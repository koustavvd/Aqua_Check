import React, { createContext, useContext, useState } from 'react';
import { Language } from '../types';
import { translations, formatNumber, DISTRICT_TRANSLATIONS } from '../i18n/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  isLanguageModalOpen: boolean;
  openLanguageModal: () => void;
  closeLanguageModal: () => void;
  selectLanguageAndClose: (lang: Language) => void;
  t: typeof translations.en;
  formatNum: (val: number | string) => string;
  getDistrictName: (districtCode: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('tripura_hydro_lang');
    if (saved === 'en' || saved === 'bn' || saved === 'hi') return saved;
    return 'en';
  });

  // Modal is always shown every time the app loads or reloads
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState<boolean>(true);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('tripura_hydro_lang', lang);
  };

  const selectLanguageAndClose = (lang: Language) => {
    setLanguage(lang);
    setIsLanguageModalOpen(false);
  };

  const openLanguageModal = () => {
    setIsLanguageModalOpen(true);
  };

  const closeLanguageModal = () => {
    setIsLanguageModalOpen(false);
  };

  const toggleLanguage = () => {
    if (language === 'en') setLanguage('bn');
    else if (language === 'bn') setLanguage('hi');
    else setLanguage('en');
  };

  const t = translations[language];

  const formatNum = (val: number | string) => formatNumber(val, language);

  const getDistrictName = (districtCode: string) => {
    const item = DISTRICT_TRANSLATIONS[districtCode];
    if (!item) return districtCode;
    return item[language] || item.en;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        isLanguageModalOpen,
        openLanguageModal,
        closeLanguageModal,
        selectLanguageAndClose,
        t,
        formatNum,
        getDistrictName,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

