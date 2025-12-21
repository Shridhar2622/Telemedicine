import React, { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import StatsCard from '../../components/admin/StatsCard';
import { Users, UserPlus, Calendar, FileText } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from "../../config";

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalDoctors: 0,
        totalAppointments: 0,
        totalPrescriptions: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const response = await axios.get(`${API_BASE_URL}/admin/stats`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.data.success) {
                    setStats(response.data.stats);
                }
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-800 mb-2">Dashboard Overview</h1>
                <p className="text-slate-500">Welcome to the admin control center.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatsCard 
                    title="Total Users" 
                    value={stats.totalUsers} 
                    icon={Users} 
                    color="bg-blue-500" 
                />
                <StatsCard 
                    title="Doctors" 
                    value={stats.totalDoctors} 
                    icon={UserPlus} 
                    color="bg-indigo-500" 
                />
                <StatsCard 
                    title="Appointments" 
                    value={stats.totalAppointments} 
                    icon={Calendar} 
                    color="bg-emerald-500" 
                />
                <StatsCard 
                    title="Prescriptions" 
                    value={stats.totalPrescriptions} 
                    icon={FileText} 
                    color="bg-orange-500" 
                />
            </div>

            {/* Placeholder for Recent Activity or Charts */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <h2 className="text-lg font-semibold text-slate-800 mb-4">System Status</h2>
                <div className="p-4 bg-green-50 text-green-700 rounded-lg border border-green-200">
                    All systems operational. Database connected. 
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
