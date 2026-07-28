import { cn } from '@/lib/utils';

/**
 * A gold flourish used as a section divider and inside the hero card.
 * One shape, reused — a different ornament per section would read as clutter.
 */
export function Ornament({ className, width = 190 }: { className?: string; width?: number }) {
  return (
    <svg
      viewBox="0 0 200 24"
      width={width}
      height={(width / 200) * 24}
      fill="none"
      aria-hidden
      className={cn('text-gold', className)}
    >
      <path
        d="M2 12h58M140 12h58"
        stroke="currentColor"
        strokeWidth="0.75"
        strokeOpacity="0.5"
        strokeLinecap="round"
      />
      <path
        d="M62 12c8-7 14-7 20 0-6 7-12 7-20 0Z"
        stroke="currentColor"
        strokeWidth="0.9"
        strokeLinejoin="round"
      />
      <path
        d="M138 12c-8-7-14-7-20 0 6 7 12 7 20 0Z"
        stroke="currentColor"
        strokeWidth="0.9"
        strokeLinejoin="round"
      />
      <path d="M100 4.5 103.2 12 100 19.5 96.8 12 100 4.5Z" fill="currentColor" fillOpacity="0.85" />
      <circle cx="86" cy="12" r="1.4" fill="currentColor" fillOpacity="0.7" />
      <circle cx="114" cy="12" r="1.4" fill="currentColor" fillOpacity="0.7" />
    </svg>
  );
}
