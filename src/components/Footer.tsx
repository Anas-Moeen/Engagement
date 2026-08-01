import { couple, event, ui } from '@/data/content';
import { Monogram } from './ui/Monogram';
import { Reveal } from './ui/Reveal';

export function Footer() {
  return (
    <footer className="grain relative overflow-x-clip bg-forest-deep/[0.80] py-20 text-center text-cream">
      <div className="shell relative flex flex-col items-center">
        <Reveal><Monogram size={76} /></Reveal>
        <Reveal index={1}>
          <p className="mt-8 pb-[0.18em] font-display text-[1.75rem] leading-[1.85]">
            {couple.groom.full}
            <span className="mx-3 text-gold">و</span>
            {couple.bride.full}
          </p>
        </Reveal>
        <Reveal index={2}>
          <p className="mt-4 text-[0.875rem] font-light text-cream/35">
            {event.dateLabel} · {event.venue.name}
          </p>
        </Reveal>
        <Reveal index={3}>
          <p className="mt-10 max-w-xs font-display text-[1.25rem] leading-loose text-cream/45">
            {ui.footer.thanks}
          </p>
        </Reveal>
      </div>
    </footer>
  );
}
