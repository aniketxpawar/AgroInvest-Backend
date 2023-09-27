const bcrypt = require("bcryptjs");
const db = require("../models/user");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const signupfarmer = async (req, res, next) => {
  try {
    let { email, password, fullName, phone } = req.body;
    const exists = await db.findOne({ email });
    if (exists && exists.isActive) {
      return res
        .status(403)
        .json({ message: "Already Signed Up, PLease Log in!" });
    } else if (exists && !exists.isActive) {
      return res
        .status(403)
        .json({ message: "Already Signed Up, Please Verify your Email." });
    }
    password = await bcrypt.hash(password, 10);
    const otp = {
      value: Math.floor(100000 + Math.random() * 900000),
      epoch: moment().unix(),
    };
    const newUser = await db.create({
      email,
      password,
      fullName,
      phone,
      userType: "farmer",
      otp,
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.OFFICIAL_EMAIL,
        pass: process.env.OFFICIAL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.OFFICIAL_EMAIL,
      to: newUser.email,
      subject: "Verification Email",
      text: `Hello ${fullName},\n\nYour OTP is: ${otp.value}.\n\nDo not share your otp with anyone!!`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        //console.error(error);
        //res.status(500).send("Internal Server Error: Email not sent.");
      } else {
        //console.log(`Email sent: ${info.response}`);
      }
    });

    res
      .status(200)
      .json({
        message: "User successfully signed up.",
        id: newUser._id,
        email,
      });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error.");
  }
};

const signupinvestor = async (req, res, next) => {
  try {
    let { email, password, fullName, phone } = req.body;
    const exists = await db.findOne({ email });
    if (exists && exists.isActive) {
      return res
        .status(403)
        .json({ message: "Already Signed Up, PLease Log in!" });
    } else if (exists && !exists.isActive) {
      return res
        .status(403)
        .json({
          message: "Account is not active, please verify your email address!",
        });
    }
    password = await bcrypt.hash(password, 10);
    const otp = {
      value: Math.floor(100000 + Math.random() * 900000),
      epoch: moment().unix(),
    };
    const newUser = await db.create({
      email,
      password,
      fullName,
      phone,
      userType: "investor",
      otp,
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.OFFICIAL_EMAIL,
        pass: process.env.OFFICIAL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.OFFICIAL_EMAIL,
      to: newUser.email,
      subject: "Verification Email",
      text: `Hello ${fullName},\n\nYour OTP is: ${otp.value}.\n\nDo not share your otp with anyone!!`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        //res.status(500).send("Internal Server Error: Email not sent.");
      } else {
        //console.log(`Email sent: ${info.response}`);
      }
    });

    res
      .status(200)
      .json({
        message: "User successfully signed up.",
        id: newUser._id,
        email,
      });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error.");
  }
};

const login = async (req, res, next) => {
  try {
    let { email, password } = req.body;
    if (!email) {
      res.status(401).send("Email is required");
    }
    if (!password) {
      res.status(401).send("The password field is required");
    }
    const user = await db.findOne({ email });
    if (!user) {
      res.status(401).send("User not Found. Please Sign Up!");
    }
    if (user) {
      if (!user.isActive) {
        res
          .status(408)
          .send("Account is not active, please verify your email address!");
      } else {
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
          res.status(401).send("Invalid credentials");
          return;
        }
        const [accessToken, refreshToken] = await Promise.all([
          jwt.sign({ id: user._id, email }, process.env.JWT_KEY, {
            expiresIn: "15m",
          }),
          jwt.sign({ id: user._id, email }, process.env.JWT_REFRESHTOKEN_KEY, {
            expiresIn: "30d",
          }),
        ]);
        // res.setHeader("Authorization", `Bearer ${accessToken}`);
        // res.cookie('jwt', refreshToken, { httpOnly: true,
        //   //sameSite: 'None', secure: true,
        //   maxAge: 30 * 24 * 60 * 60 });
        res.send({
          _id: user._id,
          email: user.email,
          fullName: user.fullName,
          message: "Login successful",
          accessToken,
          refreshToken,
        });
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
};

module.exports = { signupfarmer, signupinvestor, login };
