const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const Admin = require("../models/Admin");

dotenv.config({ path: path.join(__dirname, "../../.env") });

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("MongoDB Connected");

    const existingAdmin = await Admin.findOne({ email: "admin@telemedicine.com" });
    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit();
    }

    const admin = new Admin({
      name: "Super Admin",
      email: "admin@telemedicine.com",
      password: "adminpassword123", // Will be hashed by pre-save hook
      role: "Admin"
    });

    await admin.save();
    console.log("Admin created successfully you can see");
    console.log("Email: admin@telemedicine.com");
    console.log("Password: adminpassword123");
    process.exit();
  } catch (error) {
    console.error("Error creating admin:", error.message);
    process.exit(1);
  }
};

createAdmin();
