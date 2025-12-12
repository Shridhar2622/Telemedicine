import React, { useState, useEffect } from 'react';
import useFetchData from '../hooks/useFetchData';
import api from '../utils/api';

const BookingModal = ({ doctor, onClose, onSuccess }) => {
    const { data: freshDoctorData, loading: fetchingDoctor } = useFetchData(`/doctor/${doctor._id}`);
    
    // Use fresh data if available, otherwise fallback to prop (but fresh is preferred for slots)
    const activeDoctor = freshDoctorData?.data || doctor;

    const [selectedDay, setSelectedDay] = useState('');
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [error, setError] = useState('');

    // Filter available days that actually have slots
    const availableDays = activeDoctor.availableTimes?.filter(day => day.slots && day.slots.length > 0) || [];

    const getNextDateForDay = (dayName) => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayIndex = days.indexOf(dayName);
        if (dayIndex === -1) return null;

        const today = new Date();
        const todayIndex = today.getDay();
        
        let daysUntil = dayIndex - todayIndex;
        if (daysUntil <= 0) {
            daysUntil += 7; // Target next occurrence
        }

        const nextDate = new Date(today);
        nextDate.setDate(today.getDate() + daysUntil);
        return nextDate; // Return Date object
    };

    const handleBook = async () => {
        if (!selectedDay || !selectedSlot) return;

        setBookingLoading(true);
        setError('');

        try {
            const dateObj = getNextDateForDay(selectedDay.day);
            const dateStr = dateObj.toISOString().split('T')[0]; // YYYY-MM-DD

            const payload = {
                doctorId: activeDoctor.userId._id || activeDoctor.userId || activeDoctor._id, // Handle potential ID variations
                date: dateStr,
                day: selectedDay.day,
                timeSlot: {
                    start: selectedSlot.startTime,
                    end: selectedSlot.endTime
                }
            };

            await api.post('/appointments/book', payload);
            if (onSuccess) onSuccess();
            onClose();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to book appointment');
            setBookingLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-scale-in">
                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">Book Appointment</h3>
                        <p className="text-sm text-slate-500">Dr. {activeDoctor.name}</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        ✕
                    </button>
                </div>

                <div className="p-6">
                    {fetchingDoctor ? (
                         <div className="flex justify-center py-8">
                             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                         </div>
                    ) : (
                        <>
                            {/* Step 1: Select Day */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-slate-700 mb-3">Select Day</label>
                                <div className="flex flex-wrap gap-2">
                                    {availableDays.length > 0 ? (
                                        availableDays.map((timeObj, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => { setSelectedDay(timeObj); setSelectedSlot(null); }}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                                    selectedDay === timeObj
                                                        ? 'bg-primary text-white shadow-md shadow-primary/20'
                                                        : 'bg-white border border-slate-200 text-slate-600 hover:border-primary hover:text-primary'
                                                }`}
                                            >
                                                {timeObj.day}
                                            </button>
                                        ))
                                    ) : (
                                        <div className="w-full bg-slate-50 p-4 rounded-xl text-center border border-dashed border-slate-200">
                                            <p className="text-sm text-slate-500 font-medium">No slots available</p>
                                            <p className="text-xs text-slate-400 mt-1">This doctor usually has no open slots. Check back later.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Step 2: Select Slot */}
                            {selectedDay && (
                                <div className="mb-8 animate-fade-in">
                                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                                        Available Slots for {selectedDay.day} 
                                        <span className="font-normal text-slate-400 ml-2">
                                            ({getNextDateForDay(selectedDay.day).toLocaleDateString()})
                                        </span>
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {selectedDay.slots.map((slot, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setSelectedSlot(slot)}
                                                className={`px-3 py-2.5 rounded-lg text-sm font-medium border transition-all text-center ${
                                                    selectedSlot === slot
                                                        ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                                                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                                                }`}
                                            >
                                                {slot.startTime} - {slot.endTime}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {error && (
                                <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                                    {error}
                                </div>
                            )}

                            <div className="flex gap-3 mt-4">
                                <button
                                    onClick={onClose}
                                    className="flex-1 py-3 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleBook}
                                    disabled={!selectedDay || !selectedSlot || bookingLoading}
                                    className="flex-1 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex justify-center w-full"
                                >
                                    {bookingLoading ? <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></span> : null}
                                    {bookingLoading ? 'Confirming...' : 'Confirm Booking'}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookingModal;
