const User = require("../model/User");
const GoogleUser = require("../model/GoogleUser");

const signleUser = async (req, res, next) => {
  try {
    const id = req.params.id;

    let type = "";
    let user;

    if (await User.count({ _id: id })) {
      type = "jwt";
    }

    if (await GoogleUser.count({ _id: id })) {
      type = "sessions";
    }

    if (type == "jwt") {
      user = await User.findById(id);
    } else if (type == "sessions") {
      user = await GoogleUser.findById(id);
    }

    res.send({ user });
  } catch (error) {
    next(error);
  }
};
const updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.userId, {
      name: req.body.name,
      profileData: req.file.buffer,
    });

    const token = user.createJWT();
    res.status(201).json({ token });
  } catch (error) {
    next(error);
  }
};

const getProfileImage = async (req, res, next) => {
  try {
    const id = req.params.id;

    const buffer = await User.findById(id).select("profileData");
    console.log({ buffer });
    res.send(buffer);
  } catch (error) {}
};

module.exports = { signleUser, updateUser, getProfileImage };
