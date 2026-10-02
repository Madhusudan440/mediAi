import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Sparkles, 
  Volume2, 
  Globe, 
  Download, 
  Bookmark, 
  Bell, 
  RefreshCw, 
  BookOpen, 
  HelpCircle, 
  Pill, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Search,
  Filter,
  ArrowUpDown,
  Smile,
  Zap,
  Check
} from 'lucide-react';
import { getDocument, saveBookmark, saveReminder, updateDocument } from '../services/storageService';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { MedicalTermModal } from '../components/MedicalTermModal';
import { SelectExplainDrawer } from '../components/SelectExplainDrawer';
import { tts } from '../utils/speechUtils';
import { translateText, sendChatMessage } from '../services/apiService';
import { generateDoctorPdf } from '../utils/pdfGenerator';
import { useLanguage } from '../context/LanguageContext';
import { FormattedMessage } from './AIChatbot';

export function ReportView({ documentId, onNavigate }) {
  const [docData, setDocData] = useState(null);
  const [explanationLevel, setExplanationLevel] = useState('simple'); // 'verySimple', 'simple', 'detailed'
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [highlightedText, setHighlightedText] = useState(null);
  
  // Feature states
  const [activeLang, setActiveLang] = useState('English');
  const [translatedText, setTranslatedText] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  
  // Custom modifier responses
  const [customExplanation, setCustomExplanation] = useState(null);
  const [loadingCustom, setLoadingCustom] = useState(false);

  // Lab Table search & filter
  const [testSearch, setTestSearch] = useState('');
  const [testFilter, setTestFilter] = useState('all'); // 'all', 'abnormal'
  const [savedBookmarkSuccess, setSavedBookmarkSuccess] = useState(false);

  useEffect(() => {
    if (documentId) {
      const data = getDocument(documentId);
      setDocData(data);
    }
  }, [documentId]);

  // Handle text selection listener
  useEffect(() => {
    const handleMouseUp = () => {
      const selection = window.getSelection();
      const text = selection?.toString().trim();
      if (text && text.length > 3 && text.length < 100) {
        setHighlightedText(text);
      }
    };
    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, []);

  if (!docData) {
    return (
      <div className="text-center py-20 space-y-4">
        <FileText className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">No Document Selected</h2>
        <button onClick={() => onNavigate('dashboard')} className="px-5 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow">
          Return to Dashboard
        </button>
      </div>
    );
  }

  // Handle Explain More Feature Button Modifiers
  const handleModifierClick = async (modifierType) => {
    setLoadingCustom(true);
    setCustomExplanation(null);
    try {
      let prompt = "";
      if (modifierType === 'simpler') prompt = "Make this explanation much simpler.";
      else if (modifierType === 'more') prompt = "Explain more details about this report.";
      else if (modifierType === 'like_10') prompt = "Explain like I'm 10 years old with a fun analogy.";
      else if (modifierType === 'example') prompt = "Give me a relatable real-life example for this report.";
      else if (modifierType === 'again') prompt = "Rephrase and explain this report again.";
      else if (modifierType === 'terms') prompt = "List and explain all difficult medical terms in this report.";

      const res = await sendChatMessage(prompt, docData, [], modifierType);
      setCustomExplanation(res);
    } catch (e) {
      console.error(e);
      alert('Failed to generate custom explanation.');
    } finally {
      setLoadingCustom(false);
    }
  };

  // Handle Read Aloud
  const handleReadAloud = () => {
    const textToSpeak = customExplanation || translatedText || docData.explanations?.[explanationLevel] || docData.overview;
    setIsSpeaking(true);
    tts.speak(textToSpeak, {
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false)
    });
  };

  // Handle Translation
  const handleTranslate = async (langName) => {
    setActiveLang(langName);
    if (langName === 'English') {
      setTranslatedText(null);
      return;
    }
    setIsTranslating(true);
    try {
      const targetText = customExplanation || docData.explanations?.[explanationLevel] || docData.overview;
      const res = await translateText(targetText, langName);
      setTranslatedText(typeof res === 'string' ? res : res.translatedText);
    } catch (e) {
      console.error(e);
    } finally {
      setIsTranslating(false);
    }
  };

  // Bookmark active explanation
  const handleSaveBookmark = () => {
    saveBookmark({
      type: 'report',
      title: docData.title || docData.documentType,
      content: customExplanation || docData.explanations?.[explanationLevel] || docData.overview,
      docId: docData.id
    });
    setSavedBookmarkSuccess(true);
    setTimeout(() => setSavedBookmarkSuccess(false), 2000);
  };

  // Filtered tests
  const filteredTests = (docData.tests || []).filter(t => {
    const matchesSearch = (t.name || '').toLowerCase().includes(testSearch.toLowerCase());
    const matchesFilter = testFilter === 'all' || (testFilter === 'abnormal' && (t.status || '').includes('Outside'));
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8 pb-16">
      
      {/* Report Overview Header */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
        
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                {docData.documentType || 'Medical Document'}
              </span>
              <span className="text-xs font-mono text-slate-400">Date: {docData.date || 'N/A'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-2">
              {docData.title || docData.documentType}
            </h1>
          </div>

          {/* AI Confidence badge */}
          <div className="flex items-center space-x-3 bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">AI Confidence</p>
              <p className="text-sm font-black text-emerald-600 dark:text-emerald-400">{docData.confidenceScore || 92}% ✓</p>
            </div>
            <button
              onClick={() => generateDoctorPdf(docData)}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Doctor PDF</span>
            </button>
          </div>
        </div>

        {/* Overview Stat Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="bg-blue-50/60 dark:bg-slate-800/60 p-3 rounded-2xl border border-blue-100 dark:border-slate-700">
            <span className="text-xs text-slate-500 font-medium">Tests Detected</span>
            <p className="text-xl font-black text-blue-700 dark:text-blue-300">{docData.tests?.length || 0}</p>
          </div>
          <div className="bg-emerald-50/60 dark:bg-slate-800/60 p-3 rounded-2xl border border-emerald-100 dark:border-slate-700">
            <span className="text-xs text-slate-500 font-medium">Medicines</span>
            <p className="text-xl font-black text-emerald-700 dark:text-emerald-300">{docData.medicines?.length || 0}</p>
          </div>
          <div className="bg-amber-50/60 dark:bg-slate-800/60 p-3 rounded-2xl border border-amber-100 dark:border-slate-700">
            <span className="text-xs text-slate-500 font-medium">Outside Range</span>
            <p className="text-xl font-black text-amber-700 dark:text-amber-300">
              {docData.tests?.filter(t => (t.status || '').includes('Outside')).length || 0}
            </p>
          </div>
          <div className="bg-purple-50/60 dark:bg-slate-800/60 p-3 rounded-2xl border border-purple-100 dark:border-slate-700">
            <span className="text-xs text-slate-500 font-medium">Follow-up</span>
            <p className="text-xl font-black text-purple-700 dark:text-purple-300">{docData.followUp?.timeframe || '1'}</p>
          </div>
        </div>

      </div>

      <DisclaimerBanner />

      {/* THREE EXPLANATION LEVELS TAB BAR */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
        
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">AI Report Explanation</h2>
          </div>

          {/* Level Buttons */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
            {[
              { key: 'verySimple', label: '🟢 Very Simple' },
              { key: 'simple', label: '🔵 Simple' },
              { key: 'detailed', label: '🟣 Detailed' }
            ].map(lvl => (
              <button
                key={lvl.key}
                onClick={() => { setExplanationLevel(lvl.key); setCustomExplanation(null); setTranslatedText(null); }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  explanationLevel === lvl.key
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                {lvl.label}
              </button>
            ))}
          </div>
        </div>

        {/* ⭐ EXPLAIN MORE FEATURE TOOLBAR (Section 14) */}
        <div className="bg-gradient-to-r from-blue-50 to-teal-50 dark:from-slate-800 dark:to-slate-800/60 p-4 rounded-2xl border border-blue-100 dark:border-slate-700 space-y-2">
          <span className="text-[11px] uppercase font-bold text-slate-500 tracking-wider block">
            ⭐ Interactive Explanation Controls:
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleModifierClick('again')}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-blue-100 text-xs font-semibold shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-1"
            >
              <span>🔄 Explain Again</span>
            </button>
            <button
              onClick={() => handleModifierClick('simpler')}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 text-xs font-semibold shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-1"
            >
              <span>🟢 Make It Simpler</span>
            </button>
            <button
              onClick={() => handleModifierClick('more')}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-300 hover:bg-blue-100 text-xs font-semibold shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-1"
            >
              <span>📖 Explain More</span>
            </button>
            <button
              onClick={() => handleModifierClick('like_10')}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 text-amber-700 dark:text-amber-300 hover:bg-amber-100 text-xs font-semibold shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-1"
            >
              <span>👶 Explain Like I'm 10</span>
            </button>
            <button
              onClick={() => handleModifierClick('example')}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 text-purple-700 dark:text-purple-300 hover:bg-purple-100 text-xs font-semibold shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-1"
            >
              <span>💡 Give Me an Example</span>
            </button>
            <button
              onClick={handleReadAloud}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shadow-sm border flex items-center gap-1 ${
                isSpeaking ? 'bg-emerald-600 text-white animate-pulse' : 'bg-emerald-50 text-emerald-800 border-emerald-200'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{isSpeaking ? 'Listening...' : '🔊 Read Aloud'}</span>
            </button>
            <button
              onClick={handleSaveBookmark}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 text-xs font-semibold shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-1"
            >
              {savedBookmarkSuccess ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Bookmark className="w-3.5 h-3.5 text-slate-500" />}
              <span>{savedBookmarkSuccess ? 'Saved!' : 'Bookmark'}</span>
            </button>
          </div>
        </div>

        {/* Main Text Content Box */}
        <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 relative">
          
          {/* Translation Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-3 text-xs">
            <span className="text-slate-500 font-semibold">Language: <strong>{activeLang}</strong></span>
            <div className="flex items-center space-x-1">
              {['English', 'Kannada', 'Hindi', 'Tamil', 'Telugu'].map(lang => (
                <button
                  key={lang}
                  onClick={() => handleTranslate(lang)}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold ${activeLang === lang ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-200'}`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {loadingCustom ? (
            <div className="py-8 text-center text-slate-500 space-y-2">
              <Sparkles className="w-6 h-6 animate-spin text-blue-600 mx-auto" />
              <p className="text-xs">Generating customized AI explanation...</p>
            </div>
          ) : (
            <div className="prose dark:prose-invert max-w-none text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
              <FormattedMessage text={translatedText || customExplanation || docData.explanations?.[explanationLevel] || docData.overview} />
            </div>
          )}
        </div>

      </div>

      {/* LAB TEST RESULTS TABLE SECTION */}
      {docData.tests && docData.tests.length > 0 && (
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
          
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                <span>Extracted Lab Test Results</span>
              </h2>
              <p className="text-xs text-slate-500">Values outside displayed reference range are explicitly highlighted.</p>
            </div>

            {/* Table Search & Filter Controls */}
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search test..."
                  value={testSearch}
                  onChange={(e) => setTestSearch(e.target.value)}
                  className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>
              <button
                onClick={() => setTestFilter(testFilter === 'all' ? 'abnormal' : 'all')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors ${
                  testFilter === 'abnormal' ? 'bg-amber-50 border-amber-500 text-amber-800' : 'border-slate-300 text-slate-600'
                }`}
              >
                {testFilter === 'abnormal' ? 'Outside Range Only' : 'All Tests'}
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3.5">Test Name</th>
                  <th className="p-3.5">Result</th>
                  <th className="p-3.5">Unit</th>
                  <th className="p-3.5">Reference Range</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                {filteredTests.map((test, idx) => {
                  const isAbnormal = (test.status || '').includes('Outside') || (test.status || '').includes('Critical');
                  return (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="p-3.5 font-bold">{test.name}</td>
                      <td className={`p-3.5 font-bold ${isAbnormal ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-slate-100'}`}>
                        {test.result}
                      </td>
                      <td className="p-3.5 text-slate-500 font-mono">{test.unit || '-'}</td>
                      <td className="p-3.5 font-mono text-slate-600 dark:text-slate-400">{test.referenceRange || '-'}</td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isAbnormal ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300' : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                        }`}>
                          {test.status || 'Normal'}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => setSelectedTerm({
                            term: test.name,
                            simpleMeaning: test.simpleExplanation || test.whatItMeasures || `${test.name} result is ${test.result} ${test.unit}`,
                            example: test.whatItMeasures
                          })}
                          className="px-2.5 py-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-slate-800 rounded-lg hover:bg-blue-100"
                        >
                          ✨ Explain This Test
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* MEDICINES DETECTED SECTION */}
      {docData.medicines && docData.medicines.length > 0 && (
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
          
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Pill className="w-5 h-5 text-emerald-600" />
              <span>Medicines Detected</span>
            </h2>
            <p className="text-xs text-slate-500">Dosage & frequency as written in original prescription.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {docData.medicines.map((med, idx) => (
              <div key={idx} className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">{med.name}</h3>
                    {med.genericName && med.genericName !== 'Unknown' && (
                      <p className="text-xs text-slate-500">Generic: <strong>{med.genericName}</strong></p>
                    )}
                  </div>
                  {med.ocrWarning && (
                    <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-semibold">
                      ⚠️ Verify OCR
                    </span>
                  )}
                </div>

                <div className="text-xs space-y-1 text-slate-700 dark:text-slate-300">
                  <p><strong>Purpose:</strong> {med.purpose || 'Prescribed medication'}</p>
                  <p><strong>Dosage:</strong> {med.dosage || 'As directed'}</p>
                  <p><strong>Frequency:</strong> {med.frequency || '-'}</p>
                  <p><strong>Duration:</strong> {med.duration || '-'}</p>
                  {med.precautions && <p className="text-amber-700 dark:text-amber-300"><strong>Precautions:</strong> {med.precautions}</p>}
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                  <button
                    onClick={() => setSelectedTerm({
                      term: med.name,
                      simpleMeaning: `${med.name} (${med.genericName || ''}) is used for ${med.purpose}. Take ${med.dosage} ${med.frequency}.`,
                      example: med.precautions
                    })}
                    className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
                  >
                    ✨ Explain Medicine
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* DOCTOR QUESTIONS GENERATOR */}
      {docData.doctorQuestions && docData.doctorQuestions.length > 0 && (
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-purple-600" />
            <span>Questions You Can Ask Your Doctor</span>
          </h2>

          <div className="space-y-2">
            {docData.doctorQuestions.map((q, idx) => (
              <div key={idx} className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 flex items-start gap-2.5">
                <span className="font-bold text-blue-600">Q{idx + 1}.</span>
                <span>{q}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Clickable Medical Terms Drawer & Highlight Text Drawer Modals */}
      {selectedTerm && (
        <MedicalTermModal termData={selectedTerm} onClose={() => setSelectedTerm(null)} />
      )}

      {highlightedText && (
        <SelectExplainDrawer
          selectedText={highlightedText}
          contextText={docData.overview}
          onClose={() => setHighlightedText(null)}
        />
      )}

    </div>
  );
}
