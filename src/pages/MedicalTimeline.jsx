import React, { useState, useEffect } from 'react';
import { Calendar, FileText, Clock, ChevronRight, Activity } from 'lucide-react';
import { getDocuments } from '../services/storageService';

export function MedicalTimeline({ onNavigate, onSelectDocument }) {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const docs = getDocuments();
    // Sort chronologically newest first
    docs.sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));
    setDocuments(docs);
  }, []);

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center justify-center gap-2">
          <Calendar className="w-7 h-7 text-indigo-600" />
          <span>Medical History Timeline</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Visual chronological record of all medical reports, prescriptions, and notes.
        </p>
      </div>

      {documents.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-3">
          <Calendar className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">No Timeline Data Available</h3>
          <p className="text-xs text-slate-500">Upload reports to automatically generate your medical timeline.</p>
        </div>
      ) : (
        <div className="relative border-l-2 border-indigo-200 dark:border-indigo-900/60 ml-4 sm:ml-8 space-y-8 pl-6 sm:pl-8 py-4">
          {documents.map((doc, idx) => (
            <div key={doc.id} className="relative group">
              
              {/* Timeline Bullet Node */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-6 h-6 rounded-full bg-white dark:bg-slate-900 border-4 border-indigo-600 flex items-center justify-center shadow" />

              <div
                onClick={() => {
                  if (onSelectDocument) onSelectDocument(doc.id);
                  onNavigate('report');
                }}
                className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 shadow-sm hover:shadow-md cursor-pointer transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    {doc.documentType}
                  </span>
                  <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {doc.date || 'Recent'}
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">{doc.title || doc.documentType}</h3>
                <p className="text-xs text-slate-500 line-clamp-2">{doc.overview || doc.explanations?.simple}</p>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-indigo-600 font-semibold">
                  <span>Patient: {doc.patientName || 'Self'}</span>
                  <span className="flex items-center gap-0.5">
                    View Details <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
