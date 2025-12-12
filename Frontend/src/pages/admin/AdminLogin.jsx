import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CardSwap, { Card } from "../../components/ui/CardSwap"
import doctor1 from "../../assets/doctor1.jpg";
import doctor2 from "../../assets/doctor2.jpg";
import doctor3 from "../../assets/doctor3.jpg";
import "../auth/LoginPage.css"; // Reusing the login styles

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
      const res = await fetch("http://localhost:3000/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setBackendError(data.message || "Login failed.");
        return;
      }

      // Save token & user
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user)); 

      // Redirect to Admin Dashboard
      navigate("/admin/dashboard");
      
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
            <h2 className="login-title">Admin Portal</h2>
            <h4 className="login-subtitle">
              Restricted Access. Authorized Personnel Only.
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
                placeholder="admin@example.com"
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
                placeholder="Enter admin password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
              {fieldError.password && (
                <p className="error-message">⚠️ {fieldError.password}</p>
              )}
            </div>

            {/* Submit */}
            <div className="submit-section">
              <button
                type="submit"
                className="login-button"
                disabled={loading}
              >
                {loading && <span className="loading-spinner"></span>}
                {loading ? "Accessing..." : "Access Dashboard"}
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

export default AdminLogin;
