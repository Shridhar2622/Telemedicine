const express=require('express');
const {login,registerUser,verifyEmail,verifyOTP}=require('../controllers/authController')
const route=express.Router()


//register a user
route.post("/register",registerUser)

//login a user
route.post("/login",login)

//verify email
route.post("/verifyEmail",verifyEmail)

//verify your OTP
route.post("/verifyOTP",verifyOTP)


module.exports=route