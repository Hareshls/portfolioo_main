import { useEffect } from 'react';
import Preloader from './components/Preloader';
import Nav from './components/Nav';
import Hero from './components/Hero';
import HeroFly from './components/HeroFly';
import Marquee from './components/Marquee';
import About from './components/About';
import Skills from './components/Skills';
import Story from './components/Story';
import Projects from './components/Projects';
import Education from './components/Education';
import Proof from './components/Proof';
import Contact from './components/Contact';

/** Adaptive font scaling above 1920px */
function initAdaptiveGrid() {
  function grid() {
    const w = innerWidth;
    const red = ((1920 - w) / 1920) * 100 * 0.6666;
    const s = 16 - 16 * red / 100;
    if (s > 16) document.documentElement.style.fontSize = s + 'px';
    else document.documentElement.style.removeProperty('font-size');
  }
  grid();
  window.addEventListener('resize', grid);
}

/** Splits [data-a] headings into lines / letters. */
function initReveals() {
  document.querySelectorAll('[data-a]').forEach((el) => {
    if (el.dataset.a === 'chars') {
      el.querySelectorAll('[data-line]').forEach((l) => {
        const t = l.textContent;
        l.innerHTML = `<span style="transform:none;opacity:1;transition:none">${[...t]
          .map((c) => `<span class="ch">${c}</span>`)
          .join('')}</span>`;
        l.querySelectorAll('.ch').forEach((c, i) => {
          c.style.transitionDelay = i * 52 + (l.nextElementSibling ? 0 : 240) + 'ms';
        });
      });
    } else {
      const kids = [...el.querySelectorAll(':scope>span')];
      kids.forEach((k, i) => {
        const t = k.innerHTML;
        k.className = 'ln';
        k.innerHTML = `<span style="transition-delay:${i * +(el.dataset.st || 90)}ms">${t}</span>`;
      });
    }
  });
}

/** Scroll-triggered reveals: adds .on once element enters viewport. */
function observeReveals() {
  const io = new IntersectionObserver((es) =>
    es.forEach((e) => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      const delay = +(e.target.dataset.d || 0);
      setTimeout(() => e.target.classList.add('on'), delay);
    })
  );
  document.querySelectorAll('.fu,[data-a]').forEach((el) => {
    if (el.closest('#top') && (el.dataset.d || el.dataset.a)) return;
    io.observe(el);
  });
}

export default function App() {
  useEffect(() => {
    initAdaptiveGrid();
    // Give React one frame to render the DOM, then init reveals
    requestAnimationFrame(() => {
      initReveals();
      observeReveals();
    });
  }, []);

  return (
    <>
      {/* SVG liquid distortion filter (shared by projects) */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <filter id="lf">
          <feTurbulence id="ft" type="fractalNoise" baseFrequency=".009" numOctaves="2" result="n" />
          <feDisplacementMap id="fd" in="SourceGraphic" in2="n" scale="1" />
        </filter>
      </svg>

      <Preloader />
      <Nav />

      <main>
        <Hero />
        <HeroFly />
        <Marquee />
        <About />
        <Skills />
        <Story />
        <Projects />
        <Education />
        <Proof />
        <Contact />
      </main>
    </>
  );
}
