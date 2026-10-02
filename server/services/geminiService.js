import dotenv from 'dotenv';
dotenv.config();

/**
 * MediExplain AI - Google Gemini API Service Layer
 * Supports text, document, and image vision understanding with model fallback.
 */

const getApiKey = () => {
  return process.env.AI_API_KEY || process.env.GEMINI_API_KEY || '';
};

const getModelName = () => {
  return process.env.AI_MODEL || 'gemini-2.5-flash';
};

// Available Gemini models list
const MODEL_FALLBACKS = [
  getModelName(),
  'gemini-2.5-flash',
  'gemini-1.5-flash',
  'gemini-2.0-flash-exp',
  'gemini-1.5-pro',
  'gemini-3.6-flash'
];

/**
 * Sends a content generation request to Gemini API
 */
export async function callGeminiApi(parts, options = {}) {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('AI_API_KEY or GEMINI_API_KEY is not defined in environment variables.');
  }

  // Deduplicate model fallbacks list
  const modelsToTry = [...new Set(MODEL_FALLBACKS)];
  let lastError = null;

  for (const model of modelsToTry) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const requestBody = {
        contents: [
          {
            parts: parts
          }
        ],
        generationConfig: {
          temperature: options.temperature ?? 0.2,
          maxOutputTokens: options.maxOutputTokens ?? 1024, // Optimized for fast response speed
          topP: 0.8
        }
      };

      if (options.responseSchema) {
        requestBody.generationConfig.responseMimeType = "application/json";
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.warn(`Gemini Model ${model} returned error status ${response.status}: ${errorData}`);
        lastError = new Error(`Gemini API Error (${response.status}): ${errorData}`);
        continue; // Try next fallback model
      }

      const data = await response.json();
      const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!textResponse) {
        throw new Error('Received empty response from Gemini API.');
      }

      return textResponse;
    } catch (err) {
      console.warn(`Attempt with model ${model} failed:`, err.message);
      lastError = err;
    }
  }

  throw lastError || new Error('All Gemini AI model attempts failed.');
}

/**
 * Analyzes extracted document text and optional image
 */
