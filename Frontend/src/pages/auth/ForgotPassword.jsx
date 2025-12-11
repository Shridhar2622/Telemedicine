import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";

function ForgotPassword() {
  const navigate = useNavigate();

  // steps: 1 = email, 2 = otp + new password
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // ✅ STEP 1 → SEND OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        "http://localhost:3000/api/auth/forgotPassword",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setError(data.message || "Failed to send OTP");
        return;
      }

      setSuccessMsg("OTP sent to your email ✅");
      setStep(2); // ✅ move to OTP + Password UI

    } catch (err) {
      console.log(err);
      setError("Server error, try again later");
      setLoading(false);
    }
  };

  // ✅ STEP 2 → VERIFY OTP + RESET PASSWORD
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!otp.trim() || !newPassword.trim()) {
      setError("All fields are required");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        "http://localhost:3000/api/auth/forgotPassword/verifyOTP",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp, newPassword }),
        }
      );

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setError(data.message || "OTP verification failed");
        return;
      }

      setSuccessMsg("Password changed successfully 🎉");

      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch (err) {
      console.log(err);
      setError("Server error, try again later");
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gray-50">
      <div className="w-80 md:w-96 bg-white shadow-lg rounded-2xl p-6 flex flex-col gap-5">

        {/* HEADER */}
        <div className="text-center">
          <h2 className="text-3xl font-bold">
            {step === 1 ? "Verify Your Email" : "Reset Password"}
          </h2>
          <p className="text-gray-500 text-sm">
            {step === 1
              ? "Enter your registered email"
              : "Enter OTP and your new password"}
          </p>
        </div>

        {/* ✅ STEP 1 FORM (EMAIL) */}
        {step === 1 && (
          <form className="flex flex-col gap-4" onSubmit={handleSendOtp}>
            <div className="flex flex-col gap-1">
              <label className="font-medium">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="border border-gray-300 rounded-md h-10 px-3 text-[15px]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <Button
              value={loading ? "Verifying..." : "Verify Email"}
              disabled={loading}
            />
          </form>
        )}

        {/* ✅ STEP 2 FORM (OTP + PASSWORD) */}
        {step === 2 && (
          <form className="flex flex-col gap-4" onSubmit={handleVerifyOtp}>

            <div className="flex flex-col gap-1">
              <label className="font-medium">OTP</label>
              <input
                type="text"
                placeholder="Enter OTP"
                className="border border-gray-300 rounded-md h-10 px-3 text-[15px]"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-medium">New Password</label>
              <input
                type="password"
                placeholder="Enter new password"
                className="border border-gray-300 rounded-md h-10 px-3 text-[15px]"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <Button
              value={loading ? "Updating..." : "Reset Password"}
              disabled={loading}
            />
          </form>
        )}

        {/* ✅ ERROR MESSAGE */}
        {error && (
          <p className="text-[13px] text-red-500 text-center">{error}</p>
        )}

        {/* ✅ SUCCESS MESSAGE */}
        {successMsg && (
          <p className="text-[13px] text-green-600 text-center">{successMsg}</p>
        )}

        {/* BACK TO LOGIN */}
        <p
          className="text-sm text-center text-indigo-600 cursor-pointer hover:underline"
          onClick={() => navigate("/login")}
        >
          Back to Login
        </p>

      </div>
    </div>
  );
}

export default ForgotPassword;
