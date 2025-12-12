const express=require('express');
const {login,registerUser,verifyEmail,verifyOTP,forgetPassword,verifyForgotPasswordOtp}=require('../controllers/authController');

const route=express.Router()

route.post("/register",registerUser)
route.post("/login",login)
route.post("/verifyEmail",verifyEmail)
route.post("/verifyOTP",verifyOTP)



//forgot password
route.post("/forgotPassword", forgetPassword);
route.post("/forgotPassword/verifyOTP", verifyForgotPasswordOtp);



module.exports=route