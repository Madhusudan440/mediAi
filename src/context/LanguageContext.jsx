import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', flag: '🇬🇧' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', native: 'मराठी', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', flag: '🇮🇳' }
];

const UI_TRANSLATIONS = {
  English: {
    dashboard: 'Dashboard',
    upload: 'Upload Report',
    scan: 'Camera Scanner',
    documents: 'My Documents',
    compare: 'Compare Reports',
    timeline: 'Medical Timeline',
    chat: 'AI Assistant',
    medicines: 'Medicines & Tests',
    reminders: 'Reminders & Bookmarks',
    privacy: 'Privacy & Data',
    myProfile: 'My Profile',
    accessibilityPlatform: 'AI Health Platform',
    selectLanguage: 'Select Language',
    easyReading: 'Easy Reading',
    highContrast: 'High Contrast',
    darkTheme: 'Dark Mode',
    lightTheme: 'Light Mode',
    developer: 'Developer:',
    localPrivacy: 'Your saved MediAI data is stored locally in this browser.',
    heroTitle: 'Understand Your Medical Reports',
    heroSubtitle: 'Scan medical reports & prescriptions for simple explanations in your language.',
    uploadNow: 'Upload Report Now',
    scanNow: 'Scan Document'
  },
  Kannada: {
    dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    upload: 'ವರದಿ ಅಪ್‌ಲೋಡ್',
    scan: 'ಕ್ಯಾಮೆರಾ ಸ್ಕ್ಯಾನರ್',
    documents: 'ನನ್ನ ದಾಖಲೆಗಳು',
    compare: 'ವರದಿ ಹೋಲಿಕೆ',
    timeline: 'ವೈದ್ಯಕೀಯ ಟೈಮ್‌ಲೈನ್',
    chat: 'AI ಸಹಾಯಕ',
    medicines: 'ಔಷಧಿಗಳು ಮತ್ತು ಪರೀಕ್ಷೆಗಳು',
    reminders: 'ಜ್ಞಾಪನೆಗಳು',
    privacy: 'ಗೌಪ್ಯತೆ ಮತ್ತು ಡೇಟಾ',
    myProfile: 'ನನ್ನ ಪ್ರೊಫೈಲ್',
    accessibilityPlatform: 'AI ಆರೋಗ್ಯ ವೇದಿಕೆ',
    selectLanguage: 'ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ',
    easyReading: 'ಸುಲಭ ಓದು',
    highContrast: 'ಹೆಚ್ಚಿನ ವ್ಯತಿರಿಕ್ತತೆ',
    darkTheme: 'ಡಾರ್ಕ್ ಮೋಡ್',
    lightTheme: 'ಲೈಟ್ ಮೋಡ್',
    developer: 'ಡೆವಲಪರ್:',
    localPrivacy: 'ನಿಮ್ಮ ಉಳಿಸಿದ ಡೇಟಾ ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಸ್ಥಳೀಯವಾಗಿ ಸಂಗ್ರಹಿಸಲಾಗಿದೆ.',
    heroTitle: 'ನಿಮ್ಮ ವೈದ್ಯಕೀಯ ವರದಿಗಳನ್ನು ಸರಳವಾಗಿ ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ',
    heroSubtitle: 'ವೈದ್ಯಕೀಯ ವರದಿಗಳು ಮತ್ತು ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್‌ಗಳನ್ನು ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ ಸರಳವಾಗಿ ತಿಳಿಯಿರಿ.',
    uploadNow: 'ವರದಿ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
    scanNow: 'ದಾಖಲೆ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ'
  },
  Hindi: {
    dashboard: 'डैशबोर्ड',
    upload: 'रिपोर्ट अपलोड करें',
    scan: 'कैमरा स्कैनर',
    documents: 'मेरे दस्तावेज़',
    compare: 'रिपोर्ट तुलना',
    timeline: 'मेडिकल टाइमलाइन',
    chat: 'AI सहायक',
    medicines: 'दवाएं और परीक्षण',
    reminders: 'रिमाइंडर्स और बुकमार्क',
    privacy: 'गोपनीयता और डेटा',
    myProfile: 'मेरी प्रोफाइल',
    accessibilityPlatform: 'AI स्वास्थ्य मंच',
    selectLanguage: 'भाषा चुनें',
    easyReading: 'आसान पठन',
    highContrast: 'उच्च कंट्रास्ट',
    darkTheme: 'डार्क मोड',
    lightTheme: 'लाइट मोड',
    developer: 'डेवलपर:',
    localPrivacy: 'आपका सहेजा गया डेटा इसी ब्राउज़र में सुरक्षित है।',
    heroTitle: 'अपनी मेडिकल रिपोर्ट को आसानी से समझें',
    heroSubtitle: 'मेडिकल रिपोर्ट और पर्चे को अपनी भाषा में आसानी से समझें।',
    uploadNow: 'रिपोर्ट अपलोड करें',
    scanNow: 'दस्तावेज़ स्कैन करें'
  },
  Tamil: {
    dashboard: 'டாஷ்போர்டு',
    upload: 'அறிக்கையைப் பதிவேற்றவும்',
    scan: 'கேமரா ஸ்கேனர்',
    documents: 'என் ஆவணங்கள்',
    compare: 'அறிக்கை ஒப்பீடு',
    timeline: 'மருத்துவ காலக்கோடு',
    chat: 'AI உதவியாளர்',
    medicines: 'மருந்துகள் & பரிசோதனைகள்',
    reminders: 'நினைவூட்டல்கள்',
    privacy: 'தனியுரிமை & தரவு',
    myProfile: 'என் சுயவிவரம்',
    accessibilityPlatform: 'AI சுகாதார தளம்',
    selectLanguage: 'மொழியைத் தேர்ந்தெடுக்கவும்',
    easyReading: 'எளிதான வாசிப்பு',
    highContrast: 'அதிக முரண்பாடு',
    darkTheme: 'இருண்ட பயன்முறை',
    lightTheme: 'ஒளி பயன்முறை',
    developer: 'உருவாக்கியவர்:',
    localPrivacy: 'உங்கள் சேமிக்கப்பட்ட தரவு இந்த உலாவியில் பாதுகாப்பாக உள்ளது.',
    heroTitle: 'உங்கள் மருத்துவ அறிக்கைகளைப் புரிந்து கொள்ளுங்கள்',
    heroSubtitle: 'மருத்துவ அறிக்கைகளை உங்கள் மொழியில் எளிமையாகப் புரிந்து கொள்ளுங்கள்.',
    uploadNow: 'அறிக்கையைப் பதிவேற்றவும்',
    scanNow: 'ஆவணத்தை ஸ்கேன் செய்'
  },
  Telugu: {
    dashboard: 'డాష్‌బోర్డ్',
    upload: 'నివేదిక అప్‌లోడ్',
    scan: 'కెమెరా స్కాన్',
    documents: 'నా పత్రాలు',
    compare: 'నివేదిక పోలిక',
    timeline: 'మెడికల్ టైమ్‌లైన్',
    chat: 'AI సహాయకుడు',
    medicines: 'మందులు & పరీక్షలు',
    reminders: 'రిమైండర్‌లు',
    privacy: 'గోప్యత & డేటా',
    myProfile: 'నా ప్రొఫైల్',
    accessibilityPlatform: 'AI ఆరోగ్య వేదిక',
    selectLanguage: 'భాషను ఎంచుకోండి',
    easyReading: 'సులభమైన పఠనం',
    highContrast: 'హై కాంట్రాస్ట్',
    darkTheme: 'డార్క్ మోడ్',
    lightTheme: 'లైట్ మోడ్',
    developer: 'డెవలపర్:',
    localPrivacy: 'మీ డేటా ఈ బ్రౌజర్‌లో సురక్షితంగా నిల్వ చేయబడింది.',
    heroTitle: 'మీ వైద్య నివేదికలను సులభంగా అర్థం చేసుకోండి',
    heroSubtitle: 'వైద్య నివేదికలు మరియు మందుల చీటీలను మీ భాషలో సులభంగా తెలుసుకోండి.',
    uploadNow: 'నివేదికను అప్‌లోడ్ చేయండి',
    scanNow: 'పత్రాన్ని స్కాన్ చేయండి'
  },
  Malayalam: {
    dashboard: 'ഡാഷ്ബോർഡ്',
    upload: 'റിപ്പോർട്ട് അപ്‌ലോഡ്',
    scan: 'ക്യാമറ സ്‌കാനർ',
    documents: 'എന്റെ രേഖകൾ',
    compare: 'റിപ്പോർട്ട് താരതമ്യം',
    timeline: 'മെഡിക്കൽ ടൈംലൈൻ',
    chat: 'AI സഹായി',
    medicines: 'മരുന്നുകളും പരിശോധനകളും',
    reminders: 'ഓർമ്മപ്പെടുത്തലുകൾ',
    privacy: 'സ്വകാര്യത & ഡാറ്റ',
    myProfile: 'എന്റെ പ്രൊഫൈൽ',
    accessibilityPlatform: 'AI ആരോഗ്യ പ്ലാറ്റ്ഫോം',
    selectLanguage: 'ഭാഷ തിരഞ്ഞെടുക്കുക',
    easyReading: 'എളുപ്പ വായന',
    highContrast: 'ഹൈ കോൺട്രാസ്റ്റ്',
    darkTheme: 'ഡാർക്ക് മോഡ്',
    lightTheme: 'ലൈറ്റ് മോഡ്',
    developer: 'ഡെവലപ്പർ:',
    localPrivacy: 'നിങ്ങളുടെ വിവരങ്ങൾ ഈ ബ്രൗസറിൽ സുരക്ഷിതമാണ്.',
    heroTitle: 'നിങ്ങളുടെ മെഡിക്കൽ റിപ്പോർട്ടുകൾ എളുപ്പത്തിൽ മനസ്സിലാക്കുക',
    heroSubtitle: 'മെഡിക്കൽ റിപ്പോർട്ടുകൾ നിങ്ങളുടെ ഭാഷയിൽ എളുപ്പത്തിൽ മനസ്സിലാക്കുക.',
    uploadNow: 'റിപ്പോർട്ട് അപ്‌ലോഡ് ചെയ്യുക',
    scanNow: 'രേഖ സ്‌കാൻ ചെയ്യുക'
  },
  Marathi: {
    dashboard: 'डॅशबोर्ड',
    upload: 'रिपोर्ट अपलोड करा',
    scan: 'कॅमेरा स्कॅनर',
    documents: 'माझे दस्तऐवज',
    compare: 'रिपोर्ट तुलना',
    timeline: 'मेडिकल टाइमलाईन',
    chat: 'AI सहाय्यक',
    medicines: 'औषधे आणि चाचण्या',
    reminders: 'स्मरणपत्रे',
    privacy: 'गोपनीयता आणि डेटा',
    myProfile: 'माझे प्रोफाइल',
    accessibilityPlatform: 'AI आरोग्य प्लॅटफॉर्म',
    selectLanguage: 'भाषा निवडा',
    easyReading: 'सोपे वाचन',
    highContrast: 'हाय कॉन्ट्रास्ट',
    darkTheme: 'डार्क मोड',
    lightTheme: 'लाइट मोड',
    developer: 'डेव्हलपर:',
    localPrivacy: 'तुमचा डेटा या ब्राउझरमध्ये सुरक्षित आहे.',
    heroTitle: 'तुमचे वैद्यकीय अहवाल सोप्या भाषेत समजून घ्या',
    heroSubtitle: 'वैद्यकीय अहवाल आणि प्रिस्क्रिप्शन तुमच्या भाषेत समजून घ्या.',
    uploadNow: 'अहवाल अपलोड करा',
    scanNow: 'कागदपत्र स्कॅन करा'
  },
  Bengali: {
    dashboard: 'ড্যাশবোর্ড',
    upload: 'রিপোর্ট আপলোড',
    scan: 'ক্যামেরা স্ক্যানার',
    documents: 'আমার নথি',
    compare: 'রিপোর্ট তুলনা',
    timeline: 'মেডিকেল টাইমলাইন',
    chat: 'AI সহকারী',
    medicines: 'ওষুধ ও পরীক্ষা',
    reminders: 'রিমাইন্ডার',
    privacy: 'গোপনীয়তা ও ডেটা',
    myProfile: 'আমার প্রোফাইল',
    accessibilityPlatform: 'AI স্বাস্থ্য প্ল্যাটফর্ম',
    selectLanguage: 'ভাষা নির্বাচন করুন',
    easyReading: 'সহজ পাঠ্য',
    highContrast: 'হাই কনট্রাস্ট',
    darkTheme: 'ডার্ক মোড',
    lightTheme: 'লাইট মোড',
    developer: 'ডেভেলপার:',
    localPrivacy: 'আপনার সংরক্ষিত তথ্য এই ব্রাউজারে সংরক্ষিত থাকে।',
    heroTitle: 'আপনার মেডিকেল রিপোর্ট সহজেই বুঝুন',
    heroSubtitle: 'মেডিকেল রিপোর্ট এবং ব্যবস্থাপত্র আপনার ভাষায় সহজ ভাষায় বুঝুন।',
    uploadNow: 'রিপোর্ট আপলোড করুন',
    scanNow: 'নথি স্ক্যান করুন'
  }
};

export function LanguageProvider({ children }) {
  const [currentLanguage, setCurrentLanguage] = useState('English');

  const changeLanguage = (langName) => {
    setCurrentLanguage(langName);
  };

  const t = (key) => {
    const langDict = UI_TRANSLATIONS[currentLanguage] || UI_TRANSLATIONS.English;
    return langDict[key] || UI_TRANSLATIONS.English[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage, languages: SUPPORTED_LANGUAGES, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
