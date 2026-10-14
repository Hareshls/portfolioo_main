import { useEffect, useRef } from 'react';
import { PORTRAIT, tick } from '../utils/helpers';

// Five frames, left to right
const FRAME_LAYOUT = [
  { x: -1.46, y: 0.3, r: -22, s: 0.62, s0: 0.5, d: 0.42, z: 1 },
  { x: -0.92, y: 0.11, r: -12, s: 0.88, s0: 0.7, d: 0.1, z: 2 },
  { x: 0, y: 0, r: 0, s: 1, s0: 1, d: 0, z: 5 }, // Centre destination frame
  { x: 0.92, y: 0.11, r: 12, s: 0.88, s0: 0.7, d: 0.1, z: 2 },
  { x: 1.46, y: 0.3, r: 22, s: 0.62, s0: 0.5, d: 0.42, z: 1 },
];

// One photo per frame:
// Frames 0, 1, 3, 4 are secondary photos.
// Frame 2 is the actual Hero cutout portrait (empty until settled).
const PHOTOS = [
  '/photos/photo-4.jpg',
  '/photos/photo-2.jpg',
  PORTRAIT,
  '/photos/photo-1.jpg',
  '/photos/photo-3.jpg',
];

/**
 * Individual frame card.
 * - idx 2 = centre empty black destination frame: inner img starts at opacity: 0.
 * - Clicking any frame brings it smoothly to front (max z-index + smooth CSS transition).
 * - No auto-cycling; stable state until user interacts.
 */
function Frame({ idx, f, onSelect }) {
  const elRef = useRef(null);
  const imgRef = useRef(null);

  return (
    <div
      className={`fr ${idx === 2 ? 'fr-dest' : ''}`}
      ref={elRef}
      style={{ zIndex: f.z }}
      data-frame={idx}
      onClick={() => onSelect(idx)}
      title={idx === 2 ? 'Haresh LS — Main Portrait' : `View photo ${idx + 1}`}
    >
      <div className="in">
        <img
          ref={imgRef}
          className="ly on"
          src={PHOTOS[idx]}
          alt={idx === 2 ? 'Haresh LS — Portrait' : `Haresh LS — photo ${idx + 1}`}
          decoding="async"
          style={{ opacity: idx === 2 ? 0 : 1 }}
        />
        {/* Dimming overlay — driven by scroll */}
        <div className="ov" />
      </div>
    </div>
  );
}

