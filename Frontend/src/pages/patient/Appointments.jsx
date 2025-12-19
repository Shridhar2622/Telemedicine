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
    const [selectedReviewAppt, setSelectedReviewAppt] = useState(null);
    const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
    const [toast, setToast] = useState({ message: '', type: '' }); // 'success' or 'error'

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast({ message: '', type: '' }), 3000);
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!selectedReviewAppt) return;
        try {
            await api.post('/reviews', {
                doctorId: selectedReviewAppt.doctor._id,
                appointmentId: selectedReviewAppt._id,
                rating: parseInt(reviewForm.rating),
                comment: reviewForm.comment
            });
            showToast('Review submitted successfully!', 'success');
            setSelectedReviewAppt(null); // Close modal
            setReviewForm({ rating: 5, comment: '' }); // Reset form
        } catch (err) {
            console.error(err);
            showToast(err.response?.data?.message || 'Failed to submit review', 'error');
        }
    };

    const handleCancel = async (appointmentId) => {
        if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
        
        setCancellingId(appointmentId);
        try {
            await api.patch('/appointments/cancel', { appointmentId });
            showToast('Appointment cancelled successfully', 'success');
            refetch(); // Refresh list
        } catch (error) {
            showToast('Failed to cancel appointment', 'error');
            console.error(error);
        } finally {
            setCancellingId(null);
        }
    };

    const appointments = data?.appointments || [];

    const filteredAppointments = appointments.filter(appt => {
        if (filter === 'upcoming') return appt.status === 'scheduled' || appt.status === 'pending' || appt.status === 'accepted';
        if (filter === 'completed') return appt.status === 'completed';
        if (filter === 'cancelled') return appt.status === 'cancelled' || appt.status === 'rejected';
        return true;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'accepted': return 'text-green-600 bg-green-50 border-green-200';
            case 'scheduled': return 'text-blue-600 bg-blue-50 border-blue-200';
            case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'completed': return 'text-indigo-600 bg-indigo-50 border-indigo-200';
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
            {/* Toast Notification */}
            {toast.message && (
                <div className={`fixed top-4 right-4 z-[60] px-6 py-3 rounded-xl shadow-lg animate-fade-in flex items-center gap-2 ${
                    toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                }`}>
                    <span>{toast.type === 'error' ? '⚠️' : '✅'}</span>
                    <span className="font-medium">{toast.message}</span>
                    <button onClick={() => setToast({ message: '', type: '' })} className="ml-2 hover:opacity-80">✕</button>
                </div>
            )}

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
                                                    <>
                                                        {appt.meetingRoom && (
                                                            <a 
                                                                href={appt.meetingRoom}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-1 shadow-sm"
                                                            >
                                                                📹 Join
                                                            </a>
                                                        )}
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); navigate('/patient/messages', { 
                                                                state: { 
                                                                    userId: appt.doctor?._id || appt.doctor?.userId, 
                                                                    userName: appt.doctor?.name || appt.doctor?.userName,
                                                                    role: 'Doctor'
                                                                } 
                                                            })}}
                                                            className="text-xs font-semibold text-white bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-1 shadow-sm"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                            </svg>
                                                            Chat
                                                        </button>
                                                    </>
                                                )}

                                                {/* Review Button for Accepted/Completed appointments */}
                                                {(appt.status === 'accepted' || appt.status === 'completed') && (
                                                    <button
                                                        onClick={() => setSelectedReviewAppt(appt)}
                                                        className="text-xs font-semibold text-white bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-1 shadow-sm"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                        Review
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
    {selectedReviewAppt && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-scale-up">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-slate-900">Rate Dr. {selectedReviewAppt.doctor?.name}</h3>
                            <button onClick={() => setSelectedReviewAppt(null)} className="text-slate-400 hover:text-slate-600">
                                ✕
                            </button>
                        </div>
                        <form onSubmit={handleReviewSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Rating</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                                            className={`text-2xl transition-transform hover:scale-110 ${star <= reviewForm.rating ? 'text-yellow-400' : 'text-slate-200'}`}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Your Feedback</label>
                                <textarea
                                    required
                                    value={reviewForm.comment}
                                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none h-32"
                                    placeholder="Share your experience..."
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className="w-full py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover transition-colors shadow-lg shadow-primary/30"
                            >
                                Submit Review
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </MainLayout>
    );
};

export default Appointments;
