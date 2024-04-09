const BadRequest = require("../error/bad-request");
const Unauthorized = require("../error/unauthorized");
const Jobs = require("../model/Jobs");
const User = require("../model/User");

const AllJobs = async (req, res, next) => {
  try {
    console.log(req.query);
    const search = req.query.search || "";

    const page = req.query.page || 1;

    const perPageItem = parseInt(req.query.perPage) || 15;
    const createBy = req.query.createBy || "";
    const sortBy = req.query.sortBy || "createdAt";
    const orderBy = req.query.orderBy || -1;

    let sort = {};
    sort[sortBy] = orderBy;

    let findOption = {
      position: { $regex: search, $options: "i" },
    };
    if (createBy !== "") {
      findOption = { position: { $regex: search, $options: "i" }, createBy };
    }

    const jobs = await Jobs.find(findOption)
      .sort(sort)
      .skip((page - 1) * perPageItem)
      .limit(perPageItem)
      .populate("createBy");

    const totalJobs = await Jobs.countDocuments(findOption);
    const totalPage = Math.ceil(totalJobs / perPageItem);

    res.status(200).json({
      jobs: jobs,
      user: req.user,
      currentPage: page || 1,
      itemsperPage: perPageItem,
      totalPage: totalPage,
    });
  } catch (error) {
    next(error);
  }
};

const SingleJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    const job = await Jobs.findOne({ _id: id });
    if (job == null) {
      throw new BadRequest("This job is not exist");
    }
    res.status(200).json({ job });
  } catch (error) {
    next(error);
  }
};

const createJob = async (req, res, next) => {
  try {
    const userType = req.user.type == "jwt" ? "Users" : "GoogleUsers";
    console.log({ req });
    // const { company, position } = req.body;

    console.log({ userType });
    const job = await Jobs.create({
      ...req.body,
      createBy: req.user.userId,
      userType,
    });

    res.status(201).json(req.body);
  } catch (err) {
    next(err);
  }
};

const updateJob = async (req, res, next) => {
  try {
    const { id } = req.params;

    const job = await Jobs.findOne({ _id: id });

    if (!job) {
      throw new BadRequest("job is not exist ");
    }

    if (job.createBy == req.user.userId) {
      const updateJob = await Jobs.updateOne({ _id: id }, { ...req.body });
      res.status(200).json({ msg: "update sucessfully" });
    } else {
      throw new Unauthorized("u are unathuorized to delete this jobs");
    }
  } catch (err) {
    next(err);
  }
};

const deleteJob = async (req, res, next) => {
  try {
    const { id } = req.params;

    const job = await Jobs.findOne({ _id: id });
    if (!job) {
      throw new BadRequest("job is not exist ");
    }

    if (job.createBy == req.user.userId) {
      await Jobs.deleteOne({ _id: id });

      res.status(200).json({ msg: "deleted" });
    } else {
      throw new Unauthorized("u are unathuorized to delete this jobs");
    }
  } catch (error) {
    next(error);
  }
};

const SearchJobs = async (req, res, next) => {
  res.send("successful");
};
module.exports = {
  AllJobs,
  SingleJob,
  createJob,
  updateJob,
  deleteJob,
  SearchJobs,
};
