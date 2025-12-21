import { useState, useEffect } from "react";
import Button from "../../components/Button";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { API_BASE_URL } from "../../config";
import { useNavigate } from "react-router-dom";
import CardSwap, { Card } from "../../components/ui/CardSwap"
import doctor1 from "../../assets/doctor1.jpg";
import doctor2 from "../../assets/doctor2.jpg";
import doctor3 from "../../assets/doctor3.jpg";
import PublicNavbar from "../../components/PublicNavbar";
import "./LoginPage.css";

function Loginpage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Patient"); // ⭐ DEFAULT ROLE

  const navigate = useNavigate();
  // Parse query params
  const [searchParams] = useState(new URLSearchParams(window.location.search));

  useEffect(() => {
    const error = searchParams.get("error");
    if (error === "blocked") {
      setBackendError(
        <span>
          Your account is blocked. <a href="/contact" className="underline font-bold hover:text-red-700">Contact us</a> for support.
        </span>
      );
    } else if (error === "auth_failed") {
      setBackendError("Google Authentication failed. Please try again.");
    }
  }, [searchParams]);

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
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
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
        const errorMsg = data.message || "Login failed, please try again.";
        
        // Customhandling for blocked users to show clickable link
        if (res.status === 403 && (errorMsg.includes("blocked") || errorMsg.includes("contact admin"))) {
          setBackendError(
            <span>
              Your account is blocked. <a href="/contact" className="underline font-bold hover:text-red-700">Contact us</a> for support.
            </span>
          );
        } else {
          setBackendError(errorMsg);
        }
        return;
      }

      // ⭐ ROLE CHECK (MAIN CONDITION)
      // Allow Admin to login even if they selected Patient/Doctor
      if (data.user.role !== role && data.user.role !== 'Admin') {
        setBackendError("You are not authorized for this role.");
        return;
      }

      // ⭐ SAVE TOKEN & USER
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // ⭐ REDIRECT based on role
      if (data.user.role === 'Admin') {
        navigate("/admin/dashboard");
      } else if (role === "Patient") {
        navigate("/patient/dashboard");
      } else if (role === "Doctor") {
        navigate("/doctor/dashboard");
      }
    } catch (error) {
      console.log("Login error:", error);
      setBackendError("Server error. Please try again later.");
      setLoading(false);
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
      <div className="login-form-section pt-24 md:pt-0"> {/* Mobile padding */}
        <div className="login-form-container mt-20 md:mt-0"> {/* Extra margin for safety */}

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
            {/* Forgot Password */}
            <div className="flex justify-end">
              <span
                className="text-sm text-indigo-600 font-medium cursor-pointer hover:underline transition-all"
                onClick={() => navigate("/forgotPassword")}
              >
                Forgot Password?
              </span>
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
              <div className="backend-error animate-pulse text-center font-semibold">
                {backendError}
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

export default Loginpage;
