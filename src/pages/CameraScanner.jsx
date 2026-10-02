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
  Plus
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

    // Simulate blur check (random mock quality check for realistic demo)
    const isQualityBlurry = Math.random() < 0.15; // 15% chance to simulate blur check warning
    setIsBlurry(isQualityBlurry);

    setCapturedImages([...capturedImages, dataUrl]);
    setActiveImageIndex(capturedImages.length);
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleRetake = () => {
    if (activeImageIndex !== null) {
      const newImages = capturedImages.filter((_, idx) => idx !== activeImageIndex);
      setCapturedImages(newImages);
      setActiveImageIndex(newImages.length > 0 ? 0 : null);
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
        title: `Camera Scan ${new Date().toLocaleDateString()}`,
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
          <Camera className="w-7 h-7 text-teal-600" />
          <span>Mobile Camera Document Scanner</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Capture doctor prescriptions or reports directly using your device camera.
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
          <div className="relative rounded-2xl overflow-hidden bg-black aspect-[4/3] flex items-center justify-center border border-slate-800">
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
                <span className="text-xs text-white/80 font-semibold bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">
                  Position document within frame
                </span>
              </div>
            )}
          </div>

          {/* Blur / Quality Warning */}
          {isBlurry && activeImageIndex !== null && (
            <div className="bg-amber-50 dark:bg-amber-950/50 border-l-4 border-amber-500 p-3 rounded-r text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>⚠️ This document is difficult to read. Please take another photo with better lighting and keep camera steady.</span>
              </div>
            </div>
          )}

          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            {activeImageIndex === null ? (
              <button
                onClick={handleCapture}
                className="w-full py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-lg shadow-teal-600/25 flex items-center justify-center gap-2"
              >
                <Camera className="w-5 h-5" />
                <span>Capture Document Photo</span>
              </button>
            ) : (
              <>
                <div className="flex space-x-2">
                  <button
                    onClick={handleRotate}
                    className="p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5"
                  >
                    <RotateCw className="w-4 h-4" />
                    <span>Rotate</span>
                  </button>

                  <button
                    onClick={handleRetake}
                    className="p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-rose-600 text-xs font-semibold hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Retake</span>
                  </button>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => setActiveImageIndex(null)}
                    className="p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Page</span>
                  </button>

                  <button
                    disabled={isProcessing}
                    onClick={handleProcessScannedDocument}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md flex items-center gap-2"
                  >
                    {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    <span>{isProcessing ? 'Processing Scan...' : 'Analyze Document'}</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Captured Pages Gallery Thumbnails */}
          {capturedImages.length > 0 && (
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-slate-500">Captured Pages ({capturedImages.length})</span>
              <div className="flex space-x-3 overflow-x-auto pb-2">
                {capturedImages.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-16 h-20 rounded-lg overflow-hidden border-2 cursor-pointer shrink-0 ${
                      activeImageIndex === idx ? 'border-teal-500 ring-2 ring-teal-500/30' : 'border-slate-300'
                    }`}
                  >
                    <img src={img} alt={`Page ${idx + 1}`} className="w-full h-full object-cover" />
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
