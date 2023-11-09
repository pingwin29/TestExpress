const jwt = require("jsonwebtoken");
const User = require("../model/User");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

const BadRequest = require("../error/bad-request");
const Unauthorized = require("../error/unauthorized");

const login = async (req, res, next) => {
  try {
    const { password, email } = req.body;

    if (!email || !password) {
      throw new BadRequest("please provide email , password ");
    }

    const existUser = await User.findOne({ email: email }).exec();

    if (!existUser) {
      throw new BadRequest("Email is Not Exist");
    }

    const hash = existUser.password;

    const isMatch = await bcrypt.compareSync(password.toString(), hash);

    if (!isMatch) {
      throw new Unauthorized("Credial Denial");
    }

    if (existUser.isVerified == false) {
      throw new Unauthorized("Please Confrim your Email ");
    }

    const token = existUser.createJWT();

    console.log({ token });

    const type = "jwt";
    res
      .status(200)
      .json({ name: existUser.name, userId: existUser.id, email: existUser.email, token, type });
    // Store hash in your password DB.
  } catch (error) {
    next(error);
  }
};

const sendMailCode = async (mail, msg) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_NAME,
        pass: process.env.MAIL_PASS,
      },
    });

    transporter.verify((err, sucess) => {
      if (err) {
        console.log({ err });
      } else {
        console.log({ data: sucess });
      }
    });

    const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();

    option = {
      from: process.env.MAIL_NAME,
      to: mail,
      subject: "Account Verification Code",
      text: `${msg}: ${verificationCode}
            By (KhantDweThu Software) 
      `,
    };

    transporter.sendMail(option);
    return verificationCode;
  } catch (error) {
    next(error);
  }
};

const confrimRegister = async (req, res, next) => {
  try {
    const { mail } = req.params;
    const { code } = req.body;
    const user = await User.findOne({ email: mail });

    if (!user) {
      throw new BadRequest("Your email is not exist");
    }

    if (code) {
      if (code == user.veriCode) {
        const confrimUser = await User.updateOne(
          { email: mail },
          { isVerified: true, veriCode: "______" }
        );
        const type = "jwt";
        const token = user.createJWT();
        res.status(200).json({ type, token });
      } else {
        throw new BadRequest("please try again and sure your verification code is incorrecct");
      }
    } else {
      throw new BadRequest("please check your confrim code");
    }
  } catch (error) {
    next(error);
  }
};

const register = async (req, res, next) => {
  try {
    const { name, password, email } = req.body;

    if (!name || !password || !email) {
      throw new BadRequest("please provide correctly name,password,email");
    }

    const msg = "Your login Verification Code is";
    const veriCode = await sendMailCode(email, msg);

    const user = await User.create({
      ...req.body,
      veriCode,
      userType: "email",
    });

    res.status(201).send({ name: user.name, email: user.email });
  } catch (err) {
    next(err);
  }
};

const forgetPassword = async (req, res, next) => {
  try {
    const { email } = req.query;
    const msg = "Your account reset password for email verification code is";
    const veriCode = await sendMailCode(email, msg);
    const update = await User.updateOne({ email: email }, { veriCode: veriCode });

    if (update.matchedCount == 0) {
      throw new BadRequest("Email is not Exist");
    }

    res.status(200).send("sucessful");
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    let { veriCode, password } = req.body;
    const { email } = req.query;

    var salt = await bcrypt.genSaltSync(10);
    var hash = await bcrypt.hashSync(password, salt);

    const update = await User.updateOne(
      { email: email, veriCode: veriCode },
      { password: hash, veriCode: "____" }
    );

    console.log({ update });

    if (update.matchedCount === 0) {
      throw new BadRequest("veriCode is not correct");
    }

    res.status(201).json({ veriCode, password, email });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login.html");
  });
};

module.exports = {
  login,
  register,
  confrimRegister,
  forgetPassword,
  changePassword,
  logout,
};
