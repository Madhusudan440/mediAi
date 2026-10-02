import React, { useState, useEffect } from 'react';
import { ShieldCheck, HardDrive, Trash2, AlertTriangle, CheckCircle2, Lock } from 'lucide-react';
import { getStorageStats, clearAllData, getDocuments } from '../services/storageService';

export function PrivacyCenter({ onNavigate }) {
  const [stats, setStats] = useState(getStorageStats());
  const [documents, setDocuments] = useState(getDocuments());
  const [showConfirmClearAll, setShowConfirmClearAll] = useState(false);
  const [clearedNotice, setClearedNotice] = useState(false);

  const refreshStats = () => {
    setStats(getStorageStats());
    setDocuments(getDocuments());
  };

  const handleClearAll = () => {
    clearAllData();
    refreshStats();
    setShowConfirmClearAll(false);
    setClearedNotice(true);
    setTimeout(() => setClearedNotice(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center justify-center gap-2">
          <ShieldCheck className="w-7 h-7 text-indigo-600" />
          <span>Privacy & Data Management Center</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Strictly local browser storage architecture with zero server-side databases.
        </p>
      </div>

      {/* Local Storage Privacy Badge Box */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-6 rounded-3xl shadow-lg space-y-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-white/10 rounded-2xl">
            <Lock className="w-6 h-6 text-teal-300" />
          </div>
          <div>
            <h3 className="font-bold text-base sm:text-lg text-white">Your Saved Data is 100% Local</h3>
            <p className="text-xs text-blue-200">
              Your saved MediExplain information is stored locally in this browser. Clearing browser storage may remove your saved data.
            </p>
          </div>
        </div>
      </div>

      {/* Storage Usage Stats */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
        <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-blue-600" />
          <span>Local Storage Metrics</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
            <span className="text-[11px] text-slate-500 font-medium">Storage Size</span>
            <p className="text-lg font-black text-slate-900 dark:text-slate-100">{stats.kb} KB</p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
            <span className="text-[11px] text-slate-500 font-medium">Documents</span>
            <p className="text-lg font-black text-slate-900 dark:text-slate-100">{stats.docCount}</p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
            <span className="text-[11px] text-slate-500 font-medium">Bookmarks</span>
            <p className="text-lg font-black text-slate-900 dark:text-slate-100">{stats.bookmarkCount}</p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
            <span className="text-[11px] text-slate-500 font-medium">Reminders</span>
            <p className="text-lg font-black text-slate-900 dark:text-slate-100">{stats.reminderCount}</p>
          </div>
        </div>
      </div>

      {/* Danger Zone Actions */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-rose-200 dark:border-rose-900/50 shadow-md space-y-4">
        <h3 className="font-bold text-sm text-rose-600 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          <span>Data Purge Actions</span>
        </h3>

        {clearedNotice && (
          <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-xl text-xs text-emerald-700 dark:text-emerald-300 font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>All local MediExplain data has been purged.</span>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowConfirmClearAll(true)}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete All Saved Data</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmClearAll && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">Permanently Delete All Local Data?</h3>
              <p className="text-xs text-slate-500">
                This will delete all saved medical reports, chat history, bookmarks, and reminders from this browser. This action cannot be undone.
              </p>
            </div>
            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => setShowConfirmClearAll(false)}
                className="flex-1 py-2 text-xs font-semibold rounded-xl border border-slate-300 text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleClearAll}
                className="flex-1 py-2 text-xs font-bold rounded-xl bg-rose-600 text-white shadow"
              >
                Delete Everything
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
