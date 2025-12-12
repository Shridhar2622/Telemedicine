const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { doctorRoleMiddleware } = require("../middlewares/roleMiddleware");

const {
  createOrUpdateDoctorProfile,
  getDoctorProfile,
  getDoctorById,
  getAllDoctors,
  checkProfileStatus,
  updateDoctorSchedule,
} = require("../controllers/doctorController");


router.get("/profile/status", authMiddleware, doctorRoleMiddleware, checkProfileStatus);

router.post("/profile", authMiddleware, doctorRoleMiddleware, createOrUpdateDoctorProfile);

router.put("/schedule", authMiddleware, doctorRoleMiddleware, updateDoctorSchedule);

router.get("/profile", authMiddleware, doctorRoleMiddleware, getDoctorProfile);

router.get("/", getAllDoctors);

router.get("/:id", getDoctorById);

module.exports = router;
