const BadRequest = require("../error/bad-request");
const Unauthorized = require("../error/unauthorized");
const jwt = require("jsonwebtoken");
const User = require("../model/User");
const mongoose = require("mongoose");

const Authorization = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new Unauthorized("login in first");
    }
    const [authType, authToken] = authHeader.split(" ");

    if (authType !== "Bearer") {
      throw new Unauthorized("AuthType is invaild");
    }

    const payload = jwt.verify(authToken, process.env.JWTTOKEN);

    const user = await User.findById({ _id: payload.userId });
    console.log({ user });
    if (!user) {
      throw new Unauthorized("Your Acc is Deleted");
    }

    req.user = { ...payload, type: "jwt" };

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = Authorization;
