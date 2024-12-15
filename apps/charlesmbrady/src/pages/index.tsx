import About from './about';
import Projects from './projects';
import Contact from './contact';
import Hero from '../components/tempHero';

export default function Index() {
  return (
    <>
      <Hero text="Charles Brady" subtext="Full Stack Developer" />
      <About />
      <Projects />
      <Contact />
    </>
  );
}
