ضع ملف الموسيقى هنا باسم:  theme.mp3
Put your background music here as: theme.mp3

Keep it under ~2 MB / 128 kbps. It is lazy-loaded (preload="none")
so it never blocks first paint.

  ffmpeg -i source.wav -b:a 128k -ac 2 theme.mp3

The path, title and default volume are set in:
  src/data/content.ts -> media.music
