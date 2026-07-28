'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Music2, Pause, Play, Volume2, VolumeX, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { media, ui } from '@/data/content';
import { num } from '@/lib/utils';

/**
 * Floating music player.
 *
 * THE DOUBLE-AUDIO BUG, and why it happened:
 * the previous version returned early with its own <audio> element before the
 * control had faded in, then rendered a *second* <audio> inside a wrapper once
 * it had. React treats those as two different DOM nodes, so the element the
 * autoplay effect captured was not the element the buttons controlled. Tapping
 * pause paused the visible one while the orphaned one kept playing — and the
 * next tap started a second stream on top of it.
 *
 * The fix is structural: the <audio> tag is rendered exactly once, at a fixed
 * position in the tree, and never sits behind a conditional. Only the visible
 * control is conditional.
 */
export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  /** Autoplay is attempted at most once, ever. */
  const autoTried = useRef(false);
  /** Once the visitor pauses deliberately, nothing may restart it for them. */
  const userStopped = useRef(false);

  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(media.music.defaultVolume);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setReady(true), 2400);
    return () => window.clearTimeout(t);
  }, []);

/*
   * Getting sound going as early as the browser will allow.
   *
   * Step 1: try immediately on load. On desktop this often succeeds outright —
   * Chrome allows it once your "media engagement" score for the domain is high
   * enough, and some browsers allow it by default.
   *
   * Step 2: if that is refused (which it always is on a phone, first visit),
   * retry on the visitor's first interaction of any kind — tap, touch, click or
   * key press. Scrolling deliberately is NOT in that list: browsers do not
   * count a scroll as user activation, so listening for it would just fail.
   *
   * Taps on the player itself are excluded, otherwise pressing pause as your
   * very first action would start the track and immediately stop it.
   */
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.volume = media.music.defaultVolume;
    if (!media.music.autoplay) return;

    const EVENTS = ['pointerdown', 'touchstart', 'click', 'keydown'] as const;

    const stopListening = () => {
      EVENTS.forEach((ev) => window.removeEventListener(ev, onGesture));
    };

    const attempt = () => {
      if (autoTried.current || userStopped.current) return;
      el.muted = false;
      el.play()
        .then(() => {
          autoTried.current = true;
          stopListening();
        })
        .catch(() => {
          /* Blocked — keep waiting for a gesture. The button is always there. */
        });
    };

    function onGesture(e: Event) {
      if (panelRef.current?.contains(e.target as Node)) return;
      attempt();
    }

    /*
     * Every browser allows *muted* autoplay unconditionally. Starting the
     * track muted the instant the page loads means it is already decoded
     * and playing in the background, so the first real gesture only has to
     * flip `muted` off — instant, instead of also starting playback cold
     * (which can stall for a beat on a slow connection).
     */
    el.muted = true;
    el.play().catch(() => {
      /* Even muted autoplay can be refused in rare embedding contexts —
         the gesture-triggered attempt below still covers that case. */
    });

    EVENTS.forEach((ev) => window.addEventListener(ev, onGesture, { passive: true }));
    return stopListening;
  }, []);

  useEffect(() => {
    const el = audioRef.current;
    if (el) el.volume = muted ? 0 : volume;
  }, [volume, muted]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  function toggle() {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) {
      userStopped.current = false;
      autoTried.current = true;
      el.muted = false;
      el.play().catch(() => setPlaying(false));
    } else {
      userStopped.current = true;
      el.pause();
    }
  }

  return (
    <>
      {/* Rendered once, unconditionally. Do not move this inside a branch. */}
      <audio
        ref={audioRef}
        src={media.music.src}
        loop
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />

      <div
        ref={panelRef}
        className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] start-4 z-50 sm:start-6"
      >
        <AnimatePresence mode="wait" initial={false}>
          {ready && open && (
            <motion.div
              key="panel"
              initial={{ opacity: 0, y: 14, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 14, scale: 0.94 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-[17.5rem] rounded-[1.5rem] border border-gold/20 bg-forest-deep/85 p-4 shadow-lift backdrop-blur-2xl"
              role="group"
              aria-label={ui.music.label}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-display text-lg leading-loose text-cream">
                    {media.music.title}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-[0.8rem] text-cream/50">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        playing ? 'animate-pulse bg-gold' : 'bg-cream/30'
                      }`}
                    />
                    {playing ? ui.music.playing : ui.music.paused}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="-me-1 -mt-1 rounded-full p-2 text-cream/45 transition-colors hover:text-gold"
                  aria-label={ui.music.close}
                >
                  <X size={15} strokeWidth={1.75} />
                </button>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={toggle}
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gold-leaf text-forest-deep shadow-card transition-transform active:scale-95"
                  aria-label={playing ? ui.music.pause : ui.music.play}
                  aria-pressed={playing}
                >
                  {playing ? (
                    <Pause size={16} strokeWidth={2} />
                  ) : (
                    <Play size={16} strokeWidth={2} className="translate-x-[1px]" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setMuted((m) => !m)}
                  className="shrink-0 rounded-full p-2 text-cream/60 transition-colors hover:text-gold"
                  aria-label={muted ? ui.music.unmute : ui.music.mute}
                  aria-pressed={muted}
                >
                  {muted || volume === 0 ? (
                    <VolumeX size={16} strokeWidth={1.75} />
                  ) : (
                    <Volume2 size={16} strokeWidth={1.75} />
                  )}
                </button>

                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={Math.round((muted ? 0 : volume) * 100)}
                    onChange={(e) => {
                      setVolume(Number(e.target.value) / 100);
                      setMuted(false);
                    }}
                    className="slider"
                    aria-label={ui.music.volume}
                  />
                  <span className="w-8 shrink-0 text-end text-[0.75rem] tabular-nums text-cream/40">
                    {num(Math.round((muted ? 0 : volume) * 100))}
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {ready && !open && (
            <motion.button
              key="disc"
              type="button"
              onClick={() => setOpen(true)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative grid h-12 w-12 place-items-center rounded-full border border-gold/25 bg-forest-deep/80 text-gold shadow-lift backdrop-blur-2xl transition-colors hover:border-gold/60"
              aria-label={ui.music.open}
            >
              <Music2 size={16} strokeWidth={1.75} className={playing ? 'animate-pulse' : ''} />
              {playing && (
                <span className="pointer-events-none absolute -end-0.5 -top-0.5 flex h-3.5 w-3.5 items-end justify-center gap-[2px] rounded-full bg-forest-deep">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="w-[1.5px] rounded-full bg-gold"
                      animate={{ height: ['3px', '9px', '3px'] }}
                      transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18 }}
                    />
                  ))}
                </span>
              )}
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
