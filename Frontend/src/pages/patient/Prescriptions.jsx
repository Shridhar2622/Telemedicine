import React from 'react';
import MainLayout from '../../layouts/MainLayout';
import Card from '../../components/ui/Card';
import useFetchData from '../../hooks/useFetchData';

const Prescriptions = () => {
    const { data, loading, error } = useFetchData('/user/prescription');
    const prescriptions = data?.data || [];

    return (
        <MainLayout>
             <div className="mb-8 animate-slide-up">
                <h1 className="text-3xl font-bold text-slate-900">My Prescriptions</h1>
                <p className="text-slate-500 mt-2">View and download your digital prescriptions.</p>
            </div>

            <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[1, 2].map(i => (
                            <div key={i} className="h-48 bg-slate-100 rounded-xl animate-pulse"></div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="p-4 bg-red-50 text-red-600 rounded-lg">
                        Error loading prescriptions: {error}
                    </div>
                ) : prescriptions.length > 0 ? (
                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                       {prescriptions.map((presc) => (
                           <Card key={presc._id} className="relative overflow-hidden border-t-4 border-t-primary">
                               <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                                   <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 2h2v5h5v2h-5v5h-2v-5H7v-2h5V5z"/></svg>
                               </div>

                               <div className="flex justify-between items-start mb-4">
                                   <div>
                                       <p className="text-sm text-slate-500">Prescribed by</p>
                                       <h3 className="text-lg font-bold text-slate-900">Dr. {presc.doctor?.userName || 'Unknown'}</h3>
                                       <p className="text-xs text-slate-400 mt-0.5">{new Date(presc.createdAt).toLocaleDateString()}</p>
                                   </div>
                                   {presc.followUpDate && (
                                       <div className="text-right">
                                           <p className="text-xs text-orange-600 font-medium bg-orange-50 px-2 py-1 rounded-md">
                                               Follow-up: {new Date(presc.followUpDate).toLocaleDateString()}
                                           </p>
                                       </div>
                                   )}
                               </div>

                               <div className="mb-4 bg-slate-50 p-3 rounded-lg">
                                   <h4 className="text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide">Medicines</h4>
                                   <div className="space-y-2">
                                       {presc.medicines?.map((med, idx) => (
                                           <div key={idx} className="flex justify-between items-start text-sm border-b border-slate-200 last:border-0 pb-1 last:pb-0">
                                               <span className="font-medium text-slate-800">{med.name}</span>
                                               <span className="text-slate-500 text-xs">{med.dosage} • {med.frequency} • {med.duration}</span>
                                           </div>
                                       ))}
                                   </div>
                               </div>

                               {presc.notes && (
                                   <div className="mb-4">
                                       <p className="text-sm text-slate-500 italic">"{presc.notes}"</p>
                                   </div>
                               )}
                               
                               <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end">
                                   <button className="text-sm font-medium text-primary hover:text-primary-hover flex items-center gap-1">
                                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                                       Download PDF
                                   </button>
                               </div>
                           </Card>
                       ))}
                   </div>
                ) : (
                    <div className="text-center py-12">
                         <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">💊</div>
                        <p className="text-slate-500">No prescriptions found.</p>
                    </div>
                )}
            </div>
        </MainLayout>
    );
};

export default Prescriptions;
