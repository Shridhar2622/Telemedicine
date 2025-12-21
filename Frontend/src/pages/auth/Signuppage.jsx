import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { API_BASE_URL } from "../../config";
import { useNavigate } from "react-router-dom";
import CardSwap, { Card } from "../../components/ui/CardSwap"
import doctor1 from "../../assets/doctor1.jpg";
import doctor2 from "../../assets/doctor2.jpg";
import doctor3 from "../../assets/doctor3.jpg";
import PublicNavbar from "../../components/PublicNavbar";
import "./LoginPage.css";


function Signuppage() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Patient"); // Default role

  // UI states
  const [loading, setLoading] = useState(false);
  const [fieldError, setFieldError] = useState({
    userName: "",
    email: "",
    password: "",
  });
  const [backendError, setBackendError] = useState("");

  const navigate = useNavigate();

  // Basic validators
  function validateFields() {
    const errors = { userName: "", email: "", password: "" };
    let ok = true;

    if (!userName.trim()) {
      errors.userName = "Username is required";
      ok = false;
    } else if (userName.trim().length < 3) {
      errors.userName = "Username must be at least 3 characters";
      ok = false;
    }

    if (!email.trim()) {
      errors.email = "Email is required";
      ok = false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      errors.email = "Enter a valid email";
      ok = false;
    }

    if (!password) {
      errors.password = "Password is required";
      ok = false;
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
      ok = false;
    }

    setFieldError(errors);
    return ok;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBackendError("");

    if (!validateFields()) return;

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: userName.trim(),
          email: email.trim(),
          password,
          role,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setBackendError(data.message || "Registration failed. Try again.");
        return;
      }

      // Save email for OTP page
      localStorage.setItem("pendingEmail", email);

      navigate("/verifyemail");
    } catch (err) {
      console.error("Signup error:", err);
      setLoading(false);
      setBackendError("Server error. Please try again later.");
    }
  };

  return (
    <div className="login-container relative">
      <div className="absolute top-0 w-full z-50">
        <PublicNavbar />
      </div>
      {/* LEFT POSTER SECTION */}
      <div className="login-showcase">
        <div className="showcase-content floating">
          <CardSwap
            cardDistance={60}
            verticalDistance={70}
            delay={5000}
            pauseOnHover={false}
          >
            <Card>
              <img src={doctor1} alt="Professional Doctor" />
            </Card>
            <Card>
              <img src={doctor2} alt="Medical Professional" />
            </Card>
            <Card>
              <img src={doctor3} alt="Healthcare Expert" />
            </Card>
          </CardSwap>
        </div>
      </div>

      {/* RIGHT FORM SECTION */}
      <div className="login-form-section pt-24 md:pt-0">
        <div className="login-form-container mt-20 md:mt-0">
          
          {/* Header */}
          <div className="login-header">
            <h2 className="login-title">Create Account</h2>
            <h4 className="login-subtitle">
              Already have an account?{" "}
              <a
                href="#"
                className="signup-link"
                onClick={() => navigate("/login")}
              >
                Log In
              </a>
            </h4>
          </div>

          {/* FORM */}
          <form className="login-form" onSubmit={handleSubmit}>
            
            {/* Username */}
            <div className="form-group">
              <label className="form-label">UserName</label>
              <input
                className={`form-input ${fieldError.userName ? "error" : ""}`}
                type="text"
                placeholder="Enter username"
                onChange={(e) => setUserName(e.target.value)}
                value={userName}
              />
              {fieldError.userName && (
                <p className="error-message">⚠️ {fieldError.userName}</p>
              )}
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                className={`form-input ${fieldError.email ? "error" : ""}`}
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {fieldError.email && (
                <p className="error-message">⚠️ {fieldError.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className={`form-input ${fieldError.password ? "error" : ""}`}
                type="password"
                placeholder="Enter password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
              {fieldError.password && (
                <p className="error-message">⚠️ {fieldError.password}</p>
              )}
            </div>

            {/* ROLE SELECTOR */}
            <div className="role-selector">
              <label className="form-label">Register As</label>

              <div className="role-buttons">
                {["Patient", "Doctor"].map((item) => (
                  <button
                    type="button"
                    key={item}
                    className={`role-button ${role === item ? "active" : ""}`}
                    onClick={() => setRole(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="submit-section">
              <button
                type="submit"
                className="login-button"
                disabled={loading}
              >
                {loading && <span className="loading-spinner"></span>}
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </div>

            {/* Backend error */}
            {backendError && (
              <div className="backend-error">
                ⚠️ {backendError}
              </div>
            )}

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="mt-6">
              <button
                type="button"
                onClick={() => window.location.href = `${API_BASE_URL}/auth/google`}
                className="w-full flex justify-center items-center gap-3 px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
              >
                <img className="h-5 w-5" src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google logo" />
                Sign in with Google
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signuppage;
