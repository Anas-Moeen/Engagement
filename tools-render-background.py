"""
Renders a seamlessly-looping cinematic background in the invitation's palette.

Every motion is a pure sine of t/T, so frame N is identical to frame 0 and the
loop has no visible seam. Nothing here is random per-frame except the grain,
which is too fine to read as a jump.

Palette is pulled straight from the site tokens:
  forest-moss #123A2C · forest #0B241C · forest-deep #071812 · gold #C8A96A
"""
# Usage:
#   python3 tools-render-background.py 1600 900 public/assets/video/hero-landscape.mp4 7
#   python3 tools-render-background.py 900 1600 public/assets/video/hero-portrait.mp4 7
#
# Requires: python3, numpy, ffmpeg. Change the palette constants below to
# match a new colour scheme.
import subprocess
import sys

import numpy as np

TAU = 2 * np.pi

MOSS = np.array([0x12, 0x3A, 0x2C], dtype=np.float32)
DEEP = np.array([0x07, 0x18, 0x12], dtype=np.float32)
GOLD = np.array([0xC8, 0xA9, 0x6A], dtype=np.float32)
GOLD_SOFT = np.array([0xDF, 0xC8, 0x94], dtype=np.float32)


def gaussian_sprite(radius: int) -> np.ndarray:
    """A soft round falloff, used for both bokeh and the big light pools."""
    size = radius * 2 + 1
    y, x = np.ogrid[-radius : radius + 1, -radius : radius + 1]
    d = np.sqrt(x * x + y * y) / radius
    g = np.clip(1.0 - d, 0.0, 1.0) ** 2.2
    return g.astype(np.float32)


def bokeh_sprite(radius: int) -> np.ndarray:
    """Soft disc with a brighter core — what an out-of-focus highlight does."""
    size = radius * 2 + 1
    y, x = np.ogrid[-radius : radius + 1, -radius : radius + 1]
    d = np.sqrt(x * x + y * y) / radius
    halo = np.clip(1.0 - d, 0.0, 1.0) ** 2.6
    core = np.clip(1.0 - d / 0.42, 0.0, 1.0) ** 1.5
    return (halo * 0.75 + core * 0.55).astype(np.float32)


def composite(canvas, sprite, cx, cy, colour, alpha):
    """Additive blend of a sprite onto the canvas, clipped at the edges."""
    if alpha <= 0.002:
        return
    r = sprite.shape[0] // 2
    H, W = canvas.shape[:2]

    x0, y0 = int(cx) - r, int(cy) - r
    x1, y1 = x0 + sprite.shape[1], y0 + sprite.shape[0]

    sx0, sy0 = max(0, -x0), max(0, -y0)
    sx1, sy1 = sprite.shape[1] - max(0, x1 - W), sprite.shape[0] - max(0, y1 - H)
    if sx1 <= sx0 or sy1 <= sy0:
        return

    dx0, dy0 = max(0, x0), max(0, y0)
    patch = sprite[sy0:sy1, sx0:sx1, None] * (colour * alpha)
    canvas[dy0 : dy0 + patch.shape[0], dx0 : dx0 + patch.shape[1]] += patch


def build_background(W, H):
    """Static vertical gradient plus a corner warmth. Rendered once."""
    yy = np.linspace(0, 1, H, dtype=np.float32)[:, None]
    # Ease the gradient so the darkest band sits low, where text rarely lands.
    t = yy ** 1.35
    base = MOSS[None, None, :] * (1 - t[:, :, None]) + DEEP[None, None, :] * t[:, :, None]
    base = np.repeat(base, W, axis=1)

    # A faint cool lift across the upper third keeps it from going flat.
    xx = np.linspace(0, 1, W, dtype=np.float32)[None, :, None]
    lift = np.exp(-(((yy[:, :, None] - 0.22) / 0.42) ** 2)) * (0.5 + 0.5 * xx)
    base += lift * np.array([6, 14, 11], dtype=np.float32)
    return base


def vignette(W, H, strength=0.55):
    yy = np.linspace(-1, 1, H, dtype=np.float32)[:, None]
    xx = np.linspace(-1, 1, W, dtype=np.float32)[None, :]
    d = np.sqrt(xx * xx * 0.85 + yy * yy)
    v = 1.0 - strength * np.clip((d - 0.35) / 0.9, 0, 1) ** 1.6
    return v[:, :, None].astype(np.float32)


def make_particles(n, seed, W, H):
    """Fixed table of bokeh motes — deterministic, so renders are repeatable."""
    rng = np.random.default_rng(seed)
    short = min(W, H)
    return [
        dict(
            x=rng.uniform(-0.05, 1.05) * W,
            y=rng.uniform(-0.05, 1.05) * H,
            r=int(rng.uniform(0.012, 0.055) * short),
            # Amplitude of the periodic drift, in pixels.
            ax=rng.uniform(0.01, 0.05) * W,
            ay=rng.uniform(0.03, 0.11) * H,
            phase=rng.uniform(0, TAU),
            phase2=rng.uniform(0, TAU),
            # Each mote completes a whole number of cycles per loop.
            cycles=int(rng.integers(1, 3)),
            peak=rng.uniform(0.10, 0.42),
            warm=rng.random() < 0.4,
        )
        for _ in range(n)
    ]


