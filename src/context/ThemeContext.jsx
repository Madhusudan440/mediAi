import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSettings, saveSettings, getActiveProfile, setActiveProfile as setStorageActiveProfile, getProfiles } from '../services/storageService';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [settings, setSettingsState] = useState(() => getSettings());
  const [activeProfile, setActiveProfileState] = useState(() => getActiveProfile());

  useEffect(() => {
    // Apply dark mode class to <html> element
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Apply high contrast class
    if (settings.highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }

    // Apply font size class
    document.documentElement.classList.remove('text-size-normal', 'text-size-large', 'text-size-xlarge');
    document.documentElement.classList.add(`text-size-${settings.fontSize || 'normal'}`);
  }, [settings]);

  const updateSettings = (newSettings) => {
    const updated = saveSettings(newSettings);
    setSettingsState(updated);
  };

  const toggleTheme = () => {
    updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' });
  };

  const toggleHighContrast = () => {
    updateSettings({ highContrast: !settings.highContrast });
  };

  const toggleEasyReading = () => {
    updateSettings({ easyReading: !settings.easyReading });
  };

  const setFontSize = (size) => {
    updateSettings({ fontSize: size });
  };

  const switchProfile = (profileId) => {
    setStorageActiveProfile(profileId);
    const updatedProf = getActiveProfile();
    setActiveProfileState(updatedProf);
  };

  return (
    <ThemeContext.Provider
      value={{
        settings,
        updateSettings,
        toggleTheme,
        toggleHighContrast,
        toggleEasyReading,
        setFontSize,
        activeProfile,
        switchProfile,
        profiles: getProfiles()
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
