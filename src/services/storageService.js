/**
 * MediExplain AI - Centralized LocalStorage Data Manager
 * NO DATABASE REQUIREMENT: Stores all user application data client-side in LocalStorage.
 * Never stores API keys or raw oversized binary PDF files permanently in LocalStorage.
 */

const KEYS = {
  DOCUMENTS: 'mediexplain_documents',
  CONVERSATIONS: 'mediexplain_conversations',
  SETTINGS: 'mediexplain_settings',
  BOOKMARKS: 'mediexplain_bookmarks',
  REMINDERS: 'mediexplain_reminders',
  PROFILE: 'mediexplain_profile'
};

// Helper: safe JSON parse
const getItem = (key, fallback) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (err) {
    console.error(`LocalStorage getItem error for key ${key}:`, err);
    return fallback;
  }
};

// Helper: safe JSON stringify
const setItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`LocalStorage setItem error for key ${key}:`, err);
  }
};

// ==================== DOCUMENTS ====================
export const getDocuments = (profileId = null) => {
  const docs = getItem(KEYS.DOCUMENTS, []).filter(d => !d.id || !d.id.startsWith('demo_'));
  if (profileId) {
    return docs.filter(d => d.profileId === profileId);
  }
  return docs;
};

export const getDocument = (id) => {
  const docs = getDocuments();
  return docs.find(d => d.id === id) || null;
};

