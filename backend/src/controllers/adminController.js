// const Admin = require("../models/Admin");
const User = require("../models/User"); // will get all users from here like doctor,admin
const Doctor = require("../models/Doctor")



exports.adminLogin = async (req,res) => {
    try {
        const {email,password} = req.body;
        const admin = await Admin.findOne({email});

        if(!admin){
            return res.status(404).json({message: "Admin does not exist"});
        }

        const match = await bcrypt.compare(password,admin.password);
        if(!match){
            return res.status(400).json({message: "Invalid password"});
        }

        //get token-> will do it later
        return res.status(200).json({
            message: "Login successful" //Can send token also will implement later
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({message : "Server error in admin"});
    }
}


exports.getAllUsers = async (req,res) => {
    try {
        const users = await User.find().select("-password");
        return res.status(200).json(users);
    } catch (error) {
        console.log(error);
        return res.status(500).json({message : "Server error"});
    }
};


exports.getAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find().select("-password");
        return res.status(200).json(doctors);

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error" });
    }
};