import type { Metadata, Viewport } from 'next';
import { Amiri, IBM_Plex_Sans_Arabic } from 'next/font/google';
import { couple, event, seo, siteUrl } from '@/data/content';
import './globals.css';

/** Display: a Naskh with real calligraphic contrast. Headings only. */
const display = Amiri({
  subsets: ['arabic', 'latin'],
  weight: ['400', '700'],
  variable: '--font-display',
  display: 'swap',
  preload: true,
});

/** Body/UI: stays legible at 13px, which Amiri does not. */
const body = IBM_Plex_Sans_Arabic({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: seo.title,
  description: seo.description,
  keywords: [...seo.keywords],
  applicationName: seo.title,
  authors: [{ name: `${couple.bride.full} و ${couple.groom.full}` }],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: siteUrl,
    siteName: seo.title,
    title: seo.title,
    description: seo.description,
    locale: seo.locale,
  },
  twitter: {
    card: 'summary_large_image',
    title: seo.title,
    description: seo.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  formatDetection: { telephone: true, address: false, email: false },
  other: { 'og:image:alt': seo.ogImageAlt },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FDFBF7' },
    { media: '(prefers-color-scheme: dark)', color: '#0B241C' },
  ],
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Event',
  name: seo.title,
  description: seo.description,
  inLanguage: 'ar',
  startDate: event.startsAt,
  endDate: event.endsAt,
  eventStatus: 'https://schema.org/EventScheduled',
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  location: {
    '@type': 'Place',
    name: event.venue.name,
    address: event.venue.address,
    geo: { '@type': 'GeoCoordinates', latitude: event.venue.lat, longitude: event.venue.lng },
  },
  image: [`${siteUrl}/opengraph-image`],
  url: siteUrl,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${display.variable} ${body.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
