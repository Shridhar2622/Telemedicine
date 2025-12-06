import { Routes, Route, Navigate } from "react-router-dom";
import Signuppage from "./pages/auth/Signuppage.jsx";
import Loginpage from "./pages/auth/Loginpage.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/signup" />} />
      <Route path="/signup" element={<Signuppage />} />
      <Route path="/login" element={<Loginpage />} />
    </Routes>
  );
}

export default App;
