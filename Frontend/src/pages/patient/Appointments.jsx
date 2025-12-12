import React, { useState } from 'react';
import MainLayout from '../../layouts/MainLayout';
import Card from '../../components/ui/Card';
import useFetchData from '../../hooks/useFetchData';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const Appointments = () => {
    const { data, loading, error, refetch } = useFetchData('/appointments/my');
    const [filter, setFilter] = useState('upcoming'); // upcoming, completed, cancelled
    const navigate = useNavigate();
    const [cancellingId, setCancellingId] = useState(null);

    const appointments = data?.appointments || [];

    const handleCancel = async (appointmentId) => {
        if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
        
        setCancellingId(appointmentId);
        try {
            await api.patch('/appointments/cancel', { appointmentId });
            refetch(); // Refresh list
        } catch (error) {
            alert('Failed to cancel appointment');
            console.error(error);
        } finally {
            setCancellingId(null);
        }
    };

    const filteredAppointments = appointments.filter(appt => {
        if (filter === 'upcoming') return appt.status === 'scheduled' || appt.status === 'pending';
        if (filter === 'completed') return appt.status === 'completed';
        if (filter === 'cancelled') return appt.status === 'cancelled' || appt.status === 'rejected';
        return true;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'scheduled': return 'text-blue-600 bg-blue-50 border-blue-200';
            case 'pending': return 'text-orange-600 bg-orange-50 border-orange-200';
            case 'completed': return 'text-green-600 bg-green-50 border-green-200';
            case 'cancelled': 
            case 'rejected': return 'text-red-600 bg-red-50 border-red-200';
            default: return 'text-slate-600 bg-slate-50 border-slate-200';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Date TBD';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString; // Return original string if valid check fails
        return date.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
    };

    return (
        <MainLayout>
            <div className="mb-8 animate-slide-up">
                <h1 className="text-3xl font-bold text-slate-900">My Appointments</h1>
                <p className="text-slate-500 mt-2">Manage and view your appointment history.</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex space-x-2 mb-8 border-b border-slate-200 pb-1 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                {['upcoming', 'completed', 'cancelled'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setFilter(tab)}
                        className={`px-4 py-2 text-sm font-medium capitalize transition-all border-b-2 ${
                            filter === tab
                                ? 'border-primary text-primary'
                                : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-24 bg-slate-100 rounded-xl animate-pulse"></div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="p-4 bg-red-50 text-red-600 rounded-lg">
                        Error loading appointments: {error}
                    </div>
                ) : filteredAppointments.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                        {filteredAppointments.map((appt) => (
                            <Card key={appt._id} className="group border-l-4 border-l-indigo-500">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                                    {/* 1. Doctor Info (Left) */}
                                    <div className="flex items-center gap-5 md:w-1/3">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-300">
                                            {appt.doctor?.name?.charAt(0) || 'D'}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">Dr. {appt.doctor?.name || 'Unknown Doctor'}</h3>
                                            <p className="text-sm font-medium text-slate-500">{appt.doctor?.specialization || 'General'}</p>
                                        </div>
                                    </div>

                                    {/* 2. Date, Time, Status (Center - Horizontally Middle) */}
                                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:w-1/3 border-t md:border-t-0 md:border-l md:border-r border-slate-100 py-4 md:py-0 my-2 md:my-0">
                                        <div className="text-center">
                                            <p className="text-slate-900 font-bold">{formatDate(appt.date)}</p>
                                            <p className="text-sm text-slate-500 font-medium">{appt.timeSlot?.start} - {appt.timeSlot?.end}</p>
                                        </div>
                                        
                                        <span className={`text-xs px-3 py-1.5 rounded-full font-bold uppercase tracking-wider ${getStatusColor(appt.status)}`}>
                                            {appt.status}
                                        </span>
                                    </div>
                                    
                                    {/* 3. Action Buttons (Right) */}
                                    <div className="flex flex-col md:flex-row gap-2 justify-center md:justify-end md:w-1/3">
                                        {filter === 'upcoming' && appt.status !== 'cancelled' && (
                                            <>
                                                {(appt.status === 'scheduled') && (
                                                    <button 
                                                        onClick={() => navigate('/patient/messages', { 
                                                            state: { 
                                                                userId: appt.doctor?._id || appt.doctor?.userId, 
                                                                userName: appt.doctor?.name || appt.doctor?.userName,
                                                                role: 'Doctor'
                                                            } 
                                                        })}
                                                        className="text-xs font-semibold text-white bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-1 shadow-sm"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                        </svg>
                                                        Chat
                                                    </button>
                                                )}
                                                <button 
                                                    onClick={() => handleCancel(appt._id)}
                                                    disabled={cancellingId === appt._id}
                                                    className="text-xs font-semibold text-rose-500 bg-rose-50 hover:bg-rose-100 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                                                >
                                                    {cancellingId === appt._id ? 'Cancelling...' : 'Cancel'}
                                                </button>
                                            </>
                                        )}
                                        {(filter !== 'upcoming' || appt.status === 'cancelled') && (
                                             <button className="text-xs font-semibold text-slate-400 bg-slate-50 px-4 py-2 rounded-lg cursor-not-allowed">
                                                View Details
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">📅</div>
                        <h3 className="text-lg font-medium text-slate-900">No appointments found</h3>
                        <p className="text-slate-500 mt-1">You don't have any {filter} appointments.</p>
                        {filter === 'upcoming' && (
                            <button 
                                onClick={() => navigate('/patient/find-doctors')}
                                className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-medium shadow-lg shadow-primary/30"
                            >
                                Book an Appointment
                            </button>
                        )}
                    </div>
                )}
            </div>
        </MainLayout>
    );
};

export default Appointments;
