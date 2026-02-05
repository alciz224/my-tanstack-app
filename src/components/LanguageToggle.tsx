import * as React from 'react'
import type { Language } from '@/lib/i18n'
import { getLanguage, setLanguage } from '@/lib/i18n'

export function LanguageToggle() {
  const [lang, setLangState] = React.useState<Language>(getLanguage())

  function change(newLang: Language) {
    setLanguage(newLang)
    setLangState(newLang)
  }

  return (
    <div className="flex items-center gap-1" role="group" aria-label="Language">
      <button
        type="button"
        onClick={() => change('fr')}
        className={`px-2 py-1 rounded-md text-sm font-medium border ${
          lang === 'fr' ? 'bg-muted text-foreground border-border' : 'text-muted-foreground border-transparent hover:bg-muted'
        }`}
        aria-pressed={lang === 'fr'}
      >
        FR
      </button>
      <button
        type="button"
        onClick={() => change('en')}
        className={`px-2 py-1 rounded-md text-sm font-medium border ${
          lang === 'en' ? 'bg-muted text-foreground border-border' : 'text-muted-foreground border-transparent hover:bg-muted'
        }`}
        aria-pressed={lang === 'en'}
      >
        EN
      </button>
    </div>
  )
}