export default function About() {
  const abRef = useRef(null);
  const ampRef = useRef(null);
  const ambRef = useRef(null);

  // Which frame is "clicked to front" (null = default layout)
  const frontRef = useRef(null);

  // ── About-frames scroll animation ───────────────────────────────────────
  useEffect(() => {
    const ab = abRef.current;
    if (!ab) return;
    const cl = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
    const lp = (a, b, t) => a + (b - a) * t;

    function upd() {
      const r = ab.getBoundingClientRect();
      if (r.bottom < -50 || r.top > innerHeight + 50) return;

      const sy = window.scrollY;
      const aboutTop = r.top + sy;
      const settleScroll = aboutTop + 120;
      const settled = sy >= settleScroll;

      // Destination frame image: completely empty until portrait settles!
      const fr2Img = ab.querySelector('[data-frame="2"] img.ly');
      if (fr2Img) {
        fr2Img.style.opacity = settled ? '1' : '0';
      }

      const S = Math.min(innerWidth * 0.3, innerHeight * 0.38);

      // Layer reveal: only emerges after portrait has settled into place
      const fanoutDist = 650;
      const p_fanout = settled ? cl((sy - settleScroll) / fanoutDist) : 0;

      // Staggered emergence:
      // Inner frames (1, 3) slide out first (0 → 0.7)
      const t1 = cl(p_fanout / 0.7);
      const e1 = 1 - Math.pow(1 - t1, 3);
      const op1 = cl(t1 * 2.5);

      // Outer frames (0, 4) slide out next (0.25 → 1.0)
      const t2 = cl((p_fanout - 0.25) / 0.75);
      const e2 = 1 - Math.pow(1 - t2, 3);
      const op2 = cl(t2 * 2.5);

      FRAME_LAYOUT.forEach((f, i) => {
        const el = ab.querySelector(`[data-frame="${i}"]`);
        const ov = el?.querySelector('.ov');
        if (!el || !ov) return;

        const activeFront = frontRef.current;

        // If a swap is active (a secondary frame was clicked to front):
        if (activeFront !== null) {
          if (i === activeFront) {
            // Clicked frame is at center
            return;
          }
          if (i === 2) {
            // Center frame moved to clicked frame's slot
            return;
          }
        }

        if (i === 2) {
          // Centre destination frame stays at center
          el.style.transform = 'translate(0px, 0px) rotate(0deg) scale(1)';
          el.style.opacity = '1';
          ov.style.opacity = '0';
        } else {
          // Secondary frames slide outward from behind main portrait
          const isInner = i === 1 || i === 3;
          const e = isInner ? e1 : e2;
          const op = isInner ? op1 : op2;

          const x = lp(0, f.x, e);
          const y = lp(0, f.y, e);
          const rot = lp(0, f.r, e);
          const sc = lp(0.85, f.s, e);

          el.style.transform = `translate(${x * S}px, ${y * S}px) rotate(${rot}deg) scale(${sc})`;
          el.style.opacity = String(op);
          ov.style.opacity = String(f.d * e);
        }
      });

      ab.style.setProperty('--pin', cl((p_fanout - 0.5) / 0.5));
    }

    tick(upd, 0);
  }, []);

  // ── Container scroll (About-me text reveal) ──────────────────────────────
  useEffect(() => {
    const ab = abRef.current;
    const layer = document.getElementById('aboutme');
    const head = document.getElementById('csHead');
    const card = document.getElementById('csCard');
    if (!ab || !layer || !head || !card) return;

    const cl = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
    const lp = (a, b, t) => a + (b - a) * t;
    const ez = (t) => 1 - Math.pow(1 - t, 3);
    const mob = () => innerWidth <= 768;

    tick(() => {
      const r = ab.getBoundingClientRect();
      const vh = innerHeight;
      if (r.bottom < -50 || r.top > vh + 50) return;

      const e = ez(cl((-r.top / vh - 1.5) / 1.1));
      ab.style.setProperty('--ov', e.toFixed(3));
      layer.style.transform = `translateY(${(1 - e) * 105}vh)`;
      card.style.transform = `rotateX(${lp(20, 0, e)}deg) scale(${mob() ? lp(0.7, 0.9, e) : lp(1.05, 1, e)})`;
      head.style.transform = `translateY(${lp(0, -30, e)}px)`;
    });
  }, []);

  // ── About-me word-by-word reveal ─────────────────────────────────────────
  useEffect(() => {
    const amp = ampRef.current;
    const box = ambRef.current;
    if (!amp || !box) return;

    const SEG = [
      ["I’m Haresh, an "],
      ['AI full-stack engineer', 'e'],
      [' who builds complete products, from data pipelines and vector search to fast, polished interfaces. I work with React, Node and FastAPI, connect LLMs to real data using '],
      ['RAG', 'e'],
      [' and '],
      ['FAISS', 'e'],
      [", and focus on making AI feel quick and reliable. Four products shipped, one internship done, and ready for the next hard problem."],
    ];

    amp.innerHTML = '';
    let i = 0;
    SEG.forEach(([t, e]) =>
      t.split(/(\s+)/).forEach((w) => {
        if (!w) return;
        if (/^\s+$/.test(w)) { amp.appendChild(document.createTextNode(' ')); return; }
        const sp = document.createElement(e ? 'em' : 'span');
        sp.className = 'pw';
        sp.textContent = w;
        sp.style.transitionDelay = i++ * 32 + 'ms';
        amp.appendChild(sp);
      })
    );

    const io = new IntersectionObserver((en, ob) => {
      if (!en[0].isIntersecting) return;
      ob.disconnect();
      amp.classList.add('go');
    }, { threshold: 0.25 });
    io.observe(box);
    box.classList.add('amb');
    return () => io.disconnect();
  }, []);

  // ── Click to bring a frame to the front and swap center frame into its place ─
  function handleSelect(idx) {
    const ab = abRef.current;
    if (!ab) return;

    const S = Math.min(innerWidth * 0.3, innerHeight * 0.38);
    const centerEl = ab.querySelector('[data-frame="2"]');
    const centerF = FRAME_LAYOUT[2];

    // If clicking Frame 2 or clicking the already-selected frame: restore default layout
    if (idx === 2 || frontRef.current === idx) {
      const activeIdx = frontRef.current;
      frontRef.current = null;

      // Restore previously-selected frame back to its original slot
      if (activeIdx !== null && activeIdx !== 2) {
        const prevEl = ab.querySelector(`[data-frame="${activeIdx}"]`);
        const pf = FRAME_LAYOUT[activeIdx];
        if (prevEl) {
          prevEl.style.zIndex = String(pf.z);
          prevEl.style.transition = 'transform 0.6s cubic-bezier(0.16,1,0.3,1)';
          prevEl.style.transform = `translate(${pf.x * S}px,${pf.y * S}px) rotate(${pf.r}deg) scale(${pf.s})`;
          const ov = prevEl.querySelector('.ov');
          if (ov) ov.style.opacity = String(pf.d);
        }
      }

      // Restore center frame (Frame 2) back to center
      if (centerEl) {
        centerEl.style.zIndex = String(centerF.z);
        centerEl.style.transition = 'transform 0.6s cubic-bezier(0.16,1,0.3,1)';
        centerEl.style.transform = 'translate(0px,0px) rotate(0deg) scale(1)';
        const cOv = centerEl.querySelector('.ov');
        if (cOv) cOv.style.opacity = '0';
      }
      return;
    }

    // If another frame was previously front, restore it to its own slot first
    if (frontRef.current !== null) {
      const prevIdx = frontRef.current;
      const prevEl = ab.querySelector(`[data-frame="${prevIdx}"]`);
      const pf = FRAME_LAYOUT[prevIdx];
      if (prevEl && prevIdx !== 2) {
        prevEl.style.zIndex = String(pf.z);
        prevEl.style.transition = 'transform 0.6s cubic-bezier(0.16,1,0.3,1)';
        prevEl.style.transform = `translate(${pf.x * S}px,${pf.y * S}px) rotate(${pf.r}deg) scale(${pf.s})`;
        const prevOv = prevEl.querySelector('.ov');
        if (prevOv) prevOv.style.opacity = String(pf.d);
      }
    }

    // Set new active front frame
    frontRef.current = idx;
    const clickedEl = ab.querySelector(`[data-frame="${idx}"]`);
    const clickedF = FRAME_LAYOUT[idx];

    // 1. Move clicked frame into center position (foreground)
    if (clickedEl) {
      clickedEl.style.zIndex = '12';
      clickedEl.style.transition = 'transform 0.6s cubic-bezier(0.16,1,0.3,1)';
      clickedEl.style.transform = 'translate(0px,0px) rotate(0deg) scale(1)';
      const ov = clickedEl.querySelector('.ov');
      if (ov) ov.style.opacity = '0';
    }

    // 2. Move center photo (Frame 2) into the clicked photo's place!
    if (centerEl) {
      centerEl.style.zIndex = String(clickedF.z);
      centerEl.style.transition = 'transform 0.6s cubic-bezier(0.16,1,0.3,1)';
      centerEl.style.transform = `translate(${clickedF.x * S}px,${clickedF.y * S}px) rotate(${clickedF.r}deg) scale(${clickedF.s})`;
      const cOv = centerEl.querySelector('.ov');
      if (cOv) cOv.style.opacity = String(clickedF.d);
    }
  }

  return (
    <section className="ab" id="about" ref={abRef}>
      <div className="abs">
        <div className="abh">
          <p className="eb">Haresh LS · AI Full-Stack Engineer</p>
          <h2 className="abt d" data-a="lines">
            <span>About Me</span>
          </h2>
        </div>

        <div className="frames" id="frames">
          {FRAME_LAYOUT.map((f, i) => (
            <Frame
              key={i}
              idx={i}
              f={f}
              onSelect={handleSelect}
              isFront={false /* controlled imperatively via frontRef */}
            />
          ))}
        </div>

        <div className="pill" id="pill">Keep scrolling <i>↓</i></div>
        <div className="cs-bd" aria-hidden="true" />

        <div className="cs-layer" id="aboutme">
          <div className="cs-in">
            <div className="cs-head" id="csHead">
              <h2>
                <span className="cs-sm">A little about</span>
                <span className="cs-big d">Haresh LS</span>
              </h2>
            </div>
            <div className="cs-card" id="csCard">
              <div className="cs-pane">
                <div id="amb" className="cs-txt" ref={ambRef}>
                  <p className="eb">Who I am</p>
                  <p className="amp" id="amp" ref={ampRef} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
