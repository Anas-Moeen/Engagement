'use client';

import { useEffect, useState } from 'react';

export type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
};

function diff(target: number): TimeLeft {
  const total = Math.max(0, target - Date.now());
  return {
    days: Math.floor(total / 86_400_000),
    hours: Math.floor((total / 3_600_000) % 24),
    minutes: Math.floor((total / 60_000) % 60),
    seconds: Math.floor((total / 1000) % 60),
    total,
  };
}

/**
 * Ticks once per second, indefinitely — even past zero, so callers can keep
 * deriving state (e.g. "event ended") off `Date.now()` without a refresh.
 * Returns `null` until mounted so the server-rendered markup and the first
 * client render match — otherwise hydration mismatches.
 */
export function useCountdown(isoDate: string) {
  const [left, setLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    const target = new Date(isoDate).getTime();
    setLeft(diff(target));

    const id = window.setInterval(() => {
      setLeft(diff(target));
    }, 1000);

    return () => window.clearInterval(id);
  }, [isoDate]);

  return left;
}
