'use client';

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { useState } from 'react';
import { couple, ui } from '@/data/content';

/** Appears only once the hero has been passed — the hero should own the screen. */
export function Nav() {
  const { scrollY } = useScroll();
  const [shown, setShown] = useState(false);

  useMotionValueEvent(scrollY, 'change', (y) => {
    setShown(y > window.innerHeight * 0.85);
  });

  const links = [
    { href: '#details', label: ui.nav.details },
    { href: '#timeline', label: ui.nav.program },
    { href: '#location', label: ui.nav.location },
    { href: '#contact', label: ui.nav.contact },
  ];

  return (
    <AnimatePresence>
      {shown && (
        <motion.nav
          initial={{ y: -70, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -70, opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-x-0 top-0 z-40 border-b border-forest/[0.07] bg-paper/85 backdrop-blur-xl"
        >
          <div className="shell flex h-14 items-center gap-3 sm:gap-6">
            <a
              href="#top"
              className="shrink-0 font-display text-lg text-forest"
              aria-label={ui.nav.toTop}
            >
              {couple.monogram}
            </a>

            <ul className="no-scrollbar flex min-w-0 flex-1 items-center justify-end gap-1 overflow-x-auto sm:flex-none sm:gap-6">
              {links.map((link) => (
                <li key={link.href} className="shrink-0">
                  <a
                    href={link.href}
                    className="block whitespace-nowrap rounded-pill px-2.5 py-1.5 text-[0.8125rem] text-forest/60 transition-colors hover:text-gold-deep sm:px-0 sm:py-0 sm:text-[0.9375rem]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
