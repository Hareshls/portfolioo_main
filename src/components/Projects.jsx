import { useEffect, useRef } from 'react';
import { getLenis } from './Nav';

const PROJECTS = [
  {
    title: 'CareerLens AI',
    num: '01',
    tag: 'Llama 3.3 70B · Production AI',
    desc: 'An end-to-end intelligent career acceleration pipeline that bridges the gap between job candidates and modern ATS algorithms. Ingests raw resumes in PDF format, performs structured entity extraction, cross-references target job descriptions, computes semantic match scores, and generates precision bullet rewrites tailored for high-ranking interview shortlists in under 60 seconds.',
    features: [
      { label: '8-STAGE PIPELINE', val: 'PDF parsing, vector scoring & bullet rewrites.' },
      { label: 'ATS CALIBRATION', val: '94% match scoring calibrated against live rubrics.' },
      { label: 'SUB-60S TURNAROUND', val: 'Full gap analysis & keyword extraction in <60s.' },
    ],
    cats: ['React.js', 'FastAPI', 'Llama 3.3 70B', 'Python', 'Vector Search', 'JWT Auth'],
    github: 'https://github.com/Hareshls/Ai-resume-matcher',
    demo: null,
    status: 'LIVE DEMO',
  },
  {
    title: 'ContractIQ',
    num: '02',
    tag: 'RAG + FAISS · LEGAL AI',
    desc: 'Automated legal contract intelligence and risk assessment platform designed for high-stakes agreements. Breaks down complex commercial contracts into clause-level embeddings stored in FAISS, detects hidden indemnities and high-liability risks against historical precedent, and synthesizes actionable plain-English risk assessments with zero hallucination guarantee.',
    features: [
      { label: 'CLAUSE RISK SCORING', val: 'Calibrated 0–100 scores for high-liability terms.' },
      { label: 'FAISS VECTOR SEARCH', val: 'Sub-millisecond retrieval grounded in legal precedent.' },
      { label: 'ZERO HALLUCINATION', val: 'Strict citation-backed reasoning with source links.' },
    ],
    cats: ['React.js', 'FastAPI', 'FAISS Vector DB', 'Python', 'LLM Reasoning', 'JWT Auth'],
    github: 'https://github.com/Hareshls/ContractIQ-Intelligent-Contract-Risk-Analysis-and-RAG-Based-Legal-Assistant',
    demo: null,
    status: 'LIVE DEMO',
  },
  {
    title: 'SpendMind',
    num: '03',
    tag: 'MERN STACK · REAL-TIME ANALYTICS',
    desc: 'Full-stack financial management and real-time budget forecasting application. Features automatic transaction categorization, intelligent monthly burn-rate predictions, custom spending thresholds with instant warning triggers, and interactive data visualization charts to provide complete clarity over cash flow and saving targets.',
    features: [
      { label: 'SMART CATEGORIZATION', val: 'Automatic merchant & category classification.' },
      { label: 'PREDICTIVE ANALYTICS', val: 'Burn-rate alerts before budget overruns occur.' },
      { label: 'INTERACTIVE DASHBOARDS', val: 'Dynamic Chart.js visualizations & cashflow trends.' },
    ],
    cats: ['MongoDB', 'Express.js', 'React.js', 'Node.js', 'REST APIs', 'Chart.js'],
    github: 'https://github.com/Hareshls/Expensetrackers',
    demo: null,
    status: 'LIVE DEMO',
  },
  {
    title: 'RAG Doc Q&A',
    num: '04',
    tag: 'FASTAPI + FAISS · RAG ENGINE',
    desc: 'High-throughput document intelligence engine that transforms large PDFs and enterprise knowledge bases into conversational agents. Features smart document chunking with semantic overlap, dense embedding generation, FAISS vector indexing, and grounded context injection to guarantee accurate, context-bound question answers with exact page citations.',
    features: [
      { label: 'SMART CHUNKING', val: 'Semantic boundary chunking with sliding context.' },
      { label: 'DENSE EMBEDDINGS', val: 'Vectorized text stored in FAISS for top-k retrieval.' },
      { label: 'EXACT CITATIONS', val: 'Direct source page and paragraph grounding.' },
    ],
    cats: ['Python', 'FastAPI', 'FAISS Vector Search', 'React.js', 'Prompt Engineering', 'LangChain'],
    github: 'https://github.com/Hareshls/RAG--document-AI',
    demo: null,
    status: 'LIVE DEMO',
  },
];

