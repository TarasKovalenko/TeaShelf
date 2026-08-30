import type { L10n } from '@/i18n'

export interface Tea {
  readonly id: string
  readonly name: string
  readonly type: L10n
  readonly typeKey: string
  readonly origin: L10n
  readonly year: L10n
  readonly vendor: L10n
  readonly price: string
  readonly temp: number
  readonly time: number
  readonly ratio: L10n
  readonly steeps: number
  readonly rating: number
  readonly when: L10n
  readonly liquor: string
  readonly blurb: L10n
  readonly long: L10n
  readonly notes: readonly L10n[]
  readonly lastBrewed: string
  readonly photo?: string
}
