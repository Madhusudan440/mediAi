import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileText, 
  Image as ImageIcon, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Loader2, 
  Edit3, 
  Trash2, 
  Eye, 
  ArrowRight 
} from 'lucide-react';
import { extractTextFromImage } from '../services/tesseractService';
import { analyzeDocument } from '../services/apiService';
import { saveDocument } from '../services/storageService';
import { OCRCorrectionModal } from '../components/OCRCorrectionModal';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import confetti from 'canvas-confetti';

export function DocumentUpload({ onNavigate, onSelectDocument }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [stage, setStage] = useState('idle'); // 'idle', 'ocr', 'review_ocr', 'analyzing', 'complete', 'error'
  const [ocrResult, setOcrResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showOcrModal, setShowOcrModal] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    if (!file) return;

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      setErrorMessage('Unsupported file format. Please upload a PDF, JPG, JPEG, or PNG file.');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setErrorMessage('File size exceeds 15MB limit. Please choose a smaller image or PDF.');
      return;
    }

    setSelectedFile(file);
    setErrorMessage(null);

    // Create image preview if image
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setFilePreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleStartProcessing = async () => {
    if (!selectedFile) return;

    setStage('analyzing');
    setErrorMessage(null);

    try {
      let extractedText = '';

      if (selectedFile.type.startsWith('image/')) {
        try {
          const ocrData = await extractTextFromImage(selectedFile);
          extractedText = ocrData.text || '';
        } catch (e) {
          console.warn('Browser Tesseract OCR skipped, using direct Gemini Vision.');
        }
      } else {
        extractedText = `PDF Document uploaded: ${selectedFile.name}.`;
      }

      // Run AI analysis directly without stopping
      await runAiAnalysis(extractedText, filePreview);
    } catch (err) {
      console.error(err);
      setStage('error');
      setErrorMessage(err.message || 'Failed to process document with AI.');
    }
  };

  const runAiAnalysis = async (textToAnalyze, imageBase64Data) => {
    setStage('analyzing');
    setShowOcrModal(false);
    try {
      const aiData = await analyzeDocument(textToAnalyze, imageBase64Data, selectedFile?.type || 'image/jpeg');
      
      // Save to LocalStorage
      const savedDoc = saveDocument({
        ...aiData,
        title: selectedFile ? selectedFile.name.replace(/\.[^/.]+$/, "") : aiData.documentType,
        extractedText: textToAnalyze
      });

      setStage('complete');

      // Trigger success confetti
      try {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      } catch (e) {}

      if (onSelectDocument) onSelectDocument(savedDoc.id);

      // Navigate to report view after short delay
      setTimeout(() => {
        onNavigate('report');
      }, 1000);

    } catch (err) {
      console.error(err);
      setStage('error');
      setErrorMessage(err.message || 'AI document understanding API request failed.');
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setFilePreview(null);
    setStage('idle');
    setOcrResult(null);
    setErrorMessage(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      
      {/* Title */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center justify-center gap-2">
          <UploadCloud className="w-7 h-7 text-blue-600" />
          <span>Upload Medical Document</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
          Upload any medical report, prescription, doctor note, or lab test (PDF, JPG, PNG).
        </p>
      </div>

      <DisclaimerBanner compact />

      {/* Processing Pipeline Visualizer */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="grid grid-cols-5 text-center gap-2">
          {[
            { label: '1. Select File', active: stage === 'idle' || stage !== 'idle' },
            { label: '2. Read & OCR', active: stage === 'ocr' || stage === 'review_ocr' || stage === 'analyzing' || stage === 'complete' },
            { label: '3. Detect Type', active: stage === 'analyzing' || stage === 'complete' },
            { label: '4. Extract Info', active: stage === 'analyzing' || stage === 'complete' },
            { label: '5. AI Explanation', active: stage === 'complete' }
          ].map((step, idx) => (
            <div key={idx} className="space-y-1">
              <div className={`h-1.5 rounded-full transition-all ${step.active ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-800'}`} />
              <span className={`text-[10px] font-semibold block ${step.active ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Drag and Drop Zone */}
      {!selectedFile ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`bg-white dark:bg-slate-900 border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 scale-[0.99]'
              : 'border-slate-300 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-slate-50/50'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
            accept=".pdf,.png,.jpg,.jpeg"
            className="hidden"
          />

          <div className="w-16 h-16 mx-auto rounded-3xl bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 shadow-sm">
            <UploadCloud className="w-8 h-8" />
          </div>

          <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100">
            Drag & drop your medical document here
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Supports PDF, JPG, JPEG, and PNG files up to 15MB
          </p>

          <button
            type="button"
            className="mt-6 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md inline-flex items-center gap-2"
          >
            <span>Browse Files</span>
          </button>
        </div>
      ) : (
        /* Selected File Card & Actions */
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-50 dark:bg-slate-800 text-blue-600 rounded-2xl">
                {selectedFile.type.includes('pdf') ? <FileText className="w-6 h-6" /> : <ImageIcon className="w-6 h-6" />}
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">{selectedFile.name}</h4>
                <p className="text-xs text-slate-400">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {selectedFile.type}</p>
              </div>
            </div>
            
            {stage === 'idle' && (
              <button
                onClick={handleReset}
                className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl"
                title="Remove file"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Image Preview */}
          {filePreview && (
            <div className="max-h-60 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-2">
              <img src={filePreview} alt="Document Preview" className="max-h-56 object-contain rounded-xl" />
            </div>
          )}

          {/* Stage Status Display */}
          {stage === 'ocr' && (
            <div className="flex items-center justify-center space-x-3 py-6 text-blue-600">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-sm font-semibold">Running Tesseract OCR text extraction...</span>
            </div>
          )}

          {stage === 'analyzing' && (
            <div className="flex items-center justify-center space-x-3 py-6 text-teal-600">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-sm font-semibold">Generating AI document understanding & explanations...</span>
            </div>
          )}

          {stage === 'complete' && (
            <div className="bg-emerald-50 dark:bg-emerald-950/40 p-4 rounded-2xl text-emerald-800 dark:text-emerald-300 text-sm font-semibold flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Document successfully processed! Opening report...</span>
            </div>
          )}

          {stage === 'idle' && (
            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={handleReset}
                className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleStartProcessing}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Process Medical Report</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Error Banner */}
      {errorMessage && (
        <div className="bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 p-4 rounded-2xl text-xs sm:text-sm font-medium flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Manual OCR Correction Modal */}
      {showOcrModal && ocrResult && (
        <OCRCorrectionModal
          initialText={ocrResult.text}
          confidence={ocrResult.confidence}
          onConfirm={(editedText) => runAiAnalysis(editedText, filePreview)}
          onCancel={() => { setShowOcrModal(false); setStage('idle'); }}
        />
      )}

    </div>
  );
}
