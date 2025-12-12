import { useState, useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";

function PatientProfile() {
  
  const [user, setUser] = useState({
    userName: "",
    fullName: "",
    email: "",
    style: "light",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [activeTab, setActiveTab] = useState("details");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/api/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setUser({
          userName: data.user.userName || "",
          fullName: data.user.fullName || "",
          email: data.user.email || "",
          style: data.user.style || "light",
        });
      }
    } catch (error) {
      console.error("Error fetching profile", error);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/api/user/updateProfile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(user),
      });
      const data = await res.json();
      setLoading(false);

      if (data.success) {
        setMessage({ type: "success", text: "Profile updated successfully!" });
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        localStorage.setItem("user", JSON.stringify({ ...storedUser, ...data.user }));
      } else {
        setMessage({ type: "error", text: data.message || "Failed to update profile" });
      }
    } catch (error) {
      setLoading(false);
      setMessage({ type: "error", text: "Server error" });
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/api/user/updatePassword", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
        }),
      });
      const data = await res.json();
      setLoading(false);

      if (data.success) {
        setMessage({ type: "success", text: "Password updated successfully!" });
        setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        setMessage({ type: "error", text: data.message || "Failed to update password" });
      }
    } catch (error) {
      setLoading(false);
      setMessage({ type: "error", text: "Server error" });
    }
  };

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto animate-slide-up">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Account Settings</h1>
          <p className="text-slate-500 mt-2">Manage your personal information and preferences.</p>
        </div>

        {message.text && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
            message.type === 'success' 
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            <span>{message.type === 'success' ? '✅' : '⚠️'}</span>
            {message.text}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row min-h-[500px]">
          
          <div className="w-full md:w-64 bg-slate-50/50 border-r border-slate-200 p-4 flex flex-col gap-2">
            {[
              { id: "details", label: "Overview", icon: "👤" },
              { id: "security", label: "Login & Security", icon: "🔒" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 font-medium ${
                  activeTab === tab.id
                    ? "bg-white text-primary shadow-sm ring-1 ring-slate-200"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <span className="text-xl">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="flex-1 p-8">
            
            {activeTab === "details" && (
              <form onSubmit={handleUpdateProfile} className="space-y-8 max-w-2xl">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-6 pb-2 border-b border-slate-100">Personal Information</h2>
                  
                  <div className="grid grid-cols-1 gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-slate-700 font-medium text-sm">Full Name</label>
                        <input
                          type="text"
                          value={user.fullName}
                          onChange={(e) => setUser({ ...user, fullName: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-slate-400"
                          placeholder="Your full name"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-slate-700 font-medium text-sm">Username</label>
                        <input
                          type="text"
                          value={user.userName}
                          onChange={(e) => setUser({ ...user, userName: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-slate-400"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-slate-700 font-medium text-sm">Email Address</label>
                        <input
                          type="email"
                          value={user.email}
                          onChange={(e) => setUser({ ...user, email: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-slate-400"
                        />
                        <p className="text-xs text-slate-500">
                          Changing your email will require re-verification.
                        </p>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <button
                        onClick={handleUpdateProfile}
                        disabled={loading}
                        className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-lg shadow-primary/30 flex items-center gap-2"
                      >
                        {loading ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            )}

            {activeTab === "security" && (
              <form onSubmit={handleUpdatePassword} className="space-y-8 max-w-xl">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-6 pb-2 border-b border-slate-100">Password & Security</h2>
                  
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-slate-700 font-medium text-sm">Current Password</label>
                      <input
                        type="password"
                        value={passwordData.oldPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-slate-400"
                        placeholder="••••••••"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-slate-700 font-medium text-sm">New Password</label>
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-slate-400"
                        placeholder="••••••••"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-slate-700 font-medium text-sm">Confirm New Password</label>
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-start pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-red-500 hover:bg-red-600 text-white px-8 py-2.5 rounded-lg font-medium shadow-lg shadow-red-500/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </form>
            )}



          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default PatientProfile;
