const mongoose = require("mongoose");
const dotenv = require("dotenv");


const DB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Database connected ⭐");
  } catch (e) {
    console.log("Database connection error:", e.message);
    process.exit(1); // stop server if DB fails
  }
};

module.exports = DB;


