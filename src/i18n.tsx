import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Lang = "uk" | "en";

export type L10n = Readonly<Record<Lang, string>>;

const STORAGE_KEY = "leafnotes-lang";

const ui = {
  eyebrow: { uk: "Особиста чайна полиця", en: "A personal tea shelf" },
  titleTop: { uk: "Листя, до якого", en: "Leaves I keep" },
  titleAccent: { uk: "я вертаюсь", en: "coming back to" },
  intro: {
    uk: "Полиця, з якої я щось знімаю майже щодня. Записую воду й таймінг, бо через місяць уже не памʼятаю, чому той шен вийшов гірким.",
    en: "The shelf I take something off almost every day. I write down the water and the timing, because a month later I never remember why that sheng came out bitter.",
  },
  all: { uk: "Усі", en: "All" },
  searchPlaceholder: {
    uk: "Назва, нотатка, регіон…",
    en: "Search name, note, origin…",
  },
  sort: { uk: "Сорт.", en: "Sort" },
  sortRating: { uk: "Оцінка", en: "Rating" },
  sortRecent: { uk: "Свіже", en: "Recent" },
  sortName: { uk: "А–Я", en: "A–Z" },
  empty: {
    uk: "Нічого схожого на полиці нема. Спробуй ширший запит.",
    en: "Nothing on the shelf matches that. Try a broader search.",
  },
  close: { uk: "Закрити", en: "Close" },
  language: { uk: "Мова", en: "Language" },
  filterByType: { uk: "Фільтр за типом", en: "Filter by type" },
  infusionOf: { uk: "Пролив {n} з {total}", en: "Infusion {n} of {total}" },
  harvest: { uk: "збір", en: "harvest" },
  water: { uk: "Вода", en: "Water" },
  leafRatio: { uk: "Пропорція", en: "Leaf ratio" },
  firstSteep: { uk: "Перший пролив", en: "First steep" },
  singleBrew: { uk: "Заварювання", en: "Whisk / brew" },
  infusions: { uk: "Проливів", en: "Infusions" },
  oneOnly: { uk: "Один", en: "One only" },
  vendor: { uk: "Де брав", en: "Vendor" },
  price: { uk: "Ціна", en: "Price" },
  drinkIt: { uk: "Коли пʼю", en: "Drink it" },
  rating: { uk: "Оцінка", en: "Rating" },
  tastingNotes: { uk: "Смакові нотки", en: "Tasting notes" },
  steepTimer: { uk: "Таймер проливу", en: "Steep timer" },
  singleBrewLabel: { uk: "Один пролив", en: "Single brew" },
  start: { uk: "Старт", en: "Start" },
  pause: { uk: "Пауза", en: "Pause" },
  restart: { uk: "Заново", en: "Restart" },
  nextSteep: { uk: "Наступний", en: "Next steep" },
  reset: { uk: "Скинути", en: "Reset" },
  keptByHand: { uk: "Веду руками · оновлено", en: "Kept by hand · updated" },
  min: { uk: "хв", en: "min" },
  sec: { uk: " с", en: "s" },
  hintDone: { uk: "Час. Зливай.", en: "Time. Pour it off." },
  hintDoneSingle: { uk: "Готово.", en: "Done." },
  hintSingle: {
    uk: "Збивай, поки піна не тримає пік.",
    en: "Whisk until the foam holds a peak.",
  },
  hintFirst: {
    uk: "Пресований чай спершу промий.",
    en: "Rinse first if it's a compressed tea.",
  },
  hintNext: {
    uk: "Кожен наступний пролив приблизно на 25% довший.",
    en: "Each infusion runs about 25% longer than the last.",
  },
} satisfies Record<string, L10n>;

export type UiKey = keyof typeof ui;

interface I18n {
  readonly lang: Lang;
  readonly setLang: (next: Lang) => void;
  readonly t: (key: UiKey) => string;
  readonly p: (value: L10n) => string;
  readonly locale: string;
}

const Ctx = createContext<I18n | null>(null);

function initialLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "uk" || saved === "en") return saved;
  } catch {}
  return navigator.language.toLowerCase().startsWith("uk") ? "uk" : "en";
}

export function I18nProvider({ children }: { readonly children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {}
  }, []);

  const value = useMemo<I18n>(
    () => ({
      lang,
      setLang,
      t: (key) => ui[key][lang],
      p: (value) => value[lang],
      locale: lang === "uk" ? "uk-UA" : "en-GB",
    }),
    [lang, setLang],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n(): I18n {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>');
  return ctx;
}
