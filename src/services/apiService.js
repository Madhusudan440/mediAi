/**
 * MediExplain AI - Frontend API Service Layer
 * Sends secure requests to the backend Express server endpoints (/api/*)
 */

const API_BASE = '/api';

async function handleResponse(response) {
  if (!response.ok) {
    let errorMsg = `HTTP Error ${response.status}`;
    try {
      const errJson = await response.json();
      errorMsg = errJson.details || errJson.error || errorMsg;
    } catch (e) {
      const text = await response.text();
      errorMsg = text || errorMsg;
    }
    throw new Error(errorMsg);
  }
  return await response.json();
}

/**
 * Analyzes OCR text or base64 image via /api/analyze
 */
export async function analyzeDocument(extractedText = '', imageBase64 = null, mimeType = 'image/jpeg') {
  const response = await fetch(`${API_BASE}/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      extractedText,
      imageBase64,
      mimeType
    })
  });
  const data = await handleResponse(response);
  return data.data;
}

/**
 * Sends chat queries with document context and prompt modifiers
 */
export async function sendChatMessage(userQuestion, reportContext = null, history = [], modifier = null) {
  const response = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      userQuestion,
      reportContext,
      history,
      modifier
    })
  });
  const data = await handleResponse(response);
  return data.answer;
}

/**
 * Explains a single medical term or snippet
 */
export async function explainMedicalTerm(term, context = '') {
  const response = await fetch(`${API_BASE}/explain`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      term,
      context
    })
  });
  const data = await handleResponse(response);
  return data.data;
}

/**
 * Translates document explanations or text into target language
 */
export async function translateText(content, targetLanguage) {
  const response = await fetch(`${API_BASE}/translate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      content,
      targetLanguage
    })
  });
  const data = await handleResponse(response);
  return data.translated;
}

/**
 * Generates executive doctor summary
 */
export async function generateSummary(documentData) {
  const response = await fetch(`${API_BASE}/summarize`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      documentData
    })
  });
  const data = await handleResponse(response);
  return data.summary;
}
