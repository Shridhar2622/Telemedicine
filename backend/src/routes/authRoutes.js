const express=require('express');
const {login,registerUser,verifyEmail,verifyOTP, googleAuthSuccess, googleAuthFailure}=require('../controllers/authController')
const passport = require("passport");
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


module.exports=route