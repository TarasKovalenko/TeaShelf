import { useI18n, type UiKey } from '@/i18n'

export type SortKey = 'rating' | 'recent' | 'name'

export interface TypeFilter {
  readonly value: string
  readonly label: string
  readonly count: number
}

interface ToolbarProps {
  readonly types: readonly TypeFilter[]
  readonly type: string
  readonly onType: (value: string) => void
  readonly query: string
  readonly onQuery: (value: string) => void
  readonly sort: SortKey
  readonly onSort: (value: SortKey) => void
}

const sorts: readonly { readonly key: SortKey; readonly label: UiKey }[] = [
  { key: 'rating', label: 'sortRating' },
  { key: 'recent', label: 'sortRecent' },
  { key: 'name', label: 'sortName' },
]

export function Toolbar({ types, type, onType, query, onQuery, sort, onSort }: ToolbarProps) {
  const { t } = useI18n()

  return (
    <div className="toolbar">
      <div className="chips" role="group" aria-label={t('filterByType')}>
        {types.map((option) => (
          <button
            key={option.value}
            type="button"
            className="chip"
            aria-pressed={type === option.value}
            onClick={() => onType(option.value)}
          >
            {option.label}
            <span className="chip__count">{option.count}</span>
          </button>
        ))}
      </div>

      <div className="toolbar__spacer" />

      <input
        className="search"
        type="search"
        value={query}
        onChange={(event) => onQuery(event.target.value)}
        placeholder={t('searchPlaceholder')}
        aria-label={t('searchPlaceholder')}
        autoComplete="off"
      />

      <div className="sorts">
        <span>{t('sort')}</span>
        {sorts.map((option) => (
          <button
            key={option.key}
            type="button"
            className="sort"
            aria-pressed={sort === option.key}
            onClick={() => onSort(option.key)}
          >
            {t(option.label)}
          </button>
        ))}
      </div>
    </div>
  )
}
