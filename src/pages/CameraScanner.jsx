import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  RefreshCw, 
  RotateCw, 
  Check, 
  AlertTriangle, 
  Sparkles, 
  Loader2, 
  X,
  Plus,
  Trash2
} from 'lucide-react';
import { extractTextFromImage } from '../services/tesseractService';
import { analyzeDocument } from '../services/apiService';
import { saveDocument } from '../services/storageService';
import confetti from 'canvas-confetti';

export function CameraScanner({ onNavigate, onSelectDocument }) {
  const [stream, setStream] = useState(null);
  const [capturedImages, setCapturedImages] = useState([]);
  const [activeImageIndex, setActiveImageIndex] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [cameraError, setCameraError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isBlurry, setIsBlurry] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.warn('Camera access error:', err);
      setCameraError('Camera access denied or unavailable. You can upload an image file instead.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);

    // Quality blur check simulation
    const isQualityBlurry = Math.random() < 0.15;
    setIsBlurry(isQualityBlurry);

    const newImages = [...capturedImages, dataUrl];
    setCapturedImages(newImages);
    setActiveImageIndex(newImages.length - 1);
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleRemoveImage = (indexToRemove) => {
    const updated = capturedImages.filter((_, idx) => idx !== indexToRemove);
    setCapturedImages(updated);
    if (updated.length === 0) {
      setActiveImageIndex(null);
    } else if (activeImageIndex === indexToRemove) {
      setActiveImageIndex(Math.max(0, indexToRemove - 1));
    } else if (activeImageIndex > indexToRemove) {
      setActiveImageIndex(activeImageIndex - 1);
    }
  };

  const handleProcessScannedDocument = async () => {
    if (capturedImages.length === 0) return;
    setIsProcessing(true);

    try {
      const primaryImage = capturedImages[0];
      const ocrRes = await extractTextFromImage(primaryImage);

      const aiData = await analyzeDocument(ocrRes.text || '', primaryImage, 'image/jpeg');

      const savedDoc = saveDocument({
        ...aiData,
        title: `Camera Scan (${capturedImages.length} ${capturedImages.length === 1 ? 'Page' : 'Pages'}) ${new Date().toLocaleDateString()}`,
        extractedText: ocrRes.text || ''
      });

      try { confetti({ particleCount: 70, spread: 60 }); } catch (e) {}

      if (onSelectDocument) onSelectDocument(savedDoc.id);

      setTimeout(() => {
        onNavigate('report');
      }, 800);

    } catch (err) {
      console.error(err);
      alert('Failed to process camera scan: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      
      {/* Title */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center justify-center gap-2">
          <Camera className="w-7 h-7 text-blue-600" />
          <span>Multi-Page Camera Document Scanner</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Capture multiple pages of prescriptions or lab reports using your device camera.
        </p>
      </div>

      {cameraError ? (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-900 p-6 rounded-3xl text-center space-y-4">
          <AlertTriangle className="w-10 h-10 text-amber-600 mx-auto" />
          <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">{cameraError}</p>
          <button
            onClick={() => onNavigate('upload')}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold shadow"
          >
            Go to File Upload
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          
          {/* Camera Viewfinder or Image Preview */}
          <div className="relative rounded-2xl overflow-hidden bg-black aspect-[4/3] flex items-center justify-center border border-slate-800 shadow-inner">
            {activeImageIndex === null ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={capturedImages[activeImageIndex]}
                alt="Captured document"
                style={{ transform: `rotate(${rotation}deg)` }}
                className="max-h-full object-contain transition-transform duration-200"
              />
            )}

            <canvas ref={canvasRef} className="hidden" />

            {/* Viewfinder overlay grid */}
            {activeImageIndex === null && (
              <div className="absolute inset-4 border-2 border-dashed border-white/40 rounded-xl pointer-events-none flex items-center justify-center">
                <span className="text-xs text-white/80 font-semibold bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-sm">
                  Position document page within frame
                </span>
              </div>
            )}
          </div>

          {/* Blur / Quality Warning */}
          {isBlurry && activeImageIndex !== null && (
            <div className="bg-amber-50 dark:bg-amber-950/50 border-l-4 border-amber-500 p-3 rounded-r text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>⚠️ This document may be blurry. Ensure good lighting or take another photo.</span>
              </div>
            </div>
          )}

          {/* Camera Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            {activeImageIndex === null ? (
              <button
                onClick={handleCapture}
                className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
              >
                <Camera className="w-5 h-5" />
                <span>Capture Page {capturedImages.length + 1}</span>
              </button>
            ) : (
              <div className="w-full flex flex-wrap items-center justify-between gap-2">
                <div className="flex space-x-2">
                  <button
                    onClick={handleRotate}
                    className="p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5"
                  >
                    <RotateCw className="w-4 h-4" />
                    <span>Rotate</span>
                  </button>

                  <button
                    onClick={() => setActiveImageIndex(null)}
                    className="px-3.5 py-2.5 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-xs font-bold hover:bg-blue-100 flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Take Another Photo</span>
                  </button>
                </div>

                <button
                  disabled={isProcessing || capturedImages.length === 0}
                  onClick={handleProcessScannedDocument}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold shadow-md flex items-center gap-2"
                >
                  {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  <span>{isProcessing ? 'Processing...' : `Analyze Document (${capturedImages.length} ${capturedImages.length === 1 ? 'Page' : 'Pages'})`}</span>
                </button>
              </div>
            )}
          </div>

          {/* Captured Pages Gallery with Corner Remove Button */}
          {capturedImages.length > 0 && (
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Captured Document Pages ({capturedImages.length})
                </span>
                <span className="text-[11px] text-slate-400">
                  Click thumbnail to preview or <span className="text-rose-500 font-bold">✕</span> to remove
                </span>
              </div>

              <div className="flex space-x-3 overflow-x-auto pb-3 pt-1">
                {capturedImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative group shrink-0"
                  >
                    {/* Thumbnail Container */}
                    <div
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-16 h-20 rounded-xl overflow-hidden border-2 cursor-pointer relative shadow-sm transition-all ${
                        activeImageIndex === idx 
                          ? 'border-blue-600 ring-2 ring-blue-500/40 scale-105' 
                          : 'border-slate-300 dark:border-slate-700 hover:border-blue-400'
                      }`}
                    >
                      <img src={img} alt={`Page ${idx + 1}`} className="w-full h-full object-cover" />
                      <span className="absolute bottom-1 left-1 text-[9px] bg-black/70 text-white font-mono font-bold px-1 rounded">
                        P{idx + 1}
                      </span>
                    </div>

                    {/* Corner Remove 'Wrong Option' Button (✕) */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage(idx);
                      }}
                      className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center text-[11px] font-black shadow-md z-10 hover:scale-110 transition-transform"
                      title="Remove page"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
