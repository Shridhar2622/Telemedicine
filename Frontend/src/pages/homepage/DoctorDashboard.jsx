import useFetchData from '../../hooks/useFetchData';
import React, { useEffect } from 'react';
import MainLayout from '../../layouts/MainLayout';
import Card from '../../components/ui/Card';

import { useNavigate } from 'react-router-dom';

const DoctorDashboard = () => {
    const navigate = useNavigate();
    // Get user from localStorage for immediate display
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const doctorName = storedUser.userName || 'Doctor';

    const { data: profile, loading: profileLoading } = useFetchData('/doctor/profile');
    const { data: appointments, loading: apptLoading } = useFetchData('/appointments/doctor');

    // Redirect to profile creation if profile is missing
    useEffect(() => {
        if (!profileLoading && !profile?.data) {
            navigate('/doctor/profile');
        }
    }, [profile, profileLoading, navigate]);

    const specialization = profile?.data?.specialization || 'General Practitioner';
    
    // Calculate stats
    // API returns { appointments: [...] }
    const apptList = appointments?.appointments || [];
    
    // Filter for today's appointments
    const today = new Date().toISOString().split('T')[0];
    const todaysAppointments = apptList.filter(a => a.date && a.date.startsWith(today));
    const upcomingAppointments = apptList.filter(a => a.status === 'scheduled' || a.status === 'pending');
    
    // Calculate unique patients
    const patientSet = new Set(apptList.map(a => a.patient?._id));

    const stats = [
        { label: 'Total Patients', value: patientSet.size, color: 'bg-blue-50 text-blue-600' },
        { label: 'Appointments Today', value: todaysAppointments.length, color: 'bg-green-50 text-green-600' },
        { label: 'Pending Requests', value: upcomingAppointments.filter(a => a.status === 'pending').length, color: 'bg-orange-50 text-orange-600' },
    ];

    if (profileLoading || apptLoading) {
        return (
            <MainLayout>
                 <div className="animate-pulse">
                    <div className="h-8 bg-slate-200 rounded w-1/3 mb-4"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/4 mb-8"></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="h-32 bg-slate-200 rounded-xl"></div>
                        <div className="h-32 bg-slate-200 rounded-xl"></div>
                        <div className="h-32 bg-slate-200 rounded-xl"></div>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="mb-8 animate-slide-up">
                <h1 className="text-3xl font-bold text-slate-900">
                    Welcome back, <span className="text-primary">Dr. {doctorName}</span>
                </h1>
                <p className="text-slate-500 mt-2">Specialization: {specialization}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                {stats.map((stat) => (
                    <Card key={stat.label} className="card-hover border-l-4 border-l-primary/50">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                                <p className="text-3xl font-bold text-slate-800 mt-2">{stat.value}</p>
                            </div>
                            <div className={`p-3 rounded-full ${stat.color}`}>
                                <div className="w-6 h-6 bg-current opacity-50 rounded-full"></div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <div className="lg:col-span-2 space-y-6">
                    <Card title="Today's Schedule">
                        <div className="space-y-4">
                            {todaysAppointments && todaysAppointments.length > 0 ? (
                                todaysAppointments.map((appt) => (
                                    <div key={appt._id} className="flex items-center py-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 p-2 rounded-lg transition-colors">
                                        <div className="w-12 h-12 rounded-full bg-slate-200 flex-shrink-0 mr-4 flex items-center justify-center text-slate-500 font-bold">
                                            {appt.patient?.userName?.charAt(0) || 'P'}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium text-slate-800">{appt.patient?.userName || 'Patient'}</h4>
                                            <p className="text-sm text-slate-500">General Checkup</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="block text-primary font-medium">{appt.timeSlot?.start}</span>
                                            <button className="text-xs text-slate-400 hover:text-primary mt-1">View Details</button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-slate-500 text-center py-4">No appointments scheduled for today.</p>
                            )}
                        </div>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card title="Quick Actions">
                        <div className="space-y-3">
                            <button className="w-full py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-medium shadow-lg shadow-primary/30">
                                View Request
                            </button>
                            <button className="w-full py-2 px-4 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium">
                                Manage Schedule
                            </button>
                        </div>
                    </Card>
                </div>
            </div>
        </MainLayout>
    );
};

export default DoctorDashboard;
