require("dotenv").config();
//router
const JobRouter = require("./router/job");
const authRouter = require("./router/auth");
//thirdpirty
const express = require("express");
const app = express();
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const MongoStore = require("connect-mongo");
const cors = require("cors");

//custom module
const passwordSetup = require("./config/passport");
const connectDB = require("./db/connect");
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const authorizationMiddleware = require("./middleware/auth");
const passportMiddleware = require("./middleware/passport_middleware");
// middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(
  session({
    secret: "cat",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MOGO_URL }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

//routes
app.use("/api/v1/jobs/session", passportMiddleware, JobRouter);
app.use("/api/v1/jobs/jwt", authorizationMiddleware, JobRouter);
app.use("/api/v1/auth", authRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// server
const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MOGO_URL);
    app.listen(port, () => {
      console.log("server is listening in port " + port);
    });
  } catch (error) {
    console.log({ error });
  }
};

start();
