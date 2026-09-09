'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, Key, Save, AlertTriangle, CheckCircle, Upload } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function MatchCommandCenter() {
  const params = useParams();
  const id = params.id as string;

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [roomId, setRoomId] = useState('');
  const [roomPassword, setRoomPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSchedule = async () => {
    try {
      setLoading(true);
      setFeedback(null);
      const res = await fetch(`/api/matches/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'schedule',
          scheduledDate: date,
          startTime: `${date}T${time}:00Z`,
          timezone: 'Asia/Karachi',
          notes: ''
        }),
      });
      if (res.ok) {
        setFeedback({ type: 'success', message: 'Match schedule saved successfully.' });
      } else {
        const data = await res.json().catch(() => ({}));
        setFeedback({ type: 'error', message: data.error || 'Failed to save schedule' });
      }
    } catch (e) {
      console.error(e);
      setFeedback({ type: 'error', message: 'Network error saving schedule' });
    } finally {
      setLoading(false);
    }
  };

  const handleRoom = async () => {
    try {
      setLoading(true);
      setFeedback(null);
      const res = await fetch(`/api/matches/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'room',
          roomId,
          roomPassword
        }),
      });
      if (res.ok) {
        setFeedback({ type: 'success', message: 'Room credentials published to players.' });
      } else {
        const data = await res.json().catch(() => ({}));
        setFeedback({ type: 'error', message: data.error || 'Failed to save room credentials' });
      }
    } catch (e) {
      console.error(e);
      setFeedback({ type: 'error', message: 'Network error saving room credentials' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white mb-2">Match Command Center</h1>
          <p className="text-gray-400">Managing Match #{id}</p>
        </div>
      </div>

      {feedback && (
        <div className={`p-4 rounded-xl text-xs font-bold border flex items-center justify-between ${
          feedback.type === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
            : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
        }`}>
          <span>{feedback.message}</span>
          <button onClick={() => setFeedback(null)} className="text-xs hover:underline ml-2">Dismiss</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scheduling & Details */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-500" />
            Scheduling & Details
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Date</label>
                <input 
                  type="date" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500" 
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Time</label>
                <input 
                  type="time" 
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500" 
                />
              </div>
            </div>
            <button 
              onClick={handleSchedule}
              disabled={loading}
              className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" /> Save Schedule
            </button>
          </div>
        </div>

        {/* Room Info */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Key className="w-5 h-5 text-emerald-500" />
            Room Distribution
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Room ID</label>
              <input 
                type="text" 
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white font-mono focus:outline-none focus:border-emerald-500" 
                placeholder="00000000" 
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Room Password</label>
              <input 
                type="text" 
                value={roomPassword}
                onChange={(e) => setRoomPassword(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white font-mono focus:outline-none focus:border-emerald-500" 
                placeholder="********" 
              />
            </div>
            <button 
              onClick={handleRoom}
              disabled={loading}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              Distribute Room Credentials
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