def render(width, height, seconds, fps, out_path, seed):
    W, H, N = width, height, int(seconds * fps)
    short = min(W, H)

    base = build_background(W, H)
    vig = vignette(W, H)

    particles = make_particles(46, seed, W, H)
    sprites = {}
    for p in particles:
        if p["r"] not in sprites:
            sprites[p["r"]] = bokeh_sprite(p["r"])

    # Three large light pools that breathe. These carry most of the "cinematic".
    pool_r = int(short * 0.55)
    pool_sprite = gaussian_sprite(pool_r)
    pools = [
        dict(x=0.20 * W, y=0.14 * H, ax=0.05 * W, ay=0.04 * H, phase=0.0, peak=0.38, col=MOSS * 3.0),
        dict(x=0.84 * W, y=0.78 * H, ax=0.06 * W, ay=0.05 * H, phase=2.1, peak=0.16, col=GOLD),
        dict(x=0.62 * W, y=0.34 * H, ax=0.04 * W, ay=0.06 * H, phase=4.0, peak=0.07, col=GOLD_SOFT),
    ]

    sparks = make_particles(30, seed + 501, W, H)
    for sp in sparks:
        sp["r"] = max(2, int(short * 0.0035))
        sp["peak"] = np.random.default_rng(sp["phase"].__hash__() & 0xFFFF).uniform(0.55, 1.0)
    spark_sprite = bokeh_sprite(max(2, int(short * 0.0035)))

    ff = subprocess.Popen(
        [
            "ffmpeg", "-y", "-loglevel", "error",
            "-f", "rawvideo", "-pix_fmt", "rgb24",
            "-s", f"{W}x{H}", "-r", str(fps), "-i", "-",
            "-an",
            "-c:v", "libx264", "-preset", "slow", "-crf", "26",
            # One keyframe per loop, at the loop point, so quality does not
            # swing across the GOP and reveal the (mathematically seamless) join.
            "-x264-params", f"keyint={int(seconds*fps)}:min-keyint={int(seconds*fps)}:scenecut=0",
            "-pix_fmt", "yuv420p", "-profile:v", "high", "-level", "4.0",
            "-movflags", "+faststart",
            out_path,
        ],
        stdin=subprocess.PIPE,
    )

    rng = np.random.default_rng(99)
    for i in range(N):
        t = i / N  # 0 → 1 across the loop
        canvas = base.copy()

        for p in pools:
            a = TAU * t + p["phase"]
            alpha = p["peak"] * (0.72 + 0.28 * np.sin(a))
            composite(
                canvas, pool_sprite,
                p["x"] + p["ax"] * np.sin(a),
                p["y"] + p["ay"] * np.cos(a),
                p["col"], alpha,
            )

        for p in particles:
            a = TAU * t * p["cycles"] + p["phase"]
            # Opacity pulse on a different phase so motes twinkle out of sync.
            fade = 0.5 + 0.5 * np.sin(TAU * t * p["cycles"] + p["phase2"])
            composite(
                canvas, sprites[p["r"]],
                p["x"] + p["ax"] * np.sin(a),
                p["y"] + p["ay"] * np.sin(a + 1.2),
                GOLD_SOFT if p["warm"] else GOLD,
                p["peak"] * (0.25 + 0.75 * fade),
            )

        for p in sparks:
            a = TAU * t * p["cycles"] + p["phase"]
            fade = 0.5 + 0.5 * np.sin(TAU * t * p["cycles"] + p["phase2"])
            composite(
                canvas, spark_sprite,
                p["x"] + p["ax"] * np.sin(a),
                p["y"] + p["ay"] * np.sin(a + 0.8),
                GOLD_SOFT, p["peak"] * fade ** 2.5,
            )

        canvas *= vig

        # Fine grain. Ties the layers into one image and, more usefully, gives
        # x264 something to dither against so the gradients don't band.
        canvas += rng.normal(0, 2.1, (H, W, 1)).astype(np.float32)

        ff.stdin.write(np.clip(canvas, 0, 255).astype(np.uint8).tobytes())

        if i % 40 == 0:
            print(f"  {out_path}: {i}/{N}", flush=True)

    ff.stdin.close()
    ff.wait()
    print(f"  done {out_path}")


if __name__ == "__main__":
    w, h, out, seed = int(sys.argv[1]), int(sys.argv[2]), sys.argv[3], int(sys.argv[4])
    render(w, h, seconds=12, fps=25, out_path=out, seed=seed)
