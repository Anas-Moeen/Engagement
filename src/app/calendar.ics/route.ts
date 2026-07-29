import { couple, event, seo, siteUrl } from '@/data/content';
import { buildIcsContent } from '@/lib/utils';

/**
 * Served with `Content-Disposition: inline` and `text/calendar` — this is
 * what makes iOS/macOS Safari open the native "Add Event" sheet directly
 * instead of downloading a file. Content is static, so Next prerenders this
 * once at build time rather than running it per-request.
 */
export async function GET() {
  const host = new URL(siteUrl).host;
  const ics = buildIcsContent({
    uid: `engagement-${event.startsAt}@${host}`,
    title: seo.title,
    details: seo.description,
    location: `${event.venue.name}, ${event.venue.address}`,
    startsAt: event.startsAt,
    endsAt: event.endsAt,
    url: siteUrl,
  });

  return new Response(ics, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `inline; filename="${couple.monogram.replace(/\s+/g, '')}-engagement.ics"`,
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
