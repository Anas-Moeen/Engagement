'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { media, settings } from '@/data/content';

/**
 * Option A and Option B in one component.
 *
 * If `media.heroVideo` is set AND the file loads AND the visitor hasn't asked
 * for reduced motion AND they aren't on a metered connection, we play the
 * cinematic loop. Any one of those failing falls through to the animated
 * gradient-and-particle background, which is never a visible downgrade — it is
 * the same palette, same motion vocabulary, no layout shift.
 */
export function AmbientBackground({ fixed = false }: { fixed?: boolean } = {}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  const [videoOk, setVideoOk] = useState(false);
  const [allowVideo, setAllowVideo] = useState(false);
  const [portrait, setPortrait] = useState(false);

  /* Two crops of the same loop. A single landscape file on a phone would be
     scaled ~2.4x by object-cover, throwing away most of the frame and softening
     what is left; the portrait cut is composed for that aspect instead. */
  useEffect(() => {
    const mq = window.matchMedia('(orientation: portrait)');
    const sync = () => setPortrait(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (!media.heroVideo || reduced) return;

    // Don't burn a guest's mobile data on a decorative loop.
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } })
      .connection;
    if (conn?.saveData) return;
    if (conn?.effectiveType && /2g/.test(conn.effectiveType)) return;

    setAllowVideo(true);
  }, [reduced]);

  const source = media.heroVideo
    ? portrait
      ? media.heroVideo.portrait
      : media.heroVideo.landscape
    : null;
  const poster = portrait ? media.heroPoster.portrait : media.heroPoster.landscape;

  /* Rotating the device swaps the file, so reload and restart. */
  useEffect(() => {
    const el = videoRef.current;
    if (!el || !allowVideo) return;
    el.load();
    // Some in-app browsers ignore the autoplay attribute but honour .play().
    el.play().catch(() => setVideoOk(false));
  }, [allowVideo, source]);

  const showVideo = allowVideo && videoOk;

  return (
    <div
      className={`${fixed ? 'fixed' : 'absolute'} inset-0 -z-10 overflow-hidden bg-forest`}
      aria-hidden
    >
      {allowVideo && source && (
        <video
          key={source}
          ref={videoRef}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
            showVideo ? 'opacity-100' : 'opacity-0'
          }`}
          src={source}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          disablePictureInPicture
          onCanPlay={() => setVideoOk(true)}
          onError={() => setVideoOk(false)}
        />
      )}

      {/* Animated fallback — also stays behind the video as a colour bed, so a
          slow first frame never flashes black. */}
      <AnimatedBackdrop dimmed={showVideo} />

      {/* Readability veil. Deeper at the edges so the centred text sits in the
          calmest part of the frame. */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(120% 90% at 50% 45%, rgba(7,24,18,${
            settings.videoOverlayOpacity * 0.6
          }) 0%, rgba(7,24,18,${settings.videoOverlayOpacity}) 55%, rgba(7,24,18,0.96) 100%)`,
        }}
      />

      {/* Fine grain over everything ties video and CSS layers into one image. */}
      <div className="grain absolute inset-0" />
    </div>
  );
}

/** Slow gold pools + drifting motes. Deliberately under-animated. */
function AnimatedBackdrop({ dimmed }: { dimmed: boolean }) {
  const reduced = useReducedMotion();

  return (
    <div
      className={`absolute inset-0 transition-opacity duration-1000 ${
        dimmed ? 'opacity-30' : 'opacity-100'
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-forest-moss via-forest to-forest-deep" />

      <div className="absolute -top-1/4 start-1/4 h-[70vh] w-[70vh] animate-drift rounded-full bg-forest-mist/30 blur-[120px]" />
      <div
        className="absolute bottom-[-25%] end-[-10%] h-[55vh] w-[55vh] animate-drift rounded-full bg-gold/[0.10] blur-[110px]"
        style={{ animationDelay: '-7s' }}
      />
      <div
        className="absolute top-1/3 end-1/4 h-[40vh] w-[40vh] animate-drift rounded-full bg-gold/[0.06] blur-[100px]"
        style={{ animationDelay: '-14s' }}
      />

      {!reduced && <Motes />}
    </div>
  );
}

/**
 * Fourteen gold motes. Positions come from a fixed table rather than
 * Math.random() so the server and client render identical markup.
 */
const MOTES = [
  { x: 8, y: 22, s: 2.5, d: 19, delay: 0 },
  { x: 17, y: 68, s: 1.5, d: 24, delay: 3 },
  { x: 26, y: 12, s: 2, d: 21, delay: 6 },
  { x: 34, y: 84, s: 3, d: 26, delay: 1 },
  { x: 43, y: 38, s: 1.5, d: 18, delay: 8 },
  { x: 51, y: 74, s: 2, d: 23, delay: 4 },
  { x: 59, y: 18, s: 2.5, d: 27, delay: 9 },
  { x: 66, y: 56, s: 1.5, d: 20, delay: 2 },
  { x: 74, y: 30, s: 2, d: 25, delay: 11 },
  { x: 81, y: 79, s: 3, d: 22, delay: 5 },
  { x: 88, y: 44, s: 1.5, d: 28, delay: 7 },
  { x: 94, y: 15, s: 2, d: 19, delay: 10 },
  { x: 12, y: 48, s: 2, d: 30, delay: 12 },
  { x: 70, y: 92, s: 1.5, d: 24, delay: 14 },
] as const;

function Motes() {
  return (
    <div className="absolute inset-0">
      {MOTES.map((m, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-gold-soft"
          style={{
            left: `${m.x}%`,
            top: `${m.y}%`,
            width: m.s,
            height: m.s,
            boxShadow: '0 0 6px 1px rgba(223,200,148,0.5)',
          }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.65, 0.2, 0.7, 0],
            y: [0, -70, -140],
            x: [0, i % 2 ? 18 : -18, 0],
          }}
          transition={{
            duration: m.d,
            delay: m.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}
