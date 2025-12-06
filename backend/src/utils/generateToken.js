
const User=require("../models/User")
const jwt=require("jsonwebtoken")

function generateToken(newUser)
{

return jwt.sign({
        id: newUser._id,
        role: newUser.role,
        email: newUser.email,
        userName: newUser.userName
    },process.env.SECRET_KEY,{
        expiresIn: "5d"
    });
}

module.exports=generateToken