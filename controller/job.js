const BadRequest = require("../error/bad-request");
const Unauthorized = require("../error/unauthorized");
const Jobs = require("../model/Jobs");
const User = require("../model/User");

const AllJobs = async (req, res, next) => {
  try {
    const jobs = await Jobs.find({});
    res.status(200).json({ jobs: jobs, jobs_length: jobs.length, user: req.user.name });
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
      createBy: req.user.userId || req.user._id,
      userType: req.user.userId ? "jwt" : "session",
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

module.exports = { AllJobs, SingleJob, createJob, updateJob, deleteJob };
