import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
email:{
    type:String,
    required:true
},
otp:{
    type:Number,
    required:true
},
expire:{
    type :Date,
    default:()=>new Date(Date.now()+5*60*1000),
    index:{expires:"5m"}
}

})

export const otpModel = mongoose.model("otp" ,otpSchema) 