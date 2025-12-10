const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {
  createOrUpdateDoctorProfile,
  getDoctorProfile,
  getDoctorById,
  getAllDoctors,
  checkProfileStatus,
} = require("../controllers/doctorController");

// Check if profile is completed (must be authenticated)
router.get("/profile/status", authMiddleware, checkProfileStatus);

// Create or update doctor profile (must be authenticated)
router.post("/profile", authMiddleware, createOrUpdateDoctorProfile);

// Get logged-in doctor's profile (must be authenticated)
router.get("/profile", authMiddleware, getDoctorProfile);

// Get all doctors (public)
router.get("/", getAllDoctors);

// Get doctor by ID (public)
router.get("/:id", getDoctorById);

module.exports = router;
