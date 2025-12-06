const User=require('../models/User')
const bcrypt=require('bcrypt')
const Prescription= require('../models/Prescription.js')
const jwt=require('jsonwebtoken')
//Handle Register


//update password
async function updatePassword(req,res){
    try{
        const{email,oldPassword,newPassword}=req.body

        //any empty fields
        if(!email || !oldPassword || !newPassword)
        {
            return res.status(400).json({
                message: "All fields are required"
            })
        }

        //Check if user exist or not
        const user= await User.findOne({email})
        if(!user){
             return res.status(404).json({
                message: "User not found"
            })
        }
        

        //comapre oldPassword is true or not
        const hashedPassword=await bcrypt.compare(oldPassword,user.password)
        if(!hashedPassword)
        {
            return res.status(403).json({
                message: "Password is wrong. Try using correct password"
            })
        }

        //hash the password
        const salt=await bcrypt.genSalt(10)
        const newHashPassword=await bcrypt.hash(newPassword,salt)
        user.password= newHashPassword
        await user.save()

        return res.status(202).json({
            message: "Passwrod updated succesfully"
        })

    }catch(e)
    {
        console.log(e)
        res.status(500).json({
            message: "Server error"
        })
    }
}


//view prescription
async function getPrescription(req,res){
    try {
        const userId=req.user.id
        const prescription=await Prescription.find({patient: userId})
        if(!prescription || prescription.length===0) {
            return res.status(401).json({
                messaage: "No prescription found"
            })
        }

       return res.status(200).json(prescription)

        
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: "Server issue"
        })
        
    }

}



//User homepage
function viewProfile(req,res){
    try {
        
        return res.status(200).json({
            message: `${req.user.userName} welcome to homepage`
        })

    }catch(e){
        console.log(e)
        return res.status(200).json({
            message: `server error`
        })
    }
}


//update profile
async function updateProfile(req, res) {
    try {
        const userId = req.user.id;  // The logged-in user's ID
        
        const { userName } = req.body;

        if (!userName) {
            return res.status(400).json({
                message: "Please enter a username"
            });
        }

        // Find the currently logged in user
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Check if username is taken
        const existingUser = await User.findOne({ userName });

        if (existingUser && existingUser._id.toString() !== userId) {
            return res.status(409).json({
                message: "Username already taken, try a different one"
            });
        }

        // Update username
        user.userName = userName;
        await user.save();

        return res.status(200).json({
            message: "Username updated successfully",
            user: {
                userName: user.userName,
                email: user.email,
                style: user.style
            }
        });

    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: "Server error"
        });
    }
}



module.exports={updatePassword,getPrescription,viewProfile,updateProfile}