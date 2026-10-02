import React, { useState } from 'react';
import { Edit3, Check, AlertTriangle, X } from 'lucide-react';

export function OCRCorrectionModal({ initialText, confidence, onConfirm, onCancel }) {
  const [text, setText] = useState(initialText || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(text);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-blue-600" />
              <span>Review & Edit Extracted Text</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Verify and fix any OCR misread numbers, test names, or medicine dosage before AI analysis.
            </p>
          </div>
          <button onClick={onCancel} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* OCR Confidence Warning */}
        {confidence < 80 && (
          <div className="mt-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-900 text-amber-800 dark:text-amber-300 p-3 rounded-xl text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              OCR Confidence Score: <strong>{confidence}%</strong>. Handwritten or faint text detected. Please double-check numbers and medicine names carefully.
            </span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Extracted Medical Text
            </label>
            <textarea
              rows={10}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full p-3.5 text-xs sm:text-sm font-mono rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-slate-400">
              Editing text will improve AI understanding accuracy.
            </span>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Confirm & Analyze with AI</span>
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
}
