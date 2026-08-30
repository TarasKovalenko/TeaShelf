import { useI18n } from '@/i18n'
import { stars, timeLabel } from '@/lib/format'
import type { Tea } from '@/types'

interface TeaCardProps {
  readonly tea: Tea
  readonly onOpen: (tea: Tea) => void
}

export function TeaCard({ tea, onOpen }: TeaCardProps) {
  const { p, t } = useI18n()

  return (
    <button type="button" className="card" onClick={() => onOpen(tea)}>
      <div className="card__head">
        <div className="card__titles">
          <div className="card__kicker">
            {p(tea.type)} · {p(tea.year)}
          </div>
          <h2>{tea.name}</h2>
          <div className="card__origin">{p(tea.origin)}</div>
        </div>
        <div className="liquor" style={{ background: tea.liquor }} aria-hidden="true" />
      </div>

      <div className="card__blurb">{p(tea.blurb)}</div>

      <div className="card__foot">
        <span>
          {tea.temp}° · {timeLabel(tea.time, { min: t('min'), sec: t('sec') })} · {p(tea.ratio)}
        </span>
        <span className="stars" aria-label={`${tea.rating}/5`}>
          {stars(tea.rating)}
        </span>
      </div>
    </button>
  )
}
