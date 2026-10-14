import { useEffect, useRef, useState } from 'react';
import { PORTRAIT } from '../utils/helpers';

export default function Hero() {
  const nmRef = useRef(null);
  const roleRef = useRef(null);
  const [photoVisible, setPhotoVisible] = useState(false);
  const [roleVisible, setRoleVisible] = useState(false);

  /* ── Fit "HARESH" to screen width & align role headline ───── */
  useEffect(() => {
    const nm = nmRef.current;
    const hero = document.getElementById('top');
    const role = roleRef.current;

    function fitName() {
      if (!nm || !hero) return;
      const cx = document.createElement('canvas').getContext('2d');
      cx.font = '400 100px Anton';
      const m = cx.measureText('HARESH');
      const wr = m.width / 100;
      const cap = m.actualBoundingBoxAscent / 100;
      const target = window.innerWidth * 0.81;
      const fs = target / wr;
      nm.style.fontSize = fs + 'px';
      nm.style.left = nm.style.right = window.innerWidth * 0.095 + 'px';
      const H = hero.clientHeight;
      const capPx = cap * fs;
      const k = Math.min(3.2, Math.max(1, 0.44 * H / capPx));
      nm.style.transformOrigin = '50% 50%';
      nm.style.transform = k > 1.001 ? `scaleY(${k})` : '';
      nm.style.top = (0.42 * H - (capPx * k) / 2) + 'px';

      // Move role headline slightly to the right (+10px from left edge of 'H')
      requestAnimationFrame(() => {
        const firstH = nm.querySelector('.ch') || nm.querySelector('[data-line]') || nm;
        if (role && firstH && hero) {
          const hLeft = firstH.getBoundingClientRect().left;
          const heroLeft = hero.getBoundingClientRect().left;
          role.style.left = `${(hLeft - heroLeft + 10).toFixed(2)}px`;
        }
      });
    }

    document.fonts.ready.then(fitName);
    window.addEventListener('resize', fitName);
    try { fitName(); } catch (e) { }
    return () => window.removeEventListener('resize', fitName);
  }, []);

  /* ── Sequenced hero entrance: First only photo, then other text contents ── */
  useEffect(() => {
    const rm = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
    let t1, t2, t3;

    function revealText() {
      // 2. Big name "HARESH" chars animate in smoothly right after photo arrives
      t1 = setTimeout(() => {
        document.querySelectorAll('#top [data-a]').forEach((el) => {
          el.classList.add('on');
        });
      }, rm ? 0 : 160);

      // 3. Role headline "I’m an AI Full Stack Developer" glides in with the name
      t2 = setTimeout(() => {
        setRoleVisible(true);
      }, rm ? 0 : 260);

      // 4. Footer footnotes fade in last
      t3 = setTimeout(() => {
        document.querySelectorAll('#top .fu').forEach((el) => {
          el.classList.add('on');
        });
      }, rm ? 0 : 400);
    }

    const preEl = document.getElementById('pre');
    const isPreloaderActive = Boolean(preEl && !window.__pre?.done);

    let cleanupListeners = () => { };

    if (isPreloaderActive) {
      // Photo starts its entrance as the preloader curtain wipes up
      const onWipe = () => {
        setPhotoVisible(true);
      };

      // After preloader has completely finished, trigger the smooth text reveal
      const onDone = () => {
        setPhotoVisible(true);
        revealText();
      };

      document.addEventListener('preloader:wipe', onWipe, { once: true });
      document.addEventListener('preloader:done', onDone, { once: true });

      cleanupListeners = () => {
        document.removeEventListener('preloader:wipe', onWipe);
        document.removeEventListener('preloader:done', onDone);
      };
    } else {
      setPhotoVisible(true);
      revealText();
    }

    return () => {
      cleanupListeners();
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <section id="top">
      {/* ── Portrait (First to come in) ── */}
      <div className="pt" id="pt">
        <img className={`me${photoVisible ? ' on' : ''}`} id="me" src={PORTRAIT} alt="Haresh LS" decoding="async" />
      </div>
      <div className="gb" />

      {/* ── Headline — Cinematic entrance reveal ── */}
      <div className={`role-tag${roleVisible ? ' on' : ''}`} role="text" ref={roleRef}>
        I’m an AI Full Stack Developer
      </div>

      {/* ── Giant name — char-by-char reveal ── */}
      <h1
        className="nm d"
        data-a="chars"
        data-d="2800"
        aria-label="Haresh"
        ref={nmRef}
      >
        <span className="ln" data-line>
          {'HARESH'.split('').map((c, i) => (
            <span key={i} className="ch">{c}</span>
          ))}
        </span>
      </h1>

      {/* ── Footer footnotes ── */}
      <div className="hf l fu" data-d="3400">© 2026</div>
      <div className="hf r fu" data-d="3400">
        Building digital experiences<br />that matter.
      </div>
    </section>
  );
}
