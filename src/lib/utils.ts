import { settings } from '@/data/content';

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

const ARABIC_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

/**
 * Converts Western digits to Arabic-Indic, honouring `settings.arabicNumerals`.
 * Applied at render time only — every stored value stays a real number so
 * arithmetic and form submissions are unaffected.
 */
export function num(value: string | number): string {
  const s = String(value);
  if (!settings.arabicNumerals) return s;
  return s.replace(/\d/g, (d) => ARABIC_DIGITS[Number(d)]);
}

/** Zero-pads to two digits, then localises. */
export function pad2(value: number): string {
  return num(String(value).padStart(2, '0'));
}

/** Arabic plural agreement for the countdown and guest counts. */
export function plural(count: number, one: string, few: string, many: string): string {
  if (count === 1) return one;
  if (count === 2) return few;
  if (count >= 3 && count <= 10) return many;
  return few;
}

/** Google Calendar template link, generated from the event config. */
export function calendarUrl(opts: {
  title: string;
  details: string;
  location: string;
  startsAt: string;
  endsAt: string;
}) {
  const fmt = (iso: string) => new Date(iso).toISOString().replace(/[-:]|\.\d{3}/g, '');
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: opts.title,
    details: opts.details,
    location: opts.location,
    dates: `${fmt(opts.startsAt)}/${fmt(opts.endsAt)}`,
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

/** Keyless Google Maps embed — no API key, no billing account. */
export function mapEmbedUrl(lat: number, lng: number, zoom = 15) {
  return `https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&hl=ar&output=embed`;
}
