const passport = require("passport");
const GoogleUser = require("../model/GoogleUser");
const User = require("../model/User");
const googleStrategy = require("passport-google-oauth20").Strategy;

passport.serializeUser((id, done) => {
  console.log({ id });
  done(null, id);
});

passport.deserializeUser(async (id, done) => {
  const data = await User.findById(id);
  userData = {
    name: data.name,
    userId: data._id,
    type: "session",
  };
  if (data) done(null, userData);
});

passport.use(
  new googleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      // callbackURL: "https://banwapp.onrender.com/api/v1/auth/google/callback",
      callbackURL: "/api/v1/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      const { id, displayName, _json } = profile;
      const { email } = _json;

      const user = await User.findOne({ email: email, userType: "google" });
      if (user != null) {
        done(null, user.id);
      } else {
        console.log("new Users");
        const newUser = await User.create({
          email: email,
          name: displayName,
          userType: "google",
          isVerified: true,
          veriCode: "___",
          password: "google",
        });
        done(null, newUser.id);
      }
    }
  )
);
