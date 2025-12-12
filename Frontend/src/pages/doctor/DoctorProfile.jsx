import React, { useState, useEffect } from 'react';
import MainLayout from '../../layouts/MainLayout';
import Card from '../../components/ui/Card';
import api from '../../utils/api';
import useFetchData from '../../hooks/useFetchData';
import { useNavigate } from 'react-router-dom';

const DoctorProfile = () => {
    const navigate = useNavigate();
    const { data: profile, loading: fetching } = useFetchData('/doctor/profile');
    
    // Form State
    const [formData, setFormData] = useState({
        name: '',
        specialization: 'General Physician',
        qualification: '',
        experience: 0,
        consultationFee: 0,
        bio: ''
    });

    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Populate form if data exists
    useEffect(() => {
        if (profile?.data) {
            setFormData({
                name: profile.data.name || '',
                specialization: profile.data.specialization || 'General Physician',
                qualification: profile.data.qualification || '',
                experience: profile.data.experience || 0,
                consultationFee: profile.data.consultationFee || 0,
                bio: profile.data.bio || ''
            });
        } else {
             const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
             if (storedUser.userName) {
                 setFormData(prev => ({ ...prev, name: storedUser.userName }));
             }
        }
    }, [profile]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage({ type: '', text: '' });

        try {
            await api.post('/doctor/profile', formData);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            
            if (!profile?.data) {
                 setTimeout(() => navigate('/doctor/dashboard'), 1500);
            }
        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile.' });
        } finally {
            setIsSaving(false);
        }
    };

    const specializations = [
        "General Physician", "Cardiologist", "Dermatologist", "Pediatrician",
        "Orthopedic", "Neurologist", "Psychiatrist", "Gynecologist", 
        "Dentist", "ENT Specialist"
    ];

    return (
        <MainLayout>
             {/* Notification Toast */}
             {message.text && (
                <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg animate-fade-in text-white ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {message.type === 'success' ? '✅' : '❌'} {message.text}
                </div>
            )}

            <div className="max-w-5xl mx-auto pb-10 animate-slide-up">
                <form onSubmit={handleSubmit}>
                    
                    {/* Header Card (Matching Public Profile) */}
                    <Card className="mb-8 border-0 overflow-hidden relative bg-gradient-to-br from-teal-600 to-blue-600 text-white p-0 shadow-2xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                        
                        <div className="p-8 md:p-12 relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start">
                            {/* Avatar */}
                            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-4xl font-bold border-4 border-white/20 shadow-2xl shrink-0">
                                {formData.name?.charAt(0) || 'D'}
                            </div>
                            
                            {/* Editable Header Fields */}
                            <div className="flex-1 w-full space-y-4">
                                <div>
                                    <label className="text-blue-100 text-xs uppercase tracking-wider font-bold mb-1 block">Display Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-2xl md:text-4xl font-bold text-white placeholder-white/50 focus:outline-none focus:bg-white/20 focus:border-white/40 transition-all"
                                        placeholder="Dr. Name"
                                    />
                                </div>
                                
                                <div>
                                    <label className="text-blue-100 text-xs uppercase tracking-wider font-bold mb-1 block">Specialization</label>
                                    <div className="relative inline-block w-full md:w-auto">
                                        <select
                                            name="specialization"
                                            value={formData.specialization}
                                            onChange={handleChange}
                                            className="w-full md:w-auto appearance-none bg-white/10 border border-white/20 rounded-xl px-4 py-2 pr-10 text-xl font-medium text-blue-100 focus:outline-none focus:bg-white/20 transition-all cursor-pointer"
                                        >
                                            {specializations.map(spec => (
                                                <option key={spec} value={spec} className="text-slate-900">{spec}</option>
                                            ))}
                                        </select>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-blue-200">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    <div className="bg-white/10 px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/10 backdrop-blur-sm">
                                        <span className="text-lg">🎓</span>
                                        <input 
                                            type="text"
                                            name="qualification"
                                            value={formData.qualification}
                                            onChange={handleChange}
                                            placeholder="Qualification (e.g. MBBS)"
                                            className="bg-transparent border-none text-white placeholder-blue-200/50 text-sm focus:outline-none w-32 md:w-auto"
                                        />
                                    </div>

                                    <div className="bg-white/10 px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/10 backdrop-blur-sm">
                                        <span className="text-lg">💼</span>
                                        <input 
                                            type="number"
                                            name="experience"
                                            value={formData.experience}
                                            onChange={handleChange}
                                            placeholder="Yrs"
                                            className="bg-transparent border-none text-white placeholder-blue-200/50 text-sm focus:outline-none w-16"
                                        />
                                        <span className="text-white text-sm">Years Exp.</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Left: About */}
                        <div className="md:col-span-2 space-y-8">
                            <Card title="About Me">
                                <p className="text-slate-500 mb-2 text-sm">Create a compelling bio to build trust with your patients.</p>
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    rows="6"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-700 resize-none placeholder:text-slate-400 text-lg leading-relaxed"
                                    placeholder="Share your medical background, approach to care, and any special interests..."
                                />
                            </Card>

                            <Card title="Practice Information">
                                <div className="grid grid-cols-2 gap-6 p-2">
                                    <div>
                                        <p className="text-sm text-slate-500 mb-1">Clinic / Hospital</p>
                                        <p className="font-semibold text-slate-800">TeleMed Health Virtual Clinic</p>
                                        <p className="text-xs text-slate-400 mt-1">(Default)</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500 mb-1">Languages Spoken</p>
                                        <p className="font-semibold text-slate-800">English, Hindi</p>
                                         <p className="text-xs text-slate-400 mt-1">(Editable in settings)</p>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Right: Fees & Save */}
                        <div className="space-y-6">
                            <Card className="border border-slate-100 shadow-xl shadow-slate-200/50">
                                <h3 className="text-lg font-bold text-slate-800 mb-4">Consultation Fee</h3>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</div>
                                    <input
                                        type="number"
                                        name="consultationFee"
                                        value={formData.consultationFee}
                                        onChange={handleChange}
                                        min="0"
                                        required
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all font-bold text-lg text-slate-900"
                                    />
                                </div>
                                <p className="text-xs text-slate-400 mt-2">Per session (30-60 mins)</p>
                            </Card>

                            <button
                                type="submit"
                                disabled={isSaving}
                                className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 group"
                            >
                                {isSaving ? 'Saving...' : 'Save Profile Changes'}
                            </button>

                             <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100 text-sm text-blue-800">
                                <strong className="block mb-1">💡 Pro Tip</strong>
                                Ensure your profile photo (gravatar) and details are professional to get more bookings.
                             </div>
                        </div>
                    </div>
                </form>
            </div>
        </MainLayout>
    );
};

export default DoctorProfile;
