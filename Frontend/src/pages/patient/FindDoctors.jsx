import React, { useState, useEffect } from 'react';
import MainLayout from '../../layouts/MainLayout';
import Card from '../../components/ui/Card';
import useFetchData from '../../hooks/useFetchData';
import BookingModal from '../../components/BookingModal';
import api from '../../utils/api';
import { useNavigate } from 'react-router-dom';

const FindDoctors = () => {
    // Determine User Role
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isDoctor = user.role === 'Doctor';

    // Filter State
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        minRating: '',
        maxPrice: ''
    });
    const [debouncedFilters, setDebouncedFilters] = useState(filters);
    
    // Fetch Data with filters
    const queryParams = new URLSearchParams();
    if (debouncedFilters.minRating) queryParams.append('minRating', debouncedFilters.minRating);
    if (debouncedFilters.maxPrice) queryParams.append('maxPrice', debouncedFilters.maxPrice);
    
    const { data, loading, error, refetch } = useFetchData(`/doctor?${queryParams.toString()}`);
    
    // Trigger internal filter debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedFilters(filters);
        }, 500);
        return () => clearTimeout(timer);
    }, [filters]);

    // ...

    const doctors = data?.data || [];
    
    // Client-side search (Name/Spec) + Server-side filters (Price/Rating)
    const filteredDoctors = doctors.filter(doc => 
        doc.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        doc.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const [selectedDoctor, setSelectedDoctor] = useState(null); // For Booking Modal
    const [showSuccess, setShowSuccess] = useState(false);
    const navigate = useNavigate();

    const handleBookingSuccess = () => {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    const bgColors = [
        'bg-blue-50/50', 'bg-green-50/50', 'bg-purple-50/50', 
        'bg-orange-50/50', 'bg-pink-50/50', 'bg-teal-50/50',
        'bg-indigo-50/50', 'bg-cyan-50/50'
    ];

    return (
        <MainLayout>
             <div className="mb-8 animate-slide-up">
                <h1 className="text-3xl font-bold text-slate-900">Find a Doctor</h1>
                <p className="text-slate-500 mt-2">Search for specialists, filter by price, and book your consultation.</p>
            </div>

            {/* Success Toast */}
            {showSuccess && (
                <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg animate-fade-in flex items-center gap-2">
                    <span className="text-xl">✅</span>
                    <span className="font-semibold">Appointment booked successfully!</span>
                </div>
            )}

            {/* Filter & Search Bar */}
            <div className="mb-8 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="Search by doctor name or specialization..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-700"
                        />
                        <svg className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    {/* Filter: Rating */}
                    <div className="w-full md:w-48">
                        <select
                            value={filters.minRating}
                            onChange={(e) => setFilters(prev => ({ ...prev, minRating: e.target.value }))}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-700"
                        >
                            <option value="">All Ratings</option>
                            <option value="4">4+ Stars</option>
                            <option value="4.5">4.5+ Stars</option>
                            <option value="5">5 Stars</option>
                        </select>
                    </div>

                    {/* Filter: Price */}
                    <div className="w-full md:w-48">
                        <select
                            value={filters.maxPrice}
                            onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-700"
                        >
                            <option value="">Any Price</option>
                            <option value="500">Under ₹500</option>
                            <option value="1000">Under ₹1000</option>
                            <option value="2000">Under ₹2000</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Doctor Grid */}
            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="bg-white border border-slate-100 rounded-2xl p-6 h-[320px] flex flex-col animate-pulse">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-16 h-16 bg-slate-200 rounded-full"></div>
                                    <div className="w-16 h-6 bg-slate-200 rounded-md"></div>
                                </div>
                                <div className="space-y-3 flex-1">
                                    <div className="w-3/4 h-6 bg-slate-200 rounded"></div>
                                    <div className="w-1/2 h-4 bg-slate-200 rounded"></div>
                                    <div className="w-full h-12 bg-slate-100 rounded mt-2"></div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-slate-50 flex gap-2">
                                     <div className="flex-1 h-10 bg-slate-200 rounded-xl"></div>
                                     <div className="flex-1 h-10 bg-slate-200 rounded-xl"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="p-4 bg-red-50 text-red-600 rounded-lg">
                        Error loading doctors: {error}
                    </div>
                ) : filteredDoctors.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredDoctors.map((doc, index) => {
                            const bgColor = bgColors[index % bgColors.length];
                            return (
                                <Card key={doc._id} className={`${bgColor} border-2 border-white hover:shadow-lg transition-all hover:-translate-y-1 duration-300 flex flex-col`}>
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-2xl border-2 border-slate-50">
                                        {doc.name?.charAt(0) || 'D'}
                                    </div>
                                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-md border border-yellow-100">
                                        <span className="text-yellow-500 text-xs">⭐</span>
                                        <span className="text-sm font-bold text-slate-700">{doc.rating || '4.5'}</span>
                                    </div>
                                </div>
                                
                                <div className="mb-4 flex-1">
                                    <h3 className="text-lg font-bold text-slate-900 line-clamp-1" title={doc.name}>Dr. {doc.name}</h3>
                                    <p className="text-primary font-medium text-sm mb-1">{doc.specialization}</p>
                                    <p className="text-slate-500 text-sm line-clamp-2">{doc.bio || 'Experienced specialist dedicated to patient care.'}</p>
                                </div>

                                <div className="mt-auto pt-4 border-t border-slate-100 space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Experience</span>
                                        <span className="font-medium text-slate-900">{doc.experience || 5}+ Years</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Consultation Fee</span>
                                        <span className="font-medium text-green-600">₹{doc.consultationFee || 500}</span>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-2 mt-4">
                                        <button 
                                            onClick={() => navigate(`/doctor-profile/${doc._id}`)}
                                            className="py-2.5 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors font-semibold text-sm"
                                        >
                                            View Profile
                                        </button>

                                        {!isDoctor && doc.availableTimes?.length > 0 ? (
                                            <button 
                                                onClick={() => setSelectedDoctor(doc)}
                                                className="py-2.5 bg-primary text-white rounded-xl hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all font-semibold text-sm"
                                            >
                                                Book Now
                                            </button>
                                        ) : !isDoctor ? (
                                            <button disabled className="py-2.5 bg-slate-100 text-slate-400 rounded-xl cursor-not-allowed font-semibold text-sm">
                                                Unavailable
                                            </button>
                                        ) : (
                                            /* If isDoctor, maybe hide or show simple disabled */
                                            <button disabled className="py-2.5 bg-slate-50 text-slate-400 rounded-xl cursor-not-allowed font-medium text-sm border border-slate-100">
                                                Doctor View
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </Card>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🔍</div>
                        <h3 className="text-lg font-medium text-slate-900">No doctors found</h3>
                        <p className="text-slate-500 mt-1">Try adjusting your search or filters.</p>
                    </div>
                )}
            </div>

            {/* MODAL COMPONENT */}
            {selectedDoctor && (
                <BookingModal 
                    doctor={selectedDoctor} 
                    onClose={() => setSelectedDoctor(null)} 
                    onSuccess={handleBookingSuccess}
                />
            )}
        </MainLayout>
    );
};

export default FindDoctors;
