const express=require('express')
const route=express.Router();

const {viewPrescription}=require('../controllers/prescriptionController')



//View prescpription (make sure to put the middleware for checking)
route.get("/viewPrescription",viewPrescription)







module.exports=route