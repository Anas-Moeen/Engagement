'use client';

import { motion } from 'framer-motion';
import { event, ui } from '@/data/content';
import { useCountdown } from '@/lib/useCountdown';
import { num, pad2, plural } from '@/lib/utils';

const R = 88;
const CIRC = 2 * Math.PI * R;

/** Anchor for the ring: the day the invitations went out. */
const ANNOUNCED = '2026-04-01T00:00:00+03:00';

export function Countdown() {
  const left = useCountdown(event.startsAt);

  const target = new Date(event.startsAt).getTime();
  const from = new Date(ANNOUNCED).getTime();
  const progress = left ? Math.min(1, Math.max(0, 1 - left.total / (target - from))) : 0;
  const arrived = left?.total === 0;
  /* `left` re-ticks every second even past zero, so this stays accurate
     without a page refresh once the event's end time has also passed. */
  const ended = arrived && Date.now() >= new Date(event.endsAt).getTime();

  /* Explicit cells rather than a "hh : mm : ss" string — in RTL a single
     colon-joined string gets reordered by the bidi algorithm. */
  const cells = [
    { value: left ? pad2(left.hours) : '—', label: ui.countdown.hours },
    { value: left ? pad2(left.minutes) : '—', label: ui.countdown.minutes },
    { value: left ? pad2(left.seconds) : '—', label: ui.countdown.seconds },
  ];

  return (
    <div className="flex flex-col items-center">
      <div className="relative grid h-[224px] w-[224px] place-items-center">
        {/* Rotated -90deg so the arc starts at 12 o'clock; scaleX(-1) makes it
            deplete anticlockwise, which is the direction Arabic readers scan. */}
        <svg
          viewBox="0 0 200 200"
          className="absolute inset-0 h-full w-full"
          style={{ transform: 'rotate(-90deg) scaleX(-1)' }}
        >
          <circle cx="100" cy="100" r={R} fill="none" stroke="currentColor" strokeWidth="1" className="text-gold/20" />
          <motion.circle
            cx="100" cy="100" r={R}
            fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"
            className="text-gold"
            strokeDasharray={CIRC}
            initial={{ strokeDashoffset: CIRC }}
            whileInView={{ strokeDashoffset: CIRC * (1 - progress) }}
            viewport={{ once: true }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>

        <div className="text-center">
          {ended ? (
            <p className="font-display text-3xl text-cream">{ui.countdown.ended}</p>
          ) : arrived ? (
            <p className="font-display text-3xl text-cream">{ui.countdown.today}</p>
          ) : (
            <>
              <p className="font-display text-[4.5rem] leading-none text-cream tabular-nums">
                {left ? num(left.days) : '—'}
              </p>
              <p className="mt-3 text-[0.9375rem] text-gold">
                {left
                  ? plural(left.days, ui.countdown.day, ui.countdown.days, 'أيام')
                  : ui.countdown.days}
              </p>
            </>
          )}
        </div>
      </div>

      {!arrived && (
        <>
          <ul className="mt-10 flex items-stretch gap-2 sm:gap-3">
            {cells.map((cell, i) => (
              <li key={cell.label} className="flex items-stretch gap-2 sm:gap-3">
                <div className="min-w-[4.25rem] rounded-2xl border border-gold/15 bg-white/[0.04] px-3 py-4 text-center backdrop-blur-xl sm:min-w-[5rem]">
                  <p className="font-display text-[1.875rem] leading-none text-cream tabular-nums">
                    {cell.value}
                  </p>
                  <p className="mt-2 text-[0.75rem] text-cream/45">{cell.label}</p>
                </div>
                {i < cells.length - 1 && (
                  <span aria-hidden className="my-3 w-px self-stretch bg-gold/15" />
                )}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-[0.8125rem] text-cream/35">{ui.countdown.remaining}</p>
        </>
      )}
    </div>
  );
}
