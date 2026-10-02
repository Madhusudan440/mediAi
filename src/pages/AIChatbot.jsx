import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  Sparkles, 
  Bot, 
  User, 
  Trash2, 
  Loader2, 
  FileText,
  Lightbulb,
  Activity
} from 'lucide-react';
import { getDocuments, getConversation, saveConversation, deleteConversation } from '../services/storageService';
import { sendChatMessage } from '../services/apiService';
import { tts, createSpeechRecognizer } from '../utils/speechUtils';

export function FormattedMessage({ text }) {
  if (!text) return null;

  const lines = text.split('\n');
  const elements = [];
  let currentList = [];

  const flushList = () => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={`ul_${elements.length}`} className="my-2 space-y-2 pl-1">
          {currentList.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5 leading-relaxed text-xs sm:text-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 mt-2 shrink-0 shadow-xs" />
              <div className="flex-1 text-slate-800 dark:text-slate-200">{renderInline(item)}</div>
            </li>
          ))}
        </ul>
      );
      currentList = [];
    }
  };

  const renderInline = (str) => {
    if (!str) return null;
    const parts = [];
    const regex = /\*\*(.*?)\*\*/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(str)) !== null) {
      if (match.index > lastIndex) {
        const plain = str.substring(lastIndex, match.index).replace(/\*/g, '');
        if (plain) parts.push(plain);
      }
      parts.push(
        <strong key={match.index} className="font-bold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-xs sm:text-sm">
          {match[1].replace(/\*/g, '')}
        </strong>
      );
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < str.length) {
      const remaining = str.substring(lastIndex).replace(/\*/g, '');
      if (remaining) parts.push(remaining);
    }

    return parts.length > 0 ? parts : str.replace(/\*/g, '');
  };

  lines.forEach((line, lineIndex) => {
    const trimmed = line.trim();
    const bulletMatch = trimmed.match(/^([\*\-\•]|\d+\.)\s+(.*)/);

    if (bulletMatch) {
      currentList.push(bulletMatch[2]);
    } else {
      flushList();
      if (!trimmed) return;

      if (trimmed.startsWith('#')) {
        const headingText = trimmed.replace(/^#+\s*/, '');
        elements.push(
          <h4 key={lineIndex} className="font-extrabold text-sm sm:text-base text-blue-600 dark:text-blue-400 mt-3 mb-1.5 flex items-center gap-2">
            <span>{renderInline(headingText)}</span>
          </h4>
        );
      } else if (trimmed.startsWith('⚠️')) {
        elements.push(
          <div key={lineIndex} className="my-2.5 p-3 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs font-semibold leading-relaxed">
            {renderInline(trimmed)}
          </div>
        );
      } else {
        elements.push(
          <p key={lineIndex} className="my-1.5 leading-relaxed text-xs sm:text-sm text-slate-800 dark:text-slate-200">
            {renderInline(trimmed)}
          </p>
        );
      }
    }
  });

  flushList();

  return <div className="space-y-1">{elements}</div>;
}

