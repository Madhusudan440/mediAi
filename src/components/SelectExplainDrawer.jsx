import React, { useState } from 'react';
import { Sparkles, Volume2, Globe, X, Loader2, BookOpen } from 'lucide-react';
import { explainMedicalTerm, translateText } from '../services/apiService';
import { tts } from '../utils/speechUtils';

export function SelectExplainDrawer({ selectedText, contextText, onClose }) {
  const [explanation, setExplanation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [translatedText, setTranslatedText] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  React.useEffect(() => {
    if (selectedText) {
      fetchExplanation();
    }
  }, [selectedText]);

  const fetchExplanation = async () => {
    setLoading(true);
    setError(null);
    setTranslatedText(null);
    try {
      const res = await explainMedicalTerm(selectedText, contextText);
      setExplanation(res);
    } catch (err) {
      console.error(err);
      setError('Could not generate explanation for selected text.');
    } finally {
      setLoading(false);
    }
  };

  const handleSpeak = () => {
    const text = translatedText || explanation?.simpleMeaning || selectedText;
    setIsSpeaking(true);
    tts.speak(text, {
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false)
    });
  };

  const handleTranslate = async (lang) => {
    if (!explanation) return;
    try {
      const res = await translateText(explanation.simpleMeaning, lang);
      setTranslatedText(typeof res === 'string' ? res : res.translatedText);
    } catch (e) {
      console.error(e);
    }
  };

  if (!selectedText) return null;

  return (
    <div className="fixed bottom-4 right-4 left-4 md:left-auto md:w-96 z-50 bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-2xl border border-blue-500/30 animate-in slide-in-from-bottom-5 duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-blue-100 dark:bg-blue-950 text-blue-600 rounded-lg">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Highlighted Selection</h4>
            <p className="text-[11px] text-blue-600 font-semibold truncate max-w-[200px]">"{selectedText}"</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body */}
      <div className="py-3">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-6 text-slate-500">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600 mb-2" />
            <p className="text-xs">Analyzing selection with AI...</p>
          </div>
        ) : error ? (
          <p className="text-xs text-rose-500 py-2">{error}</p>
        ) : explanation ? (
          <div className="space-y-3">
            
            {/* Simple meaning */}
            <div className="text-xs text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl leading-relaxed">
              <strong className="block text-[10px] uppercase text-blue-600 font-bold mb-1">Simple Meaning</strong>
              {translatedText || explanation.simpleMeaning}
            </div>

            {/* Example */}
            {explanation.example && (
              <div className="text-[11px] text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-xl">
                💡 <strong>Analogy:</strong> {explanation.example}
              </div>
            )}

            {/* Pronunciation */}
            {explanation.pronunciation && (
              <div className="text-[11px] text-teal-700 dark:text-teal-300 font-mono">
                🗣️ Pronunciation: <strong>{explanation.pronunciation}</strong>
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* Toolbar */}
      {explanation && !loading && (
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={handleSpeak}
            className="flex items-center space-x-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>{isSpeaking ? 'Speaking...' : 'Read Aloud'}</span>
          </button>
          
          <div className="flex items-center space-x-1 text-[10px]">
            <Globe className="w-3 h-3 text-slate-400" />
            <button onClick={() => handleTranslate('Kannada')} className="text-blue-600 hover:underline">Kannada</button>
            <span>•</span>
            <button onClick={() => handleTranslate('Hindi')} className="text-blue-600 hover:underline">Hindi</button>
            <span>•</span>
            <button onClick={() => handleTranslate('Tamil')} className="text-blue-600 hover:underline">Tamil</button>
          </div>
        </div>
      )}
    </div>
  );
}
