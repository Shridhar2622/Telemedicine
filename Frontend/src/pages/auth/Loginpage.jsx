import { useState } from "react";
import Button from "../../components/Button";
import GoogleLoginButton from "../../components/GoogleLoginButton";
import { useNavigate } from "react-router-dom";
import CardSwap, { Card } from "../../components/ui/CardSwap"
import doctor1 from "../../assets/doctor1.jpg";
import doctor2 from "../../assets/doctor2.jpg";
import doctor3 from "../../assets/doctor3.jpg";
import "./LoginPage.css";

function Loginpage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Patient"); // ⭐ DEFAULT ROLE

  const navigate = useNavigate();

  // UI state
  const [loading, setLoading] = useState(false);
  const [fieldError, setFieldError] = useState({ email: "", password: "" });
  const [backendError, setBackendError] = useState("");

  // Basic validation
  function formValidator() {
    const error = { email: "", password: "" };
    let ok = true;

    if (!email.trim()) {
      error.email = "Email is required";
      ok = false;
    }

    if (!password.trim()) {
      error.password = "Password is required";
      ok = false;
    }

    setFieldError(error);
    return ok;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBackendError("");

    if (!formValidator()) return;

    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      setLoading(false);

      // Backend validation failed
      if (!res.ok) {
        setBackendError(data.message || "Login failed, please try again.");
        return;
      }

      // ⭐ ROLE CHECK (MAIN CONDITION)
      if (data.user.role !== role) {
        setBackendError("You are not authorized for this role.");
        return;
      }

      // ⭐ SAVE TOKEN & USER
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // ⭐ REDIRECT based on role
      if (role === "Patient") navigate("/patient/homepage");
      if (role === "Doctor") navigate("/doctor/homepage");

    } catch (error) {
      console.log("Login error:", error);
      setBackendError("Server error. Please try again later.");
      setLoading(false);
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
            <h2 className="login-title">Welcome Back</h2>
            <h4 className="login-subtitle">
              New to our platform?{" "}
              <a
                href="#"
                className="signup-link"
                onClick={() => navigate("/signup")}
              >
                Create Account
              </a>
            </h4>
          </div>

          {/* FORM */}
          <form className="login-form" onSubmit={handleSubmit}>

            {/* Email */}
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                className={`form-input ${fieldError.email ? "error" : ""}`}
                type="email"
                placeholder="Enter your email"
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
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
              {fieldError.password && (
                <p className="error-message">⚠️ {fieldError.password}</p>
              )}
            </div>

            {/* ROLE SELECTOR */}
            <div className="role-selector">
              <label className="form-label">Login As</label>

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
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </div>

            {/* Backend error */}
            {backendError && (
              <div className="backend-error">
                ⚠️ {backendError}
              </div>
            )}

            {/* Divider */}
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="text-gray-500 text-sm">OR</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Google Login Button */}
            <GoogleLoginButton />
          </form>
        </div>
      </div>
    </div>
  );
}

export default Loginpage;
