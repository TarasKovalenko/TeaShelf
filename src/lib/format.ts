export interface TimeUnits {
  readonly min: string;
  readonly sec: string;
}

export function stars(rating: number): string {
  const full = Math.round(rating);
  return "●".repeat(full) + "○".repeat(Math.max(0, 5 - full));
}

export function timeLabel(seconds: number, units: TimeUnits): string {
  if (seconds >= 60) return `${Math.round(seconds / 60)} ${units.min}`;
  return `${seconds}${units.sec}`;
}

export function clock(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function steepSeconds(base: number, index: number): number {
  return Math.round(base * Math.pow(1.25, index));
}

export function longDate(iso: string, locale: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}
