import * as React from 'react'
import { useLanguageStore } from '@/stores/languageStore'
import type { Language } from '@/lib/i18n'

export function LanguageToggle() {
  const { language, setLanguage } = useLanguageStore()

  return (
    <div className="flex items-center gap-1" role="group" aria-label="Language">
      <button
        type="button"
        onClick={() => setLanguage('fr')}
        className={`px-2 py-1 rounded-md text-sm font-medium border ${language === 'fr' ? 'bg-muted text-foreground border-border' : 'text-muted-foreground border-transparent hover:bg-muted'
          }`}
        aria-pressed={language === 'fr'}
      >
        FR
      </button>
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`px-2 py-1 rounded-md text-sm font-medium border ${language === 'en' ? 'bg-muted text-foreground border-border' : 'text-muted-foreground border-transparent hover:bg-muted'
          }`}
        aria-pressed={language === 'en'}
      >
        EN
      </button>
    </div>
  )
}
