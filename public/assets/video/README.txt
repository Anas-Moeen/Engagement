فيديو الخلفية / Background video
================================

hero-landscape.mp4   1600x900   12s loop   ~350 KB   → desktop & tablet
hero-portrait.mp4     900x1600  12s loop   ~375 KB   → phones

Both are procedurally generated in the site's own palette
(forest #0B241C, moss #123A2C, gold #C8A96A) and loop seamlessly:
all motion is a pure sine of t/T, so the last frame flows into the first.
No licence, no attribution, no stock footage subscription.

Which file plays is chosen at runtime by orientation — see
src/components/ui/AmbientBackground.tsx. Paths live in
src/data/content.ts -> media.heroVideo

To swap in your own footage
---------------------------
Keep the same two filenames and the site picks them up unchanged.

  # landscape
  ffmpeg -i source.mp4 -t 12 -an -vf "scale=1600:-2,crop=1600:900" \
         -c:v libx264 -crf 26 -preset slow -pix_fmt yuv420p \
         -movflags +faststart hero-landscape.mp4

  # portrait
  ffmpeg -i source.mp4 -t 12 -an -vf "scale=-2:1600,crop=900:1600" \
         -c:v libx264 -crf 26 -preset slow -pix_fmt yuv420p \
         -movflags +faststart hero-portrait.mp4

Then re-export the poster stills (first frame of each):

  ffmpeg -i hero-landscape.mp4 -vframes 1 -q:v 4 \
         ../images/hero-landscape-poster.jpg
  ffmpeg -i hero-portrait.mp4 -vframes 1 -q:v 4 \
         ../images/hero-portrait-poster.jpg

Notes
- Always -an (no audio): saves bytes and avoids autoplay blocks.
- Keep the footage dark and slow; the overlay is tuned for low contrast.
- Free sources if you want real footage: Pexels Videos, Coverr, Mixkit.
- Set media.heroVideo to null in content.ts to use the animated CSS
  background instead — it needs no files at all.
