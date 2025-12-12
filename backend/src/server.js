const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "../../.env" });

const cors = require("cors");
const DB = require("./config/db");
const http = require("http");
const { initSocket } = require("./socket");

DB();

const app = express();
const server = http.createServer(app);
const io = initSocket(server);
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5175", "http://localhost:5174", process.env.FRONTEND_URL].filter(Boolean),
    credentials: true,
  })
);

const authRoute = require("./routes/authRoutes");
const userRoute = require("./routes/userRoutes");
const doctorRoute = require("./routes/doctorRoutes");
const appointmentRoute = require("./routes/appointmentRouter");
const prescriptionRoute = require("./routes/prescriptionRoutes");
const adminRoute = require("./routes/adminRoutes");
const messageRoute = require("./routes/messageRoutes");

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/doctor", doctorRoute);
app.use("/api/appointments", appointmentRoute);
app.use("/api/prescription", prescriptionRoute);
app.use("/api/admin", adminRoute);
app.use("/api/messages", messageRoute);

app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} 🚀`);
  console.log(`Socket.io is ready ⚡`);

  setInterval(async () => {
    try {
      const Appointment = require("./models/Appointment");
      // const moment = require("moment"); // Removed dependency

      const now = new Date();
      
      const pendingAppts = await Appointment.find({ status: "pending" });

      for (const appt of pendingAppts) {
        try {
            // Combine date (YYYY-MM-DD) and time (HH:MM) to create a Date object
            // status: cancelled if past
            const dateTimeString = `${appt.date}T${appt.timeSlot.start}:00`;
            const apptDate = new Date(dateTimeString);

            if (!isNaN(apptDate.getTime()) && apptDate < now) {
                appt.status = "cancelled";
                await appt.save();
                console.log(`Auto-cancelled expired appointment: ${appt._id}`);
            }
        } catch (err) {
            console.error(`Error processing appointment ${appt._id}:`, err.message);
        }
      }
    } catch (error) {
      console.error("Error in auto-cancel job:", error.message);
    }
  }, 10 * 60 * 1000); // Run every 10 minutes

});