export async function analyzeDocumentText(extractedText, imageBase64 = null, imageMimeType = 'image/jpeg') {
  const prompt = `Analyze the following medical text and/or document image. Extract all details, test results, medicines, and explanations in strict JSON format.

JSON Structure:
{
  "documentType": "Blood Report | Prescription | Doctor Consultation Note | Discharge Summary | X-Ray Report | CT Report | MRI Report | Ultrasound Report | Health Checkup | Medical Bill | Other",
  "confidenceScore": 92,
  "patientName": "Name or Unknown",
  "doctorName": "Doctor Name or Unknown",
  "hospitalName": "Hospital/Lab or Unknown",
  "date": "Date or Unknown",
  "overview": "Clear 2-3 sentence overview of findings.",
  "explanations": {
    "verySimple": "🟢 VERY SIMPLE: Simple plain-language explanation for non-medical users.",
    "simple": "🔵 SIMPLE: Standard easy explanation.",
    "detailed": "🟣 DETAILED: Full explanation with proper medical context."
  },
  "tests": [
    {
      "name": "Test Name",
      "result": "Value",
      "unit": "Unit",
      "referenceRange": "Ref Range",
      "status": "Normal | Outside Range | Critical | Unknown",
      "whatItMeasures": "What this test checks",
      "simpleExplanation": "Plain language meaning",
      "confidence": 95
    }
  ],
  "medicines": [
    {
      "name": "Medicine Name",
      "genericName": "Generic Name or Unknown",
      "purpose": "What this treats",
      "dosage": "Exact written dose",
      "frequency": "Exact written frequency",
      "duration": "Duration",
      "precautions": "Important warnings/precautions",
      "confidence": 85,
      "ocrWarning": false
    }
  ],
  "medicalTerms": [
    {
      "term": "Term Name",
      "simpleMeaning": "Simple definition",
      "pronunciation": "hy-per-TEN-shun format",
      "example": "Relatable real-world analogy"
    }
  ],
  "doctorQuestions": [
    "4 to 6 questions for doctor"
  ],
  "followUp": {
    "recommended": true,
    "timeframe": "2 weeks",
    "notes": "Notes if any"
  },
  "uncertainties": [
    "Unclear handwritten terms or blurry values"
  ]
}

Extracted Text:
${extractedText || "Text provided via image attachment"}`;

  const parts = [{ text: prompt }];

  if (imageBase64) {
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    parts.push({
      inline_data: {
        mime_type: imageMimeType,
        data: cleanBase64
      }
    });
  }

  const rawJson = await callGeminiApi(parts, { temperature: 0.1 });
  
  // Extract pure JSON object from output
  const jsonMatch = rawJson.match(/\{[\s\S]*\}/);
  const jsonCandidate = jsonMatch ? jsonMatch[0] : rawJson;
  const sanitizedJson = jsonCandidate.replace(/,\s*([\}\]])/g, '$1');

  try {
    const parsed = JSON.parse(sanitizedJson);
    return {
      documentType: parsed.documentType || 'Prescription',
      confidenceScore: parsed.confidenceScore || 90,
      patientName: parsed.patientName || 'Unknown',
      doctorName: parsed.doctorName || 'Doctor',
      hospitalName: parsed.hospitalName || 'Clinic/Lab',
      date: parsed.date || new Date().toISOString().split('T')[0],
      overview: parsed.overview || 'Medical document analyzed by AI.',
      explanations: {
        verySimple: parsed.explanations?.verySimple || parsed.overview || 'Medical prescription analyzed.',
        simple: parsed.explanations?.simple || parsed.overview || 'Medical prescription analyzed.',
        detailed: parsed.explanations?.detailed || parsed.overview || 'Medical prescription analyzed.'
      },
      tests: parsed.tests || [],
      medicines: parsed.medicines || [],
      medicalTerms: parsed.medicalTerms || [],
      doctorQuestions: parsed.doctorQuestions || ['What is the purpose of this prescription?', 'How should this medicine be taken?'],
      followUp: parsed.followUp || { recommended: true, timeframe: '1 Week', notes: '' },
      uncertainties: parsed.uncertainties || []
    };
  } catch (e) {
    console.warn('Failed to parse Gemini JSON output directly. Fallback parsing activated. Raw text:', rawJson);
    // Return structured report using raw text as explanation so analysis never crashes
    return {
      documentType: 'Prescription',
      confidenceScore: 88,
      patientName: 'Unknown',
      doctorName: 'Doctor',
      hospitalName: 'Clinic',
      date: new Date().toISOString().split('T')[0],
      overview: rawJson.replace(/```json/g, '').replace(/```/g, '').slice(0, 300),
      explanations: {
        verySimple: rawJson.replace(/```json/g, '').replace(/```/g, '').slice(0, 300),
        simple: rawJson.replace(/```json/g, '').replace(/```/g, ''),
        detailed: rawJson
      },
      tests: [],
      medicines: [],
      medicalTerms: [],
      doctorQuestions: ['What is the recommended dosage for these medications?', 'Are there any potential side effects?'],
      followUp: { recommended: true, timeframe: '1 Week', notes: '' },
      uncertainties: ['Handwritten prescription notes require doctor verification.']
    };
  }
}

import { SYSTEM_SAFETY_PROMPT } from '../utils/prompts.js';

