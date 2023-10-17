const passport = require("passport");
const {
  login,
  register,
  confrimRegister,
  forgetPassword,
  changePassword,
  logout,
} = require("../controller/auth");
const router = require("express").Router();

router.route("/login").post(login);
router.route("/register").post(register);
router.route("/register/:mail").post(confrimRegister);
router.route("/forget").get(forgetPassword);
router.route("/forget/changepass").patch(changePassword);
router.route("/logout").get(logout);

router.route("/google").get((req, res, next) => {
  console.log({ req });
  return next();
}, passport.authenticate("google", { scope: ["profile", "email"] }));
router.route("/google/callback").get(
  passport.authenticate("google", {
    successRedirect: "/?type=session",
    failureRedirect: "/login.html",
  })
);

module.exports = router;
