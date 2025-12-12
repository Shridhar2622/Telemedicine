import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Retrieve user role from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = user.role || 'Patient'; // Default to Patient if not found

  const patientLinks = [
    { name: 'Dashboard', path: '/patient/dashboard', color: 'bg-blue-500' },
    { name: 'Appointments', path: '/patient/appointments', color: 'bg-emerald-500' },
    { name: 'Prescriptions', path: '/patient/prescriptions', color: 'bg-purple-500' },
    { name: 'Find Doctor', path: '/patient/find-doctors', color: 'bg-indigo-500' },
    { name: 'Messages', path: '/patient/messages', color: 'bg-pink-500' },
    { name: 'Profile', path: '/patient/profile', color: 'bg-orange-500' },
  ];

  const doctorLinks = [
    { name: 'Dashboard', path: '/doctor/dashboard', color: 'bg-blue-500' },
    { name: 'My Schedule', path: '/doctor/schedule', color: 'bg-emerald-500' },
    { name: 'My Patients', path: '/doctor/patients', color: 'bg-purple-500' },
    { name: 'Appointments', path: '/doctor/appointments', color: 'bg-indigo-500' },
    { name: 'Doctor Directory', path: '/patient/find-doctors', color: 'bg-teal-500' },
    { name: 'Messages', path: '/doctor/messages', color: 'bg-pink-500' },
    { name: 'Profile', path: '/doctor/profile', color: 'bg-orange-500' },
  ];

  const navItems = role === 'Doctor' ? doctorLinks : patientLinks;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-screen fixed left-0 top-0 flex flex-col z-10 hidden md:flex">
      <div className="p-6 border-b border-slate-100">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          TeleMed
          <span className="block text-xs font-normal text-slate-400 mt-1 uppercase tracking-wider">{role} Portal</span>
        </h1>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive
                  ? 'bg-slate-50 text-slate-900 font-medium'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <span className={`w-3 h-3 mr-4 rounded-full ${item.color} shadow-sm group-hover:scale-110 transition-transform`} />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
