import { useI18n } from '@/i18n'
import { LangSwitch } from './LangSwitch'

export function Masthead() {
  const { t } = useI18n()

  return (
    <header className="masthead">
      <div className="masthead__intro">
        <div className="eyebrow">{t('eyebrow')}</div>
        <h1>
          {t('titleTop')}
          <br />
          <em>{t('titleAccent')}</em>
        </h1>
        <p>{t('intro')}</p>
      </div>

      <div className="masthead__side">
        <LangSwitch />
      </div>
    </header>
  )
}
