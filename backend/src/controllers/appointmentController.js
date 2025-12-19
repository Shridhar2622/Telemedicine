  const Appointment = require("../models/Appointment");
  const User = require("../models/User");
  const Doctor = require("../models/Doctor");
  const Coupon = require("../models/Coupon");
  const { verifyPaymentSignature } = require("./paymentController");


  // 📌 BOOK APPOINTMENT (Patient)
  async function bookAppointment(req, res) {
    try {
      // Doctors must not book
      if (req.user.role === "Doctor") {
        return res.status(403).json({
          message: "Doctors cannot book appointments",
        });
      }

      const { doctorId, date, day, timeSlot, couponCode, razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
      const patient = req.user.id;

      if (!doctorId || !date || !day || !timeSlot?.start || !timeSlot?.end) {
        return res.status(400).json({
          message: "All fields are required",
        });
      }

      // Verify Payment first
      if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
           return res.status(400).json({ message: "Payment details missing" });
      }

      // Check for Idempotency: If this payment was already used for a booking, return it.
      const existingPaymentAppt = await Appointment.findOne({ 
          'paymentInfo.paymentId': razorpay_payment_id 
      });

      if (existingPaymentAppt) {
          return res.status(200).json({
              message: "Appointment already booked with this payment",
              appointment: existingPaymentAppt
          });
      }

      const isSignatureValid = verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
      if (!isSignatureValid) {
          return res.status(400).json({ message: "Invalid payment signature" });
      }


      // get real doctor profile (doctorId = userId)
      const doctor = await Doctor.findOne({ userId: doctorId });

      if (!doctor) {
        return res.status(404).json({ message: "Doctor profile not found" });
      }

      // Check already booked
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

      // Handle Coupon Usage
      let discountApplied = 0;
      if (couponCode) {
          const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
          
          if (coupon) {
              if (coupon.isActive && 
                  new Date() <= new Date(coupon.expirationDate) && 
                  (coupon.usageLimit === null || coupon.usedCount < coupon.usageLimit)) {
                  
                  coupon.usedCount += 1;
                  await coupon.save();
                  discountApplied = coupon.discountPercentage;
              }
          }
      }

      const appointment = await Appointment.create({
        patient,
        doctor: doctor._id,
        date,
        day,
        timeSlot,
        status: "pending",
        paymentInfo: {
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
            amount: doctor.consultationFee * (1 - discountApplied/100) // approximate
        }
      });

      return res.status(201).json({
        message: "Appointment booked successfully",
        appointment,
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Something went wrong" });
    }
  }



  // 📌 PATIENT — VIEW THEIR OWN APPOINTMENTS
  async function viewAppointment(req, res) {
    console.log("👉 viewAppointment called!");
    try {
      if (!req.user) {
         console.error("❌ No req.user found!");
         return res.status(500).json({ message: "Auth failed inside controller" });
      }
      
      const patientId = req.user.id;
      console.log("👤 Patient ID:", patientId);

      const appts = await Appointment.find({ patient: patientId })
        .populate({
          path: "doctor",
          select: "name specialization consultationFee"
        });
        
      console.log(`✅ Found ${appts.length} appointments`);

      return res.status(200).json({
        success: true,
        appointments: appts,
      });

    } catch (e) {
      console.error("Error in viewAppointment:", e);
      return res.status(500).json({ message: "Server Problem: " + e.message });
    }
  }



  // 📌 DOCTOR — VIEW APPOINTMENTS THEY RECEIVED
  async function doctorViewAppointments(req, res) {
    try {
      if (req.user.role !== "Doctor") {
        return res.status(403).json({ message: "Only doctors can see their appointments" });
      }

      const doctorProfile = await Doctor.findOne({ userId: req.user.id });
      if (!doctorProfile) {
        return res.status(404).json({ message: "Doctor profile not found" });
      }

      const appts = await Appointment.find({ doctor: doctorProfile._id })
        .populate("patient", "userName email");

      return res.status(200).json({
        success: true,
        appointments: appts,
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server Problem" });
    }
  }



  // 📌 DOCTOR — ACCEPT OR REJECT APPOINTMENT
  async function updateAppointmentStatus(req, res) {
    try {
      const { appointmentId, status, meetingRoom } = req.body;

      if (!["accepted", "rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const doctorProfile = await Doctor.findOne({ userId: req.user.id });

      if (!doctorProfile) {
        return res.status(404).json({ message: "Doctor profile not found" });
      }

      const appt = await Appointment.findOne({
        _id: appointmentId,
        doctor: doctorProfile._id
      });

      if (!appt) {
        return res.status(404).json({ message: "Appointment not found" });
      }

      appt.status = status;
      if (meetingRoom) appt.meetingRoom = meetingRoom;
      
      await appt.save();

      return res.status(200).json({
        success: true,
        message: `Appointment ${status}`,
        appointment: appt
      });

    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: "Server Problem" });
    }
  }



  // 📌 PATIENT — CANCEL THEIR APPOINTMENT
  async function cancelAppointment(req, res) {
    try {
      const { appointmentId } = req.body;

      const appt = await Appointment.findOne({
        _id: appointmentId,
        patient: req.user.id
      });

      if (!appt) {
        return res.status(404).json({ message: "Appointment not found" });
      }

      appt.status = "cancelled";
      await appt.save();

      return res.status(200).json({
        success: true,
        message: "Appointment cancelled",
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server Problem" });
    }
  }


  module.exports = {
    bookAppointment,
    viewAppointment,
    doctorViewAppointments,
    updateAppointmentStatus,
    cancelAppointment
  };
