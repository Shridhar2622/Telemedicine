const express=require('express');
const {updatePassword,getPrescription,viewProfile}=require('../controllers/userController')
const route=express.Router()
const authMiddleware=require('../middlewares/authMiddleware')
const {patientRoleMiddleware}=require('../middlewares/roleMiddleware')
//import ur controllers



//to update the password
route.put("/updatePassword",updatePassword)

//view ur homepage
route.get("/homepage",authMiddleware,patientRoleMiddleware,viewProfile);


//view ur prescription
route.get("/prescription",authMiddleware,getPrescription)

module.exports=route