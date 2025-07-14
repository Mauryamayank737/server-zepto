import UserModel from "../model/User.model.js";
import bcrypt from "bcryptjs";
import { generatedAccessToken } from "../utils/generateAccessToken.js";
import { generatedRefreshToken } from "../utils/generatedRefreshToken.js";
import { uploadImageClodinary } from "../utils/uploadImageCloudinary.js";
import fs from "fs";
import { otpModel } from "../model/otp.js";
import { sendOtp } from "../utils/sendOtp.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, re_password } = req.body;

    if ((!name, !email, !password)) {
      console.log("Provide give the name ,email and password");
      return res.status(400).json({
        message: "Provide give the name ,email and password",
        error: true,
        success: false,
        body: {},
      });
    }

    const userEmail = await UserModel.findOne({ email });

    if (userEmail) {
      console.log("User Already exist");
      return res.status(404).json({
        message: "User Already exist",
        error: true,
        success: false,
        body: {},
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await UserModel.create({
      name,
      email,
      password: hashPassword,
    });
    console.log("User Register", user);
    return res.status(200).json({
      message: "User Register",
      error: false,
      success: true,
      body: user,
    });
  } catch (error) {
    console.log(error, "register controller error");
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
      body: {},
    });
  }
};

export const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      console.log("Please Proved email or password");
      return res.status(400).json({
        message: "Please Proved email or password",
        error: true,
        success: false,
        body: {},
      });
    }
    const findEmail = await UserModel.findOne({ email });
    if (!findEmail) {
      console.log("email not found");
      return res.status(400).json({
        message: "email not found",
        error: true,
        success: false,
        body: {},
      });
    }
    if (findEmail.status !== "Active") {
      return res.status(400).json({
        message: "Please Contact Admin And your Account is not Active",
      });
    }
    // console.log(findEmail);
    const FindPassword = await bcrypt.compare(password, findEmail.password);

    if (!FindPassword) {
      console.log("Password not correct");
      return res.status(404).json({
        message: "Password not correct",
        error: true,
        success: false,
        body: {},
      });
    }

    let accessToken = await generatedAccessToken(findEmail._id);
    let refreshToken = await generatedRefreshToken(findEmail._id);

    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };
    await res.cookie("accessToken", accessToken, cookiesOption);
    await res.cookie("refreshToken", refreshToken, cookiesOption);
    // console.log(accessToken);
    // console.log(refreshToken);

    const user = await UserModel.findOneAndUpdate(
      { _id: findEmail._id },
      { refresh_token: refreshToken, last_login_date: new Date() },
      { new: true }
    );

    // console.log(user)
    console.log("user login successfuly");
    return res.status(200).json({
      message: "User login",
      error: false,
      success: true,
      body: user,
    });
  } catch (error) {
    console.log(error, "login controller error");
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
      body: {},
    });
  }
};

export const logout = async (req, res) => {
  try {
    const userId = req.userId;
    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };
    res.clearCookie("accessToken", cookiesOption);
    res.clearCookie("refreshToken", cookiesOption);

    const removeRefreshToken = await UserModel.findByIdAndUpdate(userId, {
      refresh_token: "",
    });
    return res.status(200).json({
      message: "logout successfly",
      error: false,
      success: true,
      body: {},
    });
  } catch (error) {
    console.log(error, "logout controller error");
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
      body: {},
    });
  }
};

export const OtpSendEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    const userData = await UserModel.findOne({ email });
    if (!userData) {
      return res.status(400).json({
        message: "This email not present user database\nPlease register First",
        error: true,
        success: false,
        body: {},
      });
    }

    const otp = Math.floor(Math.random() * 1000000);
    const subject = "email verification ";

    const prevOtp = await otpModel.findOne({ email });
    if (prevOtp) {
      await prevOtp.deleteOne();
    }

    await sendOtp({ email, subject, otp });

    await otpModel.create({ email, otp });

    let newUser = await userData.updateOne({ otp: otp }, { new: true });
    console.log(newUser);
    res.json({
      message: "otp send Your email",
    });
    next();
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
      body: {},
    });
  }
};

export const verification_email = async (req, res, next) => {
  try {
    let { email, otp } = req.body;
    const UserData = await otpModel.findOne({ email });
    if (!UserData) {
      return res.status(404).json({
        message: "email not found please send otp",
        error: true,
        success: false,
        body: {},
      });
    } else {
      if (UserData.otp != otp) {
        return res.status(404).json({
          message: "otp not match",
          error: true,
          success: false,
          body: {},
        });
      }

      const user = await UserModel.findOneAndUpdate(
        { email },
        { verify_email: true },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({
          message: "otp correct but please register first ",
          error: true,
          success: false,
          body: {},
        });
      }
      await UserData.deleteOne();

      res.status(200).json({
        message: "otp correct",
        error: false,
        success: true,
        body: user,
      });
      req.userId = user._id;
      next();
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
      body: {},
    });
  }
};

export const uploadAvatar = async (req, res) => {
  try {
    const userId = req.userId;
    const image = req.file;
    // console.log(image ,"image")
    const url = await uploadImageClodinary(image);

    console.log("image", url);

    fs.unlink(image.path, function (err) {
      if (err) console.log(err);
    });

    const userData = await UserModel.findByIdAndUpdate(
      userId,
      {
        avatar: url.url,
      },
      { new: true }
    );
    // console.log(userData)

    console.log("avatar uploaded successfuly... ");
    return res.status(200).json({
      message: "Image Upload ",
      error: false,
      success: true,
      body: {
        url,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
      body: {},
    });
  }
};

export const updateUserDetail = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, email, mobile } = req.body;
    

    const UpdateDetail = await UserModel.findByIdAndUpdate(
      userId,
      {
        name,
        email,
        mobile,
      },
      {
        new: true,
      }
    );
    // console.log(UpdateDetail);
    return res.status(200).json({
      message: "Detail Updated",
      error: false,
      success: true,
      body: UpdateDetail,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
      body: {},
    });
  }
};

export const setPassword = async (req, res) => {
  try {
    let { password, email } = req.body;
    console.log(password, email);
    const hashPassword = await bcrypt.hash(password, 10);

    const user = await UserModel.findOneAndUpdate(
      { email: email },
      {
        password: hashPassword,
      },
      { new: true }
    );

    res.status(200).json({
      message: "password update",
      error: false,
      success: true,
      body: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
      body: {},
    });
  }
};

export const UserDetail = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await UserModel.findOne({ _id: userId }).select(
      "-password -refresh_token -forgot_password_otp -forgot_password_expired -otp"
    );
    console.log("user", user);
    return res.status(200).json({
      message: "userDetail",
      error: false,
      success: true,
      body: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
      body: {},
    });
  }
};
