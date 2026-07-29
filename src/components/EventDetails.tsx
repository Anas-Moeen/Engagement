import { CalendarPlus, Clock, MapPin } from 'lucide-react';
import { event, ui } from '@/data/content';
import { AddToCalendar } from './AddToCalendar';
import { Reveal } from './ui/Reveal';
import { Section } from './ui/Section';

export function EventDetails() {
  const facts = [
    { icon: CalendarPlus, label: ui.details.date, value: event.dateLabel, sub: event.hijriLabel },
    { icon: Clock, label: ui.details.time, value: event.timeLabel, sub: null },
    { icon: MapPin, label: ui.details.place, value: event.venue.name, sub: event.venue.hall },
  ];

  return (
    <Section
      id="details"
      tone="cream"
      eyebrow={ui.details.eyebrow}
      title={ui.details.title}
      lede={ui.details.lede}
    >
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <div className="card overflow-hidden p-2">
            <dl className="grid divide-y divide-forest/[0.07] sm:grid-cols-3 sm:divide-x sm:divide-x-reverse sm:divide-y-0">
              {facts.map(({ icon: Icon, label, value, sub }) => (
                <div key={label} className="px-6 py-9 text-center">
                  <Icon size={20} strokeWidth={1.25} className="mx-auto text-gold-deep" aria-hidden />
                  <dt className="eyebrow mt-4">{label}</dt>
                  <dd className="mt-2 pb-[0.1em] font-display text-[1.625rem] leading-[1.65]">{value}</dd>
                  {sub && <p className="mt-1.5 text-[0.8125rem] font-light text-forest/45">{sub}</p>}
                </div>
              ))}
            </dl>
          </div>
        </Reveal>

        <Reveal index={1}>
          <div className="mt-5">
            <AddToCalendar />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
