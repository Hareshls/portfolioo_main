import { useEffect, useRef, useState } from 'react';
import { tick } from '../utils/helpers';

let lenis = null;
export const getLenis = () => lenis;

export const openAndDownloadResume = (e) => {
  if (e && e.preventDefault) e.preventDefault();
  // 1. Open the resume PDF in a new tab for instant reading
  window.open('/Haresh_LS_Resume.pdf', '_blank', 'noopener,noreferrer');

  // 2. Automatically trigger the download
  const link = document.createElement('a');
  link.href = '/Haresh_LS_Resume.pdf';
  link.download = 'Haresh_LS_Resume.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const SECTIONS = ['top', 'about', 'skills', 'ventures', 'contact'];
const NAV_LINKS = [
  { label: 'Home', href: '#top' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#ventures' },
  { label: 'Contact', href: '#contact' },
];
const MOBILE_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Story', href: '#story' },
  { label: 'Projects', href: '#ventures' },
  { label: 'Education', href: '#education' },
  { label: 'Proof', href: '#voices' },
  { label: 'Contact', href: '#contact' },
];

export default function Nav() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const bgRef = useRef(null);
  const mmRef = useRef(null);

  // Global listener for opening & downloading resume
  useEffect(() => {
    const handleOpenResume = () => openAndDownloadResume();
    window.addEventListener('open-resume', handleOpenResume);
    return () => window.removeEventListener('open-resume', handleOpenResume);
  }, []);

  // Smooth scroll init (Lenis)
  useEffect(() => {
    history.scrollRestoration = 'manual';
    scrollTo(0, 0);

    import('https://cdn.jsdelivr.net/npm/lenis@1.3.19/dist/lenis.mjs')
      .then((m) => {
        lenis = new m.default({ smoothWheel: true });
        lenis.scrollTo(0, { immediate: true, force: true });

        const pre = window.__pre;
        if (!pre || pre.done) {
          lenis.start();
        } else {
          lenis.stop();
          document.addEventListener('preloader:done', () => {
            scrollTo(0, 0);
            document.documentElement.style.overflow = '';
            lenis.start();
          }, { once: true });
        }

        (function r(t) { lenis.raf(t); requestAnimationFrame(r); })(0);
      })
      .catch(() => {});

    // Anchor smooth scroll
    const handleAnchor = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const t = document.querySelector(a.getAttribute('href'));
      if (t) {
        e.preventDefault();
        lenis ? lenis.scrollTo(t) : t.scrollIntoView({ behavior: 'smooth' });
      }
    };
    document.addEventListener('click', handleAnchor);
    return () => document.removeEventListener('click', handleAnchor);
  }, []);

  // Scroll spy
  useEffect(() => {
    tick(() => {
      const secs = SECTIONS.map((id) => document.getElementById(id)).filter(Boolean);
      let cur = 0;
      secs.forEach((s, i) => { if (s.getBoundingClientRect().top < innerHeight * 0.45) cur = i; });
      setActiveIdx(cur);
    }, 120);
  }, []);

  // Toggle mobile menu
  const toggleMenu = () => {
    const next = !menuOpen;
    setMenuOpen(next);
    next ? lenis?.stop() : lenis?.start();
  };
  const closeMenu = () => { setMenuOpen(false); lenis?.start(); };

  return (
    <>
      <header id="hd">
        <nav className="t" aria-label="Primary">
          <div className="logo">
            <span className="logo-dot" />
            <span className="logo-text">HARESH LS</span>
          </div>
          <ul className="nl">
            {NAV_LINKS.map((l, i) => (
              <li key={l.href}>
                <a className={activeIdx === i ? 'on' : ''} href={l.href}>{l.label}</a>
              </li>
            ))}
            <li className="nl-divider" aria-hidden="true" />
            <li>
              <a
                href="/Haresh_LS_Resume.pdf"
                target="_blank"
                rel="noreferrer noopener"
                className="nl-resume"
                onClick={openAndDownloadResume}
                aria-label="Open resume in new tab and download"
              >
                Resume
              </a>
            </li>
          </ul>
          <button
            className={`bg${menuOpen ? ' x' : ''}`}
            id="bg"
            aria-label="Menu"
            onClick={toggleMenu}
            ref={bgRef}
          >
            <s /><s /><s />
          </button>
        </nav>
      </header>

      <div id="mm" className={menuOpen ? 'o' : ''} ref={mmRef}>
        {MOBILE_LINKS.map((l, i) => (
          <a
            key={l.href}
            className="d"
            href={l.href}
            style={{ transitionDelay: `${120 + i * 50}ms` }}
            onClick={closeMenu}
          >
            {l.label}
          </a>
        ))}
        {/* Mobile Menu Resume Link */}
        <a
          href="/Haresh_LS_Resume.pdf"
          target="_blank"
          rel="noreferrer noopener"
          className="d"
          style={{ transitionDelay: `${120 + MOBILE_LINKS.length * 50}ms` }}
          onClick={(e) => {
            closeMenu();
            openAndDownloadResume(e);
          }}
        >
          Resume
        </a>
      </div>
    </>
  );
}
