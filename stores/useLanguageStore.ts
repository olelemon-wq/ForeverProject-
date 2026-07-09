import { create } from 'zustand';

type Language = 'th' | 'en';

interface LanguageState {
  lang: Language;
  setLang: (lang: Language) => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  lang: typeof window !== 'undefined' ? (localStorage.getItem('lang') as Language || 'th') : 'th',
  setLang: (lang) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('lang', lang);
    }
    set({ lang });
  },
}));
