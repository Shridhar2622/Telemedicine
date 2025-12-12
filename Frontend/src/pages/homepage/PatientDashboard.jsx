import useFetchData from '../../hooks/useFetchData';
import MainLayout from '../../layouts/MainLayout';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';

const PatientDashboard = () => {
    const navigate = useNavigate();
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const userName = storedUser.fullName || storedUser.userName || 'Patient';

    const { data: appointments, loading: apptLoading } = useFetchData('/appointments/my');
    const { data: prescriptions, loading: prescLoading } = useFetchData('/user/prescription');

    const apptList = appointments?.appointments || [];
    const upcomingAppointments = apptList.filter(a => a.status === 'scheduled' || a.status === 'pending');
    
    const prescriptionCount = prescriptions?.data?.length || 0;
    
    const unreadMessages = 0; 

    const stats = [
        { label: 'Upcoming Appointments', value: upcomingAppointments.length, color: 'bg-blue-50 text-blue-600' },
        { label: 'My Prescriptions', value: prescriptionCount, color: 'bg-green-50 text-green-600' },
        { label: 'Unread Messages', value: unreadMessages, color: 'bg-purple-50 text-purple-600' },
    ];

    if (apptLoading || prescLoading) {
        return (
            <MainLayout>
                <div className="animate-pulse">
                    <div className="h-8 bg-slate-200 rounded w-1/3 mb-4"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/4 mb-8"></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="h-32 bg-slate-200 rounded-xl"></div>
                        <div className="h-32 bg-slate-200 rounded-xl"></div>
                        <div className="h-32 bg-slate-200 rounded-xl"></div>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="mb-8 animate-slide-up">
                <h1 className="text-3xl font-bold text-slate-900">
                    Welcome back, <span className="text-primary">{userName}</span>
                </h1>
                <p className="text-slate-500 mt-2">Here's what's happening with your health today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                {stats.map((stat) => (
                    <Card key={stat.label} className="card-hover border-l-4 border-l-primary/50">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                                <p className="text-3xl font-bold text-slate-800 mt-2">{stat.value}</p>
                            </div>
                            <div className={`p-3 rounded-full ${stat.color}`}>
                                <div className="w-6 h-6 bg-current opacity-50 rounded-full"></div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <div className="lg:col-span-2 space-y-6">
                    <Card title="Upcoming Appointments">
                        <div className="space-y-4">
                            {apptList && apptList.length > 0 ? (
                                apptList.slice(0, 5).map((appt) => (
                                    <div key={appt._id} className="flex items-center py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50 p-2 rounded-lg transition-colors">
                                        <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0 mr-4 flex items-center justify-center text-slate-500 font-bold">
                                            {appt.doctor?.name?.charAt(0) || 'D'}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium text-slate-800">Dr. {appt.doctor?.name || 'Unknown'}</h4>
                                            <p className="text-sm text-slate-500 capitalize">{appt.status} - {new Date(appt.date).toLocaleDateString()}</p>
                                        </div>
                                        <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">
                                            {appt.timeSlot?.start} - {appt.timeSlot?.end}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-slate-500 text-center py-4">No upcoming appointments.</p>
                            )}
                        </div>
                    </Card>
                </div>

                <div className="space-y-6">
                <div className="space-y-6">
                    <Card title="Quick Actions">
                        <div className="space-y-3">
                            <button 
                                onClick={() => navigate('/patient/find-doctors')}
                                className="w-full py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-medium shadow-lg shadow-primary/30"
                            >
                                Book New Appointment
                            </button>
                            <button 
                                onClick={() => navigate('/patient/find-doctors')}
                                className="w-full py-2 px-4 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                            >
                                Find a Doctor
                            </button>
                            <button 
                                onClick={() => navigate('/patient/prescriptions')}
                                className="w-full py-2 px-4 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                            >
                                My Prescriptions
                            </button>
                        </div>
                    </Card>

                    <Card 
                        title="Profile Settings" 
                        icon="⚙️"
                        onClick={() => navigate("/patient/profile")}
                        className="cursor-pointer hover:shadow-lg transition-all"
                    >
                        <p className="text-slate-500">Manage your account settings, password, and preferences.</p>
                    </Card>
                </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default PatientDashboard;
