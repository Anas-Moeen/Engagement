import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Ornament } from './Ornament';
import { Reveal } from './Reveal';

type Props = {
  id: string;
  eyebrow?: string;
  title?: string;
  lede?: string;
  children: ReactNode;
  tone?: 'paper' | 'cream' | 'forest';
  className?: string;
};

/* The video is one fixed layer behind the whole page. The light tones are
   fully opaque, so they hide it; only the forest tone is translucent, which is
   how the video ends up showing in the green sections and nowhere else. */
const tones = {
  paper: 'bg-paper text-forest',
  cream: 'bg-cream text-forest',
  forest: 'bg-forest/[0.72] text-cream grain',
} as const;

export function Section({ id, eyebrow, title, lede, children, tone = 'paper', className }: Props) {
  const dark = tone === 'forest';

  return (
    <section
      id={id}
      className={cn('relative overflow-x-clip py-24 sm:py-32', tones[tone], className)}
    >
      <div className="shell relative">
        {(eyebrow || title) && (
          <header className="mx-auto mb-16 max-w-2xl text-center sm:mb-20">
            {eyebrow && (
              <Reveal>
                <p className={cn('eyebrow', dark && 'text-gold')}>{eyebrow}</p>
              </Reveal>
            )}
            {title && (
              <Reveal index={1}>
                <h2 className="mt-3 pb-[0.12em] font-display text-display-sm">{title}</h2>
              </Reveal>
            )}
            <Reveal index={2}>
              <Ornament width={150} className="mx-auto mt-5 opacity-80" />
            </Reveal>
            {lede && (
              <Reveal index={3}>
                <p
                  className={cn(
                    'mx-auto mt-6 max-w-md text-[1rem] font-light leading-loose',
                    dark ? 'text-cream/60' : 'text-forest/60',
                  )}
                >
                  {lede}
                </p>
              </Reveal>
            )}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
