import React, { useState } from 'react';
import { Volume2, Globe, Sparkles, BookOpen, Lightbulb, X, Check, Loader2 } from 'lucide-react';
import { tts } from '../utils/speechUtils';
import { translateText } from '../services/apiService';

export function MedicalTermModal({ termData, onClose }) {
  const [activeLang, setActiveLang] = useState('English');
  const [translatedText, setTranslatedText] = useState(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  if (!termData) return null;

  const handleSpeak = () => {
    const textToSpeak = translatedText || termData.simpleMeaning || termData.term;
    setIsSpeaking(true);
    tts.speak(textToSpeak, {
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false)
    });
  };

  const handleTranslate = async (lang) => {
    setActiveLang(lang);
    if (lang === 'English') {
      setTranslatedText(null);
      return;
    }
    setIsTranslating(true);
    try {
      const res = await translateText(termData.simpleMeaning, lang);
      setTranslatedText(typeof res === 'string' ? res : res.translatedText || JSON.stringify(res));
    } catch (e) {
      console.error(e);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
              Medical Term Explainer
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              {termData.term}
            </h2>
            {termData.pronunciation && (
              <p className="text-xs text-slate-500 font-mono mt-0.5 flex items-center gap-1.5">
                <span>Pronunciation:</span>
                <span className="text-teal-600 dark:text-teal-400 font-semibold">{termData.pronunciation}</span>
              </p>
            )}
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="py-4 space-y-4">
          {/* Simple Meaning */}
          <div className="bg-blue-50/70 dark:bg-slate-800/60 p-4 rounded-2xl border border-blue-100 dark:border-slate-700">
            <h4 className="text-xs font-bold text-blue-900 dark:text-blue-300 flex items-center gap-1.5 mb-1">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>Simple Meaning</span>
            </h4>
            {isTranslating ? (
              <div className="flex items-center space-x-2 text-xs text-slate-500 py-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                <span>Translating to {activeLang}...</span>
              </div>
            ) : (
              <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                {translatedText || termData.simpleMeaning}
              </p>
            )}
          </div>

          {/* Real-World Analogy Example */}
          {termData.example && (
            <div className="bg-amber-50/80 dark:bg-amber-950/30 p-4 rounded-2xl border border-amber-200 dark:border-amber-900/50">
              <h4 className="text-xs font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5 mb-1">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                <span>Easy Analogy / Example</span>
              </h4>
              <p className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                "{termData.example}"
              </p>
            </div>
          )}

          {/* Word breakdown if any */}
          {termData.wordByWord && (
            <div className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl">
              <strong>Word Breakdown:</strong> {termData.wordByWord}
            </div>
          )}
        </div>

        {/* Actions Toolbar */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
          
          {/* TTS Read Aloud */}
          <button
            onClick={handleSpeak}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              isSpeaking
                ? 'bg-emerald-600 text-white animate-pulse'
                : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>{isSpeaking ? 'Listening...' : 'Read Aloud'}</span>
          </button>

          {/* Quick Translate Buttons */}
          <div className="flex items-center space-x-1">
            <span className="text-[10px] text-slate-400 font-semibold mr-1">Translate:</span>
            {['English', 'Kannada', 'Hindi', 'Tamil'].map(lang => (
              <button
                key={lang}
                onClick={() => handleTranslate(lang)}
                className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition-colors ${
                  activeLang === lang
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
