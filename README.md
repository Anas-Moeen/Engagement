# دعوة حفل خطوبة — Arabic Engagement Invitation

بطاقة دعوة إلكترونية فاخرة، صفحة واحدة، مهيّأة للمشاركة عبر واتساب وتيليجرام.

**Next.js 14 (App Router) · React 18 · TypeScript · Tailwind CSS · Framer Motion · Lucide**

RTL · Amiri + IBM Plex Sans Arabic

---

## التشغيل / Run it

```bash
npm install
cp .env.example .env.local   # set NEXT_PUBLIC_SITE_URL
npm run dev
```

```bash
npm run build && npm start
```

---

## ١. تعديل بيانات المناسبة

**`src/data/content.ts`** — هذا هو الملف الوحيد الذي تحتاج تعديله.

It holds the bride and groom names, Gregorian and Hijri dates, time, venue,
Google Maps URL and coordinates, timeline, contact numbers, RSVP settings,
media paths, SEO/Open Graph text — and every visible string on the site under
the `ui` object. No component contains hard-coded content.

## ٢. فيديو الخلفية

ضع الملف في `public/assets/video/hero.mp4` — المسار في `media.heroVideo`.

اجعله `null` لاستخدام الخلفية المتحركة بدلاً منه.

```bash
ffmpeg -i source.mp4 -t 18 -an -vf "scale=1280:-2" \
       -c:v libx264 -crf 30 -preset slow -movflags +faststart hero.mp4
```

The video is skipped automatically on 2G, on save-data connections, and when
the visitor prefers reduced motion — the animated backdrop takes over with no
layout shift. Free sources: Pexels Videos, Coverr, Mixkit.

Poster still: `public/assets/images/hero-poster.jpg` (`media.heroPoster`).

## ٣. الموسيقى

ضع الملف في `public/assets/audio/theme.mp3` — الإعدادات في `media.music`
(المسار، الاسم المعروض، ومستوى الصوت الافتراضي).

Under ~2 MB / 128 kbps. Lazy-loaded, so it never blocks first paint.

## ٤. صورة المشاركة (Open Graph)

مُولَّدة تلقائياً — `src/app/opengraph-image.tsx` ينشئ بطاقة ١٢٠٠×٦٣٠ من
المحتوى أثناء البناء، فلا تتعارض أبداً مع بيانات الموقع.

To use a static image instead: delete that file and add `openGraph.images`
to `src/app/layout.tsx`.

## ٥. الألوان والخطوط

- **الألوان:** `tailwind.config.ts` → `theme.extend.colors` (`forest`, `gold`, `cream`, `paper`)
- **الخطوط:** `src/app/layout.tsx` → the two `next/font/google` imports.
  Tajawal or Cairo drop in directly; the `--font-display` / `--font-body`
  CSS variables carry the change everywhere.

---

## ملاحظات عربية / Arabic typography notes

- `letter-spacing` مضبوط على `0` إجبارياً — التتبّع يقطع وصلات الحروف.
- Line-heights are looser than a Latin design would use: tight leading clips
  the descenders on ج ح خ and the dots under ب ي.
- الأرقام تظهر عربية (٠١٢٣) — للتبديل: `settings.arabicNumerals`.
- Phone numbers and clock values are wrapped in `.ltr` so the bidi algorithm
  doesn't reorder them.
- The countdown ring depletes anticlockwise, following the reading direction.

## معاينة الروابط / Link previews

`NEXT_PUBLIC_SITE_URL` **must** be the real deployed origin before you build —
WhatsApp and Telegram both require absolute `og:image` URLs.

- **Telegram** caches hard: message [@WebpageBot](https://t.me/WebpageBot) to refresh.
- **WhatsApp** caches ~7 days and reads only the first ~300 KB of HTML.
- Verify with the [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/).

## في المتصفحات المدمجة

- البطل يستخدم `100svh` لا `100vh` — تيليجرام وواتساب يضعان شريطاً فوق الصفحة.
- `viewportFit: cover` + `env(safe-area-inset-bottom)` يبقي مشغّل الموسيقى واضحاً.
- الموسيقى لا تعمل تلقائياً؛ محاولة صامتة واحدة عند أول لمسة، والزر ظاهر دائماً.

## البنية

```
src/
  app/                 layout, page, metadata, OG image, icons, RSVP route
  components/          قسم واحد لكل ملف
  components/ui/       Section, Reveal, Monogram, Ornament, AmbientBackground
  data/content.ts      كل المحتوى ← عدّل هنا فقط
  lib/                 countdown hook, Arabic numerals, calendar + map links
public/assets/
  video/  audio/  images/
```

## ربط تأكيد الحضور

`src/app/api/rsvp/route.ts` يتحقق من الرد ثم يسجّله في الـ console.
Swap the `console.log` for a Google Sheet, Airtable, Resend email, or a
database insert. The payload shape is already what you need for seating.
