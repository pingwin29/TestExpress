const passport = require("passport");
const GoogleUser = require("../model/GoogleUser");
const googleStrategy = require("passport-google-oauth20").Strategy;

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser(async (id, done) => {
  const data = await GoogleUser.findOne({ _id: id });
  if (data) done(null, data);
});

passport.use(
  new googleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "https://banwapp.onrender.com/api/v1/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      const { id, displayName } = profile;
      const user = await GoogleUser.findOne({ googleId: id });
      console.log("exist user");
      console.log({ user });
      if (user) {
        done(null, user.id);
      } else {
        const newUser = await GoogleUser.create({
          googleId: id,
          name: displayName,
        });
        done(null, newUser.id);
      }
    }
  )
);
