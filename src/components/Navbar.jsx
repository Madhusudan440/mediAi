import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  Activity, 
  Sun, 
  Moon, 
  Eye, 
  Type, 
  Menu,
  X,
  User
} from 'lucide-react';

export function Navbar({ onToggleMobileMenu, isMobileMenuOpen }) {
  const { settings, toggleTheme, toggleHighContrast, toggleEasyReading } = useTheme();
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 w-full max-w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 shadow-sm transition-colors overflow-hidden">
      <div className="w-full max-w-full px-3 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Left Logo & Brand */}
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          <button 
            onClick={onToggleMobileMenu}
            className="md:hidden p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <a href="#" className="flex items-center space-x-2 sm:space-x-3 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-teal-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform duration-200 shrink-0">
              <Activity className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-blue-600 via-teal-500 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-teal-400 dark:to-indigo-400">
                MediAI
              </span>
              <span className="hidden md:inline-flex text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60">
                {t('accessibilityPlatform')}
              </span>
            </div>
          </a>
        </div>

        {/* Right Controls & Tools (Fitted cleanly without overflow) */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">

          {/* User Profile Pill */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 px-2.5 sm:px-3 py-1.5 rounded-full border border-slate-200/80 dark:border-slate-700/80 bg-slate-50/80 dark:bg-slate-800/80 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-2xs hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center text-[10px] font-bold shrink-0">
              <User className="w-3 h-3" />
            </div>
            <span className="hidden sm:inline font-medium">{t('myProfile')}</span>
          </div>

          {/* Easy Reading Mode Toggle */}
          <button
            onClick={toggleEasyReading}
            className={`p-2 rounded-full border transition-all ${
              settings.easyReading 
                ? 'bg-teal-500 border-teal-600 text-white shadow-md shadow-teal-500/20' 
                : 'border-slate-200/80 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title={settings.easyReading ? "Exit Easy Reading Mode" : t('easyReading')}
          >
            <Type className="w-4 h-4" />
          </button>

          {/* High Contrast Mode Toggle */}
          <button
            onClick={toggleHighContrast}
            className={`p-2 rounded-full border transition-all ${
              settings.highContrast 
                ? 'bg-amber-400 border-amber-500 text-slate-950 font-bold shadow-md' 
                : 'border-slate-200/80 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title={t('highContrast')}
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Dark / Light Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full border border-slate-200/80 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-2xs"
            title={settings.theme === 'dark' ? t('lightTheme') : t('darkTheme')}
          >
            {settings.theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

        </div>
      </div>
    </header>
  );
}
