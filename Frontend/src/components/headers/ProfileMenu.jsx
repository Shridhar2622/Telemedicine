import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ProfileMenu({avtar}) {
  let name = avtar || "U";
  const [menu, setMenu] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = user.role;

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div ref={menuRef} className="relative">
      
      {/* Avatar */}
      <div
        onClick={() => setMenu((prev) => !prev)}
        className="w-10 h-10 rounded-full bg-white border-2 border-gray-300 cursor-pointer flex items-center justify-center hover:shadow-md transition"
      >
        <span className="font-semibold  text-gray-700">{name.charAt(0).toUpperCase()}</span>
      </div>

      {/* Dropdown */}
      {menu && (
        <div className="absolute right-0 mt-3 w-44 bg-white rounded-lg shadow-lg border overflow-hidden animate-fade-in z-50">
          {role === 'Admin' && (
             <MenuItem text="Admin Panel" onClick={() => navigate('/admin/dashboard')} />
          )}
          <MenuItem text="Prescriptions" onClick={() => navigate('/patient/prescriptions')} />
          <MenuItem text="View History" onClick={() => navigate('/patient/appointments')} />
          {/* <MenuItem text="Change Password" /> */}
          <div className="border-t">
            <MenuItem text="Logout" danger onClick={handleLogout} />
          </div>
        </div>
      )}
    </div>
  );
}

function MenuItem({ text, danger, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`px-4 py-2 text-sm cursor-pointer transition
      ${danger 
        ? "text-red-600 hover:bg-red-50" 
        : "text-gray-700 hover:bg-gray-100"}`}
    >
      {text}
    </div>
  );
}
