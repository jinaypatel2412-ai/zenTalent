import React, { useState } from 'react';
import { X, Calendar, Clock, Video } from 'lucide-react';

interface InterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateName: string;
}

const InterviewModal: React.FC<InterviewModalProps> = ({ isOpen, onClose, candidateName }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSchedule = async () => {
    if (!date || !time) {
      alert("Please select both date and time");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/schedule-interview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: candidateName, date, time })
      });
      
      const data = await response.json();
      if (data.success) {
        alert(`Meeting Created! Link: ${data.meetLink}`);
        onClose();
      } else {
        alert("Failed to schedule interview");
      }
    } catch (error) {
      console.error("Error scheduling interview:", error);
      alert("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl w-full max-w-md border border-zinc-200 dark:border-zinc-800 shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold outfit text-zinc-900 dark:text-white">Schedule Interview</h2>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
            <X size={20} className="text-zinc-500" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-2xl flex items-center gap-4 border border-zinc-100 dark:border-zinc-800">
            <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 font-bold text-lg">
              {candidateName.charAt(0)}
            </div>
            <div>
              <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Candidate</p>
              <p className="text-zinc-900 dark:text-white font-semibold">{candidateName}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                <Calendar size={14} /> Select Date
              </label>
              <input 
                type="date" 
                className="w-full p-3.5 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" 
                onChange={(e) => setDate(e.target.value)} 
              />
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                <Clock size={14} /> Select Time
              </label>
              <input 
                type="time" 
                className="w-full p-3.5 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" 
                onChange={(e) => setTime(e.target.value)} 
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              onClick={onClose} 
              className="flex-1 py-3.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-semibold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSchedule} 
              disabled={loading}
              className="flex-1 py-3.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? "Scheduling..." : (
                <>
                  <Video size={18} /> Confirm & Invite
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewModal;
