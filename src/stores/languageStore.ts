import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Language = 'en' | 'fr'

interface LanguageState {
  language: Language
  setLanguage: (language: Language) => void
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'fr', // Default to French as requested
      setLanguage: (language: Language) => {
        set({ language })
      },
    }),
    {
      name: 'language-storage',
    }
  )
)
