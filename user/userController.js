const bcrypt = require("bcryptjs");
const db = require("../models/user");
const harvest = require("../models/harvest");
const cart = require("../models/cart");
const requestForm = require("../models/request");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { ObjectId } = require('mongoose').Types;
const axios = require('axios');
const { request } = require("express");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.OFFICIAL_EMAIL,
    pass: process.env.OFFICIAL_PASS,
  },
});

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
        .json({ message: "Already Signed Up, PLease Log in!" });
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

    const mailOptions = {
      from: process.env.OFFICIAL_EMAIL,
      to: newUser.email,
      subject: "Verification Email",
      text: `Hello ${newUser.fullName},\n\nYour OTP is: ${newUser.otp.value}.\n\nDo not share your otp with anyone!!\n\nNote: OTP is only valid for 30 Minutes.`
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
          message: "Already Signed Up, PLease Log in!",
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

    const mailOptions = {
      from: process.env.OFFICIAL_EMAIL,
      to: newUser.email,
      subject: "Verification Email",
      text: `Hello ${newUser.fullName},\n\nYour OTP is: ${newUser.otp.value}.\n\nDo not share your otp with anyone!!\n\nNote: OTP is only valid for 30 Minutes.`
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
    user.otp = {
      value: Math.floor(100000 + Math.random() * 900000),
      epoch: moment().unix(),
    };
    await user.save();

    const mailOptions = {
      from: process.env.OFFICIAL_EMAIL,
      to: user.email,
      subject: "Verification Email",
      text: `Hello ${user.fullName},\n\nYour OTP is: ${user.otp.value}.\n\nDo not share your otp with anyone!!\n\nNote: OTP is only valid for 30 Minutes.`
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
          .status(408)
          .json({message:"Verify your email address by entering the OTP sent to your email",userId:user._id});
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
          userType: user.userType,
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

const verifyOtp = async(req,res,next) => {
  try{
    const {id,otp} = req.body;
    const user = await db.findById(id);
    if(otp!==user.otp.value){
      return res.status(401).json({message:"Wrong OTP"})
    }
    const now = moment().unix();
    if(now - user.otp.epoch > 1800){
      return res.status(412).json({message:'OTP expired'})
    }
    user.isActive = true;
    await user.save();
    const [accessToken, refreshToken] = await Promise.all([
      jwt.sign({ id: user._id, email:user.email }, process.env.JWT_KEY, {
        expiresIn: "15m",
      }),
      jwt.sign({ id: user._id, email:user.email }, process.env.JWT_REFRESHTOKEN_KEY, {
        expiresIn: "30d",
      }),
    ]);
    res.status(200).json({message:"OTP Verified",_id:user._id, email:user.email,accessToken,refreshToken,userType:user.userType})
  } catch(err){
    console.log(err)
    res.status(500).send("Internal Server Error.")
  }
}

const resendOtp = async(req,res,next) => {
  try{
    const {id} = req.body;
    const user = await db.findById(id);
    user.otp = {
      value: Math.floor(100000 + Math.random() * 900000),
      epoch: moment().unix(),
    };
    await user.save();

    const mailOptions = {
      from: process.env.OFFICIAL_EMAIL,
      to: user.email,
      subject: "Verification Email",
      text: `Hello ${user.fullName},\n\nYour OTP is: ${user.otp.value}.\n\nDo not share your otp with anyone!!\n\nNote: OTP is only valid for 30 Minutes.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        //res.status(500).send("Internal Server Error: Email not sent.");
      } else {
        //console.log(`Email sent: ${info.response}`);
      }
    });
    res.status(200).json({message:"OTP Sent Successfully"})
  } catch(err){
    console.log(err)
    res.status(500).send("Internal Server Error.")
  }
}

const getUserById = async(req,res,next) => {
  try{
    const user = await db.findById(req.params.id)
    if(!user){
      return res.status(204).json({message:"User does not exist"});
    }
    res.status(200).json(user);
  } catch(err){
    console.error(err);
    res.status(500).send("Internal server error");
  }
}

const getFarmersList = async (req, res, next) => {
  try {
    const farmers = await db.find({ userType: "farmer", isActive: true }).select('_id fullName location area');
    if (!farmers || farmers.length === 0) {
      return res.status(404).json({ message: "No Farmers!" });
    }

    const farmersWithCropsPromises = farmers.map(async (farmer) => {
      const harvests = await harvest.find({ farmer: farmer._id });
      const crops = Array.from(new Set(harvests.map((har) => har.crop)));

      return { ...farmer.toObject(), crops };
    });

    const farmersWithCrops = await Promise.all(farmersWithCropsPromises);

    res.status(200).json(farmersWithCrops);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
};

const addToCart = async(req,res,next) => {
  try{
    const {investorId, harvestId, qty} = req.body;
    const cartItem = await cart.create({investorId,harvestId,quantity:qty});
    res.status(200).json({message:"Item Added to Cart."})
  } catch(err){
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
}

const getCartItemsByUserId = async(req,res,next) => {
  try{
    const {userId} = req.params;
    const cartItems = await cart.find({investorId:new ObjectId(userId)}).populate({
      path:'harvestId',
      select:'_id crop amountPerKg'
    });
    if(!cartItems){
      return res.status(200).json({message:"No items in the Cart"})
    }
    res.status(200).json(cartItems);

  } catch(err){
    console.log(err)
    res.status(500).send("Internal Server Error")
  }
}

const removeFromCart = async(req,res,next) => {
  try{
    const {id} = req.params;
    console.log(req.params)
    const removeItem = await cart.findByIdAndDelete(id);
    if(!removeItem){
      return res.status(403).json({message:"Failed to Remove Item"})
    }
    res.status(200).json({message:"Item Removed From Cart"});

  } catch(err){
    console.log(err);
    res.status(500).send("Internal Server Error")
  }
}

const checkout = async (req, res, next) => {
  try {
    const items = req.body;

    const result = await Promise.all(
      items.map(async (item) => {
        const buyApiUrl = 'http://localhost:3000/investment/newInvestment';
        const buyResponse = await axios.post(buyApiUrl, {
          investorId: item.investorId,
          harvestId: item.harvestId._id,
          qty: item.quantity,
        });

        const removeFromCart = await cart.findByIdAndDelete(item._id);
        return removeFromCart;
      })
    );

    if (!result) {
      return res.status(500).json({ message: "Something went wrong" });
    }

    res.status(200).json({ message: "Transaction Complete" });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
};

const sendRequest = async(req,res,next) => {
  try{
    const {farmer,crop,expectedHarvestDate,quantity,totalInvestment} = req.body;
    const newRequest = await requestForm.create({farmer:new ObjectId(farmer),crop,expectedHarvestDate,quantity,totalInvestment,stage:"Pending"})
    if(!newRequest){
      return res.status(500).json({message:"Request Not Sent"})
    }
    res.status(200).json({message:"Request Sent Successfully"})
  } catch(err){
    console.log(err)
    res.status(500).send("Internal Server Error");
  }
}

const getRequests = async(req,res,next) => {
  try{
    const {id} = req.params;
    const result = await requestForm.find({farmer: new ObjectId(id)})
    if(!result.length>0){
      return res.status(404).send({message:"No Requests"})
    }
    res.status(200).json(result)
  } catch(err){
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
}



module.exports = { signupfarmer, signupinvestor, login, verifyOtp, resendOtp, getFarmersList, getUserById,
   addToCart, getCartItemsByUserId, removeFromCart, checkout, sendRequest, getRequests };
