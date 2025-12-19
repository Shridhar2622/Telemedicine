import React from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import DoctorsTable from '../../components/admin/DoctorsTable';

const AdminDoctors = () => {
    return (
        <AdminLayout>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">Doctor Applications</h1>
                <p className="text-slate-500">Manage doctor approvals and listings.</p>
            </div>
            <DoctorsTable />
        </AdminLayout>
    );
};

export default AdminDoctors;
