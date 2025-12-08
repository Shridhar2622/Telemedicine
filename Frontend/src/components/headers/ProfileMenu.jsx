import React, { useState, useRef, useEffect } from "react";

export default function ProfileMenu({avtar}) {
  const [menu, setMenu] = useState(false);
  const menuRef = useRef(null);

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

  return (
    <div ref={menuRef} className="relative">
      
      {/* Avatar */}
      <div
        onClick={() => setMenu((prev) => !prev)}
        className="w-10 h-10 rounded-full bg-white border-2 border-gray-300 cursor-pointer flex items-center justify-center hover:shadow-md transition"
      >
        <span className="font-semibold text-gray-700">{avtar}</span>
      </div>

      {/* Dropdown */}
      {menu && (
        <div className="absolute right-0 mt-3 w-44 bg-white rounded-lg shadow-lg border overflow-hidden animate-fade-in">
          <MenuItem text="Prescriptions" />
          <MenuItem text="View History" />
          <MenuItem text="Theme" />
          <div className="border-t">
            <MenuItem text="Logout" danger />
          </div>
        </div>
      )}
    </div>
  );
}

function MenuItem({ text, danger }) {
  return (
    <div
      className={`px-4 py-2 text-sm cursor-pointer transition
      ${danger 
        ? "text-red-600 hover:bg-red-50" 
        : "text-gray-700 hover:bg-gray-100"}`}
    >
      {text}
    </div>
  );
}
