const express = require("express");
const router = express.Router();
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const { signleUser, updateUser, getProfileImage } = require("../controller/user");

// router.route("/").get(AllUser);
// router.route("/:id").get(SingleJob).patch(updateJob).delete(deleteJob);
router.route("/:id").get(signleUser).patch(upload.single("avatar"), updateUser);
// router.route("/avatar/:id").get(getProfileImage);
module.exports = router;
