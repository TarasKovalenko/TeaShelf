import { useEffect, useRef, useState } from 'react'
import { useI18n } from '@/i18n'
import { clock, stars, steepSeconds, timeLabel } from '@/lib/format'
import type { Tea } from '@/types'

interface TeaPanelProps {
  readonly tea: Tea
  readonly onClose: () => void
}

export function TeaPanel({ tea, onClose }: TeaPanelProps) {
  const { t, p } = useI18n()

  const [steepIdx, setSteepIdx] = useState(0)
  const [remaining, setRemaining] = useState(tea.time)
  const [running, setRunning] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setSteepIdx(0)
    setRemaining(tea.time)
    setRunning(false)
  }, [tea.id, tea.time])

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => {
      setRemaining((left) => {
        if (left <= 1) {
          setRunning(false)
          return 0
        }
        return left - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [running])

  useEffect(() => {
    panelRef.current?.focus()
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const multiSteep = tea.steeps > 1
  const total = steepSeconds(tea.time, steepIdx)
  const progress = total ? Math.max(0, Math.min(100, ((total - remaining) / total) * 100)) : 0
  const done = remaining === 0

  const specs: readonly { readonly k: string; readonly v: string }[] = [
    { k: t('water'), v: `${tea.temp} °C` },
    { k: t('leafRatio'), v: p(tea.ratio) },
    { k: multiSteep ? t('firstSteep') : t('singleBrew'), v: timeLabel(tea.time, { min: t('min'), sec: t('sec') }) },
    { k: t('infusions'), v: multiSteep ? String(tea.steeps) : t('oneOnly') },
    { k: t('vendor'), v: p(tea.vendor) },
    { k: t('price'), v: tea.price },
    { k: t('drinkIt'), v: p(tea.when) },
    { k: t('rating'), v: stars(tea.rating) },
  ]

  const hint = done
    ? multiSteep
      ? t('hintDone')
      : t('hintDoneSingle')
    : !multiSteep
      ? t('hintSingle')
      : steepIdx === 0
        ? t('hintFirst')
        : t('hintNext')

  function toggleTimer() {
    if (done) {
      setRemaining(total)
      setRunning(true)
      return
    }
    setRunning((was) => !was)
  }

  function nextSteep() {
    const idx = Math.min(steepIdx + 1, tea.steeps - 1)
    setSteepIdx(idx)
    setRemaining(steepSeconds(tea.time, idx))
    setRunning(false)
  }

  function resetTimer() {
    setSteepIdx(0)
    setRemaining(tea.time)
    setRunning(false)
  }

  return (
    <div className="scrim" onClick={onClose}>
      <div
        ref={panelRef}
        className="panel"
        role="dialog"
        aria-modal="true"
        aria-label={tea.name}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="panel__head">
          <div className="panel__titles">
            <div className="panel__kicker">
              {p(tea.type)} · {p(tea.year)} {t('harvest')}
            </div>
            <h2>{tea.name}</h2>
            <div className="panel__origin">{p(tea.origin)}</div>
          </div>
          <button type="button" className="btn-ghost" onClick={onClose}>
            {t('close')}
          </button>
        </div>

        {tea.photo && <img className="panel__photo" src={tea.photo} alt={tea.name} loading="lazy" />}

        <dl className="specs">
          {specs.map((spec) => (
            <div className="spec" key={spec.k}>
              <dt>{spec.k}</dt>
              <dd>{spec.v}</dd>
            </div>
          ))}
        </dl>

        <section className="block">
          <div className="block__label">{t('tastingNotes')}</div>
          <div className="tags">
            {tea.notes.map((note) => (
              <span className="tag" key={note.en}>
                {p(note)}
              </span>
            ))}
          </div>
          <p className="panel__long">{p(tea.long)}</p>
        </section>

        <section className="timer">
          <div className="timer__head">
            <div className="block__label">{t('steepTimer')}</div>
            <div className="block__label">
              {multiSteep
                ? t('infusionOf')
                    .replace('{n}', String(steepIdx + 1))
                    .replace('{total}', String(tea.steeps))
                : t('singleBrewLabel')}
            </div>
          </div>

          <div className="timer__row">
            <div className={done ? 'clock clock--done' : 'clock'} role="timer" aria-live="off">
              {clock(remaining)}
            </div>
            <div className="timer__buttons">
              <button type="button" className="btn-primary" onClick={toggleTimer}>
                {running ? t('pause') : done ? t('restart') : t('start')}
              </button>
              {multiSteep && (
                <button type="button" className="btn-outline" onClick={nextSteep}>
                  {t('nextSteep')}
                </button>
              )}
              <button type="button" className="btn-outline" onClick={resetTimer}>
                {t('reset')}
              </button>
            </div>
          </div>

          <div className="progress">
            <div className="progress__bar" style={{ width: `${progress.toFixed(1)}%` }} />
          </div>

          <div className="timer__hint">{hint}</div>
        </section>
      </div>
    </div>
  )
}
