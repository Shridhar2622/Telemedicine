const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");

// Ensure environment variables from backend/.env are loaded if not already loaded by server.js
dotenv.config({ path: path.join(__dirname, "../../.env") });

const DB = async () => {
  const mongoUri =
    process.env.MONGODB_URL ||
    process.env.MONGO_URI ||
    process.env.MONGODB_URI ||
    process.env.MONGO_URL ||
    process.env.DATABASE_URL;

  if (!mongoUri) {
    console.error("❌ Database connection error: MONGODB_URL is missing in backend/.env.");
    console.error("ℹ️  Please add your MongoDB connection string to backend/.env and make sure you SAVE the file (Ctrl + S):");
    console.error("   MONGODB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/telemedicine");
    process.exit(1);
  }


  try {
    await mongoose.connect(mongoUri);
    console.log("Database connected ⭐");
  } catch (e) {
    console.error("Database connection error:", e.message);
    process.exit(1);
  }
};

module.exports = DB;



