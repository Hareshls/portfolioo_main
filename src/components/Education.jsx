import { useEffect, useRef, useState } from 'react';
import { getLenis } from './Nav';

const EDUCATION_DATA = [
  {
    step: '01',
    period: '2020',
    title: 'SSLC (Class 10)',
    board: 'Anglo Indian Board',
    institution: 'Montfort School Anglo Indian, Salem',
    metricLabel: 'Percentage',
    metricValue: '63.2%',
    icon: 'book',
  },
  {
    step: '02',
    period: '2022',
    title: 'HSC (Class 12)',
    board: 'State Board',
    institution: 'Vedhha Vikass HR Sec School, Salem',
    metricLabel: 'Percentage',
    metricValue: '86.16%',
    icon: 'book',
  },
  {
    step: '03',
    period: '2022 – 2026',
    title: 'B.Tech Computer Science and Engineering',
    board: 'Anna University',
    institution: 'Kongu Engineering College, Perundurai, Erode',
    metricLabel: 'CGPA',
    metricValue: '6.82 / 10',
    icon: 'gradCap',
  },
];

export default function Education() {
  const containerRef = useRef(null);
  const [scrollP, setScrollP] = useState(0);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const container = containerRef.current;
          if (!container) return;

          const rect = container.getBoundingClientRect();
          const totalScroll = container.offsetHeight - window.innerHeight;
          if (totalScroll <= 0) {
            setScrollP(1);
            ticking = false;
            return;
          }

          const current = -rect.top;
          const p = Math.min(1, Math.max(0, current / totalScroll));
          setScrollP(p);

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    onScroll();

    let lenisInst = getLenis();
    let pollId = null;
    if (lenisInst) {
      lenisInst.on('scroll', onScroll);
    } else {
      pollId = setInterval(() => {
        lenisInst = getLenis();
        if (lenisInst) {
          lenisInst.on('scroll', onScroll);
          clearInterval(pollId);
        }
      }, 100);
      setTimeout(() => clearInterval(pollId), 4000);
    }

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (lenisInst) lenisInst.off('scroll', onScroll);
      if (pollId) clearInterval(pollId);
    };
  }, []);

  // Reveal thresholds:
  // p >= 0.05: Card 1 (10th Grade)
  // p >= 0.35: Card 2 (12th Grade)
  // p >= 0.65: Card 3 (B.E. CSE)
  const isCard1Active = scrollP >= 0.05;
  const isCard2Active = scrollP >= 0.35;
  const isCard3Active = scrollP >= 0.65;

  // Path progress for glowing bezier line (0 to 100%)
  const lineProgress = Math.min(100, Math.max(0, (scrollP - 0.05) / 0.65 * 100));

  return (
    <section id="education" className="education-section" ref={containerRef}>
      <div className="education-sticky-stage">
        {/* Section Header */}
        <div className="education-header">
          <div className="education-badge">
            <span className="edu-dot" />
            <span>EDUCATION</span>
          </div>

          <h2 className="education-title">
            <span>MY</span> <span className="edu-title-acc">EDUCATION</span>
          </h2>

          <p className="education-sub">
            A journey of learning, building a strong foundation and growing towards bigger goals.
          </p>
        </div>

        {/* Stepped Interactive Track */}
        <div className="education-track-wrapper">
          {/* Glowing Connected Bezier Line with Nodes */}
          <div className="education-svg-line-wrap" aria-hidden="true">
            <svg
              className="education-svg-canvas"
              viewBox="0 0 1000 120"
              preserveAspectRatio="none"
              fill="none"
            >
              <defs>
                <linearGradient id="eduLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ff2a1a" stopOpacity="0.4" />
                  <stop offset="50%" stopColor="#ff2a1a" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#ff4b3a" stopOpacity="1" />
                </linearGradient>
                <filter id="eduGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Base guide track line */}
              <path
                d="M 166 90 Q 333 70, 500 55 T 833 20"
                stroke="rgba(255, 255, 255, 0.07)"
                strokeWidth="2"
                strokeDasharray="4 4"
              />

              {/* Active Glowing Laser Line */}
              <path
                d="M 166 90 Q 333 70, 500 55 T 833 20"
                stroke="url(#eduLineGrad)"
                strokeWidth="3"
                filter="url(#eduGlow)"
                style={{
                  strokeDasharray: 1000,
                  strokeDashoffset: 1000 - (lineProgress / 100) * 1000,
                  transition: 'stroke-dashoffset 0.25s ease-out',
                }}
              />
            </svg>

            {/* Glowing Waypoint Nodes */}
            <div className={`edu-node node-1 ${isCard1Active ? 'is-active' : ''}`}>
              <div className="edu-node-glow" />
              <div className="edu-node-core" />
            </div>

            <div className={`edu-node node-2 ${isCard2Active ? 'is-active' : ''}`}>
              <div className="edu-node-glow" />
              <div className="edu-node-core" />
            </div>

            <div className={`edu-node node-3 ${isCard3Active ? 'is-active' : ''}`}>
              <div className="edu-node-glow" />
              <div className="edu-node-core" />
            </div>
          </div>

          {/* The 3 Stepped Education Cards */}
          <div className="education-cards-grid">
            {EDUCATION_DATA.map((item, index) => {
              const isActive =
                index === 0 ? isCard1Active : index === 1 ? isCard2Active : isCard3Active;

              return (
                <div
                  key={item.title}
                  className={`edu-card edu-step-${index + 1} ${isActive ? 'is-revealed' : 'is-pending'}`}
                >
                  {/* Subtle Big Watermark Number */}
                  <span className="edu-watermark-num">{item.step}</span>

                  {/* Top Bar inside Card */}
                  <div className="edu-card-topbar">
                    <span className="edu-period-pill">{item.period}</span>
                  </div>

                  {/* Title & Board */}
                  <div className="edu-card-heading">
                    <div className="edu-title-row">
                      <span className="edu-card-dot" />
                      <h3 className="edu-card-title">{item.title}</h3>
                    </div>
                    <span className="edu-board-text">{item.board}</span>
                    <p className="edu-institution-text">{item.institution}</p>
                  </div>

                  {/* Bottom Metric Container */}
                  <div className="edu-card-metric-block">
                    <div className="edu-metric-icon-box">
                      {item.icon === 'book' ? (
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                        </svg>
                      ) : (
                        <svg
                          width="22"
                          height="22"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                          <path d="M6 12v5c3 3 9 3 12 0v-5" />
                        </svg>
                      )}
                    </div>

                    <div className="edu-metric-meta">
                      <span className="edu-metric-label">{item.metricLabel}</span>
                      <span className="edu-metric-value">{item.metricValue}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
