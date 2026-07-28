'use client';

import { Check, Link2, Send, Share2 } from 'lucide-react';
import { useState } from 'react';
import { seo, siteUrl, ui } from '@/data/content';
import { Reveal } from './ui/Reveal';
import { Section } from './ui/Section';

export function ShareButtons() {
  const [copied, setCopied] = useState(false);

  /* Prefer the live URL at runtime so previews from a staging domain work too. */
  const url = typeof window !== 'undefined' ? window.location.href : siteUrl;

  const whatsapp = `https://wa.me/?text=${encodeURIComponent(`${seo.shareMessage} ${url}`)}`;
  const telegram = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(seo.shareMessage)}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      /* Clipboard is blocked in some in-app browsers; the share buttons still work. */
    }
  }

  async function nativeShare() {
    if (!navigator.share) return copy();
    try {
      await navigator.share({ title: seo.title, text: seo.shareMessage, url });
    } catch {
      /* Sheet dismissed. */
    }
  }

  return (
    <Section id="share" tone="cream" eyebrow={ui.share.eyebrow} title={ui.share.title} lede={ui.share.lede}>
      <Reveal>
        <div className="card mx-auto flex max-w-lg flex-col gap-3 p-7 sm:p-8">
          <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="btn-gold w-full">
            <Share2 size={16} strokeWidth={1.75} aria-hidden />
            {ui.share.whatsapp}
          </a>
          <a href={telegram} target="_blank" rel="noopener noreferrer" className="btn-outline w-full">
            <Send size={16} strokeWidth={1.75} aria-hidden />
            {ui.share.telegram}
          </a>

          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={copy} className="btn-outline !px-4">
              {copied ? (
                <><Check size={16} strokeWidth={1.75} aria-hidden />{ui.share.copied}</>
              ) : (
                <><Link2 size={16} strokeWidth={1.75} aria-hidden />{ui.share.copy}</>
              )}
            </button>
            <button type="button" onClick={nativeShare} className="btn-outline !px-4">
              <Share2 size={16} strokeWidth={1.75} aria-hidden />
              {ui.share.more}
            </button>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
