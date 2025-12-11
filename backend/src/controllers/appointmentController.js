const Appointment = require("../models/Appointment");
const User=require("../models/User")
const Doctor=require("../models/Doctor")
//Book the appointment
//Book the appointment
async function bookAppointment(req, res) {
  try {
    if (req.user.role === "Doctor") {
      return res.status(403).json({
        message: "Doctors cannot book appointments",
      });
    }

    const { doctorId, date, day, timeSlot } = req.body;
    const patient = req.user.id;

    if (!doctorId || !date || !day || !timeSlot?.start || !timeSlot?.end) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Get actual doctor profile
    const doctor = await Doctor.findOne({ userId: doctorId });  
    if (!doctor) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }

    // Check already booked (USE doctor._id)
    const alreadyBooked = await Appointment.findOne({
      doctor: doctor._id,   
      date,
      "timeSlot.start": timeSlot.start,
      status: { $in: ["pending", "accepted"] },
    });

    if (alreadyBooked) {
      return res.status(409).json({
        message: "This slot is already booked",
      });
    }

    const appointment = await Appointment.create({
      patient,
      doctor: doctor._id,  // IMPORTANT
      date,
      day,
      timeSlot,
    });

    return res.status(201).json({
      message: "Appointment booked successfully",
      appointment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
}


//get Appointments
async function viewAppointment(req, res) {
  try {
    const patientId = req.user.id;
    const appts = await Appointment.find({ patient: patientId })
      .populate("doctor", "name consultationFee");

    return res.status(200).json({
      success: true,
      appts
    });

  } catch (e) {
    console.error(e);
    return res.status(500).json({
      message: "Server Problem"
    });
  }
}





module.exports={bookAppointment,viewAppointment}