export function AIChatbot({ activeDocId }) {
  const [documents, setDocuments] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState(activeDocId || '');
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState(null);

  const messagesEndRef = useRef(null);
  const recognizerRef = useRef(null);

  useEffect(() => {
    const docs = getDocuments();
    setDocuments(docs);
    if (!selectedDocId && docs.length > 0) {
      setSelectedDocId(docs[0].id);
    }
  }, []);

  useEffect(() => {
    if (selectedDocId) {
      const history = getConversation(selectedDocId);
      setMessages(history);
    } else {
      const generalHistory = getConversation('general_health');
      setMessages(generalHistory);
    }
  }, [selectedDocId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const activeDoc = documents.find(d => d.id === selectedDocId) || null;

  const handleSendMessage = async (textToSend = inputText, modifier = null) => {
    const text = textToSend.trim();
    if (!text || isLoading) return;

    const userMsg = { id: `msg_${Date.now()}`, role: 'user', text, timestamp: new Date().toISOString() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputText('');
    setIsLoading(true);

    try {
      const aiAnswer = await sendChatMessage(text, activeDoc, updatedMessages, modifier);
      const aiMsg = { id: `msg_${Date.now() + 1}`, role: 'assistant', text: aiAnswer, timestamp: new Date().toISOString() };
      
      const newHistory = [...updatedMessages, aiMsg];
      setMessages(newHistory);
      
      const key = selectedDocId || 'general_health';
      saveConversation(key, newHistory);
    } catch (err) {
      console.error(err);
      const errorMsg = { id: `msg_${Date.now() + 1}`, role: 'assistant', text: '⚠️ AI assistant encountered an error. Please try asking again.', timestamp: new Date().toISOString() };
      setMessages([...updatedMessages, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleVoice = () => {
    if (isListening) {
      if (recognizerRef.current) recognizerRef.current.stop();
      setIsListening(false);
    } else {
      const rec = createSpeechRecognizer(
        (transcript, isFinal) => {
          setInputText(transcript);
          if (isFinal) {
            setIsListening(false);
          }
        },
        (err) => console.warn('Speech recognition error:', err),
        () => setIsListening(false)
      );

      if (rec) {
        recognizerRef.current = rec;
        rec.start();
        setIsListening(true);
      } else {
        alert('Voice input is not supported in this browser. Try Chrome or Edge.');
      }
    }
  };

  const handleSpeakMessage = (msgId, rawText) => {
    if (speakingMessageId === msgId) {
      tts.stop();
      setSpeakingMessageId(null);
    } else {
      setSpeakingMessageId(msgId);
      const cleanAudioText = rawText.replace(/\*/g, '');
      tts.speak(cleanAudioText, {
        onEnd: () => setSpeakingMessageId(null),
        onError: () => setSpeakingMessageId(null)
      });
    }
  };

  const handleClearHistory = () => {
    const key = selectedDocId || 'general_health';
    deleteConversation(key);
    setMessages([]);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden transition-colors">
      
      {/* Top Context Header */}
      <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-xs">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>MediAI Assistant</span>
              <span className="text-[9px] uppercase font-mono font-bold bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-500/30">
                Context Active
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {activeDoc ? `Loaded: ${activeDoc.title || activeDoc.documentType}` : 'General Medical & Wellness Mode'}
            </p>
          </div>
        </div>

        {/* Document Switcher Dropdown */}
        <div className="flex items-center space-x-2">
          <select
            value={selectedDocId}
            onChange={(e) => setSelectedDocId(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold focus:outline-none focus:border-blue-500 shadow-xs"
          >
            <option value="">🌐 General Health Assistant</option>
            {documents.map(d => (
              <option key={d.id} value={d.id}>
                📄 {d.title || d.documentType} ({d.date})
              </option>
            ))}
          </select>

          {messages.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              title="Clear chat history"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/50 dark:bg-slate-950/60">
        
        {messages.length === 0 && (
          <div className="text-center py-12 space-y-4 max-w-md mx-auto">
            <div className="w-14 h-14 mx-auto rounded-3xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-sm">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-base">
              Ask Anything Medical or Health Related
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Ask follow-up questions about your uploaded medical report or general wellness questions like sleep, nutrition, or blood pressure.
            </p>

            {/* Quick Suggestion Chips */}
            <div className="pt-2 flex flex-wrap justify-center gap-2">
              {[
                'What does my report say?',
                'Explain more simply',
                'Explain like I\'m 10',
                'What questions can I ask my doctor?',
                'How can I improve my sleep & energy?',
                'What foods help lower blood pressure?'
              ].map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(chip)}
                  className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all text-left shadow-xs"
                >
                  💡 {chip}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-2 duration-200`}
            >
              <div className={`w-8 h-8 rounded-2xl flex items-center justify-center text-xs font-bold shrink-0 ${
                isUser ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-blue-600 dark:text-blue-400'
              }`}>
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-3xl text-xs sm:text-sm shadow-sm leading-relaxed ${
                isUser 
                  ? 'bg-blue-600 text-white rounded-tr-none font-semibold' 
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none space-y-3'
              }`}>
                {isUser ? (
                  <div className="whitespace-pre-wrap">{msg.text.replace(/\*/g, '')}</div>
                ) : (
                  <FormattedMessage text={msg.text} />
                )}

                {!isUser && (
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                    <button
                      type="button"
                      onClick={() => handleSpeakMessage(msg.id, msg.text)}
                      className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 font-bold hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-all border border-blue-200 dark:border-blue-500/30"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                      <span>{speakingMessageId === msg.id ? 'Stop Speaking' : 'Read Aloud'}</span>
                    </button>
                    <span className="font-mono text-[10px]">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center space-x-3 text-slate-400 py-2">
            <div className="w-8 h-8 rounded-2xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Bot className="w-4 h-4 animate-bounce" />
            </div>
            <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs flex items-center gap-2 text-slate-700 dark:text-slate-300 shadow-xs">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600 dark:text-blue-400" />
              <span>MediAI is thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-3 sm:p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0">
        
        {/* Voice active animation bar */}
        {isListening && (
          <div className="mb-2 px-4 py-2 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs flex items-center justify-between">
            <span className="font-semibold flex items-center gap-2">
              <Mic className="w-4 h-4 text-rose-500 animate-pulse" />
              <span>Listening to your voice... Speak now</span>
            </span>
            <div className="flex items-center gap-1 h-5">
              <div className="w-1 bg-rose-500 rounded-full animate-voice-bar-1" />
              <div className="w-1 bg-rose-500 rounded-full animate-voice-bar-2" />
              <div className="w-1 bg-rose-500 rounded-full animate-voice-bar-3" />
              <div className="w-1 bg-rose-500 rounded-full animate-voice-bar-4" />
            </div>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <button
            type="button"
            onClick={handleToggleVoice}
            className={`p-3 rounded-2xl border transition-all ${
              isListening
                ? 'bg-rose-600 text-white border-rose-600 animate-pulse'
                : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title={isListening ? "Listening... Click to stop" : "Voice Input"}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={isListening ? "Listening to your voice..." : "Ask any health or report question..."}
            className="flex-1 px-4 py-3 text-xs sm:text-sm rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600 dark:focus:border-blue-500"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-2xl shadow-md shadow-blue-500/20 hover:scale-105 transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>

    </div>
  );
}
