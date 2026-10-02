import React, { useState, useEffect } from 'react';
import { Pill, Activity, Search, Filter, BookOpen } from 'lucide-react';
import { getDocuments } from '../services/storageService';
import { MedicalTermModal } from '../components/MedicalTermModal';

export function MedicinesAndTests() {
  const [activeTab, setActiveTab] = useState('medicines'); // 'medicines', 'tests'
  const [medicines, setMedicines] = useState([]);
  const [tests, setTests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTerm, setSelectedTerm] = useState(null);

  useEffect(() => {
    const docs = getDocuments();
    const allMeds = [];
    const allTests = [];

    docs.forEach(d => {
      (d.medicines || []).forEach(m => {
        allMeds.push({ ...m, docTitle: d.title || d.documentType, docDate: d.date });
      });
      (d.tests || []).forEach(t => {
        allTests.push({ ...t, docTitle: d.title || d.documentType, docDate: d.date });
      });
    });

    setMedicines(allMeds);
    setTests(allTests);
  }, []);

  const filteredMeds = medicines.filter(m => (m.name || '').toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredTests = tests.filter(t => (t.name || '').toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center justify-center gap-2">
          <Pill className="w-7 h-7 text-emerald-600" />
          <span>Medicines & Lab Test Catalog</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Search and understand all medications and lab parameters detected across your documents.
        </p>
      </div>

      {/* Tabs & Search Controls */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
            <button
              onClick={() => setActiveTab('medicines')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'medicines' ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-sm' : 'text-slate-500'
              }`}
            >
              <Pill className="w-4 h-4" />
              <span>Medicines ({medicines.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('tests')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'tests' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm' : 'text-slate-500'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Lab Tests ({tests.length})</span>
            </button>
          </div>

          <div className="relative flex-1 max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        {/* Content list */}
        {activeTab === 'medicines' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {filteredMeds.length === 0 ? (
              <p className="text-xs text-slate-400 col-span-2 text-center py-6">No medicines match your search.</p>
            ) : (
              filteredMeds.map((med, idx) => (
                <div key={idx} className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">{med.name}</h3>
                    <span className="text-[10px] text-slate-400">{med.docDate}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400"><strong>Purpose:</strong> {med.purpose}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400"><strong>Dose:</strong> {med.dosage} ({med.frequency})</p>
                  <button
                    onClick={() => setSelectedTerm({
                      term: med.name,
                      simpleMeaning: `${med.name} is prescribed for ${med.purpose}. Take ${med.dosage} ${med.frequency}.`,
                      example: med.precautions
                    })}
                    className="text-[11px] font-bold text-emerald-600 hover:underline pt-1 block"
                  >
                    ✨ Explain Medicine Details
                  </button>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {filteredTests.length === 0 ? (
              <p className="text-xs text-slate-400 col-span-2 text-center py-6">No lab tests match your search.</p>
            ) : (
              filteredTests.map((test, idx) => (
                <div key={idx} className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">{test.name}</h3>
                    <span className="text-[10px] text-slate-400">{test.docDate}</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Result: <strong>{test.result} {test.unit}</strong> (Ref: {test.referenceRange})
                  </p>
                  <p className="text-xs text-slate-500">{test.simpleExplanation || test.whatItMeasures}</p>
                  <button
                    onClick={() => setSelectedTerm({
                      term: test.name,
                      simpleMeaning: test.simpleExplanation || test.whatItMeasures,
                      example: `${test.name} checks standard body functions.`
                    })}
                    className="text-[11px] font-bold text-blue-600 hover:underline pt-1 block"
                  >
                    ✨ Explain Test Details
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {selectedTerm && (
        <MedicalTermModal termData={selectedTerm} onClose={() => setSelectedTerm(null)} />
      )}

    </div>
  );
}
