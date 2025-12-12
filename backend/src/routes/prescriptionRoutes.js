const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const { patientRoleMiddleware, doctorRoleMiddleware } = require("../middlewares/roleMiddleware");

const {
  createPrescription,
  getPrescriptionById,
  getPrescriptionsForPatient,
  getPrescriptionsForDoctor,
  updatePrescription
} = require("../controllers/prescriptionController");

// ----------------------------------------------
// DOCTOR — CREATE PRESCRIPTION
// POST /api/prescriptions/create
// ----------------------------------------------
router.post(
  "/create",
  authMiddleware,
  doctorRoleMiddleware,
  createPrescription
);

// ----------------------------------------------
// PATIENT — VIEW THEIR PRESCRIPTIONS
// GET /api/prescriptions/my
// ----------------------------------------------
router.get(
  "/my",
  authMiddleware,
  patientRoleMiddleware,
  getPrescriptionsForPatient
);

// ----------------------------------------------
// DOCTOR — VIEW PRESCRIPTIONS THEY ISSUED
// GET /api/prescriptions/doctor
// ----------------------------------------------
router.get(
  "/doctor",
  authMiddleware,
  doctorRoleMiddleware,
  getPrescriptionsForDoctor
);

// ----------------------------------------------
// GET PRESCRIPTION BY ID (doctor OR patient involved)
// GET /api/prescriptions/:id
// ----------------------------------------------
router.get(
  "/:id",
  authMiddleware,
  async (req, res, next) => { next(); }, // placeholder so auth runs first
  getPrescriptionById
);

// ----------------------------------------------
// DOCTOR — UPDATE PRESCRIPTION
// PATCH /api/prescriptions/update
// ----------------------------------------------
router.patch(
  "/update",
  authMiddleware,
  doctorRoleMiddleware,
  updatePrescription
);

module.exports = router;