export const saveDocument = (docData) => {
  const docs = getDocuments();
  const newDoc = {
    id: docData.id || `doc_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    title: docData.title || docData.documentType || 'Medical Report',
    documentType: docData.documentType || 'Other',
    confidenceScore: docData.confidenceScore || 90,
    patientName: docData.patientName || 'Patient',
    doctorName: docData.doctorName || 'Doctor',
    hospitalName: docData.hospitalName || '',
    date: docData.date || new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    profileId: docData.profileId || getActiveProfile().id,
    overview: docData.overview || '',
    explanations: docData.explanations || {},
    tests: docData.tests || [],
    medicines: docData.medicines || [],
    medicalTerms: docData.medicalTerms || [],
    doctorQuestions: docData.doctorQuestions || [],
    followUp: docData.followUp || null,
    uncertainties: docData.uncertainties || [],
    extractedText: docData.extractedText || ''
  };

  const updatedDocs = [newDoc, ...docs.filter(d => d.id !== newDoc.id)];
  setItem(KEYS.DOCUMENTS, updatedDocs);
  return newDoc;
};

export const updateDocument = (id, updates) => {
  const docs = getDocuments();
  const index = docs.findIndex(d => d.id === id);
  if (index !== -1) {
    docs[index] = { ...docs[index], ...updates, updatedAt: new Date().toISOString() };
    setItem(KEYS.DOCUMENTS, docs);
    return docs[index];
  }
  return null;
};

export const deleteDocument = (id) => {
  const docs = getDocuments();
  const filtered = docs.filter(d => d.id !== id);
  setItem(KEYS.DOCUMENTS, filtered);
  // Also clean up conversation for this doc
  deleteConversation(id);
  return true;
};

// ==================== CONVERSATIONS ====================
export const getConversation = (docId) => {
  const convs = getItem(KEYS.CONVERSATIONS, {});
  return convs[docId] || [];
};

export const saveConversation = (docId, messages) => {
  const convs = getItem(KEYS.CONVERSATIONS, {});
  convs[docId] = messages;
  setItem(KEYS.CONVERSATIONS, convs);
};

export const deleteConversation = (docId) => {
  const convs = getItem(KEYS.CONVERSATIONS, {});
  delete convs[docId];
  setItem(KEYS.CONVERSATIONS, convs);
};

// ==================== BOOKMARKS ====================
export const getBookmarks = () => {
  return getItem(KEYS.BOOKMARKS, []);
};

export const saveBookmark = (bookmark) => {
  const bookmarks = getBookmarks();
  const newBm = {
    id: bookmark.id || `bm_${Date.now()}`,
    type: bookmark.type || 'term', // 'term', 'test', 'medicine', 'question'
    title: bookmark.title,
    content: bookmark.content,
    docId: bookmark.docId || null,
    createdAt: new Date().toISOString()
  };
  const updated = [newBm, ...bookmarks.filter(b => b.id !== newBm.id)];
  setItem(KEYS.BOOKMARKS, updated);
  return newBm;
};

export const deleteBookmark = (id) => {
  const bookmarks = getBookmarks();
  setItem(KEYS.BOOKMARKS, bookmarks.filter(b => b.id !== id));
};

// ==================== REMINDERS ====================
export const getReminders = () => {
  return getItem(KEYS.REMINDERS, []);
};

export const saveReminder = (reminder) => {
  const reminders = getReminders();
  const newRem = {
    id: reminder.id || `rem_${Date.now()}`,
    title: reminder.title,
    date: reminder.date,
    time: reminder.time || '09:00',
    type: reminder.type || 'Follow-up', // 'Follow-up', 'Repeat Test', 'Medication'
    notes: reminder.notes || '',
    completed: false,
    createdAt: new Date().toISOString()
  };
  const updated = [newRem, ...reminders.filter(r => r.id !== newRem.id)];
  setItem(KEYS.REMINDERS, updated);
  return newRem;
};

export const deleteReminder = (id) => {
  const reminders = getReminders();
  setItem(KEYS.REMINDERS, reminders.filter(r => r.id !== id));
};

// ==================== SETTINGS ====================
export const getSettings = () => {
  return getItem(KEYS.SETTINGS, {
    theme: 'light', // 'light' or 'dark'
    highContrast: false,
    easyReading: false,
    fontSize: 'normal', // 'normal', 'large', 'xlarge'
    speechVoice: 'default',
    speechRate: 1.0,
    language: 'English'
  });
};

export const saveSettings = (newSettings) => {
  const current = getSettings();
  const updated = { ...current, ...newSettings };
  setItem(KEYS.SETTINGS, updated);
  return updated;
};

// ==================== FAMILY PROFILES ====================
const DEFAULT_PROFILES = [
  { id: 'prof_self', name: 'My Profile', relation: 'Self', avatar: '👤' },
  { id: 'prof_father', name: 'Father', relation: 'Parent', avatar: '👴' },
  { id: 'prof_mother', name: 'Mother', relation: 'Parent', avatar: '👵' },
  { id: 'prof_child', name: 'Child', relation: 'Dependant', avatar: '🧒' }
];

export const getProfiles = () => {
  return getItem(KEYS.PROFILE + '_list', DEFAULT_PROFILES);
};

export const saveProfile = (profile) => {
  const list = getProfiles();
  const newProf = {
    id: profile.id || `prof_${Date.now()}`,
    name: profile.name,
    relation: profile.relation || 'Other',
    avatar: profile.avatar || '👤'
  };
  const updated = [...list, newProf];
  setItem(KEYS.PROFILE + '_list', updated);
  return newProf;
};

export const getActiveProfile = () => {
  const activeId = getItem(KEYS.PROFILE + '_active', 'prof_self');
  const profiles = getProfiles();
  return profiles.find(p => p.id === activeId) || profiles[0];
};

export const setActiveProfile = (id) => {
  setItem(KEYS.PROFILE + '_active', id);
};

// ==================== PURGE & STORAGE INFO ====================
export const getStorageStats = () => {
  let totalBytes = 0;
  for (let x in localStorage) {
    if (localStorage.hasOwnProperty(x)) {
      totalBytes += (localStorage[x].length + x.length) * 2;
    }
  }
  return {
    kb: (totalBytes / 1024).toFixed(2),
    mb: (totalBytes / (1024 * 1024)).toFixed(2),
    docCount: getDocuments().length,
    bookmarkCount: getBookmarks().length,
    reminderCount: getReminders().length
  };
};

export const clearAllData = () => {
  Object.values(KEYS).forEach(k => localStorage.removeItem(k));
  localStorage.removeItem(KEYS.PROFILE + '_list');
  localStorage.removeItem(KEYS.PROFILE + '_active');
  return true;
};
