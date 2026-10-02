import express from 'express';
import multer from 'multer';
import { analyzeDocumentText, chatWithAi, explainTerm, translateContent } from '../services/geminiService.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 15 * 1024 * 1024 } });

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'MediExplain AI Backend',
    model: process.env.AI_MODEL || 'gemini-2.5-flash',
    timestamp: new Date().toISOString()
  });
});

// POST /api/analyze
router.post('/analyze', upload.single('file'), async (req, res) => {
  try {
    const extractedText = req.body.extractedText || '';
    let imageBase64 = req.body.imageBase64 || null;
    let mimeType = req.body.mimeType || 'image/jpeg';

    if (req.file) {
      imageBase64 = req.file.buffer.toString('base64');
      mimeType = req.file.mimetype;
    }

    if (!extractedText && !imageBase64) {
      return res.status(400).json({ error: 'Please provide either document text or an image file to analyze.' });
    }

    const result = await analyzeDocumentText(extractedText, imageBase64, mimeType);
    return res.json({ success: true, data: result });
  } catch (error) {
    console.error('API /api/analyze Error:', error);
    return res.status(500).json({
      error: 'Failed to analyze medical document.',
      details: error.message
    });
  }
});

// POST /api/chat
router.post('/chat', async (req, res) => {
  try {
    const { userQuestion, reportContext, history, modifier } = req.body;
    if (!userQuestion || typeof userQuestion !== 'string') {
      return res.status(400).json({ error: 'userQuestion string is required.' });
    }

    const answer = await chatWithAi(userQuestion, reportContext, history || [], modifier);
    return res.json({ success: true, answer });
  } catch (error) {
    console.error('API /api/chat Error:', error);
    return res.status(500).json({
      error: 'AI Chat assistant encountered an error.',
      details: error.message
    });
  }
});

// POST /api/explain
router.post('/explain', async (req, res) => {
  try {
    const { term, context } = req.body;
    if (!term) {
      return res.status(400).json({ error: 'Medical term is required.' });
    }

    const explanation = await explainTerm(term, context || '');
    return res.json({ success: true, data: explanation });
  } catch (error) {
    console.error('API /api/explain Error:', error);
    return res.status(500).json({
      error: 'Failed to generate term explanation.',
      details: error.message
    });
  }
});

// POST /api/translate
router.post('/translate', async (req, res) => {
  try {
    const { content, targetLanguage } = req.body;
    if (!content || !targetLanguage) {
      return res.status(400).json({ error: 'content and targetLanguage are required.' });
    }

    const translated = await translateContent(content, targetLanguage);
    return res.json({ success: true, translated });
  } catch (error) {
    console.error('API /api/translate Error:', error);
    return res.status(500).json({
      error: 'Failed to translate content.',
      details: error.message
    });
  }
});

// POST /api/summarize
router.post('/summarize', async (req, res) => {
  try {
    const { documentData } = req.body;
    if (!documentData) {
      return res.status(400).json({ error: 'documentData is required.' });
    }

    const prompt = `Create a executive, 1-page summary of this medical report suitable for a doctor's quick review.

Include:
- Key Diagnosis/Findings
- Out-of-range Lab Results
- Medicines Prescribed
- Suggested Follow-up Actions

Document Data:
${JSON.stringify(documentData, null, 2)}`;

    const answer = await chatWithAi(prompt, documentData, []);
    return res.json({ success: true, summary: answer });
  } catch (error) {
    console.error('API /api/summarize Error:', error);
    return res.status(500).json({
      error: 'Failed to generate document summary.',
      details: error.message
    });
  }
});

export default router;
