import React from 'react';
import useFetchData from '../../hooks/useFetchData';
import AdminLayout from '../../layouts/AdminLayout';
import { Mail, Clock, CheckCircle } from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';

const AdminMessages = () => {
    const { data: messagesData, loading, refetch } = useFetchData('/contact');
    
    // Check if data is wrapped or direct array
    const messages = messagesData?.data || messagesData || [];

    const handleMarkAsRead = async (id) => {
        try {
            await api.patch(`/contact/${id}/read`);
            toast.success("Marked as read");
            refetch();
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this message?")) return;
        try {
            await api.delete(`/contact/${id}`);
            toast.success("Message deleted");
            refetch();
        } catch (error) {
            toast.error("Failed to delete message");
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Support Messages</h1>
                        <p className="text-slate-500">Manage inquiries from contact form.</p>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200 flex items-center gap-2">
                        <Mail className="text-blue-500" size={20} />
                        <span className="font-semibold text-slate-700">{messages.length} Messages</span>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    {messages.length === 0 ? (
                        <div className="p-12 text-center text-slate-500">
                            <Mail className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                            <p>No messages found.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold text-slate-700">Sender</th>
                                        <th className="px-6 py-4 font-semibold text-slate-700">Message</th>
                                        <th className="px-6 py-4 font-semibold text-slate-700">Date</th>
                                        <th className="px-6 py-4 font-semibold text-slate-700">Status</th>
                                        <th className="px-6 py-4 font-semibold text-slate-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {messages.map((msg) => (
                                        <tr key={msg._id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <p className="font-medium text-slate-800">{msg.firstName} {msg.lastName}</p>
                                                <p className="text-sm text-slate-500">{msg.email}</p>
                                            </td>
                                            <td className="px-6 py-4 max-w-md">
                                                <p className="text-slate-600 truncate">{msg.message}</p>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                                {new Date(msg.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium 
                                                    ${msg.status === 'Unread' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                                                    {msg.status === 'Unread' ? <Clock size={12} /> : <CheckCircle size={12} />}
                                                    {msg.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {msg.status === 'Unread' && (
                                                        <button 
                                                            onClick={() => handleMarkAsRead(msg._id)}
                                                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                                        >
                                                            Mark Read
                                                        </button>
                                                    )}
                                                    <button 
                                                        onClick={() => handleDelete(msg._id)}
                                                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminMessages;
