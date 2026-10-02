import React, { useState, useEffect } from 'react';
import { 
  UploadCloud, 
  Camera, 
  MessageSquare, 
  FileText, 
  Pill, 
  Activity, 
  Bookmark, 
  Plus, 
  ArrowRight, 
  Globe, 
  Volume2, 
  BarChart3, 
  Clock, 
  Search,
  Sparkles,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { getDocuments, getBookmarks, getActiveProfile } from '../services/storageService';
import { DEMO_DOCUMENTS } from '../utils/demoData';
import { saveDocument } from '../services/storageService';

export function Dashboard({ onNavigate, onSelectDocument }) {
  const [documents, setDocuments] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const activeProfile = getActiveProfile();

  useEffect(() => {
    loadData();
  }, [activeProfile.id]);

  const loadData = () => {
    const docs = getDocuments(activeProfile.id);
    setDocuments(docs);
    setBookmarks(getBookmarks());
  };

  const handleLoadDemo = (demoId) => {
    const demo = DEMO_DOCUMENTS.find(d => d.id === demoId) || DEMO_DOCUMENTS[0];
    const saved = saveDocument({ ...demo, profileId: activeProfile.id });
    if (onSelectDocument) onSelectDocument(saved.id);
    onNavigate('report');
  };

  // Compute stats
  const totalDocs = documents.length;
  const totalMedicines = documents.reduce((sum, d) => sum + (d.medicines?.length || 0), 0);
  const totalTests = documents.reduce((sum, d) => sum + (d.tests?.length || 0), 0);
  const totalBookmarks = bookmarks.length;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning 👋' : hour < 17 ? 'Good Afternoon 👋' : 'Good Evening 👋';

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header Greeting Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-teal-600 to-indigo-700 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold">
            <span>{activeProfile.avatar || '👤'}</span>
            <span>Profile: {activeProfile.name}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {greeting}
          </h1>
          <p className="text-sm sm:text-base text-blue-100 font-medium">
            What would you like to understand today?
          </p>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-3">
            <button
              onClick={() => onNavigate('upload')}
              className="px-5 py-2.5 rounded-2xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 transition-all hover:scale-105"
            >
              <UploadCloud className="w-4 h-4 text-blue-600" />
              <span>📄 Upload Report</span>
            </button>

            <button
              onClick={() => onNavigate('scan')}
              className="px-5 py-2.5 rounded-2xl bg-teal-500 hover:bg-teal-400 text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 transition-all hover:scale-105"
            >
              <Camera className="w-4 h-4" />
              <span>📷 Scan Document</span>
            </button>

            <button
              onClick={() => onNavigate('chat')}
              className="px-5 py-2.5 rounded-2xl bg-blue-900/60 hover:bg-blue-900/80 text-white font-bold text-xs sm:text-sm border border-white/20 flex items-center gap-2 backdrop-blur-md"
            >
              <MessageSquare className="w-4 h-4 text-teal-300" />
              <span>💬 Ask About Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Documents Saved', value: totalDocs, icon: FileText, color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/60' },
          { label: 'Medicines Detected', value: totalMedicines, icon: Pill, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60' },
          { label: 'Lab Tests Tracked', value: totalTests, icon: Activity, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/60' },
          { label: 'Saved Bookmarks', value: totalBookmarks, icon: Bookmark, color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/60' }
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <span className="text-2xl font-black text-slate-900 dark:text-slate-100">{stat.value}</span>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Tools Row */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <span>Quick Healthcare Tools</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { id: 'medicines', title: '🧪 Test Explainer', desc: 'Understand lab ranges', action: () => onNavigate('medicines') },
            { id: 'medicines', title: '💊 Medicine Explainer', desc: 'Dosage & precautions', action: () => onNavigate('medicines') },
            { id: 'chat', title: '🌐 Translate', desc: 'Translate findings', action: () => onNavigate('chat') },
            { id: 'chat', title: '🔊 Read Aloud', desc: 'Listen to report', action: () => onNavigate('chat') },
            { id: 'compare', title: '📈 Compare Reports', desc: 'Track trends', action: () => onNavigate('compare') },
            { id: 'chat', title: '💬 AI Assistant', desc: 'Ask follow-ups', action: () => onNavigate('chat') }
          ].map((tool, idx) => (
            <button
              key={idx}
              onClick={tool.action}
              className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500/40 shadow-sm hover:shadow text-left transition-all group"
            >
              <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 group-hover:text-blue-600 transition-colors">
                {tool.title}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{tool.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Documents Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-600" />
            <span>Recent Medical Documents</span>
          </h2>
          {documents.length > 0 && (
            <button
              onClick={() => onNavigate('documents')}
              className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1"
            >
              <span>View All ({documents.length})</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {documents.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-blue-50 dark:bg-slate-800 text-blue-600 flex items-center justify-center">
              <FileText className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">No Medical Documents Saved Yet</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                Upload or scan a medical report to get instant simple explanations, test summaries, and medicine insights.
              </p>
            </div>
            
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => onNavigate('upload')}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow flex items-center gap-1.5"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Upload Report</span>
              </button>
              <button
                onClick={() => onNavigate('scan')}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-teal-600 hover:bg-teal-700 text-white shadow flex items-center gap-1.5"
              >
                <Camera className="w-4 h-4" />
                <span>Camera Scanner</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.slice(0, 6).map((doc) => (
              <div
                key={doc.id}
                onClick={() => {
                  if (onSelectDocument) onSelectDocument(doc.id);
                  onNavigate('report');
                }}
                className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 shadow-sm hover:shadow-md cursor-pointer transition-all space-y-3"
              >
                <div className="flex items-start justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                    {doc.documentType}
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3" />
                    {doc.date}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 line-clamp-1">
                    {doc.title || doc.documentType}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                    {doc.overview || doc.explanations?.simple || 'No summary text.'}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 font-medium">
                  <span>Tests: <strong>{doc.tests?.length || 0}</strong></span>
                  <span>Meds: <strong>{doc.medicines?.length || 0}</strong></span>
                  <span className="text-blue-600 dark:text-blue-400 font-bold flex items-center gap-0.5">
                    Open <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
