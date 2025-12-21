import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from "../../config";
import { CheckCircle, XCircle, Clock } from 'lucide-react';

const DoctorsTable = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, pending, approved

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_BASE_URL}/admin/doctors`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                setDoctors(response.data.doctors);
            }
        } catch (error) {
            console.error("Error fetching doctors:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (userId, action) => {
        const endpoint = action === 'approve' ? '/approve-doctor' : '/reject-doctor';
        if (!window.confirm(`Are you sure you want to ${action} this doctor?`)) return;

        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_BASE_URL}/admin${endpoint}`, 
                { userId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchDoctors(); // Refresh list
        } catch (error) {
            console.error(`Error ${action} doctor:`, error);
            alert("Failed to update doctor status");
        }
    };

    const filteredDoctors = doctors.filter(doc => {
        // Pending logic: userId.isActive is false AND role is Doctor
        // Approved logic: userId.isActive is true
        // Note: The API populates userId.
        const isActive = doc.userId?.isActive;
        
        if (filter === 'pending') return !isActive; 
        if (filter === 'approved') return isActive;
        return true;
    });

    if (loading) return <div className="text-center py-10">Loading doctors...</div>;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                <h3 className="text-lg font-semibold text-slate-800">Doctors Registry</h3>
                
                <div className="flex bg-slate-100 p-1 rounded-lg">
                    {['all', 'pending', 'approved'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-all ${
                                filter === f 
                                    ? 'bg-white text-slate-900 shadow-sm' 
                                    : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-semibold">
                        <tr>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Specialization</th>
                            <th className="px-6 py-4">Experience</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                        {filteredDoctors.map((doc) => {
                             const user = doc.userId || {};
                             return (
                                <tr key={doc._id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-medium text-slate-900">{user.userName || 'Unknown'}</p>
                                            <p className="text-slate-500 text-xs">{user.email}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-700">
                                        {doc.specialization || 'General'}
                                    </td>
                                    <td className="px-6 py-4 text-slate-700">
                                        {doc.experience} years
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {user.isActive ? (
                                                <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-medium border border-green-100">
                                                    <CheckCircle size={12} /> Approved
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-1 rounded-full text-xs font-medium border border-amber-100">
                                                    <Clock size={12} /> Pending
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            {!user.isActive && (
                                                <button 
                                                    onClick={() => handleStatusChange(user._id, 'approve')}
                                                    className="px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs font-medium hover:bg-green-700 transition-colors shadow-sm shadow-green-200"
                                                >
                                                    Approve
                                                </button>
                                            )}
                                            <button 
                                                onClick={() => handleStatusChange(user._id, 'reject')}
                                                className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 text-xs font-medium hover:bg-red-50 transition-colors"
                                            >
                                                {user.isActive ? 'Block' : 'Reject'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            
            {filteredDoctors.length === 0 && (
                <div className="p-8 text-center text-slate-500">
                    No doctors found for this filter.
                </div>
            )}
        </div>
    );
};

export default DoctorsTable;
