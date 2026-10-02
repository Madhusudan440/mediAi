import React from 'react';
import { 
  Activity, 
  UploadCloud, 
  Camera, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Volume2, 
  Globe, 
  FileText, 
  Zap, 
  Eye, 
  ArrowRight,
  HeartPulse,
  Brain,
  Search,
  BookOpen
} from 'lucide-react';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { DEMO_DOCUMENTS } from '../utils/demoData';
import { saveDocument } from '../services/storageService';

export function LandingPage({ onNavigate, onSelectDocument }) {

  const handleTryDemo = (demoId) => {
    const demoDoc = DEMO_DOCUMENTS.find(d => d.id === demoId) || DEMO_DOCUMENTS[0];
    const saved = saveDocument(demoDoc);
    if (onSelectDocument) onSelectDocument(saved.id);
    onNavigate('report');
  };

  return (
    <div className="space-y-16 pb-12">
      
      {/* Hero Section */}
      <section className="relative pt-6 pb-12 md:pt-12 md:pb-20 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>AI-Powered Healthcare Accessibility Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 leading-[1.15]">
            Understand Your Medical Reports.{' '}
            <span className="bg-gradient-to-r from-blue-600 via-teal-500 to-indigo-600 bg-clip-text text-transparent">
              Simply.
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Scan medical reports and prescriptions, understand difficult medical terms, ask questions, translate explanations, and listen to information in a language you understand.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-4">
            <button
              onClick={() => onNavigate('upload')}
              className="px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/35 transition-all flex items-center gap-2 group"
            >
              <UploadCloud className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
              <span>Upload Medical Report</span>
            </button>

            <button
              onClick={() => onNavigate('scan')}
              className="px-6 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-teal-600/25 hover:shadow-xl hover:shadow-teal-600/35 transition-all flex items-center gap-2"
            >
              <Camera className="w-5 h-5" />
              <span>Scan Document</span>
            </button>

            <button
              onClick={() => handleTryDemo('demo_blood_report')}
              className="px-6 py-3.5 rounded-2xl border-2 border-slate-300 dark:border-slate-700 hover:border-slate-400 text-slate-700 dark:text-slate-200 font-semibold text-sm sm:text-base transition-colors bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Try Demo</span>
            </button>
          </div>
        </div>

      </section>

      {/* Safety Disclaimer Banner */}
      <DisclaimerBanner />

      {/* How It Works Section */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            How MediExplain Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
            Seamless 6-step medical document understanding pipeline powered by browser OCR & free-tier Gemini AI.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { step: '1', title: 'Upload / Scan', desc: 'PDF, JPG, PNG or camera capture', icon: UploadCloud },
            { step: '2', title: 'OCR Extract', desc: 'Tesseract text & table detection', icon: Search },
            { step: '3', title: 'AI Classify', desc: 'Detects report type & parameters', icon: Brain },
            { step: '4', title: '3 Level Summary', desc: 'Very Simple, Simple, Detailed', icon: BookOpen },
            { step: '5', title: 'Explain More', desc: 'Ask follow-ups & analogies', icon: Sparkles },
            { step: '6', title: 'Translate & Voice', desc: 'Listen or translate to 8 languages', icon: Volume2 }
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.step} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative group hover:shadow-md transition-shadow">
                <span className="absolute top-3 right-3 text-2xl font-black text-slate-200 dark:text-slate-800">{s.step}</span>
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100">{s.title}</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            Advanced Accessibility Features
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
            Built specifically for patients, elderly family members, and caregivers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: '⭐ Explain More & Explain Simpler',
              desc: 'Never get stuck with rigid AI outputs. Ask the AI to make it simpler, explain like you are 10, or give a real-life analogy.',
              icon: Sparkles,
              color: 'text-amber-500 bg-amber-50 dark:bg-amber-950'
            },
            {
              title: '🔊 Native Read Aloud & Voice Input',
              desc: 'Listen to explanations in natural voices with zero external paid APIs using browser SpeechSynthesis.',
              icon: Volume2,
              color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950'
            },
            {
              title: '🌐 Multilingual Translation',
              desc: 'Translate report findings into English, Kannada, Hindi, Tamil, Telugu, Malayalam, Marathi, or Bengali.',
              icon: Globe,
              color: 'text-blue-500 bg-blue-50 dark:bg-blue-950'
            },
            {
              title: '📈 Report Comparison & Trends',
              desc: 'Compare test values across past reports side-by-side with visual charts to track your health progress.',
              icon: Activity,
              color: 'text-teal-500 bg-teal-50 dark:bg-teal-950'
            },
            {
              title: '📄 Doctor Question Generator & PDF',
              desc: 'Export a neat 1-page summary PDF with pre-generated discussion questions for your physician.',
              icon: FileText,
              color: 'text-purple-500 bg-purple-50 dark:bg-purple-950'
            },
            {
              title: '🔒 100% Zero-Database Privacy',
              desc: 'No database is used. All report history, conversations, and bookmarks remain private inside your local browser.',
              icon: ShieldCheck,
              color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950'
            }
          ].map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500/30 transition-all">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${f.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 mb-2">{f.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* About & Developer Section */}
      <footer className="pt-8 border-t border-slate-200 dark:border-slate-800 text-center space-y-2">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          MediExplain AI — AI Medical Document Understanding & Accessibility Platform
        </p>
        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          Designed & Developed by <span className="text-blue-600 dark:text-blue-400 font-bold">Madhusudan</span>
        </p>
      </footer>

    </div>
  );
}
