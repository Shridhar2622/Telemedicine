import useFetchData from '../../hooks/useFetchData';
import MainLayout from '../../layouts/MainLayout';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PatientDashboard = () => {
    const navigate = useNavigate();
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const userName = storedUser.fullName || storedUser.userName || 'Patient';

    const { data: appointments, loading: apptLoading } = useFetchData('/appointments/my');
    const { data: prescriptions, loading: prescLoading } = useFetchData('/user/prescription');

    const apptList = appointments?.appointments || [];
    const upcomingAppointments = apptList.filter(a => a.status === 'scheduled' || a.status === 'pending' || a.status === 'accepted');
    const prescriptionCount = prescriptions?.data?.length || 0;
    const unreadMessages = 0; 

    // Mock Data for Chart
    const data = [
      { name: 'Mon', activity: 40 },
      { name: 'Tue', activity: 30 },
      { name: 'Wed', activity: 20 },
      { name: 'Thu', activity: 27 },
      { name: 'Fri', activity: 18 },
      { name: 'Sat', activity: 23 },
      { name: 'Sun', activity: 34 },
    ];

    if (apptLoading || prescLoading) {
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
                {/* Hero Section */}
                <div className="relative bg-gradient-to-r from-primary to-blue-600 rounded-3xl p-8 text-white shadow-xl overflow-hidden">
                    <div className="relative z-10">
                        <h1 className="text-3xl font-bold mb-2">Welcome back, {userName}! 👋</h1>
                        <p className="text-blue-100 text-lg opacity-90">Your health journey is looking great today. You have {upcomingAppointments.length} upcoming appointments.</p>
                        <button 
                            onClick={() => navigate('/patient/find-doctors')}
                            className="mt-6 px-6 py-2 bg-white text-primary font-semibold rounded-full hover:bg-blue-50 transition-colors shadow-sm"
                        >
                            Book new appointment
                        </button>
                    </div>
                    {/* Abstract Shapes Decoration */}
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-blue-400 opacity-20 rounded-full blur-2xl"></div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard 
                        label="Appointments" 
                        value={upcomingAppointments.length} 
                        subtext="Upcoming" 
                        gradient="from-blue-500 to-blue-600"
                        icon="📅"
                    />
                    <StatCard 
                        label="Prescriptions" 
                        value={prescriptionCount} 
                        subtext="Active" 
                        gradient="from-emerald-500 to-green-600"
                        icon="💊"
                    />
                    <StatCard 
                        label="Messages" 
                        value={unreadMessages} 
                        subtext="Unread" 
                        gradient="from-purple-500 to-indigo-600"
                        icon="💬"
                    />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Column: Chart & Appts */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* Health Activity Chart */}
                        <Card title="Health Activity Trends" className="shadow-sm border border-slate-100">
                             <div className="h-64 w-full mt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={data}>
                                        <defs>
                                            <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                        <Tooltip 
                                            contentStyle={{backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                                        />
                                        <Area type="monotone" dataKey="activity" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorActivity)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                             </div>
                        </Card>

                        {/* Recent Appointments */}
                        <Card title="Upcoming Appointments">
                             <div className="space-y-4 mt-2">
                                {apptList && apptList.length > 0 ? (
                                    apptList.slice(0, 3).map((appt) => (
                                        <div key={appt._id} className="flex items-center p-4 bg-slate-50 rounded-xl hover:bg-blue-50 transition-colors group cursor-pointer border border-transparent hover:border-blue-100">
                                            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg mr-4 group-hover:bg-white group-hover:shadow-sm transition-all">
                                                {appt.doctor?.name?.charAt(0) || 'D'}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-slate-800">Dr. {appt.doctor?.name || 'Unknown'}</h4>
                                                <p className="text-sm text-slate-500 font-medium">{new Date(appt.date).toLocaleDateString()} • {appt.timeSlot?.start}</p>
                                            </div>
                                            <span className={`text-xs font-semibold px-3 py-1 rounded-full 
                                                ${appt.status === 'accepted' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                                {appt.status}
                                            </span>
                                            {appt.meetingRoom && (
                                                <a 
                                                    href={appt.meetingRoom}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={(e) => e.stopPropagation()} 
                                                    className="ml-3 px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-1"
                                                >
                                                    📹 Join
                                                </a>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                        <p className="text-slate-500">No upcoming appointments.</p>
                                        <button onClick={() => navigate('/patient/find-doctors')} className="text-primary text-sm font-medium mt-2 hover:underline">Book one now</button>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>

                    {/* Right Column: Quick Actions */}
                    <div className="space-y-8">
                        <Card title="Quick Actions">
                            <div className="grid grid-cols-2 gap-4 mt-2">
                                <QuickAction 
                                    label="Find Doctor" 
                                    icon="🔍" 
                                    color="bg-indigo-50 text-indigo-600"
                                    onClick={() => navigate('/patient/find-doctors')}
                                />
                                <QuickAction 
                                    label="Prescriptions" 
                                    icon="💊" 
                                    color="bg-emerald-50 text-emerald-600"
                                    onClick={() => navigate('/patient/prescriptions')}
                                />
                                <QuickAction 
                                    label="Messages" 
                                    icon="💬" 
                                    color="bg-pink-50 text-pink-600"
                                    onClick={() => navigate('/patient/messages')}
                                />
                                <QuickAction 
                                    label="Profile" 
                                    icon="⚙️" 
                                    color="bg-slate-50 text-slate-600"
                                    onClick={() => navigate('/patient/profile')}
                                />
                            </div>
                        </Card>

                        {/* Health Tip Card */}
                        <div className="bg-gradient-to-br from-orange-400 to-pink-500 rounded-2xl p-6 text-white shadow-lg">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="font-bold text-lg mb-1">Daily Health Tip</h3>
                                    <p className="text-white/90 text-sm leading-relaxed">
                                        "Drink at least 8 glasses of water today. Staying hydrated boosts energy and brain function!"
                                    </p>
                                </div>
                                <span className="text-4xl opacity-50">💧</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

// Helper Components for Cleaner Code
const StatCard = ({ label, value, subtext, gradient, icon }) => (
    <div className={`p-6 rounded-2xl bg-white shadow-sm border border-slate-100 hover:shadow-md transition-all group overflow-hidden relative`}>
        <div className="relative z-10">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-slate-500 font-medium text-sm">{label}</p>
                    <h3 className="text-3xl font-bold text-slate-800 mt-1">{value}</h3>
                    <p className="text-xs text-slate-400 mt-1">{subtext}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-xl text-white shadow-lg group-hover:scale-110 transition-transform`}>
                    {icon}
                </div>
            </div>
        </div>
        <div className={`absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br ${gradient} opacity-5 rounded-full`}></div>
    </div>
);

const QuickAction = ({ label, icon, color, onClick }) => (
    <button 
        onClick={onClick}
        className={`flex flex-col items-center justify-center p-4 rounded-xl ${color} hover:brightness-95 transition-all active:scale-95`}
    >
        <span className="text-2xl mb-2">{icon}</span>
        <span className="font-semibold text-sm">{label}</span>
    </button>
);

export default PatientDashboard;
