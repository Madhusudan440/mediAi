import React, { useState, useEffect } from 'react';
import { Bookmark, Bell, Plus, Trash2, Calendar, Clock, CheckCircle2 } from 'lucide-react';
import { getBookmarks, deleteBookmark, getReminders, saveReminder, deleteReminder } from '../services/storageService';

export function RemindersAndBookmarks() {
  const [activeTab, setActiveTab] = useState('bookmarks'); // 'bookmarks', 'reminders'
  const [bookmarks, setBookmarks] = useState([]);
  const [reminders, setReminders] = useState([]);

  // New Reminder Form State
  const [showAddReminderModal, setShowAddReminderModal] = useState(false);
  const [remTitle, setRemTitle] = useState('');
  const [remDate, setRemDate] = useState('');
  const [remTime, setRemTime] = useState('09:00');
  const [remType, setRemType] = useState('Follow-up');
  const [remNotes, setRemNotes] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setBookmarks(getBookmarks());
    setReminders(getReminders());
  };

  const handleDeleteBookmark = (id) => {
    deleteBookmark(id);
    loadData();
  };

  const handleDeleteReminder = (id) => {
    deleteReminder(id);
    loadData();
  };

  const handleAddReminderSubmit = (e) => {
    e.preventDefault();
    if (!remTitle || !remDate) return;
    saveReminder({
      title: remTitle,
      date: remDate,
      time: remTime,
      type: remType,
      notes: remNotes
    });
    setRemTitle('');
    setRemNotes('');
    setShowAddReminderModal(false);
    loadData();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center justify-center gap-2">
          <Bell className="w-7 h-7 text-amber-500" />
          <span>Reminders & Saved Bookmarks</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Manage follow-up appointments and bookmarked AI answers locally.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
        
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
            <button
              onClick={() => setActiveTab('bookmarks')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'bookmarks' ? 'bg-white dark:bg-slate-900 text-purple-600 shadow-sm' : 'text-slate-500'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>Bookmarks ({bookmarks.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('reminders')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'reminders' ? 'bg-white dark:bg-slate-900 text-amber-600 shadow-sm' : 'text-slate-500'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>Reminders ({reminders.length})</span>
            </button>
          </div>

          {activeTab === 'reminders' && (
            <button
              onClick={() => setShowAddReminderModal(true)}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Reminder</span>
            </button>
          )}
        </div>

        {/* BOOKMARKS LIST */}
        {activeTab === 'bookmarks' && (
          <div className="space-y-3">
            {bookmarks.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8">No bookmarked items saved yet.</p>
            ) : (
              bookmarks.map((bm) => (
                <div key={bm.id} className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 relative group">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-purple-100 text-purple-700">
                      {bm.type}
                    </span>
                    <button
                      onClick={() => handleDeleteBookmark(bm.id)}
                      className="p-1 text-slate-400 hover:text-rose-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">{bm.title}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{bm.content}</p>
                </div>
              ))
            )}
          </div>
        )}

        {/* REMINDERS LIST */}
        {activeTab === 'reminders' && (
          <div className="space-y-3">
            {reminders.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8">No reminders set. Click "Add Reminder" to schedule follow-up dates.</p>
            ) : (
              reminders.map((rem) => (
                <div key={rem.id} className="bg-amber-50/60 dark:bg-slate-950 p-4 rounded-2xl border border-amber-200 dark:border-slate-800 space-y-2 flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                      {rem.type}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">{rem.title}</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-3 font-mono">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {rem.date}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {rem.time}</span>
                    </p>
                    {rem.notes && <p className="text-xs text-slate-500">{rem.notes}</p>}
                  </div>
                  <button
                    onClick={() => handleDeleteReminder(rem.id)}
                    className="p-1 text-slate-400 hover:text-rose-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        )}

      </div>

      {/* Add Reminder Modal */}
      {showAddReminderModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 mb-4">Set Medical Reminder</h3>
            <form onSubmit={handleAddReminderSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Reminder Title</label>
                <input
                  type="text"
                  required
                  value={remTitle}
                  onChange={(e) => setRemTitle(e.target.value)}
                  placeholder="e.g. Doctor Follow-up Appointment"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={remDate}
                    onChange={(e) => setRemDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Time</label>
                  <input
                    type="time"
                    value={remTime}
                    onChange={(e) => setRemTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Type</label>
                <select
                  value={remType}
                  onChange={(e) => setRemType(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                >
                  <option value="Follow-up">Follow-up Appointment</option>
                  <option value="Repeat Test">Repeat Lab Test</option>
                  <option value="Medication">Medication Refill</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Notes (Optional)</label>
                <textarea
                  rows={2}
                  value={remNotes}
                  onChange={(e) => setRemNotes(e.target.value)}
                  placeholder="Bring previous CBC blood report..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddReminderModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 text-white font-bold shadow"
                >
                  Save Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
