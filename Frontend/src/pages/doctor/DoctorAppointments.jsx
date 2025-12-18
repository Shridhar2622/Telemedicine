import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import Card from '../../components/ui/Card';
import useFetchData from '../../hooks/useFetchData';
import api from '../../utils/api';

const DoctorAppointments = () => {
    const navigate = useNavigate();
    const { data, loading, refetch } = useFetchData('/appointments/doctor');
    const [processingId, setProcessingId] = useState(null);

    const appointments = data?.appointments || [];

    const pendingAppointments = appointments.filter(a => a.status === 'pending');
    const upcomingAppointments = appointments.filter(a => a.status === 'accepted' || a.status === 'scheduled');
    const pastAppointments = appointments.filter(a => ['completed', 'rejected', 'cancelled'].includes(a.status));

    const handleStatusUpdate = async (appointmentId, newStatus, meetingRoomLink = null) => {
        setProcessingId(appointmentId);
        try {
            await api.patch('/appointments/status', {
                appointmentId,
                status: newStatus,
                meetingRoom: meetingRoomLink // renamed argument to avoid conflict if any
            });
            refetch();
        } catch (error) {
            console.error("Failed to update status", error);
            alert("Failed to update status");
        } finally {
            setProcessingId(null);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    };

    const AppointmentItem = ({ appt, isPending }) => {
        const [showLinkInput, setShowLinkInput] = useState(false);
        const [meetingLink, setMeetingLink] = useState('');

        const handleAccept = () => {
             // 1. Open Google Meet in new tab
             window.open('https://meet.google.com/new', '_blank');
             // 2. Show input for link
             setShowLinkInput(true);
        };

        const confirmAccept = () => {
            if (!meetingLink) {
                alert("Please paste the Google Meet link");
                return;
            }
            handleStatusUpdate(appt._id, 'accepted', meetingLink);
        };

        return (
        <Card className="mb-4 bg-white border border-slate-100 hover:shadow-md transition-all">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg 
                        ${appt.status === 'pending' ? 'bg-orange-100 text-orange-600' : 
                          appt.status === 'accepted' ? 'bg-green-100 text-green-600' : 
                          'bg-slate-100 text-slate-500'}`}>
                        {appt.patient?.userName?.charAt(0) || 'P'}
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900">{appt.patient?.userName || 'Unknown Patient'}</h4>
                        <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                            <span>📅 {formatDate(appt.date)}</span>
                            <span>⏰ {appt.timeSlot?.start} - {appt.timeSlot?.end}</span>
                        </div>
                         {appt.meetingRoom && (
                            <a href={appt.meetingRoom} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 underline mt-1 block">
                                Join Meeting: {appt.meetingRoom}
                            </a>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
                    {isPending ? (
                        <>
                            {!showLinkInput ? (
                                <>
                                    <button 
                                        onClick={() => handleStatusUpdate(appt._id, 'rejected')}
                                        disabled={processingId === appt._id}
                                        className="flex-1 md:flex-none px-4 py-2 border border-red-200 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                                    >
                                        Reject
                                    </button>
                                    <button 
                                        onClick={handleAccept}
                                        disabled={processingId === appt._id}
                                        className="flex-1 md:flex-none px-6 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 shadow-lg shadow-green-600/20 transition-all disabled:opacity-50"
                                    >
                                        Accept
                                    </button>
                                </>
                            ) : (
                                <div className="flex flex-col gap-2 animate-fade-in">
                                    <input 
                                        type="text" 
                                        placeholder="Paste Google Meet Link" 
                                        value={meetingLink}
                                        onChange={(e) => setMeetingLink(e.target.value)}
                                        className="text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                    />
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => setShowLinkInput(false)}
                                            className="px-3 py-1 text-slate-500 text-xs hover:bg-slate-100 rounded"
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            onClick={confirmAccept}
                                            disabled={processingId === appt._id}
                                            className="px-4 py-1 bg-green-600 text-white text-xs font-bold rounded shadow-md hover:bg-green-700 disabled:opacity-50"
                                        >
                                            {processingId === appt._id ? 'Saving...' : 'Save Link'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex items-center gap-2">
                             {(appt.status === 'accepted' || appt.status === 'scheduled') && (
                                <button 
                                    onClick={() => navigate('/doctor/messages', { 
                                        state: { 
                                            userId: appt.patient?._id, 
                                            userName: appt.patient?.userName,
                                            role: 'Patient'
                                        } 
                                    })}
                                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                    title="Chat with Patient"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </button>
                            )}
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                                ${appt.status === 'accepted' ? 'bg-green-50 text-green-700' : 
                                  appt.status === 'rejected' ? 'bg-red-50 text-red-700' : 
                                  'bg-slate-100 text-slate-600'}`}>
                                {appt.status}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
    };

    return (
        <MainLayout>
            <div className="mb-8 animate-slide-up">
                <h1 className="text-3xl font-bold text-slate-900">Manage Appointments</h1>
                <p className="text-slate-500 mt-2">View and manage your patient requests.</p>
            </div>

            {loading ? (
                <div className="space-y-4 animate-pulse">
                    {[1, 2, 3].map(i => <div key={i} className="h-24 bg-slate-100 rounded-xl"></div>)}
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    {/* Left Col: Pending & Upcoming */}
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <span className="w-2 h-8 bg-orange-500 rounded-full"></span>
                                Pending Requests ({pendingAppointments.length})
                            </h2>
                            {pendingAppointments.length > 0 ? (
                                pendingAppointments.map(appt => <AppointmentItem key={appt._id} appt={appt} isPending={true} />)
                            ) : (
                                <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                    <p className="text-slate-500">No pending appointment requests.</p>
                                </div>
                            )}
                        </div>

                        <div>
                            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
                                Upcoming Appointments
                            </h2>
                            {upcomingAppointments.length > 0 ? (
                                upcomingAppointments.map(appt => <AppointmentItem key={appt._id} appt={appt} isPending={false} />)
                            ) : (
                                <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                    <p className="text-slate-500">No upcoming appointments.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Col: Past / History */}
                    <div>
                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 sticky top-4">
                            <h3 className="font-bold text-slate-800 mb-4">Past History</h3>
                            <div className="space-y-4">
                                {pastAppointments.length > 0 ? (
                                    pastAppointments.map(appt => (
                                        <div key={appt._id} className="text-sm border-b border-slate-200 pb-3 last:border-0">
                                            <div className="flex justify-between mb-1">
                                                <span className="font-medium text-slate-700">{appt.patient?.userName}</span>
                                                <span className={`text-xs px-2 py-0.5 rounded ${
                                                    appt.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                    {appt.status}
                                                </span>
                                            </div>
                                            <div className="text-slate-400 text-xs">
                                                {formatDate(appt.date)}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-slate-400 text-sm text-center italic">No history yet.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    );
};

export default DoctorAppointments;
