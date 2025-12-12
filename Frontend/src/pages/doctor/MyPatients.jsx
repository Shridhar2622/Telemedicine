import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import Card from '../../components/ui/Card';
import useFetchData from '../../hooks/useFetchData';

const MyPatients = () => {
    const navigate = useNavigate();
    // We fetch all appointments to derive the list of patients
    const { data, loading, error } = useFetchData('/appointments/doctor');
    const [searchTerm, setSearchTerm] = useState('');

    // Extract unique patients from appointments
    const appointments = data?.appointments || [];
    const uniquePatientsMap = new Map();

    appointments.forEach(appt => {
        if (appt.patient && !uniquePatientsMap.has(appt.patient._id)) {
            uniquePatientsMap.set(appt.patient._id, {
                ...appt.patient,
                lastVisit: appt.date,
                totalVisits: 1
            });
        } else if (appt.patient) {
            const existing = uniquePatientsMap.get(appt.patient._id);
            existing.totalVisits += 1;
        }
    });

    const patients = Array.from(uniquePatientsMap.values());

    const filteredPatients = patients.filter(patient => 
        patient.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <MainLayout>
             <div className="mb-8 animate-slide-up">
                <h1 className="text-3xl font-bold text-slate-900">My Patients</h1>
                <p className="text-slate-500 mt-2">View and manage records of patients you have treated.</p>
            </div>

            {/* Search Bar */}
            <div className="mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <div className="relative max-w-md">
                    <input
                        type="text"
                        placeholder="Search patients by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                    />
                    <svg className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            {/* Patients Grid */}
            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-48 bg-slate-100 rounded-xl animate-pulse"></div>
                        ))}
                    </div>
                ) : filteredPatients.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPatients.map((patient) => (
                            <Card key={patient._id} className="group hover:-translate-y-1 transition-all">
                                <div className="flex flex-col items-center text-center p-2">
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-400 to-cyan-300 flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg shadow-blue-400/30 group-hover:scale-110 transition-transform duration-300">
                                        {patient.userName?.charAt(0).toUpperCase() || 'P'}
                                    </div>
                                    
                                    <h3 className="text-lg font-bold text-slate-900 mb-1">{patient.userName}</h3>
                                    <p className="text-sm text-slate-500 mb-4">{patient.email}</p>
                                    
                                    <div className="w-full py-3 border-t border-slate-100 flex justify-around mb-4">
                                        <div>
                                            <span className="block text-xs text-slate-400 uppercase tracking-wider font-semibold">Total Visits</span>
                                            <span className="font-bold text-slate-700">{patient.totalVisits}</span>
                                        </div>
                                        <div>
                                            <span className="block text-xs text-slate-400 uppercase tracking-wider font-semibold">Status</span>
                                            <span className="text-xs font-bold px-2 py-1 bg-green-100 text-green-700 rounded-full mt-0.5 inline-block">Active</span>
                                        </div>
                                    </div>

                                    <div className="w-full flex gap-2">
                                        <button className="flex-1 py-2.5 rounded-lg border-2 border-primary text-primary font-bold hover:bg-primary hover:text-white transition-all text-sm">
                                            View History
                                        </button>
                                        <button 
                                            onClick={() => navigate('/doctor/messages', { 
                                                state: { 
                                                    userId: patient._id, 
                                                    userName: patient.userName,
                                                    role: 'Patient'
                                                } 
                                            })}
                                            className="px-3 py-2.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100 transition-all"
                                            title="Send Message"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">👥</div>
                        <h3 className="text-lg font-bold text-slate-900">No patients found</h3>
                        <p className="text-slate-500 mt-2">You haven't seen any patients yet{searchTerm && " matching your search"}.</p>
                    </div>
                )}
            </div>
        </MainLayout>
    );
};

export default MyPatients;
