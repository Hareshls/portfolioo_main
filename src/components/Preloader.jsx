import { useEffect, useRef } from 'react';

if (typeof window !== 'undefined') {
  window.__pre = window.__pre || { wiped: false, done: false };
}

/**
 * Preloader — 0→100% counter that runs immediately.
 * Fires custom events 'preloader:wipe' and 'preloader:done' on document.
 */
export default function Preloader() {
  const nRef = useRef(null);
  const preRef = useRef(null);

  useEffect(() => {
    const pre = preRef.current;
    const n = nRef.current;
    if (!pre || !n) return;

    const rm = matchMedia('(prefers-reduced-motion:reduce)').matches;
    const st = (window.__pre = { wiped: false, done: false });
    let fin_ = false;

    document.documentElement.style.overflow = 'hidden';
    const dur = rm ? 900 : 2000;
    const t0 = performance.now();

    function fin() {
      if (fin_) return;
      fin_ = true;
      n.textContent = '100';
      pre.classList.add('fade');
      setTimeout(() => {
        pre.classList.add('up');
        st.wiped = true;
        document.dispatchEvent(new Event('preloader:wipe'));
        setTimeout(() => {
          document.documentElement.style.overflow = '';
          pre.setAttribute('aria-hidden', 'true');
          pre.style.pointerEvents = 'none';
          st.done = true;
          document.dispatchEvent(new Event('preloader:done'));
          setTimeout(() => pre.remove(), 900);
        }, 700);
      }, 500);
    }

    const iv = setInterval(() => {
      const u = Math.min(1, (performance.now() - t0) / dur);
      n.textContent = Math.round(u * 100);
      if (u >= 1) { clearInterval(iv); fin(); }
    }, 30);
    const fb = setTimeout(fin, dur + 1500);

    return () => { clearInterval(iv); clearTimeout(fb); };
  }, []);

  return (
    <div id="pre" aria-hidden="false" ref={preRef}>
      <b>Haresh LS</b>
      <i><span id="n" ref={nRef}>0</span><u>%</u></i>
    </div>
  );
}
