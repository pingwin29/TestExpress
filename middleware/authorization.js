const Unauthorized = require("../error/unauthorized");
const jwt = require("jsonwebtoken");
const User = require("../model/User");

const authorizationMiddleware = async (req, res, next) => {
  try {
    // email user
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const [authType, authToken] = authHeader.split(" ");
      if (authType !== "Bearer") {
        throw new Unauthorized("AuthType is invaild");
      }

      const payload = jwt.verify(authToken, process.env.JWTTOKEN);
      const user = await User.findById({ _id: payload.userId });
      if (!user) {
        throw new Unauthorized("Your Acc is Deleted");
      }
      req.user = { ...payload, type: "jwt" };
    }

    // google acc user
    if (req.user) {
      console.log(req.user);
      next();
    } else {
      throw new Unauthorized("Login In First");
    }
  } catch (error) {
    next(error);
  }
};
module.exports = authorizationMiddleware;
