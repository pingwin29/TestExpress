const express = require("express");
const router = express.Router();

const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const { AllJobs, SingleJob, createJob, updateJob, deleteJob } = require("../controller/job");

router.route("/").get(AllJobs).post(upload.none(), createJob);
router.route("/:id").get(SingleJob).patch(updateJob).delete(deleteJob);
module.exports = router;
