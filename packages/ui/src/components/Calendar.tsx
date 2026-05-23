import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useState } from 'react';

type Meeting = {
  id: number;
  title: string;
  date: Date;
  time: string;
  status: 'confirmed' | 'pending' | 'declined';
};

type Slot = {
  id: number;
  time: string;
  available: boolean;
};

export default function Calendar() {
  const [date, setDate] = useState<Date>(new Date());
  const [meetings, setMeetings] = useState<Meeting[]>([
    { id: 1, title: 'Team Standup', date: new Date(), time: '10:00 AM', status: 'confirmed' },
    { id: 2, title: 'Design Review', date: new Date(), time: '2:00 PM', status: 'pending' },
  ]);
  const [slots, setSlots] = useState<Slot[]>([
    { id: 1, time: '9:00 AM', available: true },
    { id: 2, time: '10:00 AM', available: false },
    { id: 3, time: '11:00 AM', available: true },
    { id: 4, time: '2:00 PM', available: false },
    { id: 5, time: '3:00 PM', available: true },
    { id: 6, time: '4:00 PM', available: true },
  ]);
  const [newMeeting, setNewMeeting] = useState('');
  const [newTime, setNewTime] = useState('');
  const [activeTab, setActiveTab] = useState<'calendar' | 'slots' | 'requests'>('calendar');

  const toggleSlot = (id: number) => {
    setSlots(slots.map(s => s.id === id ? { ...s, available: !s.available } : s));
  };

  const addMeeting = () => {
    if (!newMeeting || !newTime) return;
    setMeetings([...meetings, {
      id: Date.now(),
      title: newMeeting,
      date: date,
      time: newTime,
      status: 'pending',
    }]);
    setNewMeeting('');
    setNewTime('');
  };

  const updateStatus = (id: number, status: 'confirmed' | 'declined') => {
    setMeetings(meetings.map(m => m.id === id ? { ...m, status } : m));
  };

  const confirmedMeetings = meetings.filter(m => m.status === 'confirmed');
  const pendingMeetings = meetings.filter(m => m.status === 'pending');

  return (
    <div className="p-2">
      <h2 className="text-lg font-semibold mb-3">Meeting Calendar</h2>

      {/* Tabs */}
      <div className="flex gap-1 mb-4">
        {(['calendar', 'slots', 'requests'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1 rounded text-xs font-medium capitalize transition-colors ${
              activeTab === tab
                ? 'bg-primary text-white'
                : 'bg-secondary text-muted-foreground hover:bg-accent'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Calendar Tab */}
      {activeTab === 'calendar' && (
        <div>
          <ReactCalendar onChange={(val) => setDate(val as Date)} value={date}  className="rounded-lg w-full mb-3 !text-gray-900"/>
          
          {/* Confirmed Meetings */}
          <h3 className="font-medium text-sm mb-2">✅ Confirmed Meetings</h3>
          {confirmedMeetings.length === 0 ? (
            <p className="text-xs text-muted-foreground mb-3">No confirmed meetings</p>
          ) : (
            confirmedMeetings.map(m => (
              <div key={m.id} className="p-2 bg-green-900/30 border border-green-700 rounded mb-2">
                <p className="text-sm font-medium">{m.title}</p>
                <p className="text-xs text-muted-foreground">{m.time}</p>
              </div>
            ))
          )}

          {/* Add Meeting */}
          <h3 className="font-medium text-sm mb-2 mt-3">+ Add Meeting</h3>
          <input
            type="text"
            placeholder="Meeting title"
            value={newMeeting}
            onChange={e => setNewMeeting(e.target.value)}
            className="w-full bg-secondary border border-border rounded px-2 py-1 text-sm mb-2 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Time (e.g. 3:00 PM)"
            value={newTime}
            onChange={e => setNewTime(e.target.value)}
            className="w-full bg-secondary border border-border rounded px-2 py-1 text-sm mb-2 focus:outline-none"
          />
          <button
            onClick={addMeeting}
            className="w-full py-1.5 bg-primary text-white rounded text-sm hover:opacity-90"
          >
            Add Meeting
          </button>
        </div>
      )}

      {/* Slots Tab */}
      {activeTab === 'slots' && (
        <div>
          <h3 className="font-medium text-sm mb-2">Availability Slots</h3>
          <p className="text-xs text-muted-foreground mb-3">Click to toggle availability</p>
          {slots.map(slot => (
            <div
              key={slot.id}
              onClick={() => toggleSlot(slot.id)}
              className={`p-2 rounded mb-2 cursor-pointer flex justify-between items-center text-sm transition-colors ${
                slot.available
                  ? 'bg-green-900/30 border border-green-700'
                  : 'bg-red-900/30 border border-red-700'
              }`}
            >
              <span>{slot.time}</span>
              <span className="text-xs">{slot.available ? '✅ Available' : '❌ Busy'}</span>
            </div>
          ))}
        </div>
      )}

      {/* Requests Tab */}
      {activeTab === 'requests' && (
        <div>
          <h3 className="font-medium text-sm mb-2">Meeting Requests</h3>
          {pendingMeetings.length === 0 ? (
            <p className="text-xs text-muted-foreground">No pending requests</p>
          ) : (
            pendingMeetings.map(m => (
              <div key={m.id} className="p-2 border border-border rounded mb-2">
                <p className="text-sm font-medium">{m.title}</p>
                <p className="text-xs text-muted-foreground mb-2">{m.time}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateStatus(m.id, 'confirmed')}
                    className="flex-1 py-1 bg-green-700 text-white rounded text-xs hover:bg-green-600"
                  >
                    ✅ Accept
                  </button>
                  <button
                    onClick={() => updateStatus(m.id, 'declined')}
                    className="flex-1 py-1 bg-red-700 text-white rounded text-xs hover:bg-red-600"
                  >
                    ❌ Decline
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}