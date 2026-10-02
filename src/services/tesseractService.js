import { createWorker } from 'tesseract.js';

/**
 * MediExplain AI - Client-side OCR service using Tesseract.js
 * Performs OCR extraction directly in the user's browser with progress callbacks.
 */

export async function extractTextFromImage(imageFileOrBase64, onProgress = () => {}) {
  let worker = null;
  try {
    worker = await createWorker('eng');
    
    // Set logger if available
    onProgress({ status: 'Recognizing text...', progress: 0.3 });

    const ret = await worker.recognize(imageFileOrBase64);
    await worker.terminate();

    onProgress({ status: 'OCR Complete', progress: 1.0 });

    return {
      text: ret.data.text,
      confidence: Math.round(ret.data.confidence),
      lines: ret.data.lines ? ret.data.lines.map(l => l.text) : []
    };
  } catch (error) {
    console.error('Tesseract OCR error:', error);
    if (worker) {
      try { await worker.terminate(); } catch (e) {}
    }
    throw new Error('Failed to perform client OCR: ' + error.message);
  }
}
