import useFetchData from '../../hooks/useFetchData';
import React, { useEffect } from 'react';
import MainLayout from '../../layouts/MainLayout';
import Card from '../../components/ui/Card';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DoctorDashboard = () => {
    const navigate = useNavigate();
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const doctorName = storedUser.userName || 'Doctor';

    const { data: profile, loading: profileLoading } = useFetchData('/doctor/profile');
    const { data: appointments, loading: apptLoading } = useFetchData('/appointments/doctor');

    useEffect(() => {
        if (!profileLoading && !profile?.data) {
            navigate('/doctor/profile');
        }
    }, [profile, profileLoading, navigate]);

    const specialization = profile?.data?.specialization || 'General Practitioner';
    const apptList = appointments?.appointments || [];
    
    // Stats calculation
    const today = new Date().toISOString().split('T')[0];
    const todaysAppointments = apptList.filter(a => a.date && a.date.startsWith(today));
    const upcomingAppointments = apptList.filter(a => a.status === 'scheduled' || a.status === 'pending');
    const patientSet = new Set(apptList.map(a => a.patient?._id));

    // Mock Data for "Patients visited this week"
    const chartData = [
      { name: 'Mon', patients: 4 },
      { name: 'Tue', patients: 7 },
      { name: 'Wed', patients: 5 },
      { name: 'Thu', patients: 9 },
      { name: 'Fri', patients: 6 },
      { name: 'Sat', patients: 3 },
      { name: 'Sun', patients: 2 },
    ];

    if (profileLoading || apptLoading) {
        return (
            <MainLayout>
                 <div className="animate-pulse space-y-8">
                    <div className="h-40 bg-gradient-to-r from-blue-100 to-indigo-50 rounded-2xl"></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1,2,3].map(i => <div key={i} className="h-32 bg-slate-100 rounded-xl"></div>)}
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="space-y-8 animate-fade-in">
                
                {/* Hero Banner */}
                <div className="relative bg-gradient-to-r from-slate-800 to-slate-900 rounded-3xl p-8 text-white shadow-xl overflow-hidden">
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center bg-white/5 p-6 rounded-2xl backdrop-blur-sm border border-white/10">
                        <div>
                            <h1 className="text-3xl font-bold mb-1">Dr. {doctorName}</h1>
                            <p className="text-slate-300 font-medium tracking-wide">{specialization}</p>
                            <div className="flex gap-4 mt-6">
                                <span className="flex items-center gap-2 text-sm bg-green-500/20 px-3 py-1 rounded-full text-green-300 border border-green-500/30">
                                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                    Available for Consult
                                </span>
                            </div>
                        </div>
                        <div className="mt-6 md:mt-0 text-right">
                             <p className="text-4xl font-bold">{todaysAppointments.length}</p>
                             <p className="text-slate-400 text-sm uppercase tracking-wider">Appointments Today</p>
                        </div>
                    </div>
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard 
                        label="Total Patients" 
                        value={patientSet.size} 
                        color="bg-purple-100 text-purple-600"
                        icon="👥"
                        trend="+12% this month"
                    />
                    <StatCard 
                        label="Pending Requests" 
                        value={upcomingAppointments.filter(a => a.status === 'pending').length} 
                        color="bg-orange-100 text-orange-600"
                        icon="⏳"
                        trend="Action needed"
                    />
                    <StatCard 
                        label="Total Earnings" 
                        value="$4,250" 
                        color="bg-green-100 text-green-600"
                        icon="💰"
                        trend="Estimated"
                    />
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Chart Section */}
                    <div className="lg:col-span-2 space-y-8">
                        <Card title="Patient Visits Overview" className="shadow-sm">
                             <div className="h-72 w-full mt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                        <Tooltip 
                                            cursor={{fill: '#f8fafc'}}
                                            contentStyle={{backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                                        />
                                        <Bar dataKey="patients" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={40} />
                                    </BarChart>
                                </ResponsiveContainer>
                             </div>
                        </Card>

                        <Card title="Today's Schedule">
                            <div className="space-y-3 mt-2">
                                {todaysAppointments && todaysAppointments.length > 0 ? (
                                    todaysAppointments.map((appt) => (
                                        <div key={appt._id} className="flex items-center p-3 border border-slate-100 rounded-lg hover:border-blue-200 hover:shadow-sm transition-all bg-white">
                                            <div className="w-14 text-center mr-4 border-r border-slate-100 pr-4">
                                                <span className="block text-sm font-bold text-slate-700">{appt.timeSlot?.start}</span>
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-slate-800">{appt.patient?.userName || 'Patient'}</h4>
                                                <span className="text-xs text-slate-500 uppercase tracking-wide">General Checkup</span>
                                            </div>
                                            <button className="px-3 py-1 text-sm text-blue-600 bg-blue-50 rounded hover:bg-blue-100 font-medium transition-colors">
                                                View
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-10 bg-slate-50/50 rounded-xl border-2 border-dashed border-slate-100">
                                        <div className="text-4xl mb-2">☕</div>
                                        <p className="text-slate-500 font-medium">No appointments today. Enjoy your break!</p>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        <Card title="Quick Actions">
                             <div className="grid grid-cols-1 gap-3">
                                <ActionRow label="View Schedule" icon="📅" onClick={() => navigate('/doctor/schedule')} />
                                <ActionRow label="Patient Directory" icon="📂" onClick={() => navigate('/doctor/patients')} />
                                <ActionRow label="Messages" icon="💬" onClick={() => navigate('/doctor/messages')} />
                                <ActionRow label="Settings" icon="⚙️" onClick={() => navigate('/doctor/profile')} />
                             </div>
                        </Card>

                        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white text-center shadow-lg">
                            <h3 className="font-bold text-xl mb-2">Pro Tip</h3>
                            <p className="text-indigo-100 text-sm">
                                Complete your profile to appear higher in search results for patients.
                            </p>
                            <button onClick={() => navigate('/doctor/profile')} className="mt-4 px-4 py-2 bg-white text-indigo-600 text-sm font-bold rounded-lg hover:bg-indigo-50 transition-colors">
                                Edit Profile
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

// Sub-components
const StatCard = ({ label, value, color, icon, trend }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow h-32">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-slate-500 text-sm font-medium">{label}</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">{value}</h3>
            </div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${color}`}>
                {icon}
            </div>
        </div>
        <p className="text-xs text-slate-400 mt-2">{trend}</p>
    </div>
);

const ActionRow = ({ label, icon, onClick }) => (
    <button onClick={onClick} className="flex items-center w-full p-3 rounded-xl hover:bg-slate-50 transition-colors group">
        <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center mr-3 group-hover:bg-white group-hover:shadow-sm transition-all">{icon}</span>
        <span className="font-medium text-slate-700 flex-1 text-left">{label}</span>
        <span className="text-slate-300 group-hover:text-primary">→</span>
    </button>
);

export default DoctorDashboard;
