import React, { useState, useEffect } from 'react';
import MainLayout from '../../layouts/MainLayout';
import Card from '../../components/ui/Card';
import useFetchData from '../../hooks/useFetchData';
import api from '../../utils/api';

const DoctorSchedule = () => {
    const { data: profileData, loading, refetch } = useFetchData('/doctor/profile');
    const [schedule, setSchedule] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Initialize state when data loads
    useEffect(() => {
        if (profileData?.data?.availableTimes) {
            setSchedule(profileData.data.availableTimes);
        }
    }, [profileData]);

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const handleAddSlot = (dayIndex) => {
        const dayName = daysOfWeek[dayIndex];
        
        setSchedule(prev => {
            const newSchedule = [...prev];
            const existingDayIndex = newSchedule.findIndex(d => d.day === dayName);

            if (existingDayIndex >= 0) {
                // Create a copy of the day object and slots array
                const updatedDay = {
                    ...newSchedule[existingDayIndex],
                    slots: [...newSchedule[existingDayIndex].slots, { startTime: '09:00', endTime: '17:00' }]
                };
                newSchedule[existingDayIndex] = updatedDay;
                return newSchedule;
            } else {
                // Add new day with one slot
                return [...newSchedule, { day: dayName, slots: [{ startTime: '09:00', endTime: '17:00' }] }];
            }
        });
    };

    const handleRemoveSlot = (dayName, slotIndex) => {
        setSchedule(prev => {
            return prev.map(day => {
                if (day.day === dayName) {
                    const newSlots = day.slots.filter((_, idx) => idx !== slotIndex);
                    return { ...day, slots: newSlots };
                }
                return day;
            }).filter(day => day.slots.length > 0);
        });
    };

    const handleTimeChange = (dayName, slotIndex, field, value) => {
        setSchedule(prev => {
            return prev.map(day => {
                if (day.day === dayName) {
                    const newSlots = [...day.slots];
                    newSlots[slotIndex] = { ...newSlots[slotIndex], [field]: value };
                    return { ...day, slots: newSlots };
                }
                return day;
            });
        });
    };

    const saveSchedule = async () => {
        setIsSaving(true);
        setMessage({ type: '', text: '' });
        try {
            // Filter out any days that accidentally have 0 slots before saving
            const validSchedule = schedule.filter(day => day.slots && day.slots.length > 0);

            // Send only valid schedule as payload
            const payload = {
                availableTimes: validSchedule
            };

            await api.put('/doctor/schedule', payload);
            setMessage({ type: 'success', text: 'Schedule and slots updated successfully!' });
            refetch();
        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', text: 'Failed to update schedule. Please try again.' });
        } finally {
            setIsSaving(false);
        }
    };

    // Helper to get slots for a specific day
    const getSlotsForDay = (dayName) => {
        return schedule.find(d => d.day === dayName)?.slots || [];
    };

    return (
        <MainLayout>
            <div className="mb-8 animate-slide-up">
                <h1 className="text-3xl font-bold text-slate-900">My Schedule</h1>
                <p className="text-slate-500 mt-2">Manage your weekly availability for appointments.</p>
            </div>

            {message.text && (
                <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                {loading ? (
                    <div className="col-span-2 space-y-4">
                         {[1, 2, 3].map(i => <div key={i} className="h-32 bg-slate-100 rounded-xl animate-pulse"></div>)}
                    </div>
                ) : (
                    <>
                        <div className="space-y-6">
                            {daysOfWeek.map((day, index) => {
                                const slots = getSlotsForDay(day);
                                return (
                                    <Card key={day} className={`transition-all ${slots.length > 0 ? 'border-l-4 border-l-primary' : 'opacity-70'}`}>
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="font-bold text-slate-800 text-lg">{day}</h3>
                                            <button 
                                                onClick={() => handleAddSlot(index)}
                                                className="text-sm text-primary hover:bg-primary/10 px-3 py-1 rounded-md transition-colors font-medium"
                                            >
                                                + Add Slot
                                            </button>
                                        </div>

                                        {slots.length === 0 ? (
                                            <p className="text-sm text-slate-400 italic">No slots available. Click add to open slots.</p>
                                        ) : (
                                            <div className="space-y-3">
                                                {slots.map((slot, sIndex) => (
                                                    <div key={sIndex} className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                                        <input 
                                                            type="time" 
                                                            value={slot.startTime} 
                                                            onChange={(e) => handleTimeChange(day, sIndex, 'startTime', e.target.value)}
                                                            className="bg-white border border-slate-200 rounded px-2 py-1 text-sm focus:outline-primary"
                                                        />
                                                        <span className="text-slate-400">-</span>
                                                        <input 
                                                            type="time" 
                                                            value={slot.endTime} 
                                                            onChange={(e) => handleTimeChange(day, sIndex, 'endTime', e.target.value)}
                                                            className="bg-white border border-slate-200 rounded px-2 py-1 text-sm focus:outline-primary"
                                                        />
                                                        <button 
                                                            onClick={() => handleRemoveSlot(day, sIndex)}
                                                            className="ml-auto text-red-400 hover:text-red-600 p-1"
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </Card>
                                );
                            })}
                        </div>
                        
                        {/* Summary / Save Card */}
                        <div className="lg:sticky lg:top-8 h-fit">
                            <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0">
                                <h3 className="text-xl font-bold mb-4">Publish Schedule</h3>
                                <p className="text-slate-300 text-sm mb-6">
                                    Make sure your availability is correct. Patients will be able to book these slots immediately after you save.
                                </p>
                                
                                <div className="space-y-4">
                                    <div className="flex justify-between text-sm text-slate-300 border-b border-white/10 pb-2">
                                        <span>Active Days</span>
                                        <span className="font-bold text-white">{schedule.length}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-slate-300 border-b border-white/10 pb-2">
                                        <span>Total Slots</span>
                                        <span className="font-bold text-white">{schedule.reduce((acc, curr) => acc + curr.slots.length, 0)}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={saveSchedule}
                                    disabled={isSaving}
                                    className="w-full mt-8 bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                                >
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </Card>
                        </div>
                    </>
                )}
            </div>
        </MainLayout>
    );
};

export default DoctorSchedule;
