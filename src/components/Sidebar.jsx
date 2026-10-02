import React from 'react';
import { 
  Home, 
  UploadCloud, 
  Camera, 
  FileText, 
  BarChart3, 
  Calendar, 
  MessageSquare, 
  Pill, 
  Bell, 
  ShieldCheck, 
  Sparkles 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export function Sidebar({ activeTab, setActiveTab, isMobileMenuOpen, setIsMobileMenuOpen }) {
  const { t } = useLanguage();

  const navItems = [
    { id: 'dashboard', label: t('dashboard'), icon: Home },
    { id: 'upload', label: t('upload'), icon: UploadCloud, highlight: true },
    { id: 'scan', label: t('scan'), icon: Camera },
    { id: 'documents', label: t('documents'), icon: FileText },
    { id: 'compare', label: t('compare'), icon: BarChart3 },
    { id: 'timeline', label: t('timeline'), icon: Calendar },
    { id: 'chat', label: t('chat'), icon: MessageSquare },
    { id: 'medicines', label: t('medicines'), icon: Pill },
    { id: 'reminders', label: t('reminders'), icon: Bell },
    { id: 'privacy', label: t('privacy'), icon: ShieldCheck }
  ];

  const mobileNavItems = [
    { id: 'dashboard', label: t('dashboard'), icon: Home },
    { id: 'upload', label: t('upload'), icon: UploadCloud },
    { id: 'scan', label: t('scan'), icon: Camera },
    { id: 'chat', label: t('chat'), icon: MessageSquare },
    { id: 'privacy', label: t('privacy'), icon: ShieldCheck }
  ];

  return (
    <>
      {/* Desktop Navigation Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800/80 shrink-0 min-h-[calc(100vh-4rem)] p-4 transition-colors">
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 font-semibold'
                    : item.highlight
                    ? 'bg-blue-50/80 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : item.highlight ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
                {item.id === 'chat' && (
                  <span className="ml-auto text-[10px] bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                    <Sparkles className="w-2.5 h-2.5" /> AI
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Local Storage Notice & Developer Credit Badge */}
        <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50/80 dark:bg-slate-800/50 p-3 rounded-xl space-y-2">
          <div>
            <p className="font-semibold text-slate-700 dark:text-slate-300">🔒 Local Privacy</p>
            <p className="leading-snug text-[10px] mt-0.5">
              {t('localPrivacy')}
            </p>
          </div>
          <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 text-[10px] text-slate-600 dark:text-slate-300 flex items-center justify-between font-medium">
            <span>{t('developer')}</span>
            <strong className="text-blue-600 dark:text-blue-400 font-bold">Madhusudan</strong>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer Navigation overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}>
          <div 
            className="w-72 bg-white dark:bg-slate-900 h-full p-4 flex flex-col space-y-2 shadow-2xl animate-in slide-in-from-left duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pb-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-slate-100">MediAI Menu</span>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
              >
                ✕
              </button>
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 flex justify-around items-center">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center py-1 px-3 rounded-lg transition-colors ${
                isActive ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
