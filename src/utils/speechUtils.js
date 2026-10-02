/**
 * MediAI - Browser Native Web Speech API Utilities
 * Provides browser-native Text-To-Speech (SpeechSynthesis) and Voice Input (SpeechRecognition)
 * with dedicated Indian Voice selection (Indian English & Indian Regional Locales).
 */

class TextToSpeechManager {
  constructor() {
    this.synth = typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null;
    this.utterance = null;
    this.voices = [];
    this.speaking = false;
    this.paused = false;

    if (this.synth) {
      this.loadVoices();
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  loadVoices() {
    if (this.synth) {
      this.voices = this.synth.getVoices();
    }
  }

  getVoices() {
    if ((!this.voices || this.voices.length === 0) && this.synth) {
      this.loadVoices();
    }
    return this.voices || [];
  }

  getBestIndianVoice(languageName = 'English') {
    const voices = this.getVoices();
    if (!voices || voices.length === 0) return null;

    const langCodeMap = {
      'English': 'en-in',
      'Hindi': 'hi-in',
      'Kannada': 'kn-in',
      'Tamil': 'ta-in',
      'Telugu': 'te-in',
      'Malayalam': 'ml-in',
      'Marathi': 'mr-in',
      'Bengali': 'bn-in'
    };
    const targetCode = langCodeMap[languageName] || 'en-in';

    // 1. Direct match by locale tag (e.g. en-IN, hi-IN)
    let match = voices.find(v => v.lang.toLowerCase().replace('_', '-').startsWith(targetCode));

    // 2. Search for any Indian voice (Microsoft Heera, Ravi, Veena, Neerja, Google English India)
    if (!match) {
      const indianKeywords = ['en-in', 'hi-in', 'kn-in', 'ta-in', 'te-in', 'ml-in', 'mr-in', 'bn-in', 'india', 'indian', 'hindi', 'heera', 'ravi', 'veena', 'neerja', 'kalpana'];
      match = voices.find(v => 
        indianKeywords.some(kw => 
          v.lang.toLowerCase().includes(kw) || 
          v.name.toLowerCase().includes(kw)
        )
      );
    }

    // 3. Fallback to standard English voice
    if (!match) {
      match = voices.find(v => v.lang.toLowerCase().startsWith('en')) || voices[0];
    }

    return match;
  }

  speak(text, options = {}) {
    if (!this.synth) {
      console.warn('Web SpeechSynthesis API is not supported in this browser.');
      return;
    }

    this.stop(); // Stop ongoing speech

    // Clean markdown symbols from text before speaking
    const cleanText = text
      .replace(/[#*`_~]/g, '')
      .replace(/\[.*?\]\(.*?\)/g, '')
      .replace(/\n\n/g, '. ');

    this.utterance = new SpeechSynthesisUtterance(cleanText);
    this.utterance.rate = options.rate || 0.95; // Clear natural rate for Indian voices
    this.utterance.pitch = options.pitch || 1.0;
    this.utterance.volume = options.volume || 1.0;

    const selectedVoice = options.voiceName 
      ? this.getVoices().find(v => v.name === options.voiceName) 
      : this.getBestIndianVoice(options.language || 'English');

    if (selectedVoice) {
      this.utterance.voice = selectedVoice;
      this.utterance.lang = selectedVoice.lang;
    } else {
      this.utterance.lang = 'en-IN';
    }

    this.utterance.onstart = () => {
      this.speaking = true;
      this.paused = false;
      if (options.onStart) options.onStart();
    };

    this.utterance.onend = () => {
      this.speaking = false;
      this.paused = false;
      if (options.onEnd) options.onEnd();
    };

    this.utterance.onerror = (e) => {
      this.speaking = false;
      this.paused = false;
      if (options.onError) options.onError(e);
    };

    this.synth.speak(this.utterance);
  }

  pause() {
    if (this.synth && this.speaking && !this.paused) {
      this.synth.pause();
      this.paused = true;
    }
  }

  resume() {
    if (this.synth && this.paused) {
      this.synth.resume();
      this.paused = false;
    }
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
      this.speaking = false;
      this.paused = false;
    }
  }
}

export const tts = new TextToSpeechManager();

/**
 * Voice Input (Speech Recognition) helper with Indian English default
 */
export function createSpeechRecognizer(onResult, onError, onEnd, languageName = 'English') {
  const SpeechRecognition = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
  
  if (!SpeechRecognition) {
    return null;
  }

  const langCodeMap = {
    'English': 'en-IN',
    'Hindi': 'hi-IN',
    'Kannada': 'kn-IN',
    'Tamil': 'ta-IN',
    'Telugu': 'te-IN',
    'Malayalam': 'ml-IN',
    'Marathi': 'mr-IN',
    'Bengali': 'bn-IN'
  };

  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.lang = langCodeMap[languageName] || 'en-IN';

  recognition.onresult = (event) => {
    let transcript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
    }
    const isFinal = event.results[event.results.length - 1].isFinal;
    onResult(transcript, isFinal);
  };

  recognition.onerror = (event) => {
    if (onError) onError(event.error);
  };

  recognition.onend = () => {
    if (onEnd) onEnd();
  };

  return recognition;
}
