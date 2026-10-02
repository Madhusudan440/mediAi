import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Calendar, FileText, CheckCircle2 } from 'lucide-react';
import { getDocuments } from '../services/storageService';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export function ReportCompare() {
  const [documents, setDocuments] = useState([]);
  const [selectedDocIds, setSelectedDocIds] = useState([]);

  useEffect(() => {
    const docs = getDocuments();
    setDocuments(docs);
    if (docs.length >= 2) {
      setSelectedDocIds([docs[0].id, docs[1].id]);
    } else if (docs.length === 1) {
      setSelectedDocIds([docs[0].id]);
    }
  }, []);

  const toggleSelectDoc = (id) => {
    if (selectedDocIds.includes(id)) {
      setSelectedDocIds(selectedDocIds.filter(i => i !== id));
    } else {
      if (selectedDocIds.length >= 3) {
        alert('You can compare up to 3 reports at once.');
        return;
      }
      setSelectedDocIds([...selectedDocIds, id]);
    }
  };

  const selectedDocs = documents.filter(d => selectedDocIds.includes(d.id));

  // Build trend chart data for common tests (e.g., Hemoglobin, WBC, Sugar, Blood Pressure)
  const commonTestsMap = {};
  selectedDocs.forEach(d => {
    (d.tests || []).forEach(t => {
      const val = parseFloat((t.result || '').replace(/[^0-9.]/g, ''));
      if (!isNaN(val)) {
        if (!commonTestsMap[t.name]) commonTestsMap[t.name] = [];
        commonTestsMap[t.name].push({
          date: d.date || 'Report',
          value: val,
          unit: t.unit || ''
        });
      }
    });
  });

  const chartableTestNames = Object.keys(commonTestsMap).filter(k => commonTestsMap[k].length >= 1);

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center justify-center gap-2">
          <BarChart3 className="w-7 h-7 text-blue-600" />
          <span>Report Comparison & Trend Tracker</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Compare lab test values and prescriptions across saved medical reports side by side.
        </p>
      </div>

      {/* Select Reports List */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
          Select Reports to Compare (Max 3):
        </h2>

        {documents.length === 0 ? (
          <p className="text-xs text-slate-400">No saved documents to compare. Please upload reports first.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {documents.map(d => {
              const isSelected = selectedDocIds.includes(d.id);
              return (
                <div
                  key={d.id}
                  onClick={() => toggleSelectDoc(d.id)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start justify-between ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950'
                  }`}
                >
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{d.documentType}</span>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 line-clamp-1">{d.title || d.documentType}</h4>
                    <p className="text-[11px] text-slate-500 font-mono mt-1">Date: {d.date}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300'}`}>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Trend Visualizer Chart */}
      {selectedDocs.length > 0 && chartableTestNames.length > 0 && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-teal-600" />
            <span>Test Value Trends Across Selected Reports</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {chartableTestNames.slice(0, 4).map(testName => (
              <div key={testName} className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex justify-between">
                  <span>{testName}</span>
                  <span className="text-slate-400 font-mono">Unit: {commonTestsMap[testName][0]?.unit}</span>
                </h3>
                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={commonTestsMap[testName]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                      <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#0284c7" strokeWidth={3} dot={{ r: 5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Side by Side Comparison Table */}
      {selectedDocs.length > 0 && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-4 overflow-x-auto">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Side-by-Side Report Summary
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {selectedDocs.map((doc, idx) => (
              <div key={doc.id} className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="pb-2 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-blue-600 uppercase">Report #{idx + 1}</span>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">{doc.title || doc.documentType}</h3>
                  <p className="text-[11px] text-slate-400 font-mono">Date: {doc.date}</p>
                </div>

                <div className="text-xs space-y-1 text-slate-700 dark:text-slate-300">
                  <p><strong>Doctor:</strong> {doc.doctorName || 'N/A'}</p>
                  <p><strong>Tests:</strong> {doc.tests?.length || 0}</p>
                  <p><strong>Medicines:</strong> {doc.medicines?.length || 0}</p>
                </div>

                <div className="pt-2 text-xs text-slate-600 dark:text-slate-400 line-clamp-4 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  {doc.overview || doc.explanations?.simple}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
