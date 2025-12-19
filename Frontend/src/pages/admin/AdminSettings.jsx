import React, { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { Bell, Monitor, Shield, Globe } from 'lucide-react';

const AdminSettings = () => {
    const [settings, setSettings] = useState({
        notifications: true,
        maintenanceMode: false,
        publicRegistration: true,
        theme: 'light'
    });

    const handleToggle = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <AdminLayout>
            <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-800">System Settings</h1>
                    <p className="text-slate-500">Configure global application preferences.</p>
                </div>

                <div className="space-y-6">
                    {/* General Settings */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-4 bg-slate-50 border-b border-slate-100">
                            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                                <Globe size={18} /> General
                            </h3>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-medium text-slate-800">Public Registration</h4>
                                    <p className="text-sm text-slate-500">Allow new users to sign up.</p>
                                </div>
                                <button 
                                    onClick={() => handleToggle('publicRegistration')}
                                    className={`w-12 h-6 rounded-full transition-colors relative ${
                                        settings.publicRegistration ? 'bg-blue-600' : 'bg-slate-200'
                                    }`}
                                >
                                    <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                                        settings.publicRegistration ? 'translate-x-6' : 'translate-x-0'
                                    }`} />
                                </button>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-medium text-slate-800">Maintenance Mode</h4>
                                    <p className="text-sm text-slate-500">Disable access for non-admin users.</p>
                                </div>
                                <button 
                                    onClick={() => handleToggle('maintenanceMode')}
                                    className={`w-12 h-6 rounded-full transition-colors relative ${
                                        settings.maintenanceMode ? 'bg-blue-600' : 'bg-slate-200'
                                    }`}
                                >
                                    <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                                        settings.maintenanceMode ? 'translate-x-6' : 'translate-x-0'
                                    }`} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Notifications */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-4 bg-slate-50 border-b border-slate-100">
                            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                                <Bell size={18} /> Notifications
                            </h3>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-medium text-slate-800">Email Alerts</h4>
                                    <p className="text-sm text-slate-500">Receive emails for critical system events.</p>
                                </div>
                                <button 
                                    onClick={() => handleToggle('notifications')}
                                    className={`w-12 h-6 rounded-full transition-colors relative ${
                                        settings.notifications ? 'bg-blue-600' : 'bg-slate-200'
                                    }`}
                                >
                                    <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                                        settings.notifications ? 'translate-x-6' : 'translate-x-0'
                                    }`} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminSettings;
