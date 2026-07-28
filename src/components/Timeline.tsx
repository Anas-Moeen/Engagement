import { timeline, ui } from '@/data/content';
import { num } from '@/lib/utils';
import { Reveal } from './ui/Reveal';
import { Section } from './ui/Section';

/**
 * The clock values are the structure — the evening genuinely is a sequence, so
 * the rail and the times carry information rather than decorate.
 */
export function Timeline() {
  return (
    <Section id="timeline" eyebrow={ui.timeline.eyebrow} title={ui.timeline.title} lede={ui.timeline.lede}>
      <ol className="mx-auto max-w-2xl">
        {timeline.map((item, i) => (
          <Reveal as="li" key={item.time} index={i} className="group relative flex gap-6 pb-11 last:pb-0">
            <div className="flex flex-col items-center">
              <span className="mt-2.5 h-2 w-2 shrink-0 rotate-45 border border-gold bg-paper transition-all duration-500 group-hover:scale-125 group-hover:bg-gold" />
              {i < timeline.length - 1 && (
                <span className="mt-2 w-px flex-1 bg-gradient-to-b from-gold/35 to-gold/5" />
              )}
            </div>

            <div className="-mt-1 flex-1 pb-2">
              <p className="ltr inline-block text-[0.875rem] font-medium tabular-nums text-gold">
                {num(item.time)}
              </p>
              <h3 className="mt-1.5 font-display text-[1.625rem] leading-snug">{item.title}</h3>
              <p className="mt-2 text-[0.9375rem] font-light leading-loose text-forest/60">
                {item.detail}
              </p>
            </div>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
