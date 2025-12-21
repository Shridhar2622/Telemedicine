import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import api from '../utils/api';

const Sidebar = () => {
  const navigate = useNavigate();
  const { socket } = useSocket();
  const [unreadCount, setUnreadCount] = useState(0);

  // On load, get the number of unread messages
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const res = await api.get('/messages/conversations');
        // Count total unread messages from all conversations
        const total = res.data.data.reduce((acc, conv) => acc + (conv.unreadCount || 0), 0);
        setUnreadCount(total);
      } catch (error) {
        console.error("Failed to fetch notification count", error);
      }
    };
    fetchUnreadCount();
  }, []);

  // Update badge when a new message arrives via socket
  useEffect(() => {
    if (!socket) return;
    
    const handleNotification = (data) => {
        if (data.type === 'message') {
            setUnreadCount(prev => prev + 1);
        }
    };

    socket.on("new_notification", handleNotification);

    return () => socket.off("new_notification", handleNotification);
  }, [socket]);

  // Handle local badge updates (e.g. when opening a chat)
  useEffect(() => {
    const handleBadgeUpdate = () => {
        // Re-fetch or simple decrement? Re-fetching is safer for sync
        api.get('/messages/conversations').then(res => {
            const total = res.data.data.reduce((acc, conv) => acc + (conv.unreadCount || 0), 0);
            setUnreadCount(total);
        });
    };
    window.addEventListener('update-unread-badge', handleBadgeUpdate);
    return () => window.removeEventListener('update-unread-badge', handleBadgeUpdate);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Check if the current user is a Doctor or Patient
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = user.role || 'Patient'; // Fallback to Patient role

  const patientLinks = [
    { name: 'Dashboard', path: '/patient/dashboard', icon: '/Dashboard.png', color: 'bg-blue-500' },
    { name: 'Appointments', path: '/patient/appointments', icon: '/Appointment.png', color: 'bg-emerald-500' },
    { name: 'Prescriptions', path: '/patient/prescriptions', icon: '/Prescriptions.png', color: 'bg-purple-500' },
    { name: 'Find Doctor', path: '/patient/find-doctors', icon: '/Doctor.png', color: 'bg-indigo-500' },
    { name: 'Messages', path: '/patient/messages', icon: '/Chat.png', color: 'bg-pink-500' },
    { name: 'Profile', path: '/patient/profile', icon: '/Profile.png', color: 'bg-orange-500' },
    { name: 'Contact Us', path: '/patient/contact', color: 'bg-teal-500' },
  ];

  const doctorLinks = [
    { name: 'Dashboard', path: '/doctor/dashboard', icon: '/Dashboard.png', color: 'bg-blue-500' },
    { name: 'My Schedule', path: '/doctor/schedule', icon: '/Schedule.png', iconClass: 'w-10 h-10', color: 'bg-emerald-500' },
    { name: 'My Patients', path: '/doctor/patients', icon: '/User.png', color: 'bg-purple-500' },
    { name: 'Appointments', path: '/doctor/appointments', icon: '/Appointment.png', color: 'bg-indigo-500' },
    { name: 'Payments', path: '/doctor/payments', icon: '/Payment.png', iconClass: 'w-10 h-10', color: 'bg-yellow-500' },
    { name: 'Doctor Directory', path: '/patient/find-doctors', icon: '/Doctor.png', color: 'bg-teal-500' },
    { name: 'Messages', path: '/doctor/messages', icon: '/Chat.png', color: 'bg-pink-500' },
    { name: 'Profile', path: '/doctor/profile', icon: '/Profile.png', color: 'bg-orange-500' },
  ];

  const navItems = role === 'Doctor' ? doctorLinks : patientLinks;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-screen fixed left-0 top-0 flex flex-col z-10 hidden md:flex">
      <div className="p-6 border-b border-slate-100 flex items-center gap-3">
        <img src="/Logo.png" alt="TeleMed Logo" className="w-8 h-8 object-contain" />
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
            {item.icon ? (
                <img src={item.icon} alt={item.name} className={`${item.iconClass || 'w-9 h-9'} mr-4 object-contain opacity-75 group-hover:opacity-100 transition-opacity`} />
            ) : (
                <span className={`w-3 h-3 mr-4 rounded-full ${item.color} shadow-sm group-hover:scale-110 transition-transform`} />
            )}
            {item.name}
            {item.name === 'Messages' && unreadCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-bounce">
                    {unreadCount}
                </span>
            )}
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
