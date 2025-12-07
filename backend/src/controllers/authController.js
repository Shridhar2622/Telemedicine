const User=require('../models/User')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const generateOTP=require('../utils/generateOTP')
const generateToken=require('../utils/generateToken')
const sendEmail=require("../services/emailService")


//register user
async function registerUser(req,res){
    try{
    const {userName,email,password,role}=req.body

    if(!userName || !email || !password)
    {
        return res.status(400).json({
            message: "All fields are required"
        })
    }
    //to check if user exist or not
    const usernameExist=await User.findOne({userName})
    const emailExist=await User.findOne({email})
    if(usernameExist){
       return res.status(409).json({
            message: "Username already exist, try diffrent username"
        })
    }
     if(emailExist){
       return res.status(403).json({
            message: "Email already exist, try loging in"
        })
    }
    //if the user not exist
    const salt=await bcrypt.genSalt(10)
    const hashedPassword=await bcrypt.hash(password,salt)

    //put it on DB
    const newUser=await User.create({
        userName,
        email,
        password: hashedPassword,
        role
    })

    //create the token so keep the user loged in
    const token=generateToken(newUser)

    res.status(201).json({
        message: "User is added or logged in",
        token: token
    })
}catch(e)
{
    console.log(e)
    return res.status(503).json({
        message:"Error from server side"
    })
}}


//login controller
async function login(req,res){
    
    try{
    const {email,password,role}=req.body

    //make sure all fields are not empty
    if(!email || !password)
    {
        return res.status(400).json({
            message: "All fields are required"
        })
    }
    //to check if he doesnt exist
    const isExist=await User.findOne({email})
    if(!isExist){
        return res.status(404).json({
            message: "User not found please sign up to continue"
        })
    }

    //now will check if password is correct or not
    const hashedPassword=await bcrypt.compare(password,isExist.password)
    if(!hashedPassword){
        return res.status(401).json({
            message: "Wrong password please use correct password"
        })
    }
    //generate the token 
   const token=await generateToken(isExist)

   return  res.status(200).json({
  message: "User is logged in",
  token:token,
  user: {
      id: isExist._id,
      userName: isExist.userName,
      email: isExist.email,
      role: isExist.role
  }
});


    }catch(e)
    {
       console.log(e)
    return res.status(503).json({
        message:"Error from server side"
    })
    }
}



//start verifEmail
async function verifyEmail(req,res){
    try {
        const {email}=req.body
        const OTP= generateOTP()
        const user=await User.findOne({email})
        if(!user)
        {
            return res.status(404).json({
                message: "User is not found, please use valid email"
            })
        }
        user.emailVerificationOTP=OTP
        user.emailVerificationExpires=Date.now()+5*60*1000
        await user.save()
        //now from here i need nodemailer

        try {
            await sendEmail(email,"Verification OTP",`<p>Your verification token is <u><b>${OTP}</b></u> it will expire in 5min</p>`)
            
        } catch (e) {
            console.log(e)
            return res.status(403).json({
                message: "Unable to send mail enter the correct gmail"
            })
            
        }
        return res.status(201).json({
            message:"email has been sent succesfully"
        })

        
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            message : "Server error"
        })
        
    }

}



//enter the otp to verify
async function verifyOTP(req,res){
    try{
        //getting the mail from user and otp
        const {otp,email}=req.body
        if(!otp)
        {
            return res.status(401).json({
                message:"Please enter the otp"
            })
        }

        //finding the user 
        const user=await User.findOne({email})
        if(!user)
        {
            return res.status(404).json({
                message: "User is not found use valid mail"
            })
        }
        //getting the current time and checking if it is expired or not valid
        const isExpired=Date.now();
        if(user.emailVerificationExpires < isExpired)
        {
            return res.status(400).json({ message: "otp is expired" });
        }
        if(user.emailVerificationOTP.toString()!==otp)
        {
             
          return res.status(400).json({ message: "please enter valid OTP" });
        
        }
        user.isEmailVerified=true;
        user.emailVerificationOTP=null;
        user.emailVerificationExpires=null;
        await user.save()
        //send a email saying your email is verified
        sendEmail(email,"verification status",`<p>Your email is verified. Enjoy our service </p>`)

        res.status(200).json({
            message:"Your email is verified"
        })


    } catch (e) {
        console.log(e)
        return res.status(500).json({
            message : "Server error"
        })
        
    }
}


module.exports={registerUser,login,verifyEmail,verifyOTP}