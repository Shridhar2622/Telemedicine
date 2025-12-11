const express=require("express")
const dotenv=require("dotenv")
// Load environment variables FIRST before any other imports
dotenv.config({path: "../.env"})

const userRoute=require("./routes/userRoutes")
const authRoute=require("./routes/authRoutes")
const doctorRoute=require("./routes/doctorRoutes")
const appointmentRoute=require("./routes/appointmentRouter")
const passport=require("./config/passport")
const session=require("express-session")
const cors=require("cors")  
const DB=require("./config/db")
DB()
const PORT=process.env.PORT
const app=express();

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
})); 

// Session configuration for passport
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key-change-this",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

//Google auth routes (not under /api)
app.use("/auth", authRoute);

//authorization handels here
app.use("/api/auth",authRoute)


//user routes handle here
app.use("/api/user",userRoute)

//doctor routes handle here
app.use("/api/doctor",doctorRoute)


//Appointment routes handle here
app.use("/api/user/appointment",appointmentRoute)

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT} 🚀`)
})
