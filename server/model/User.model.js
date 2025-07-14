import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "proved name"],
    },
    email: {
      type: String,
      required: [true, "proved email"],
      unique: true,
    },
    password: {
      type: String,
      default: [true, "proved password"],
    },
    avatar: {
      type: String,
      default: "",
    },
    mobile: {
      type: Number,
      default: null,
    },
    refresh_token: {
      type: String,
      default: "",
    },
    verify_email: {
      type: Boolean,
      default: false,
    },
    last_login_date: {
      type: Date,
      default: "",
    },
    status: {
      type: String,
      emun: ["Active", "Inactive", "Suspended"],
      default: "Active",
    },
    address_details: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "address",
      },
    ],
    shopping_cart: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "cartProduct",
      },
    ],
    orderHistory: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "order",
      },
    ],
    forgot_password_otp: {
      type: String,
      default: null,
    },
    forgot_password_expired: {
      type: Date,
      default: "",
    },
    role: {
      type: String,
      enum: ["ADMIN", "USER"],
      default: "USER",
    },
    otp:{
       type :Number,
       default :null
    }
  },
  { timestamps: true }
);

const UserModel = mongoose.model("user", UserSchema);
export default UserModel;
