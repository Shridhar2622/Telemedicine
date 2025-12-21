import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from "../../config";
import { Search, Shield, ShieldOff } from 'lucide-react';

const UsersTable = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_BASE_URL}/admin/users`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                setUsers(response.data.users);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleBlock = async (userId, currentStatus) => {
        if (!window.confirm(`Are you sure you want to ${currentStatus ? 'block' : 'unblock'} this user?`)) return;

        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_BASE_URL}/admin/user/toggle-block`, 
                { userId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchUsers(); // Refresh list
        } catch (error) {
            console.error("Error toggling block:", error);
            alert("Failed to update user status");
        }
    };

    const filteredUsers = users.filter(user => 
        user.userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="text-center py-10">Loading users...</div>;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-slate-800">All Users</h3>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input 
                        type="text" 
                        placeholder="Search users..." 
                        className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-semibold">
                        <tr>
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Joined</th>
                            <th className="px-6 py-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                        {filteredUsers.map((user) => (
                            <tr key={user._id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                                            {user.userName.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900">{user.userName}</p>
                                            <p className="text-slate-500 text-xs">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        user.role === 'Admin' ? 'bg-purple-100 text-purple-700' :
                                        user.role === 'Doctor' ? 'bg-indigo-100 text-indigo-700' :
                                        'bg-slate-100 text-slate-600'
                                    }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                        {user.isActive ? 'Active' : 'Blocked'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-500">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    <button 
                                        onClick={() => handleToggleBlock(user._id, user.isActive)}
                                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                            user.isActive 
                                                ? 'text-red-600 hover:bg-red-50 border border-red-200' 
                                                : 'text-green-600 hover:bg-green-50 border border-green-200'
                                        }`}
                                    >
                                        {user.isActive ? <ShieldOff size={14} /> : <Shield size={14} />}
                                        {user.isActive ? 'Block' : 'Unblock'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {filteredUsers.length === 0 && (
                <div className="p-8 text-center text-slate-500">
                    No users found matching your search.
                </div>
            )}
        </div>
    );
};

export default UsersTable;
