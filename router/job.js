const express = require("express");
const router = express.Router();

const {
  AllJobs,
  SingleJob,
  createJob,
  updateJob,
  deleteJob,
  SearchJobs,
} = require("../controller/job");

router.route("/").get(AllJobs).post(createJob);
router.route("/:id").get(SingleJob).patch(updateJob).delete(deleteJob);
module.exports = router;
