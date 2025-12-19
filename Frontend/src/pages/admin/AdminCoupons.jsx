import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { Ticket, Plus, Trash2, Calendar, Percent } from 'lucide-react';
import api from '../../utils/api';

const AdminCoupons = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    
    // Form State
    const [formData, setFormData] = useState({
        code: '',
        discountPercentage: '',
        expirationDate: '',
        usageLimit: ''
    });

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await api.get('/coupons', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setCoupons(res.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch coupons", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this coupon?")) return;
        try {
            const token = localStorage.getItem('token');
            await api.delete(`/coupons/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCoupons(coupons.filter(c => c._id !== id));
        } catch (error) {
            console.error("Failed to delete coupon", error);
            alert("Failed to delete coupon");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCreating(true);
        try {
            const token = localStorage.getItem('token');
            const res = await api.post('/coupons/create', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setCoupons([res.data.coupon, ...coupons]);
                setFormData({ code: '', discountPercentage: '', expirationDate: '', usageLimit: '' });
                alert("Coupon created successfully!");
            }
        } catch (error) {
            console.error("Failed to create coupon", error);
            alert(error.response?.data?.message || "Failed to create coupon");
        } finally {
            setCreating(false);
        }
    };

    return (
        <AdminLayout>
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                            <Ticket className="text-blue-600" />
                            Coupon Management
                        </h1>
                        <p className="text-slate-500">Create and manage discount codes.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Create Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 sticky top-6">
                            <h2 className="font-semibold text-lg text-slate-800 mb-4 flex items-center gap-2">
                                <Plus size={20} /> Create New Coupon
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Coupon Code</label>
                                    <input 
                                        type="text" 
                                        required
                                        placeholder="e.g. SAVE20"
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg uppercase font-mono focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={formData.code}
                                        onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Discount Percentage</label>
                                    <div className="relative">
                                        <Percent className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                        <input 
                                            type="number" 
                                            required
                                            min="1"
                                            max="100"
                                            placeholder="20"
                                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                            value={formData.discountPercentage}
                                            onChange={(e) => setFormData({...formData, discountPercentage: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Expiration Date</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                        <input 
                                            type="date" 
                                            required
                                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                            value={formData.expirationDate}
                                            onChange={(e) => setFormData({...formData, expirationDate: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Usage Limit (Optional)</label>
                                    <input 
                                        type="number" 
                                        min="1"
                                        placeholder="Unlimited"
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                        value={formData.usageLimit}
                                        onChange={(e) => setFormData({...formData, usageLimit: e.target.value})}
                                    />
                                    <p className="text-xs text-slate-500 mt-1">Leave blank for unlimited usage.</p>
                                </div>
                                <button 
                                    type="submit" 
                                    disabled={creating}
                                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                                >
                                    {creating ? 'Creating...' : 'Create Coupon'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Coupons List */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                            <div className="p-4 border-b border-slate-100 bg-slate-50">
                                <h2 className="font-semibold text-slate-800">Active Coupons</h2>
                            </div>
                            
                            {loading ? (
                                <div className="p-8 text-center text-slate-500">Loading coupons...</div>
                            ) : coupons.length === 0 ? (
                                <div className="p-8 text-center text-slate-500">No coupons found. Create one to get started!</div>
                            ) : (
                                <div className="divide-y divide-slate-100">
                                    {coupons.map((coupon) => (
                                        <div key={coupon._id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100">
                                                        {coupon.code}
                                                    </span>
                                                    <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                                                        {coupon.discountPercentage}% OFF
                                                    </span>
                                                    {coupon.usageLimit && (
                                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                                                            coupon.usedCount >= coupon.usageLimit 
                                                                ? 'bg-red-50 text-red-600 border-red-100' 
                                                                : 'bg-indigo-50 text-indigo-600 border-indigo-100'
                                                        }`}>
                                                            Used: {coupon.usedCount}/{coupon.usageLimit}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-slate-500 flex items-center gap-1">
                                                    Expires: {new Date(coupon.expirationDate).toLocaleDateString()}
                                                    {new Date() > new Date(coupon.expirationDate) && (
                                                        <span className="text-red-500 font-bold ml-2">(Expired)</span>
                                                    )}
                                                </p>
                                            </div>
                                            <button 
                                                onClick={() => handleDelete(coupon._id)}
                                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete Coupon"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminCoupons;
