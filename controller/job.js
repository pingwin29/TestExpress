const BadRequest = require("../error/bad-request");
const Unauthorized = require("../error/unauthorized");
const Jobs = require("../model/Jobs");
const User = require("../model/User");

const AllJobs = async (req, res, next) => {
  try {
    const { search, page, perPage } = req.query;
    let startIndex, endIndex, totalPage;
    let perPageItem = perPage || 5;

    let jobs;
    if (search) {
      jobs = await Jobs.find({ position: { $regex: search, $options: "i" } });
    } else {
      jobs = await Jobs.find({});
    }

    if (page && perPage) {
      startIndex = (page - 1) * perPage;
      endIndex = page * perPage;
    }

    totalPage =
      jobs.length % perPageItem == 0
        ? parseInt(jobs.length / perPageItem)
        : parseInt(jobs.length / perPageItem) + 1;

    jobs = jobs.slice(startIndex || 0, endIndex || 5);

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
    const { company, position } = req.body;
    const job = await Jobs.create({
      ...req.body,
      createBy: req.user.userId,
      userType: req.user.type,
    });

    res.status(201).json({ job });
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
module.exports = { AllJobs, SingleJob, createJob, updateJob, deleteJob, SearchJobs };
