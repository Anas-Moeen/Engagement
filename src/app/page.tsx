import { Contact } from '@/components/Contact';
import { CountdownSection } from '@/components/CountdownSection';
import { EventDetails } from '@/components/EventDetails';
import { Footer } from '@/components/Footer';
import { Hero } from '@/components/Hero';
import { Location } from '@/components/Location';
import { MusicPlayer } from '@/components/MusicPlayer';
import { Nav } from '@/components/Nav';
import { ShareButtons } from '@/components/ShareButtons';
import { Timeline } from '@/components/Timeline';
import { AmbientBackground } from '@/components/ui/AmbientBackground';
import { Motion } from '@/components/ui/Motion';

export default function Home() {
  return (
    <Motion>
      {/* One video layer behind the whole page. `fixed` keeps it in place while
          the content scrolls over it, so it is visible in every section rather
          than only the hero. */}
      <AmbientBackground fixed />
      <Nav />
      <main>
        <Hero />
        <EventDetails />
        <CountdownSection />
        <Timeline />
        <Location />
        <ShareButtons />
        <Contact />
      </main>
      <Footer />
      <MusicPlayer />
    </Motion>
  );
}
