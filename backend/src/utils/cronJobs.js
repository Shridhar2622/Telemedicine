const cron = require("node-cron");
const Appointment = require("../models/Appointment");

const initCronJobs = () => {
  // Run every 10 minutes
  cron.schedule("*/10 * * * *", async () => {
    console.log("⏳ Running Auto-Cancel Cron Job...");
    try {
      const now = new Date();
      
      // Find all pending appointments
      const pendingAppts = await Appointment.find({ status: "pending" });

      for (const appt of pendingAppts) {
        try {
          // Construct date object from date string (YYYY-MM-DD) and timeSlot.start (HH:MM)
          // Assumes appt.date is "YYYY-MM-DD" and appt.timeSlot.start is "HH:MM"
          const dateTimeString = `${appt.date}T${appt.timeSlot.start}:00`;
          const apptDate = new Date(dateTimeString);

          // Check if date is valid and in the past
          if (!isNaN(apptDate.getTime()) && apptDate < now) {
            appt.status = "cancelled";
            await appt.save();
            console.log(`🚫 Auto-cancelled expired appointment: ${appt._id} (Scheduled: ${dateTimeString})`);
          }
        } catch (innerErr) {
          console.error(`⚠️ Error processing appointment ${appt._id}: ${innerErr.message}`);
        }
      }
    } catch (error) {
      console.error("🔥 Error in Auto-Cancel Cron Job:", error.message);
    }
  });

  console.log("✅ Cron Jobs Initialized");
};

module.exports = initCronJobs;
