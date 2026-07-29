'use client';

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useRef, useState } from 'react';
import { couple, event, ui } from '@/data/content';
import { Monogram } from './ui/Monogram';
import { Ornament } from './ui/Ornament';

const EASE = [0.16, 1, 0.3, 1] as const;

const rise = {
  hidden: { opacity: 0, y: 22, filter: 'blur(6px)' },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 1, delay: 0.5 + i * 0.13, ease: EASE },
  }),
};

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  /* The card drifts up and fades as you scroll away — the video keeps going,
     so the section reads as depth rather than as two stacked layers. */
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -70]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, reduced ? 1 : 0]);

  /* The scroll hint should read as a nudge, not a fixture — it disappears
     the moment the visitor actually starts scrolling. */
  const [showScrollHint, setShowScrollHint] = useState(true);
  useMotionValueEvent(scrollYProgress, 'change', (v) => setShowScrollHint(v < 0.035));

  return (
    <section
      ref={ref}
      id="top"
      className="relative flex min-h-[100svh] items-center justify-center px-[var(--edge)] py-24 text-cream"
    >
      <motion.div style={{ y, opacity }} className="relative w-full max-w-xl">
        <motion.div
          initial={{ opacity: 0, y: 34, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.3, ease: EASE }}
          className="glass relative px-6 py-12 text-center sm:px-12 sm:py-16"
        >
          {/* Inset hairline frame — the card reads as a printed invitation. */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-3 rounded-[1.6rem] border border-gold/20 sm:inset-4"
          />
          {/* Gold corner ticks */}
          {[
            'start-5 top-5 border-s border-t',
            'end-5 top-5 border-e border-t',
            'start-5 bottom-5 border-b border-s',
            'end-5 bottom-5 border-b border-e',
          ].map((pos) => (
            <span
              key={pos}
              aria-hidden
              className={`pointer-events-none absolute h-5 w-5 border-gold/45 sm:h-6 sm:w-6 ${pos}`}
            />
          ))}

          <div className="relative">
            <motion.p
              custom={0}
              variants={rise}
              initial="hidden"
              animate="show"
              className="font-display text-[1.0625rem] text-gold-soft sm:text-lg"
            >
              {ui.hero.eyebrow}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.15, ease: EASE }}
              className="mt-8 flex justify-center"
            >
              <Monogram size={104} />
            </motion.div>

            <motion.p
              custom={1}
              variants={rise}
              initial="hidden"
              animate="show"
              className="mx-auto mt-8 max-w-xs text-[0.9375rem] font-light leading-loose text-cream/70"
            >
              {ui.hero.intro}
            </motion.p>

            <motion.p
              custom={2}
              variants={rise}
              initial="hidden"
              animate="show"
              className="mt-1 font-display text-2xl text-gold"
            >
              {ui.hero.occasion}
            </motion.p>

            <motion.h1
              custom={3}
              variants={rise}
              initial="hidden"
              animate="show"
              className="mt-6 pb-[0.14em] font-display text-display-md font-normal"
            >
              <span className="block">{couple.bride.first}</span>
              <span className="my-1 block text-[0.4em] text-gold">{ui.hero.and}</span>
              <span className="block">{couple.groom.first}</span>
            </motion.h1>

            <motion.div
              custom={4}
              variants={rise}
              initial="hidden"
              animate="show"
              className="mt-9 flex flex-col items-center gap-5"
            >
              <Ornament width={180} />
              <p className="text-[1.0625rem] font-light text-cream/85">{event.dateLabel}</p>
              <p className="text-[0.875rem] font-light text-cream/45">
                {event.hijriLabel}
              </p>
              <p className="text-[0.9375rem] font-light text-gold-soft/80">
                {event.venue.name} · {event.venue.city}
              </p>
            </motion.div>

            <motion.p
              custom={5}
              variants={rise}
              initial="hidden"
              animate="show"
              className="mx-auto mt-10 max-w-sm border-t border-gold/15 pt-8 font-display text-[1.0625rem] leading-loose text-cream/55"
            >
              {ui.hero.verse}
            </motion.p>
          </div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {showScrollHint && (
          <motion.a
            href="#details"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.45, ease: EASE } }}
            transition={{ delay: 2.2, duration: 1, ease: EASE }}
            className="group absolute inset-x-0 bottom-6 mx-auto flex w-fit flex-col items-center gap-2.5 text-cream/45 transition-colors hover:text-gold focus-visible:text-gold sm:bottom-8"
            aria-label={ui.hero.scroll}
          >
            <motion.span
              aria-hidden
              animate={reduced ? undefined : { y: [0, 7, 0] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/25 backdrop-blur-sm transition-colors group-hover:border-gold/60"
            >
              <ChevronDown size={16} strokeWidth={1.5} />
            </motion.span>
            <span className="text-[0.75rem] font-light">{ui.hero.scroll}</span>
          </motion.a>
        )}
      </AnimatePresence>
    </section>
  );
}
