const express = require("express");
const route = express.Router();

const {
  bookAppointment,
  viewAppointment,
  doctorViewAppointments,
  updateAppointmentStatus,
  cancelAppointment
} = require("../controllers/appointmentController");

const authMiddleware = require("../middlewares/authMiddleware");
const { patientRoleMiddleware, doctorRoleMiddleware } = require("../middlewares/roleMiddleware");


// 📌 PATIENT — BOOK APPOINTMENT
route.post("/book", authMiddleware, patientRoleMiddleware, bookAppointment);


// 📌 PATIENT — VIEW THEIR APPOINTMENTS
route.get("/my", authMiddleware, patientRoleMiddleware, viewAppointment);


// 📌 DOCTOR — VIEW THEIR APPOINTMENTS
route.get("/doctor", authMiddleware, doctorRoleMiddleware, doctorViewAppointments);


// 📌 DOCTOR — ACCEPT / REJECT APPOINTMENTS
route.patch("/status", authMiddleware, doctorRoleMiddleware, updateAppointmentStatus);


// 📌 PATIENT — CANCEL APPOINTMENT
route.patch("/cancel", authMiddleware, patientRoleMiddleware, cancelAppointment);


module.exports = route;
