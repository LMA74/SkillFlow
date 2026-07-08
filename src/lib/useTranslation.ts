import { useState, useCallback } from 'react';
import { getLanguage, setLanguage, t as translate, initLanguage, type Language } from './i18n';

let listeners: (() => void)[] = [];

function notifyAll() {
  listeners.forEach((l) => l());
}

export function useTranslation() {
  const [, setVersion] = useState(0);

  const changeLanguage = useCallback((lang: Language) => {
    setLanguage(lang);
    notifyAll();
  }, []);

  const refresh = useCallback(() => {
    setVersion((v) => v + 1);
  }, []);

  // Subscribe on mount
  if (!listeners.includes(refresh)) {
    listeners.push(refresh);
  }

  return {
    t: translate,
    lang: getLanguage(),
    changeLanguage,
  };
}

// Initialize language on first import
initLanguage();
