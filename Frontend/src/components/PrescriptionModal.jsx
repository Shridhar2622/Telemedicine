import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const PrescriptionModal = ({ isOpen, onClose, patientId, patientName }) => {
    const [loading, setLoading] = useState(false);
    const [appointments, setAppointments] = useState([]);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState('');
    
    // Form States
    const [medicines, setMedicines] = useState([{ name: '', dosage: '', frequency: '', duration: '' }]);
    const [notes, setNotes] = useState('');
    const [followUpDate, setFollowUpDate] = useState('');

    useEffect(() => {
        if (isOpen && patientId) {
            fetchAppointments();
        }
    }, [isOpen, patientId]);

    const fetchAppointments = async () => {
        try {
            const res = await api.get('/appointments/doctor');
            const appts = res.data.appointments || [];
            // Filter appointments for this patient
            const patientAppts = appts.filter(a => a.patient?._id === patientId || a.patient === patientId);
            
            // Sort by date descending
            patientAppts.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            setAppointments(patientAppts);
            if (patientAppts.length > 0) {
                // Default to the most recent appointment (accepted or completed preferred)
                const activeAppt = patientAppts.find(a => ['accepted', 'completed'].includes(a.status)) || patientAppts[0];
                setSelectedAppointmentId(activeAppt._id);
            }
        } catch (error) {
            console.error("Failed to fetch appointments", error);
        }
    };

    const handleMedicineChange = (index, field, value) => {
        const updatedMedicines = [...medicines];
        updatedMedicines[index][field] = value;
        setMedicines(updatedMedicines);
    };

    const addMedicineRow = () => {
        setMedicines([...medicines, { name: '', dosage: '', frequency: '', duration: '' }]);
    };

    const removeMedicineRow = (index) => {
        const updatedMedicines = medicines.filter((_, i) => i !== index);
        setMedicines(updatedMedicines);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedAppointmentId) {
            alert("No appointment found for this patient. Cannot create prescription.");
            return;
        }

        setLoading(true);
        try {
            await api.post('/prescription/create', {
                appointmentId: selectedAppointmentId,
                notes,
                medicines,
                followUpDate
            });
            alert("Prescription created successfully!");
            onClose();
            // Reset form
            setMedicines([{ name: '', dosage: '', frequency: '', duration: '' }]);
            setNotes('');
            setFollowUpDate('');
        } catch (error) {
            console.error("Failed to create prescription", error);
            alert(error.response?.data?.message || "Failed to create prescription");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-bold text-slate-900">Write Prescription</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Patient Context */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <p className="text-sm text-slate-500 mb-1">Patient</p>
                        <p className="font-bold text-slate-800 text-lg">{patientName}</p>
                        
                        <div className="mt-3">
                             <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Link to Appointment</label>
                             <select 
                                value={selectedAppointmentId}
                                onChange={(e) => setSelectedAppointmentId(e.target.value)}
                                className="w-full mt-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                                required
                             >
                                <option value="" disabled>Select Appointment</option>
                                {appointments.map(appt => (
                                    <option key={appt._id} value={appt._id}>
                                        {new Date(appt.date).toLocaleDateString()} - {appt.timeSlot?.start} ({appt.status})
                                    </option>
                                ))}
                             </select>
                        </div>
                    </div>

                    {/* Medicines */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                             <label className="text-sm font-bold text-slate-700">Medicines</label>
                             <button type="button" onClick={addMedicineRow} className="text-xs text-primary font-bold hover:underline">+ Add Medicine</button>
                        </div>
                        <div className="space-y-3">
                            {medicines.map((med, index) => (
                                <div key={index} className="grid grid-cols-12 gap-2 items-start">
                                    <div className="col-span-4">
                                        <input 
                                            placeholder="Medicine Name" 
                                            value={med.name}
                                            onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                                            required
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <input 
                                            placeholder="Dosage (e.g. 500mg)" 
                                            value={med.dosage}
                                            onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                                            required
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <input 
                                            placeholder="Freq" 
                                            value={med.frequency}
                                            onChange={(e) => handleMedicineChange(index, 'frequency', e.target.value)}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                                            required
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <input 
                                            placeholder="Dur" 
                                            value={med.duration}
                                            onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                                            required
                                        />
                                    </div>
                                    <div className="col-span-1 flex justify-center pt-2">
                                        {medicines.length > 1 && (
                                            <button type="button" onClick={() => removeMedicineRow(index)} className="text-red-500 hover:text-red-700">
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="text-sm font-bold text-slate-700 mb-1 block">Instructions / Notes</label>
                        <textarea 
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/50 outline-none min-h-[100px]"
                            placeholder="Take after food..."
                            required
                        ></textarea>
                    </div>

                    {/* Follow Up */}
                    <div>
                        <label className="text-sm font-bold text-slate-700 mb-1 block">Follow-up Date (Optional)</label>
                        <input 
                            type="date"
                            value={followUpDate}
                            onChange={(e) => setFollowUpDate(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="px-5 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary-hover shadow-lg shadow-primary/30 transition-all disabled:opacity-70"
                        >
                            {loading ? 'Creating...' : 'Create Prescription'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PrescriptionModal;
