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

type CalendarEvent = {
  title: string;
  details: string;
  location: string;
  startsAt: string;
  endsAt: string;
};

/** `YYYYMMDDTHHMMSSZ` — the UTC form every calendar format below agrees on. */
function icsDate(iso: string) {
  return new Date(iso).toISOString().replace(/[-:]|\.\d{3}/g, '');
}

/** Google Calendar template link, generated from the event config. */
export function calendarUrl(opts: CalendarEvent) {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: opts.title,
    details: opts.details,
    location: opts.location,
    dates: `${icsDate(opts.startsAt)}/${icsDate(opts.endsAt)}`,
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

/**
 * Android intent URI that opens the device's own calendar app directly on
 * its "new event" editor — the native equivalent of the iOS .ics sheet, with
 * no Google sign-in and no browser tab. Chrome for Android intercepts
 * `intent:` links before navigation and dispatches them as a real Android
 * Intent (`ACTION_INSERT` + the calendar-event MIME type), which every
 * calendar app — stock AOSP Calendar, Google Calendar, Samsung Calendar —
 * registers a handler for. `S.browser_fallback_url` is a Chrome-specific
 * extra: if no app can handle the intent (essentially never happens, but a
 * stripped-down ROM could), Chrome opens that URL instead of failing silently.
 */
export function androidCalendarIntentUrl(opts: CalendarEvent & { fallbackUrl: string }) {
  const params = [
    'action=android.intent.action.INSERT',
    'category=android.intent.category.DEFAULT',
    'type=vnd.android.cursor.item/event',
    `S.title=${encodeURIComponent(opts.title)}`,
    `S.eventLocation=${encodeURIComponent(opts.location)}`,
    `S.description=${encodeURIComponent(opts.details)}`,
    `l.beginTime=${new Date(opts.startsAt).getTime()}`,
    `l.endTime=${new Date(opts.endsAt).getTime()}`,
    `S.browser_fallback_url=${encodeURIComponent(opts.fallbackUrl)}`,
  ].join(';');
  return `intent:#Intent;${params};end`;
}

/** Outlook.com web compose link — covers Outlook/Hotmail/Microsoft 365 users. */
export function outlookCalendarUrl(opts: CalendarEvent) {
  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: opts.title,
    body: opts.details,
    location: opts.location,
    startdt: new Date(opts.startsAt).toISOString(),
    enddt: new Date(opts.endsAt).toISOString(),
  });
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params}`;
}

/** RFC 5545 §3.8.1.11 — plain-text special characters that must be backslash-escaped. */
function escapeIcsText(text: string) {
  return text.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

/**
 * RFC 5545 §3.1 line folding: no content line may exceed 75 octets: continuation
 * lines start with a single space. Folds on UTF-8 byte length, not character
 * count, since Arabic text runs 2 bytes/char and would otherwise overflow.
 */
function foldIcsLine(line: string) {
  const encoder = new TextEncoder();
  if (encoder.encode(line).length <= 75) return line;

  const rawLines: string[] = [];
  let current = '';
  let currentBytes = 0;
  for (const char of line) {
    const charBytes = encoder.encode(char).length;
    const limit = rawLines.length === 0 ? 75 : 74; // continuation lines lose one octet to the leading space
    if (currentBytes + charBytes > limit) {
      rawLines.push(current);
      current = char;
      currentBytes = charBytes;
    } else {
      current += char;
      currentBytes += charBytes;
    }
  }
  rawLines.push(current);
  return rawLines.join('\r\n ');
}

/** A minimal, valid .ics (iCalendar) file — the one format every calendar app understands natively. */
export function buildIcsContent(opts: CalendarEvent & { uid: string; url: string }) {
  const stamp = icsDate(new Date().toISOString());
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//anas-aya.com//Engagement Invitation//AR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${opts.uid}`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${icsDate(opts.startsAt)}`,
    `DTEND:${icsDate(opts.endsAt)}`,
    `SUMMARY:${escapeIcsText(opts.title)}`,
    `DESCRIPTION:${escapeIcsText(opts.details)}`,
    `LOCATION:${escapeIcsText(opts.location)}`,
    `URL:${opts.url}`,
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    'DESCRIPTION:Reminder',
    'TRIGGER:-PT2H',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return lines.map(foldIcsLine).join('\r\n') + '\r\n';
}

export type CalendarPlatform = 'apple' | 'android' | 'other';

/**
 * iPadOS 13+ reports as "Macintosh" in the UA string; touch support is the
 * only reliable way left to tell it apart from a real Mac.
 */
export function detectCalendarPlatform(): CalendarPlatform {
  if (typeof navigator === 'undefined') return 'other';
  const ua = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  if (isIOS || /Macintosh/.test(ua)) return 'apple';
  if (/Android/.test(ua)) return 'android';
  return 'other';
}

/** Keyless Google Maps embed — no API key, no billing account. */
export function mapEmbedUrl(lat: number, lng: number, zoom = 15) {
  return `https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&hl=ar&output=embed`;
}
