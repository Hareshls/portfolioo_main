import { useEffect, useRef } from 'react';
import { PORTRAIT, tick } from '../utils/helpers';

/**
 * HeroFly — the hero portrait travels from the Hero section to the
 * empty black destination frame at the center of the About Me section.
 * The cutout appearance is preserved throughout the transition.
 * Once settled into the destination frame, it hands off to the frame.
 */
export default function HeroFly() {
  const flyRef = useRef(null);

  useEffect(() => {
    const pt  = document.getElementById('pt');
    const ab  = document.getElementById('about');
    const fly = flyRef.current;
    if (!pt || !ab || !fly) return;

    const AR = 1142 / 1245;
    const cl = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
    const lp = (a, b, t) => a + (b - a) * t;

    let startX = 0;
    let startY = 0;
    let w0 = 0;
    let h0 = 0;
    let settleScroll = 0;

    function measure() {
      const b = pt.getBoundingClientRect();
      w0 = Math.min(b.width, b.height * AR);
      h0 = w0 / AR;
      startX = b.left + (b.width - w0) / 2;
      startY = (b.top + window.scrollY) + (b.height - h0);

      const aboutTop = ab.getBoundingClientRect().top + window.scrollY;
      settleScroll = aboutTop + 120;
    }

    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('load', measure);

    tick(() => {
      const sy = window.scrollY;
      const fr2 = document.querySelector('[data-frame="2"]');

      // Top of page: show real hero portrait, fly is hidden
      if (sy <= 2) {
        fly.style.display   = 'none';
        pt.style.visibility = 'visible';
        window.__flyDone    = false;
        return;
      }

      // Past settle threshold: fly hides, Frame 2 displays settled portrait
      if (sy >= settleScroll) {
        fly.style.display   = 'none';
        pt.style.visibility = 'hidden';
        window.__flyDone    = true;
        return;
      }

      // Active flight between Hero and About
      pt.style.visibility = 'hidden';
      window.__flyDone    = false;

      const progress = cl(sy / settleScroll);
      const e = progress * progress * (3 - 2 * progress);

      const naturalX = startX;
      const naturalY = startY - sy;

      let destX = window.innerWidth / 2;
      let destY = window.innerHeight * 0.6;
      let destW = Math.min(window.innerWidth * 0.3, window.innerHeight * 0.38);
      let destH = destW;

      if (fr2) {
        const r2 = fr2.getBoundingClientRect();
        destX = r2.left;
        destY = r2.top;
        destW = r2.width;
        destH = r2.height;
      }

      const curX = lp(naturalX, destX, e);
      const curY = lp(naturalY, destY, e);
      const curW = lp(w0, destW, e);
      const curH = lp(h0, destH, e);

      // Subtle border-radius rounding as portrait settles into destination frame
      const cornerR = destW * 0.1;
      const cornerP = cl((progress - 0.72) / 0.28);

      fly.style.display      = 'block';
      fly.style.opacity      = '1';
      fly.style.left         = curX + 'px';
      fly.style.top          = curY + 'px';
      fly.style.width        = curW + 'px';
      fly.style.height       = curH + 'px';
      fly.style.borderRadius = (cornerP * cornerR) + 'px';
      fly.style.overflow     = 'hidden';
    });

    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('load', measure);
      if (fly) fly.style.display   = 'none';
      if (pt)  pt.style.visibility = 'visible';
    };
  }, []);

  return (
    <div id="fly" ref={flyRef} aria-hidden="true" style={{ display: 'none' }}>
      <img src={PORTRAIT} alt="" />
    </div>
  );
}
