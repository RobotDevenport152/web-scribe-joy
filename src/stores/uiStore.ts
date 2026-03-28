import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Language = 'zh' | 'en';

interface UIStore {
  language: Language;
  mobileMenuOpen: boolean;
  setLanguage: (lang: Language) => void;
  toggleMobileMenu: () => void;
  setMobileMenuOpen: (open: boolean) => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      language: 'zh',
      mobileMenuOpen: false,
      setLanguage: (language) => set({ language }),
      toggleMobileMenu: () => set((s) => ({ mobileMenuOpen: !s.mobileMenuOpen })),
      setMobileMenuOpen: (mobileMenuOpen) => set({ mobileMenuOpen }),
    }),
    { name: 'pa-ui', partialize: (s) => ({ language: s.language }) }
  )
);
