import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CardSwap, { Card } from "../../components/ui/CardSwap"
import doctor1 from "../../assets/doctor1.jpg";
import doctor2 from "../../assets/doctor2.jpg";
import doctor3 from "../../assets/doctor3.jpg";
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
      const res = await fetch("http://localhost:3000/api/auth/register", {
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
    <div className="login-container">
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
      <div className="login-form-section">
        <div className="login-form-container">
          
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
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signuppage;