export default function Projects() {
  const containerRef = useRef(null);

  // Pinned Stage Stacking Animation
  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const container = containerRef.current;
          if (!container) return;

          const rect = container.getBoundingClientRect();
          const totalScroll = container.offsetHeight - window.innerHeight;
          if (totalScroll <= 0) return;

          const current = -rect.top;
          const p = Math.min(1, Math.max(0, current / totalScroll));

          const cards = container.querySelectorAll('.stage-card');
          const totalCards = cards.length;
          const steps = totalCards - 1;

          cards.forEach((card, i) => {
            // Once a card is fully covered by the subsequent card, hide it completely to prevent ghosting
            if (i < totalCards - 1 && p >= (i + 1) / steps) {
              card.style.visibility = 'hidden';
            } else {
              card.style.visibility = 'visible';
            }

            if (i === 0) {
              // Card 0 scales down slightly as Card 1 covers it
              const card1P = Math.min(1, Math.max(0, p * steps));
              const scale = 1 - card1P * 0.04;
              card.style.transform = `scale(${scale})`;
              card.style.opacity = '1';
            } else {
              const enterStart = (i - 1) / steps;
              const enterEnd = i / steps;

              if (p <= enterStart) {
                // Completely below the stage
                card.style.transform = 'translateY(105vh)';
                card.style.opacity = '1';
              } else if (p < enterEnd) {
                // Smoothly enters from below
                const cardP = (p - enterStart) / (enterEnd - enterStart);
                const ease = 1 - Math.pow(1 - cardP, 2.2);
                const translateY = (1 - ease) * 105;
                card.style.transform = `translateY(${translateY}vh) scale(1)`;
                card.style.opacity = '1';
              } else {
                // Fully stacked in place. As subsequent cards arrive, subtly scale down
                const nextEnterStart = enterEnd;
                const nextEnterEnd = (i + 1) / steps;
                const coverP = Math.min(1, Math.max(0, (p - nextEnterStart) / (nextEnterEnd - nextEnterStart || 1)));
                const scale = 1 - coverP * 0.04;
                card.style.transform = `translateY(0px) scale(${scale})`;
                card.style.opacity = '1';
              }
            }
          });

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

  return (
    <section id="ventures" className="ventures-section" ref={containerRef}>
      <div className="ventures-sticky-stage">
        {/* Section Header */}
        <div className="hd ventures-hd">
          <div>
            <p className="eb">Selected Projects</p>
            <h2
              className="d h2 h2s"
              style={{ maxWidth: '16ch', lineHeight: 0.95 }}
              data-a="lines"
              data-st="90"
            >
              <span>Products built with intent.</span>
            </h2>
          </div>
          <p className="sm">04 / Projects</p>
        </div>

        {/* Pinned Stacking Card Stage */}
        <div className="cards-stage">
          {PROJECTS.map((p, i) => (
            <div
              key={p.title}
              className="stage-card"
              style={{ zIndex: i + 1 }}
            >
              {/* TOP HEADER ROW: Project Number + Tag Capsule on Left, Live Demo on Right */}
              <div className="card-topbar">
                <div className="topbar-left">
                  <div className="p-num-badge">
                    <span className="p-dot" />
                    <span>PROJECT {p.num}</span>
                  </div>
                  <span className="p-tag-pill">{p.tag}</span>
                </div>

                <div className="topbar-right">
                  <div className="p-status-pill">
                    <span className="p-status-dot" />
                    <span>{p.status}</span>
                  </div>
                </div>
              </div>

              {/* TWO-COLUMN GRID: Left = Title, Desc, Tech, Buttons | Right = Architecture & Impact Table */}
              <div className="card-columns">
                {/* LEFT COLUMN */}
                <div className="card-left-col">
                  <div>
                    <h3 className="p-card-title">{p.title}</h3>
                    <p className="p-card-desc">{p.desc}</p>
                  </div>

                  <div className="p-tech-section">
                    <span className="p-section-label">CORE TECHNOLOGIES</span>
                    <div className="p-tech-tags">
                      {p.cats.map((cat) => (
                        <span key={cat} className="p-tech-pill">
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-action-buttons">
                    {p.demo ? (
                      <a
                        href={p.demo}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="p-btn-demo"
                        aria-label={`Open Live Demo for ${p.title}`}
                      >
                        <span className="p-btn-demo-dot" />
                        <span>Live Demo</span>
                        <span className="p-arrow">↗</span>
                      </a>
                    ) : (
                      <span
                        className="p-btn-demo p-btn-disabled"
                        aria-label={`${p.title} Live Demo`}
                      >
                        <span className="p-btn-demo-dot" />
                        <span>Live Demo</span>
                        <span className="p-arrow">↗</span>
                      </span>
                    )}

                    <a
                      href={p.github}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="p-btn-github"
                      aria-label={`View GitHub repository for ${p.title}`}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                      </svg>
                      <span>GitHub Repo</span>
                      <span className="p-arrow">↗</span>
                    </a>
                  </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="card-right-col">
                  <div className="p-right-header">
                    <span className="p-section-label">ARCHITECTURE & IMPACT</span>
                  </div>

                  <div className="p-feature-table">
                    {p.features.map((f) => (
                      <div key={f.label} className="p-feature-row">
                        <div className="p-feat-cell-title">
                          <span className="p-feat-dot" />
                          <span className="p-feat-name">{f.label}</span>
                        </div>
                        <div className="p-feat-cell-desc">
                          <p className="p-feat-text">{f.val}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
