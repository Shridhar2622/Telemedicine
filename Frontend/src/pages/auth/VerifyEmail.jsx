import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config";
import Button from "../../components/Button";
import toast from "react-hot-toast";
import { Mail, CheckCircle2, ArrowRight, RefreshCw, ShieldCheck } from "lucide-react";

function VerifyEmail() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState({ otp: "" });
  const [backendError, setBackendError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(true);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);

  // Read email stored during signup or from session
  const storedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  })();
  const email = localStorage.getItem("pendingEmail") || storedUser.email || "";

  // Helper to determine destination dashboard
  const getDashboardRoute = (role) => {
    const userRole = role || storedUser.role || "Patient";
    if (userRole === "Admin") return "/admin/dashboard";
    if (userRole === "Doctor") return "/doctor/dashboard";
    return "/patient/dashboard";
  };

  // If user already verified or no email found, redirect appropriately
  useEffect(() => {
    if (!email) {
      if (localStorage.getItem("token")) {
        navigate(getDashboardRoute());
      } else {
        navigate("/signup");
      }
    }
  }, [email, navigate]);

  // Initial OTP trigger on page mount
  useEffect(() => {
    let isMounted = true;
    async function sendOtp() {
      if (!email) return;
      try {
        const res = await fetch(`${API_BASE_URL}/auth/verifyEmail`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        if (isMounted) {
          if (!res.ok) {
            console.warn("Could not dispatch OTP email:", data.message);
          } else {
            toast.success("Verification code sent to your email!");
          }
        }
      } catch (err) {
        console.error("Error sending initial OTP:", err);
      } finally {
        if (isMounted) {
          setSendingOtp(false);
          setResendCooldown(30); // 30-second cooldown
        }
      }
    }

    sendOtp();

    return () => {
      isMounted = false;
    };
  }, [email]);

  // Handle countdown timer for resend
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  // Resend OTP handler
  const handleResendOtp = async () => {
    if (resendCooldown > 0 || isResending) return;
    setIsResending(true);
    setBackendError("");

    try {
      const res = await fetch(`${API_BASE_URL}/auth/verifyEmail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setBackendError(data.message || "Failed to resend code");
        toast.error(data.message || "Failed to resend code");
      } else {
        toast.success("New 4-digit code sent to your email!");
        setResendCooldown(30);
      }
    } catch (err) {
      console.error("Resend error:", err);
      setBackendError("Server error. Please try again.");
      toast.error("Network error while resending code.");
    } finally {
      setIsResending(false);
    }
  };

  // Validate OTP input
  function validateOtp() {
    const err = { otp: "" };
    let ok = true;

    if (!otp.trim()) {
      err.otp = "Please enter the OTP";
      ok = false;
    } else if (otp.trim().length !== 4) {
      err.otp = "OTP must be 4 digits";
      ok = false;
    }

    setError(err);
    return ok;
  }

  // Submit OTP to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setBackendError("");

    if (!validateOtp()) return;

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/verifyOTP`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp: otp.trim(), email }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setBackendError(data.message || "Wrong OTP, please try again.");
        toast.error(data.message || "Invalid or expired OTP");
        return;
      }

      // Save updated token and user session
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      localStorage.removeItem("pendingEmail");

      toast.success("Email verified successfully! Welcome to Telemedicine 🎉");

      // Seamless redirect directly to Dashboard based on user role
      const targetRole = data.user?.role || storedUser.role || "Patient";
      navigate(getDashboardRoute(targetRole), { replace: true });

    } catch (error) {
      console.error("Verification submit error:", error);
      setBackendError("Server error. Please try again later.");
      toast.error("Server error. Please try again later.");
      setLoading(false);
    }
  };

  // Skip verification action
  const handleSkipToDashboard = () => {
    toast("You can verify your email later from your profile settings.", {
      icon: "ℹ️",
    });
    localStorage.removeItem("pendingEmail");
    navigate(getDashboardRoute(), { replace: true });
  };

  // Loading screen while initial OTP is dispatched
  if (sendingOtp) {
    return (
      <div className="min-h-screen w-full flex justify-center items-center bg-gradient-to-br from-indigo-100 via-blue-50 to-indigo-200 px-4">
        <div className="bg-white/90 backdrop-blur-md shadow-2xl border border-indigo-100 rounded-3xl p-8 max-w-sm w-full text-center flex flex-col items-center gap-4">
          <div className="w-14 h-14 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <h2 className="text-xl font-bold text-gray-800">
            Sending Verification Code...
          </h2>
          <p className="text-gray-500 text-sm">
            Please wait a moment while we dispatch your OTP to <b>{email}</b>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-gradient-to-br from-indigo-100 via-blue-50 to-indigo-200 px-4 py-8">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-3xl p-8 border border-gray-100 flex flex-col items-center gap-6 relative overflow-hidden">
        
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600" />

        {/* Icon Header */}
        <div className="w-16 h-16 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner mt-2">
          <Mail className="w-8 h-8" />
        </div>

        {/* Text Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Verify Your Email
          </h1>
          <p className="text-gray-500 text-sm mt-1.5 leading-relaxed">
            We sent a 4-digit verification code to
            <br />
            <span className="font-semibold text-gray-800 break-all">{email}</span>
          </p>
        </div>

        {/* Verification Form */}
        <form className="w-full flex flex-col items-center gap-5" onSubmit={handleSubmit}>
          
          <div className="w-full flex flex-col items-center gap-2">
            <input
              type="text"
              maxLength="4"
              autoFocus
              className="tracking-[0.6em] text-center font-mono text-2xl font-bold w-48 py-2.5 px-4 
                         border-2 border-indigo-200 rounded-2xl focus:border-indigo-600 focus:ring-4 
                         focus:ring-indigo-100 transition-all outline-none text-indigo-900 bg-indigo-50/30"
              placeholder="••••"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            />
            {error.otp && <p className="text-red-500 text-xs font-medium">{error.otp}</p>}
            {backendError && <p className="text-red-500 text-xs font-medium text-center">{backendError}</p>}
          </div>

          <div className="w-full">
            <Button
              value={
                loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Verifying...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Verify & Go to Dashboard
                  </span>
                )
              }
              disabled={loading}
            />
          </div>

          {/* Resend Action with Cooldown */}
          <div className="text-sm text-gray-500 flex items-center gap-1.5">
            <span>Didn’t get the code?</span>
            {resendCooldown > 0 ? (
              <span className="text-gray-400 font-medium">
                Resend in {resendCooldown}s
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isResending}
                className="text-indigo-600 font-semibold hover:text-indigo-800 transition flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isResending ? "animate-spin" : ""}`} />
                Resend OTP
              </button>
            )}
          </div>

          {/* Divider */}
          <div className="w-full flex items-center gap-3 my-1">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Skip for Now Button */}
          <button
            type="button"
            onClick={handleSkipToDashboard}
            className="w-full py-2.5 px-4 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium 
                       hover:bg-gray-50 hover:text-gray-900 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Skip for now & Go to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </form>

      </div>
    </div>
  );
}

export default VerifyEmail;
