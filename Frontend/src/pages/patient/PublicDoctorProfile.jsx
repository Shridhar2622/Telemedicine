import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import Card from '../../components/ui/Card';
import useFetchData from '../../hooks/useFetchData';
import BookingModal from '../../components/BookingModal'; // Reusing existing booking modal

const PublicDoctorProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data, loading, error } = useFetchData(`/doctor/${id}`);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    const doctor = data?.data;

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isDoctor = user.role === 'Doctor';

    if (loading) {
        return (
            <MainLayout>
                <div className="animate-pulse space-y-8 max-w-4xl mx-auto">
                    <div className="h-64 bg-slate-200 rounded-2xl"></div>
                    <div className="h-32 bg-slate-200 rounded-xl"></div>
                    <div className="h-32 bg-slate-200 rounded-xl"></div>
                </div>
            </MainLayout>
        );
    }

    if (error || !doctor) {
        return (
            <MainLayout>
                <div className="text-center py-20">
                    <h2 className="text-2xl font-bold text-slate-700">Doctor not found</h2>
                    <button onClick={() => navigate(-1)} className="mt-4 text-primary hover:underline">
                        Go Back
                    </button>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
             {successMsg && (
                <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg animate-fade-in">
                    ✅ {successMsg}
                </div>
            )}

            <div className="max-w-5xl mx-auto animate-slide-up">
                {/* Header Card */}
                <Card className="mb-8 border-0 overflow-hidden relative bg-gradient-to-br from-teal-600 to-blue-600 text-white p-0">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                    
                    <div className="p-8 md:p-12 relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-4xl font-bold border-4 border-white/20 shadow-2xl">
                            {doctor.name?.charAt(0) || 'D'}
                        </div>
                        
                        <div className="flex-1 text-center md:text-left space-y-2">
                            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">Dr. {doctor.name}</h1>
                            <p className="text-xl text-blue-200 font-medium">{doctor.specialization}</p>
                            <div className="flex flex-wrap gap-3 justify-center md:justify-start mt-4">
                                <span className="bg-white/10 px-4 py-1.5 rounded-full text-sm backdrop-blur-sm border border-white/10">
                                    🎓 {doctor.qualification}
                                </span>
                                <span className="bg-white/10 px-4 py-1.5 rounded-full text-sm backdrop-blur-sm border border-white/10">
                                    💼 {doctor.experience}+ Years Experience
                                </span>
                                <span className="bg-yellow-500/20 text-yellow-200 px-4 py-1.5 rounded-full text-sm backdrop-blur-sm border border-yellow-500/20 font-semibold">
                                    ⭐ {doctor.rating || '4.5'} Rating
                                </span>
                            </div>
                        </div>

                        {!isDoctor && (
                            <div className="flex flex-col gap-3 min-w-[200px]">
                                <div className="text-center md:text-right mb-2">
                                    <p className="text-slate-400 text-sm">Consultation Fee</p>
                                    <p className="text-3xl font-bold text-green-400">₹{doctor.consultationFee}</p>
                                </div>
                                <button 
                                    onClick={() => setShowBookingModal(true)}
                                    className="w-full py-3 bg-primary hover:bg-white hover:text-primary text-white font-bold rounded-xl transition-all shadow-lg shadow-black/20"
                                >
                                    Book Appointment
                                </button>
                            </div>
                        )}
                    </div>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left: About */}
                    <div className="md:col-span-2 space-y-8">
                        <Card title="About Doctor">
                            <p className="text-slate-600 leading-relaxed text-lg">
                                {doctor.bio || "No biography available."}
                            </p>
                        </Card>

                        <Card title="Practice Information">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm text-slate-500 mb-1">Clinic / Hospital</p>
                                    <p className="font-semibold text-slate-800">TeleMed Health Virtual Clinic</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 mb-1">Languages Spoken</p>
                                    <p className="font-semibold text-slate-800">English, Hindi</p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Right: Availability Preview */}
                    <div className="space-y-6">
                        <Card title="Availability">
                            <div className="space-y-4">
                                {doctor.availableTimes && doctor.availableTimes.length > 0 ? (
                                    doctor.availableTimes.map((day, idx) => (
                                        <div key={idx} className="flex justify-between items-center border-b border-slate-50 pb-2 last:border-0">
                                            <span className="font-medium text-slate-700">{day.day}</span>
                                            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">
                                                {day.slots?.length || 0} Slots
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-slate-400 text-center italic">No slots listed.</p>
                                )}
                            </div>
                            
                            {!isDoctor && (
                                <button 
                                    onClick={() => setShowBookingModal(true)}
                                    className="w-full mt-6 py-2 border border-primary text-primary font-bold rounded-lg hover:bg-primary/5 transition-colors"
                                >
                                    Check Slots
                                </button>
                            )}
                        </Card>

                        {/* For doctors viewing other doctors */}
                        {isDoctor && (
                            <div className="bg-blue-50 p-4 rounded-xl text-blue-800 text-sm border border-blue-100">
                                <p>ℹ️ As a doctor, you are viewing this profile in <strong>peer mode</strong>.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Booking Modal */}
            {showBookingModal && (
                <BookingModal 
                    doctor={doctor} 
                    onClose={() => setShowBookingModal(false)} 
                    onSuccess={() => {
                        setSuccessMsg('Appointment booked successfully!');
                        setTimeout(() => setSuccessMsg(''), 3000);
                    }}
                />
            )}
        </MainLayout>
    );
};

export default PublicDoctorProfile;
