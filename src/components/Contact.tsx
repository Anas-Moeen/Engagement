import { MessageCircle, Phone } from 'lucide-react';
import { contacts, ui } from '@/data/content';
import { num } from '@/lib/utils';
import { Ornament } from './ui/Ornament';
import { Reveal } from './ui/Reveal';

export function Contact() {
  return (
    <section id="contact" className="grain relative overflow-x-clip bg-forest/[0.70] py-24 text-cream sm:py-32">
      <div className="shell relative">
        <header className="mx-auto mb-16 max-w-xl text-center">
          <Reveal><p className="eyebrow text-gold">{ui.contact.eyebrow}</p></Reveal>
          <Reveal index={1}>
            <h2 className="mt-3 font-display text-display-sm">{ui.contact.title}</h2>
          </Reveal>
          <Reveal index={2}><Ornament width={150} className="mx-auto mt-5 opacity-80" /></Reveal>
          <Reveal index={3}>
            <p className="mx-auto mt-6 max-w-sm text-[1rem] font-light leading-loose text-cream/60">
              {ui.contact.lede}
            </p>
          </Reveal>
        </header>

        <ul className="mx-auto grid max-w-2xl gap-4 sm:grid-cols-2">
          {contacts.map((person, i) => (
            <Reveal as="li" key={person.phone} index={i}>
              <div className="card-dark flex h-full flex-col p-8 text-center transition-colors duration-500 hover:border-gold/35">
                <p className="pb-[0.08em] font-display text-[1.625rem] leading-[1.65]">{person.name}</p>
                <p className="mt-1.5 text-[0.8125rem] text-cream/40">{person.role}</p>
                <p className="ltr mt-5 text-[0.9375rem] font-light tabular-nums text-gold-soft">
                  {num(person.phone)}
                </p>
                <div className="mt-7 grid grid-cols-2 gap-2.5">
                  <a href={`tel:${person.phone.replace(/\s/g, '')}`} className="btn-ghost-light !px-3 !text-[0.875rem]">
                    <Phone size={15} strokeWidth={1.75} aria-hidden />
                    {ui.contact.call}
                  </a>
                  <a
                    href={`https://wa.me/${person.phone.replace(/\D/g, '')}`}
                    target="_blank" rel="noopener noreferrer"
                    className="btn-ghost-light !px-3 !text-[0.875rem]"
                  >
                    <MessageCircle size={15} strokeWidth={1.75} aria-hidden />
                    {ui.contact.chat}
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
