import { createContext, useContext, useState, useMemo, useEffect } from 'react';
import en from './en.json';
import my from './my.json';

const translations = { en, my };

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try {
      return localStorage.getItem('lang') || 'my';
    } catch {
      return 'my';
    }
  });

  // Sync <html lang> on initial load
  useEffect(() => {
    document.documentElement.lang = lang === 'my' ? 'my' : 'en';
  }, [lang]);

  const setLang = (newLang) => {
    setLangState(newLang);
    try {
      localStorage.setItem('lang', newLang);
    } catch {}
    document.documentElement.lang = newLang === 'my' ? 'my' : 'en';
  };

  // t('nav.home', { name: 'x' }) → translations[lang].nav.home with {name} replaced
  const t = useMemo(() => {
    return (key, params) => {
      const keys = key.split('.');
      let value = translations[lang];
      for (const k of keys) {
        if (value && typeof value === 'object') {
          value = value[k];
        } else {
          return key; // fallback to key if not found
        }
      }
      if (typeof value !== 'string') return value ?? key;
      if (params) {
        value = value.replace(/\{(\w+)\}/g, (_, name) => params[name] ?? `{${name}}`);
      }
      return value;
    };
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, t]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLang must be used within a LanguageProvider');
  }
  return context;
}
