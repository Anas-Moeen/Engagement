'use client';

import { MotionConfig } from 'framer-motion';
import type { ReactNode } from 'react';

/**
 * The CSS `prefers-reduced-motion` block in globals.css cannot reach Framer
 * Motion's JS-driven animations. `reducedMotion="user"` makes Framer honour the
 * same OS setting, so the two stay in agreement.
 */
export function Motion({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
