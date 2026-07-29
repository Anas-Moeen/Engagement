'use client';

import { CalendarPlus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { event, seo, ui } from '@/data/content';
import { calendarUrl, detectCalendarPlatform, outlookCalendarUrl, type CalendarPlatform } from '@/lib/utils';

const ICS_HREF = '/calendar.ics';

export function AddToCalendar() {
  /* Server-rendered and first paint stay platform-agnostic (no `navigator`
     on the server); the real platform swaps in a frame later, once. */
  const [platform, setPlatform] = useState<CalendarPlatform>('other');
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    setPlatform(detectCalendarPlatform());
  }, []);

  const eventOpts = {
    title: seo.title,
    details: seo.description,
    location: `${event.venue.name}, ${event.venue.address}`,
    startsAt: event.startsAt,
    endsAt: event.endsAt,
  };
  const google = calendarUrl(eventOpts);
  const outlook = outlookCalendarUrl(eventOpts);

  /* Apple devices get the .ics served inline — Safari opens its native
     "Add Event" sheet directly, no sign-in, no download step. Everyone else
     gets Google Calendar prefilled, since Android is virtually always
     already signed into a Google account and desktop users overwhelmingly
     have a Google account too; the link below covers the rest. */
  const primary = platform === 'apple' ? { href: ICS_HREF, external: false } : { href: google, external: true };

  return (
    <div>
      <a
        href={primary.href}
        {...(primary.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        className="btn-outline w-full"
      >
        <CalendarPlus size={16} strokeWidth={1.75} aria-hidden />
        {ui.details.addToCalendar}
      </a>

      <button
        type="button"
        onClick={() => setShowMore((v) => !v)}
        className="mx-auto mt-3 block text-[0.8125rem] text-forest/45 underline-offset-4 transition-colors hover:text-gold-deep hover:underline"
        aria-expanded={showMore}
      >
        {ui.details.calendarOther}
      </button>

      {showMore && (
        <div className="mt-3 grid grid-cols-3 gap-2">
          <a href={google} target="_blank" rel="noopener noreferrer" className="btn-outline !px-2 text-[0.8125rem]">
            {ui.details.calendarGoogle}
          </a>
          <a href={outlook} target="_blank" rel="noopener noreferrer" className="btn-outline !px-2 text-[0.8125rem]">
            {ui.details.calendarOutlook}
          </a>
          <a href={ICS_HREF} className="btn-outline !px-2 text-[0.8125rem]">
            {ui.details.calendarApple}
          </a>
        </div>
      )}
    </div>
  );
}
