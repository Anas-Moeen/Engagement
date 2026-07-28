import { Car, Navigation } from 'lucide-react';
import { event, ui } from '@/data/content';
import { mapEmbedUrl } from '@/lib/utils';
import { Reveal } from './ui/Reveal';
import { Section } from './ui/Section';

export function Location() {
  return (
    <Section
      id="location"
      tone="cream"
      eyebrow={ui.location.eyebrow}
      title={ui.location.title}
      lede={ui.location.lede}
    >
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <div className="card overflow-hidden">
            {/* Keyless embed — no API key, no billing account. Lazy so it never
                competes with the hero for bandwidth. */}
            <div className="relative aspect-[16/10] w-full bg-forest/[0.06] sm:aspect-[2/1]">
              <iframe
                src={mapEmbedUrl(event.venue.lat, event.venue.lng)}
                title={ui.location.mapTitle}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full border-0 grayscale-[0.35] contrast-[1.05]"
                allowFullScreen
              />
            </div>

            <div className="p-8 text-center sm:p-10">
              <p className="pb-[0.1em] font-display text-[1.75rem] leading-[1.7]">{event.venue.name}</p>
              {/* hall and parkingNote are optional — an empty string in the
                  content file must not leave a blank line or a stray icon. */}
              {event.venue.hall && (
                <p className="mt-2 text-[0.9375rem] font-light text-forest/60">{event.venue.hall}</p>
              )}
              <p className="mt-2 text-[0.9375rem] font-light text-forest/60">{event.venue.address}</p>

              <a
                href={event.venue.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold mt-8 w-full sm:w-auto sm:px-10"
              >
                <Navigation size={16} strokeWidth={2} aria-hidden />
                {ui.location.openMaps}
              </a>

              {event.venue.parkingNote && (
                <p className="mt-7 flex items-center justify-center gap-2 text-[0.875rem] font-light text-forest/45">
                  <Car size={15} strokeWidth={1.5} aria-hidden />
                  {event.venue.parkingNote}
                </p>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
