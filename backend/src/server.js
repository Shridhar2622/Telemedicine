const express=require("express")
const dotenv=require("dotenv")
const userRoute=require("./routes/userRoutes")
const authRoute=require("./routes/authRoutes")
const doctorRoute=require("./routes/doctorRoutes")
const cors=require("cors")  
dotenv.config({path: "../.env"})
const DB=require("./config/db")
DB()
const PORT=process.env.PORT
const app=express();

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cors()); 

//authorization handels here
app.use("/api/auth",authRoute)


//user routes handle here
app.use("/api/user",userRoute)

//doctor routes handle here
app.use("/api/doctor",doctorRoute)


app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT} 🚀`)
})
