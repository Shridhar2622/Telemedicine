const express=require("express")
const route=express.Router()
const {bookAppointment,viewAppointment}=require("../controllers/appointmentController")
const authMiddleware=require('../middlewares/authMiddleware')
const {patientRoleMiddleware}=require('../middlewares/roleMiddleware')

//Book appointment
route.post("/bookAppointment",authMiddleware,bookAppointment)


//patient can view his appointments
route.get("/viewAppointment",authMiddleware,viewAppointment);



module.exports=route