import { Routes, Route, Navigate } from "react-router-dom";
import Signuppage from "./pages/auth/Signuppage.jsx";
import Loginpage from "./pages/auth/Loginpage.jsx";
import VerifyEmail from "./pages/auth/VerifyEmail.jsx";
import ForgotPassword from "./pages/auth/ForgotPassword.jsx";
import PatientPage from "./pages/homepage/PatientPage.jsx";
import PatientDashboard from "./pages/homepage/PatientDashboard.jsx";
import DoctorDashboard from "./pages/homepage/DoctorDashboard.jsx";
import Appointments from "./pages/patient/Appointments.jsx";
import FindDoctors from "./pages/patient/FindDoctors.jsx";
import Prescriptions from "./pages/patient/Prescriptions.jsx";
import PublicDoctorProfile from "./pages/patient/PublicDoctorProfile.jsx";
import PatientProfile from "./pages/patient/PatientProfile.jsx";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import DoctorSchedule from "./pages/doctor/DoctorSchedule.jsx";
import MyPatients from "./pages/doctor/MyPatients.jsx";
import DoctorProfile from "./pages/doctor/DoctorProfile.jsx";
import DoctorAppointments from "./pages/doctor/DoctorAppointments.jsx";
import Chat from "./pages/messages/Chat.jsx";


function App() {
  return (
    <div className="min-h-screen bg-blue-50 transition-colors duration-300">
      
        <Routes>
          <Route path="/" element={<Navigate to="/signup" />} />
          <Route path="/signup" element={<Signuppage />} />
          <Route path="/login" element={<Loginpage />} />
          <Route path="/verifyemail" element={<VerifyEmail />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/patient/homepage" element={<PatientPage />} />
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
          <Route path="/patient/appointments" element={<Appointments />} />
          <Route path="/patient/find-doctors" element={<FindDoctors />} />
          <Route path="/patient/prescriptions" element={<Prescriptions />} />
          <Route path="/patient/messages" element={<Chat />} />
          <Route path="/patient/profile" element={<PatientProfile />} />
          <Route path="/doctor-profile/:id" element={<PublicDoctorProfile />} />
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor/schedule" element={<DoctorSchedule />} />
          <Route path="/doctor/patients" element={<MyPatients />} />
          <Route path="/doctor/profile" element={<DoctorProfile />} />
          <Route path="/doctor/appointments" element={<DoctorAppointments />} />
          <Route path="/doctor/messages" element={<Chat />} />
          
          {/* Admin Route */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
    </div>
  );
}

export default App;
