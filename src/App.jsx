import React, { useState, useEffect } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';

// Pages
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { DocumentUpload } from './pages/DocumentUpload';
import { CameraScanner } from './pages/CameraScanner';
import { ReportView } from './pages/ReportView';
import { AIChatbot } from './pages/AIChatbot';
import { ReportCompare } from './pages/ReportCompare';
import { MedicalTimeline } from './pages/MedicalTimeline';
import { MedicinesAndTests } from './pages/MedicinesAndTests';
import { RemindersAndBookmarks } from './pages/RemindersAndBookmarks';
import { PrivacyCenter } from './pages/PrivacyCenter';
import { MyDocuments } from './pages/MyDocuments';

function MainAppContent() {
  const [activeTab, setActiveTab] = useState('landing');
  const [selectedDocId, setSelectedDocId] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { settings } = useTheme();

  // Browser Back Button & History Management (One-step back navigation)
  useEffect(() => {
    // Initialize initial history state
    window.history.replaceState({ tab: 'landing', docId: null }, '', '#landing');

    const handlePopState = (event) => {
      if (event.state && event.state.tab) {
        setActiveTab(event.state.tab);
        if (event.state.docId) {
          setSelectedDocId(event.state.docId);
        }
      } else {
        // Step back to landing page if state is empty
        setActiveTab('landing');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Custom navigate function that pushes state to browser history
  const navigateTo = (newTab, docId = null) => {
    if (docId) setSelectedDocId(docId);
    if (newTab !== activeTab) {
      window.history.pushState({ tab: newTab, docId: docId || selectedDocId }, '', `#${newTab}`);
      setActiveTab(newTab);
    }
  };

  const renderPage = () => {
    switch (activeTab) {
      case 'landing':
        return <LandingPage onNavigate={navigateTo} onSelectDocument={setSelectedDocId} />;
      case 'dashboard':
        return <Dashboard onNavigate={navigateTo} onSelectDocument={setSelectedDocId} />;
      case 'upload':
        return <DocumentUpload onNavigate={navigateTo} onSelectDocument={setSelectedDocId} />;
      case 'scan':
        return <CameraScanner onNavigate={navigateTo} onSelectDocument={setSelectedDocId} />;
      case 'documents':
        return <MyDocuments onNavigate={navigateTo} onSelectDocument={setSelectedDocId} />;
      case 'report':
        return <ReportView documentId={selectedDocId} onNavigate={navigateTo} />;
      case 'compare':
        return <ReportCompare />;
      case 'timeline':
        return <MedicalTimeline onNavigate={navigateTo} onSelectDocument={setSelectedDocId} />;
      case 'chat':
        return <AIChatbot activeDocId={selectedDocId} />;
      case 'medicines':
        return <MedicinesAndTests />;
      case 'reminders':
        return <RemindersAndBookmarks />;
      case 'privacy':
        return <PrivacyCenter onNavigate={navigateTo} />;
      default:
        return <LandingPage onNavigate={navigateTo} onSelectDocument={setSelectedDocId} />;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors ${
      settings.easyReading ? 'easy-reading-mode' : ''
    }`}>
      
      {/* Top Navbar */}
      <Navbar
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      {/* Main Body with Sidebar */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={navigateTo}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />

        {/* Dynamic Page Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto mb-16 md:mb-0">
          {renderPage()}
        </main>
      </div>

    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <MainAppContent />
      </LanguageProvider>
    </ThemeProvider>
  );
}
