const Prescriptions=require("../models/Prescription")


async function viewPrescription(){
    const {prescriptionId}= req.body
    const prescpription=await Prescriptions.findOne({patient})
    
}