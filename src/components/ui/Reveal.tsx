'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  /** Stagger index — multiplied by 70ms. */
  index?: number;
  className?: string;
  as?: 'div' | 'li' | 'section' | 'figure';
};

/**
 * The single scroll-reveal used site-wide. One motion vocabulary everywhere
 * reads as intentional; a different easing per section reads as noise.
 */
export function Reveal({ children, index = 0, className, as = 'div' }: Props) {
  const Tag = motion[as];

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-12% 0px -8% 0px' }}
      transition={{
        duration: 0.85,
        delay: index * 0.07,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </Tag>
  );
}
