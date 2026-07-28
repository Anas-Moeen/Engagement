import { event, ui } from '@/data/content';
import { Countdown } from './Countdown';
import { Ornament } from './ui/Ornament';
import { Reveal } from './ui/Reveal';

export function CountdownSection() {
  return (
    <section
      id="countdown"
      className="grain relative overflow-hidden bg-forest-deep/[0.72] py-24 text-cream sm:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute start-1/2 top-1/2 h-[62vh] w-[62vh] -translate-x-1/2 -translate-y-1/2 animate-drift rounded-full bg-forest-mist/20 blur-[120px]"
      />
      <div className="shell relative flex flex-col items-center text-center">
        <Reveal>
          <p className="eyebrow text-gold">{ui.countdown.eyebrow}</p>
        </Reveal>
        <Reveal index={1}>
          <h2 className="mt-3 font-display text-display-sm">{ui.countdown.title}</h2>
        </Reveal>
        <Reveal index={2}>
          <Ornament width={150} className="mt-5 opacity-80" />
        </Reveal>
        <Reveal index={3} className="mt-14">
          <Countdown />
        </Reveal>
        <Reveal index={4}>
          <p className="mt-12 text-[0.9375rem] font-light text-cream/45">
            {event.dateLabel} · {event.timeLabel}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
