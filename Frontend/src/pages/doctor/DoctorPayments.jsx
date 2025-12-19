import React, { useState, useEffect } from 'react';
import MainLayout from '../../layouts/MainLayout';
import { IndianRupee, TrendingUp, Calendar, User } from 'lucide-react';
import api from '../../utils/api';

const DoctorPayments = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({ totalEarnings: 0, transactions: [] });

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await api.get('/doctor/payments/history', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setData(res.data);
            }
        } catch (error) {
            console.error("Failed to fetch payments", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainLayout>
            <div className="max-w-6xl mx-auto space-y-8 animate-slide-up">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <IndianRupee className="text-green-600" />
                        My Earnings
                    </h1>
                    <p className="text-slate-500">Track your consultation revenue.</p>
                </div>

                {/* Stats Card */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-8 text-white shadow-lg shadow-green-500/20">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100 font-medium mb-1">Total Lifetime Earnings</p>
                            <h2 className="text-4xl font-bold">₹ {data.totalEarnings.toLocaleString()}</h2>
                        </div>
                        <div className="p-4 bg-white/10 rounded-full backdrop-blur-sm">
                            <TrendingUp size={32} />
                        </div>
                    </div>
                </div>

                {/* Transactions List */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 bg-slate-50">
                        <h2 className="font-semibold text-slate-800">Recent Transactions</h2>
                    </div>

                    {loading ? (
                        <div className="p-8 text-center text-slate-500">Loading payment history...</div>
                    ) : data.transactions.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <IndianRupee className="text-slate-400" />
                            </div>
                            <h3 className="text-slate-900 font-medium">No earnings yet</h3>
                            <p className="text-slate-500 mt-1">Completed appointments will appear here.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Patient</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Reference ID</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {data.transactions.map((tx) => (
                                        <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                                                        {tx.patientName.charAt(0)}
                                                    </div>
                                                    <span className="font-medium text-slate-900">{tx.patientName}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600 font-mono text-sm">
                                                {tx.date}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-bold text-green-600">₹{tx.amount}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium border border-green-100">
                                                    {tx.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-400 text-xs font-mono">
                                                {tx.paymentId || 'N/A'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
};

export default DoctorPayments;
