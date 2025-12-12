const express = require("express");
const router = express.Router();

const {
    adminLogin,
    getAllUsers,
    getAllDoctors,
    approveDoctor,
    rejectDoctor,
    toggleUserBlock,
    getStats
} = require("../controllers/adminController");

const authMiddleware = require("../middlewares/authMiddleware");
const { adminRoleMiddleware } = require("../middlewares/roleMiddleware");


// ----------------------
// PUBLIC ROUTES
// ----------------------

// ADMIN LOGIN
router.post("/login", adminLogin);



// ----------------------
// PROTECTED ADMIN ROUTES
// ----------------------
router.use(authMiddleware, adminRoleMiddleware);


// GET ALL USERS
router.get("/users", getAllUsers);

// GET ALL DOCTORS
router.get("/doctors", getAllDoctors);

// APPROVE DOCTOR
router.post("/doctor/approve", approveDoctor);

// REJECT / DEACTIVATE DOCTOR
router.post("/doctor/reject", rejectDoctor);

// BLOCK / UNBLOCK USER
router.post("/user/toggle-block", toggleUserBlock);

// PLATFORM STATISTICS
router.get("/stats", getStats);


module.exports = router;
