import { useI18n, type Lang } from '@/i18n'

const options: readonly { readonly code: Lang; readonly label: string }[] = [
  { code: 'uk', label: 'Укр' },
  { code: 'en', label: 'Eng' },
]

export function LangSwitch() {
  const { lang, setLang, t } = useI18n()

  return (
    <div className="langs" role="group" aria-label={t('language')}>
      {options.map((option, i) => (
        <span key={option.code} style={{ display: 'contents' }}>
          {i > 0 && <span className="lang__sep">/</span>}
          <button
            type="button"
            className="lang"
            lang={option.code}
            aria-pressed={lang === option.code}
            onClick={() => setLang(option.code)}
          >
            {option.label}
          </button>
        </span>
      ))}
    </div>
  )
}
