import express, { Router } from "express";
import {
  login,
  logout,
  OtpSendEmail,
  registerUser,
  setPassword,
  updateUserDetail,
  uploadAvatar,
  UserDetail,
  verification_email,
} from "../controllers/user.contoller.js";
// import { auth } from '../middleware/auth.middleware.js'
import { upload } from "../middleware/multer.js";
import { auth } from "../middleware/auth.middleware.js";
const userRouter = express(Router);

userRouter.post("/register", registerUser);
userRouter.post("/login", login);
userRouter.get("/logout", auth, logout);
userRouter.get("/user_detail", auth, UserDetail);
userRouter.post("/otpsend", OtpSendEmail);
userRouter.post("/verification", verification_email);

userRouter.post("/uploadAvatar", auth, upload.single("avatar"), uploadAvatar);

userRouter.put("/updateDetails", auth, updateUserDetail);
userRouter.post("/forgetpassword", setPassword);
export default userRouter;
