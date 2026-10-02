import React, { useState, useEffect } from 'react';
import { FileText, Clock, Trash2, Edit3, ArrowRight, Download, Plus, Search } from 'lucide-react';
import { getDocuments, deleteDocument, updateDocument, saveDocument } from '../services/storageService';
import { DEMO_DOCUMENTS } from '../utils/demoData';
import { generateDoctorPdf } from '../utils/pdfGenerator';

export function MyDocuments({ onNavigate, onSelectDocument }) {
  const [documents, setDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingDocId, setEditingDocId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  useEffect(() => {
    loadDocs();
  }, []);

  const loadDocs = () => {
    setDocuments(getDocuments());
  };

  const handleDelete = (id) => {
    deleteDocument(id);
    loadDocs();
  };

  const handleStartRename = (doc) => {
    setEditingDocId(doc.id);
    setEditTitle(doc.title || doc.documentType);
  };

  const handleSaveRename = (id) => {
    if (editTitle.trim()) {
      updateDocument(id, { title: editTitle.trim() });
    }
    setEditingDocId(null);
    loadDocs();
  };

  const handleLoadDemo = (demoId) => {
    const demo = DEMO_DOCUMENTS.find(d => d.id === demoId) || DEMO_DOCUMENTS[0];
    const saved = saveDocument(demo);
    loadDocs();
    if (onSelectDocument) onSelectDocument(saved.id);
    onNavigate('report');
  };

  const filteredDocs = documents.filter(d => 
    (d.title || d.documentType || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (d.documentType || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FileText className="w-7 h-7 text-blue-600" />
            <span>My Local Document History</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            All extracted reports and explanations are stored locally in your browser.
          </p>
        </div>

        <button
          onClick={() => onNavigate('upload')}
          className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Upload New Report</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-3">
        <Search className="w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search saved documents by title or type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-transparent text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none"
        />
      </div>

      {/* Documents Grid */}
      {filteredDocs.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-4">
          <FileText className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">No Saved Documents Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Your document history is currently empty. Click below to upload a medical document or report.
          </p>

          <div className="flex justify-center pt-2">
            <button
              onClick={() => onNavigate('upload')}
              className="px-5 py-2.5 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Upload New Document</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 shadow-sm transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                    {doc.documentType}
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3" />
                    {doc.date}
                  </span>
                </div>

                {editingDocId === doc.id ? (
                  <div className="flex items-center space-x-2 pt-1">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full text-xs p-1 rounded border border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    />
                    <button
                      onClick={() => handleSaveRename(doc.id)}
                      className="px-2 py-1 bg-blue-600 text-white rounded text-[10px] font-bold"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 line-clamp-1">
                      {doc.title || doc.documentType}
                    </h3>
                    <button
                      onClick={() => handleStartRename(doc)}
                      className="p-1 text-slate-400 hover:text-blue-600"
                      title="Rename document"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <p className="text-xs text-slate-500 line-clamp-2">
                  {doc.overview || doc.explanations?.simple}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40"
                  title="Delete document"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => generateDoctorPdf(doc)}
                    className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-blue-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Export Doctor PDF"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      if (onSelectDocument) onSelectDocument(doc.id);
                      onNavigate('report');
                    }}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow flex items-center gap-1"
                  >
                    <span>Open</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
