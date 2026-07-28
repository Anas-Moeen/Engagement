import { ImageResponse } from 'next/og';
import { couple, event, seo } from '@/data/content';

export const alt = seo.ogImageAlt;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * Fetches IBM Plex Sans Arabic at build time — the site's body face — for the
 * share card. Falls back to the default face rather than failing the build if
 * the network is unavailable.
 *
 * Amiri (the site's display/heading face) is deliberately NOT used here:
 * satori (the renderer behind `next/og`) can't shape its contextual ligature
 * substitutions (GSUB lookupType 5, format 3) and crashes the prerender —
 * see https://github.com/vercel/satori/issues for the underlying limitation.
 */
async function arabicFont(): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400&display=swap&subset=arabic',
      { headers: { 'User-Agent': 'Mozilla/5.0' } },
    ).then((r) => r.text());

    const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
    if (!url) return null;
    return await fetch(url).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

export default async function OpengraphImage() {
  const font = await arabicFont();

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(160deg, #0B241C 0%, #123A2C 55%, #071812 100%)',
          fontFamily: font ? 'IBM Plex Sans Arabic' : 'serif',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 34, left: 34, right: 34, bottom: 34,
            border: '1px solid rgba(200,169,106,0.42)',
            borderRadius: 18,
            display: 'flex',
          }}
        />

        <div style={{ display: 'flex', fontSize: 30, color: '#C8A96A', marginBottom: 34 }}>
          دعوة حفل خطوبة
        </div>

        {/* Each Arabic run sits in its own box — satori's bidi handling is
            safest when a line contains a single direction. */}
        <div style={{ display: 'flex', fontSize: 100, color: '#F7F1E5' }}>
          {couple.bride.first}
        </div>
        <div style={{ display: 'flex', fontSize: 60, color: '#C8A96A', margin: '4px 0' }}>و</div>
        <div style={{ display: 'flex', fontSize: 100, color: '#F7F1E5' }}>
          {couple.groom.first}
        </div>

        <div
          style={{
            display: 'flex', width: 210, height: 1,
            background: 'rgba(200,169,106,0.55)', margin: '42px 0',
          }}
        />

        <div style={{ display: 'flex', fontSize: 34, color: 'rgba(247,241,229,0.9)' }}>
          {event.dateLabel}
        </div>
        <div style={{ display: 'flex', fontSize: 26, color: 'rgba(200,169,106,0.85)', marginTop: 14 }}>
          {event.venue.name} — {event.venue.city}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: font
        ? [{ name: 'IBM Plex Sans Arabic', data: font, style: 'normal' as const, weight: 400 as const }]
        : [],
    },
  );
}
