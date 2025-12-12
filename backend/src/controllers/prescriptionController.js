const Prescription = require("../models/Prescription");
const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");


// ---------------------------------------------
// 📌 CREATE PRESCRIPTION (Doctor only)
// ---------------------------------------------
const createPrescription = async (req, res) => {
  try {
    const { appointmentId, notes, medicines, followUpDate } = req.body;

    const doctorId = req.user.id;

    if (!appointmentId || !notes) {
      return res.status(400).json({
        success: false,
        message: "Appointment ID and notes are required",
      });
    }

    // Verify doctor profile
    const doctorProfile = await Doctor.findOne({ userId: doctorId });
    if (!doctorProfile) {
      return res.status(403).json({
        success: false,
        message: "Only doctors can create prescriptions",
      });
    }

    // Verify appointment exists and belongs to this doctor
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    if (appointment.doctor.toString() !== doctorProfile._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only write prescriptions for your own appointments",
      });
    }

    // Create prescription
    const prescription = await Prescription.create({
      appointment: appointmentId,
      doctor: doctorId,
      patient: appointment.patient,
      notes,
      medicines: medicines || [],
      followUpDate: followUpDate || null,
    });

    return res.status(201).json({
      success: true,
      message: "Prescription created successfully",
      data: prescription,
    });

  } catch (error) {
    console.error("Error in createPrescription:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


// ---------------------------------------------
// 📌 GET PRESCRIPTION BY ID (Private)
// Doctor OR Patient involved can access
// ---------------------------------------------
const getPrescriptionById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const prescription = await Prescription.findById(id)
      .populate("doctor", "userName email")
      .populate("patient", "userName email");

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: "Prescription not found",
      });
    }

    // Access control
    if (
      prescription.doctor._id.toString() !== userId &&
      prescription.patient._id.toString() !== userId
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this prescription",
      });
    }

    return res.status(200).json({
      success: true,
      data: prescription,
    });

  } catch (error) {
    console.error("Error in getPrescriptionById:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


// ---------------------------------------------
// 📌 PATIENT — VIEW ALL THEIR PRESCRIPTIONS
// ---------------------------------------------
const getPrescriptionsForPatient = async (req, res) => {
  try {
    const userId = req.user.id;

    const prescriptions = await Prescription.find({ patient: userId })
      .populate("doctor", "userName email specialization");

    return res.status(200).json({
      success: true,
      count: prescriptions.length,
      data: prescriptions,
    });

  } catch (error) {
    console.error("Error in getPrescriptionsForPatient:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


// ---------------------------------------------
// 📌 DOCTOR — VIEW ALL PRESCRIPTIONS THEY ISSUED
// ---------------------------------------------
const getPrescriptionsForDoctor = async (req, res) => {
  try {
    const doctorId = req.user.id;

    const prescriptions = await Prescription.find({ doctor: doctorId })
      .populate("patient", "userName email");

    return res.status(200).json({
      success: true,
      count: prescriptions.length,
      data: prescriptions,
    });

  } catch (error) {
    console.error("Error in getPrescriptionsForDoctor:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


// ---------------------------------------------
// 📌 UPDATE PRESCRIPTION (Doctor only)
// ---------------------------------------------
const updatePrescription = async (req, res) => {
  try {
    const { prescriptionId, notes, medicines, followUpDate } = req.body;
    const doctorId = req.user.id;

    if (!prescriptionId) {
      return res.status(400).json({
        success: false,
        message: "Prescription ID is required",
      });
    }

    const prescription = await Prescription.findById(prescriptionId);

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: "Prescription not found",
      });
    }

    if (prescription.doctor.toString() !== doctorId) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own prescriptions",
      });
    }

    // Update fields
    if (notes) prescription.notes = notes;
    if (medicines) prescription.medicines = medicines;
    if (followUpDate) prescription.followUpDate = followUpDate;

    await prescription.save();

    return res.status(200).json({
      success: true,
      message: "Prescription updated successfully",
      data: prescription,
    });

  } catch (error) {
    console.error("Error in updatePrescription:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};



module.exports = {
  createPrescription,
  getPrescriptionById,
  getPrescriptionsForPatient,
  getPrescriptionsForDoctor,
  updatePrescription,
};
