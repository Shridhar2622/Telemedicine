import React from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import UsersTable from '../../components/admin/UsersTable';

const AdminUsers = () => {
    return (
        <AdminLayout>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">User Management</h1>
                <p className="text-slate-500">View and manage system users.</p>
            </div>
            <UsersTable />
        </AdminLayout>
    );
};

export default AdminUsers;
