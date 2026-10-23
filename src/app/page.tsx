import { SmoothScroll } from "@/components/SmoothScroll";
import { Nav } from "@/components/Nav";
import { ScrollProgress } from "@/components/ScrollProgress";
import { Cursor } from "@/components/Cursor";
import { Hero } from "@/components/hero/Hero";
import { Featured } from "@/components/sections/Featured";
import { Work } from "@/components/sections/Work";
import { Skills } from "@/components/sections/Skills";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";

export default function Page() {
  return (
    <SmoothScroll>
      <ScrollProgress />
      <Nav />
      <Cursor />
      <main id="main">
        <Hero />
        <Featured />
        <Work />
        <Skills />
        <About />
        <Contact />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
