import React from 'react';
import { ShieldAlert, AlertTriangle } from 'lucide-react';

export function DisclaimerBanner({ compact = false }) {
  if (compact) {
    return (
      <div className="bg-amber-50 dark:bg-amber-950/40 border-l-4 border-amber-500 p-3 rounded-r text-xs text-amber-800 dark:text-amber-300 flex items-center space-x-2 my-2">
        <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
        <span>
          <strong>Informational Only:</strong> MediExplain AI does not provide medical diagnosis or treatment. Always consult your healthcare provider.
        </span>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-4 rounded-xl shadow-md border border-blue-700/50 mb-6">
      <div className="flex items-start space-x-3">
        <div className="p-2 bg-blue-800/80 rounded-lg text-blue-200 mt-0.5 shrink-0">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-semibold text-sm md:text-base text-blue-100 flex items-center gap-2">
            <span>Safety & Clinical Disclaimer</span>
            <span className="text-[10px] bg-blue-700 text-blue-200 px-2 py-0.5 rounded-full font-mono uppercase">AI Assistant</span>
          </h4>
          <p className="text-xs md:text-sm text-blue-200 mt-1 leading-relaxed">
            MediExplain AI provides informational explanations of medical documents. It does not diagnose conditions, prescribe treatment, or replace a qualified healthcare professional. Always verify unclear prescriptions, medicine names, dosages, and important medical decisions with your doctor or pharmacist.
          </p>
        </div>
      </div>
    </div>
  );
}
