import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import { LogOut, User, Settings, ChevronDown } from 'lucide-react';

const AdminLayout = ({ children }) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/admin');
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="flex min-h-screen bg-slate-50">
            <AdminSidebar />
            
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="bg-white px-8 py-4 shadow-sm flex justify-between items-center z-10">
                    <h2 className="text-xl font-semibold text-slate-800">Overview</h2>
                    
                    <div className="relative" ref={dropdownRef}>
                        <button 
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center gap-4 hover:bg-slate-50 p-2 rounded-lg transition-colors focus:outline-none"
                        >
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium text-slate-900">{user.name || 'Admin'}</p>
                                <p className="text-xs text-slate-500">{user.email}</p>
                            </div>
                            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold border-2 border-transparent hover:border-indigo-200 transition-all">
                                {(user.name || 'A').charAt(0).toUpperCase()}
                            </div>
                            <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-100 py-2 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                                <div className="px-4 py-3 border-b border-slate-50 mb-1 sm:hidden">
                                    <p className="text-sm font-medium text-slate-900">{user.name || 'Admin'}</p>
                                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                                </div>
                                
                                <button 
                                    onClick={() => navigate('/admin/profile')}
                                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                                >
                                    <User size={16} className="text-slate-400" />
                                    Profile
                                </button>
                                <button 
                                    onClick={() => navigate('/admin/settings')}
                                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                                >
                                    <Settings size={16} className="text-slate-400" />
                                    Settings
                                </button>
                                <div className="my-1 border-t border-slate-50"></div>
                                <button 
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                                >
                                    <LogOut size={16} className="text-red-400" />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </header>

                <div className="flex-1 overflow-auto p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
