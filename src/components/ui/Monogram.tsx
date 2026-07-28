'use client';

import { motion } from 'framer-motion';
import { couple } from '@/data/content';

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The signature element: a gold crest whose rings and flourishes draw
 * themselves once, then the Arabic initials settle inside.
 *
 * The initials are live text in the display face rather than traced paths —
 * Arabic letterforms carry their own calligraphic weight, and faking them with
 * strokes looks like a logo of Arabic rather than Arabic.
 */
export function Monogram({ size = 116 }: { size?: number }) {
  const stroke = {
    hidden: { pathLength: 0, opacity: 0 },
    show: (i: number) => ({
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 1.9, delay: 0.2 + i * 0.22, ease: EASE },
        opacity: { duration: 0.3, delay: 0.2 + i * 0.22 },
      },
    }),
  } as const;

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      role="img"
      aria-label={`${couple.bride.first} و ${couple.groom.first}`}
      initial="hidden"
      animate="show"
      className="text-gold"
    >
      <motion.circle
        cx="60" cy="60" r="54"
        stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.45"
        variants={stroke} custom={0}
      />
      <motion.circle
        cx="60" cy="60" r="47"
        stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.3"
        variants={stroke} custom={0.4}
      />

      {/* Twin sprigs, top and bottom */}
      <motion.path
        d="M44 26 Q60 18 76 26" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round"
        variants={stroke} custom={1.2}
      />
      <motion.path
        d="M42 94 Q60 102 78 94" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round"
        variants={stroke} custom={1.4}
      />

      {/* Side diamonds */}
      <motion.path
        d="M15 60 18 56.5 21 60 18 63.5Z M105 60 102 56.5 99 60 102 63.5Z"
        fill="currentColor" fillOpacity="0.75"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.5 }}
      />

      <motion.text
        x="60" y="60"
        textAnchor="middle" dominantBaseline="central"
        className="font-display"
        fill="currentColor"
        fontSize="34"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 1.05, ease: EASE }}
        style={{ transformOrigin: '60px 60px' }}
      >
        {couple.monogram}
      </motion.text>
    </motion.svg>
  );
}
