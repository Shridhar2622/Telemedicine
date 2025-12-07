import React, { useState } from "react";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";

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
    <div className="h-screen w-full flex">
      {/* LEFT POSTER SECTION */}
      <div className="hidden md:flex flex-1 bg-indigo-600 text-white items-center justify-center">
        <h1 className="text-5xl font-bold px-10 leading-tight">
          Your Health,
          <br /> Your Control.
        </h1>
      </div>

      {/* RIGHT FORM SECTION */}
      <div className="flex flex-1 items-center justify-center">
        <div className="w-80 md:w-96 flex flex-col gap-6">

          {/* Header */}
          <div>
            <h2 className="text-4xl font-bold">Sign Up</h2>
            <h4 className="text-gray-500 text-sm">
              Already have an account?{" "}
              <span
                className="text-indigo-600 font-semibold underline cursor-pointer"
                onClick={() => navigate("/login")}
              >
                Log In
              </span>
            </h4>
          </div>

          {/* FORM */}
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            
            {/* Username */}
            <div className="flex flex-col gap-1">
              <label className="font-medium">UserName</label>
              <input
                className={`border rounded-md h-10 px-3 text-[16px] ${
                  fieldError.userName ? "border-red-500" : "border-gray-400"
                }`}
                type="text"
                placeholder="Enter username"
                onChange={(e) => setUserName(e.target.value)}
                value={userName}
              />
              {fieldError.userName && (
                <p className="text-[13px] text-red-500">
                  {fieldError.userName}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <label className="font-medium">Email</label>
              <input
                className={`border rounded-md h-10 px-3 text-[16px] ${
                  fieldError.email ? "border-red-500" : "border-gray-400"
                }`}
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {fieldError.email && (
                <p className="text-[13px] text-red-500">
                  {fieldError.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <label className="font-medium">Password</label>
              <input
                className={`border rounded-md h-10 px-3 text-[16px] ${
                  fieldError.password ? "border-red-500" : "border-gray-400"
                }`}
                type="password"
                placeholder="Enter password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
              {fieldError.password && (
                <p className="text-[13px] text-red-500">
                  {fieldError.password}
                </p>
              )}
            </div>

            {/* ROLE SELECTOR */}
            <div className="flex flex-col gap-2">
              <label className="font-medium">Select Role</label>

              <div className="flex gap-3">
                {["Patient", "Doctor"].map((item) => (
                  <button
                    type="button"
                    key={item}
                    className={`px-4 py-2 rounded-xl border transition-all 
                      ${
                        role === item
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-white text-gray-600 border-gray-300"
                      }
                    `}
                    onClick={() => setRole(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="pt-3">
              <Button
                value={loading ? "Creating account..." : "Create account"}
                type="submit"
                disabled={loading}
              />
            </div>

            {/* Backend error */}
            {backendError && (
              <p className="text-[13px] text-red-500 text-center">
                {backendError}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signuppage;
