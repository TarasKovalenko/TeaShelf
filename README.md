# Tea Notes

A personal tea shelf: what each tea tastes like, how I brew it, a steep timer, and when I last drank it. The interface speaks Ukrainian and English.

The layout is a port of the `Tea Notes.dc.html` Claude Design file.

## Running it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build
npm run preview
npm run typecheck
```

## Languages

The `УКР / ENG` switch sits in the masthead. The choice is stored in localStorage and `<html lang>` follows it.

Every text field in the data carries both languages:

```ts
origin: { uk: 'Менку, Юньнань', en: 'Mengku, Yunnan' }
```

Interface strings live in the `ui` dictionary in `src/i18n.tsx`. It is typed with `satisfies`, so a missing translation fails `tsc` rather than showing up blank in production.

Everything else in the codebase — error messages, identifiers, docs — is English. Only content is bilingual.

## Adding a tea

Open `src/data/teas.ts`, copy an object, change the fields:

```ts
{
  id: 'slug',
  name: 'Latin Name',             // the same in both languages
  typeKey: 'oolong',              // filter key
  type:   { uk: 'Улун', en: 'Oolong' },
  origin: { uk: '…', en: '…' },
  year:   { uk: '2023', en: '2023' },
  vendor: { uk: '…', en: '…' },
  price: '€18 / 100 g',
  temp: 100,                      // °C
  time: 12,                       // first steep, seconds
  ratio:  { uk: '8 г / 90 мл', en: '8g / 90ml' },
  steeps: 8,                      // 1 hides the "next steep" button
  rating: 5,                      // whole number, 0–5
  when:   { uk: '…', en: '…' },
  liquor: 'oklch(0.55 0.1 55)',   // liquor colour for the card swatch
  blurb:  { uk: '…', en: '…' },   // short, for the card
  long:   { uk: '…', en: '…' },   // full, for the panel
  notes: [{ uk: 'мед', en: 'honey' }],
  lastBrewed: '2026-08-25',       // ISO; drives "recent" sort and the footer date
  photo: '/photos/file.jpg',      // optional, shown at the top of the panel
}
```

A new `typeKey` turns into a filter chip on its own.

## What it does

- filter by type, search, sort by rating / recent / A–Z
- detail panel with brewing specs, tasting notes and the long note
- steep timer where each infusion runs 25% longer than the last
- filter, sort and the open tea live in the URL, so links are shareable

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the site and publishes `dist/` to GitHub Pages.

One-time setup: **Settings -> Pages -> Source -> GitHub Actions**.

The Vite `base` is `./`, so the build works both at a domain root and under a repository subpath.

## Decisions worth knowing

**Newsreader has no Cyrillic.** `--serif` lists Source Serif 4 right after it: Latin renders in Newsreader exactly as the design intended, Cyrillic falls through to its neighbour. Glyph fallback happens per character, so the mix is not noticeable.

**Grid hairlines come from the cards.** The original draws them with `gap: 1px` over a coloured container background. Here each card carries its own right and bottom border — otherwise the unfilled tail of the last row showed up as a grey rectangle.

**HashRouter, not BrowserRouter.** The site is static and should drop onto any host without rewrite rules, GitHub Pages included.

**No Tailwind.** The design is plain CSS with exact oklch values; keeping them as tokens in `src/index.css` stays closer to the source than translating them into utilities.

## Layout

```
.github/workflows/    Pages deployment
src/
  i18n.tsx            languages, dictionary, provider
  types.ts            Tea, L10n
  data/teas.ts        the collection
  lib/format.ts       ratings, timings, dates
  components/         Masthead, LangSwitch, Toolbar, TeaCard, TeaPanel
  pages/Shelf.tsx     the page
  index.css           all styles
public/photos/        images
```
