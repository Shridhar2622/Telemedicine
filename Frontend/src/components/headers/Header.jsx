import React, { useState, useEffect, useRef } from "react";
import logo from "../../../public/Logo.png";
import { Link, useNavigate } from "react-router-dom";
import ProfileMenu from "./ProfileMenu";
import { useSocket } from "../../context/SocketContext";

function Header({avtar}) {
  const { notifications, unreadCount, markAllAsRead } = useSocket();
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const toggleNotifications = () => {
    if (!showNotifications) {
      markAllAsRead();
    }
    setShowNotifications(!showNotifications);
  };

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = user.role || 'Patient'; // Default to Patient if not found
  const basePath = role === 'Doctor' ? '/doctor' : '/patient';

  const handleNotificationClick = (notif) => {
      // Logic for navigation based on notification type
      if (notif.type === 'message') {
          // Navigate to Chat with specific user selected
          navigate(`${basePath}/messages`, {
              state: {
                  userId: notif.senderId,
                  userName: notif.senderName,
                  role: role === 'Doctor' ? 'Patient' : 'Doctor' // Opponent role
              }
          });
      } else if (notif.type === 'appointment') {
          if (notif.data?.meetingRoom) {
               // If it has a meeting room, maybe go to chat to find the link or just go to appointments
               // User asked for "join link and chat notification"
               // We'll prioritize the meeting link if it's a "meeting ready" notification?
               // Actually, usually easier to go to appointments page where the "Join" button is.
               navigate(`${basePath}/appointments`);
          } else {
               navigate(`${basePath}/appointments`);
          }
      } else {
          // Default fallthrough
          navigate(`${basePath}/dashboard`);
      }
      setShowNotifications(false);
  };

  return (
    <header className="w-full h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 flex items-center justify-between sticky top-0 z-50">
      
      <Link to="/" className="flex items-center gap-2 cursor-pointer">
        <img
          src={logo}
          alt="App Logo"
          className="w-10 h-10 object-contain"
        />
        <span className="text-white font-semibold text-lg hidden sm:block">
          MedConnect
        </span>
      </Link>

      <div className="flex-1"></div>

      <div className="flex items-center gap-4">
        
        {/* Notification Bell */}
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={toggleNotifications}
                className="relative p-2 rounded-full hover:bg-slate-100 transition-colors"
                aria-label="Notifications"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`w-6 h-6 ${unreadCount > 0 ? 'text-primary fill-primary/10' : 'text-slate-600'}`}
                >
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 border border-white rounded-full animate-pulse"></span>
                )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-slate-100 rounded-xl shadow-xl z-50 overflow-hidden animate-slide-up origin-top-right">
                    <div className="p-3 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                        <h3 className="font-semibold text-slate-800 text-sm">Notifications</h3>
                        <span className="text-xs text-slate-400">{notifications.length} total</span>
                    </div>
                    
                    <div className="max-h-80 overflow-y-auto">
                        {notifications.length > 0 ? (
                            notifications.map((notif, idx) => (
                                <div 
                                    key={idx} 
                                    onClick={() => handleNotificationClick(notif)}
                                    className="p-3 border-b border-slate-50 hover:bg-slate-50 transition-colors last:border-b-0 cursor-pointer"
                                >
                                    <div className="flex gap-3">
                                        <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${notif.isRead ? 'bg-slate-200' : 'bg-blue-500'}`}></div>
                                        <div>
                                            <p className="text-sm text-slate-800 font-medium leading-tight mb-1">{notif.message}</p>
                                            <p className="text-xs text-slate-400">
                                                {new Date(notif.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </p>
                                            
                                            {/* Meeting Link Button - Keep separate link behavior or let main click handle it? 
                                                User logic: "when i click on notification if it is a chat it should take it there"
                                                We'll keep the button as an explicit option but the whole card is clickable too.
                                            */}
                                            {notif.data?.meetingRoom && (
                                                <a 
                                                    href={notif.data.meetingRoom}
                                                    target="_blank"
                                                    rel="noopener noreferrer" 
                                                    onClick={(e) => e.stopPropagation()} 
                                                    className="mt-2 inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-md hover:bg-blue-700 transition-colors shadow-sm"
                                                >
                                                    <span>Join Meeting</span>
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                                                        <path d="M3.25 4A2.25 2.25 0 001 6.25v7.5A2.25 2.25 0 003.25 16h7.5A2.25 2.25 0 0013 13.75v-7.5A2.25 2.25 0 0010.75 4h-7.5zM19 4.75a.75.75 0 00-1.28-.53l-3 3a.75.75 0 00-.22.53v4.5c0 .199.079.39.22.53l3 3a.75.75 0 001.28-.53V4.75z" />
                                                    </svg>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center bg-slate-50/30">
                                <div className="text-3xl mb-2">🔕</div>
                                <p className="text-sm text-slate-400">No new notifications</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>

        <ProfileMenu avtar={avtar} />
      </div>

    </header>
  );
}

export default Header;