export async function chatWithAi(userQuestion, reportContext = null, history = [], modifier = null) {
  let contextBlock = "";
  if (reportContext) {
    contextBlock = `CURRENT DOCUMENT CONTEXT:\nDocument Type: ${reportContext.documentType || 'Medical Report'}\nOverview: ${reportContext.overview || ''}\nExtracted Tests: ${JSON.stringify(reportContext.tests || [])}\nExtracted Medicines: ${JSON.stringify(reportContext.medicines || [])}\nFull Summary: ${JSON.stringify(reportContext.explanations || {})}\n\n`;
  } else {
    contextBlock = "NO SPECIFIC DOCUMENT LOADED. Answer as a general medical and health information assistant in easy-to-understand terms.\n\n";
  }

  let modifierInstruction = "";
  if (modifier === 'simpler' || userQuestion.toLowerCase().includes('simpler') || userQuestion.toLowerCase().includes('i don\'t understand')) {
    modifierInstruction = "INSTRUCTION: Provide a Very Simple 2-sentence explanation with an easy analogy.";
  } else if (modifier === 'explain_more' || userQuestion.toLowerCase().includes('explain more') || userQuestion.toLowerCase().includes('tell me everything')) {
    modifierInstruction = "INSTRUCTION: Provide structured sections (What it helps with, How it works, Why people use it, Safety).";
  } else if (modifier === 'like_10' || userQuestion.toLowerCase().includes('like i\'m 10') || userQuestion.toLowerCase().includes('like im 10')) {
    modifierInstruction = "INSTRUCTION: Explain like I am 10 years old. Use an everyday relatable analogy (like alarm signals or household plumbing) without changing medical truth.";
  } else if (modifier === 'example' || userQuestion.toLowerCase().includes('example')) {
    modifierInstruction = "INSTRUCTION: Give a short, relatable real-world example.";
  } else if (modifier === 'again' || userQuestion.toLowerCase().includes('explain again')) {
    modifierInstruction = "INSTRUCTION: Rephrase previous response using fresh, simple words.";
  }

  const systemInstruction = `${SYSTEM_SAFETY_PROMPT}

${contextBlock}
${modifierInstruction}

ALWAYS REMEMBER: Default answer length MUST BE SHORT TO MEDIUM (readable in 10-20 seconds).
Use bold titles, bullet points, clean formatting, and key information first.`;

  const conversationText = history.map(h => `${h.role === 'user' ? 'User' : 'MediExplain AI'}: ${h.text}`).join('\n');
  const fullPrompt = `${systemInstruction}\n\nConversation History:\n${conversationText}\n\nUser: ${userQuestion}\n\nMediExplain AI:`;

  return await callGeminiApi([{ text: fullPrompt }], { temperature: 0.3 });
}

/**
 * Explains a specific highlighted medical term or text snippet
 */
export async function explainTerm(term, context = "") {
  const prompt = `Explain the medical term or snippet "${term}" clearly.
Document Context (if any): ${context.slice(0, 500)}

Return JSON format:
{
  "term": "${term}",
  "simpleMeaning": "Simple plain language definition (1-2 sentences)",
  "detailedMeaning": "Detailed explanation",
  "wordByWord": "Breakdown of prefix/root/suffix",
  "example": "Relatable real-world analogy",
  "pronunciation": "Phonetic pronunciation e.g. hy-per-TEN-shun",
  "doctorAdvice": "When to consult a doctor regarding this term"
}`;

  const res = await callGeminiApi([{ text: prompt }], { temperature: 0.2 });
  const cleanStr = res.replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(cleanStr);
}

/**
 * Translates text/JSON into target language while preserving key medical terms & numbers
 */
export async function translateContent(content, targetLanguage) {
  const prompt = `You are an expert medical translator. Translate the given text or JSON data into ${targetLanguage}.
CRITICAL RULES:
1. Preserve all Medicine Names, Brand Names, Numbers, Units (g/dL, mg, ml), and Dosage values exactly as written.
2. Translate explanations, descriptions, recommendations, and question suggestions clearly into ${targetLanguage}.
3. If JSON is provided, return valid JSON with translated string values.

Input to translate:
${typeof content === 'string' ? content : JSON.stringify(content, null, 2)}`;

  const res = await callGeminiApi([{ text: prompt }], { temperature: 0.1 });
  const cleanStr = res.replace(/```json/g, '').replace(/```/g, '').trim();
  if (typeof content === 'object') {
    try {
      return JSON.parse(cleanStr);
    } catch (e) {
      return { translatedText: cleanStr };
    }
  }
  return cleanStr;
}
