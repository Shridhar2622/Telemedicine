const express=require('express');
const {login,registerUser,verifyEmail,verifyOTP,forgetPassword,verifyForgotPasswordOtp}=require('../controllers/authController');

const route=express.Router()


//register a user
route.post("/register",registerUser)

//login a user
route.post("/login",login)

//verify email
route.post("/verifyEmail",verifyEmail)

//verify your OTP
route.post("/verifyOTP",verifyOTP)

// Google OAuth Routes
route.get(
  "/google",
  passport.authenticate("google", { 
    scope: ["profile", "email"],
    prompt: "select_account" // Force account selection
  })
);

route.get(
  "/google/callback",
  passport.authenticate("google", { 
    failureRedirect: "/auth/google/failure",
    session: false 
  }),
  googleAuthSuccess
);

route.get("/google/failure", googleAuthFailure);


//forgot password
route.post("/forgotPassword", forgetPassword);
route.post("/forgotPassword/verifyOTP", verifyForgotPasswordOtp);



module.exports=route