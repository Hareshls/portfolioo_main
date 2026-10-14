import { useEffect, useRef } from 'react';
import { getLenis } from './Nav';

const PROJECTS = [
  {
    title: 'CareerLens AI',
    num: '01',
    tag: 'LLAMA 3.3 70B · PRODUCTION AI',
    verifiedBadge: 'PIPELINE VERIFIED',
    desc: 'An end-to-end intelligent career acceleration pipeline that bridges the gap between job candidates and modern ATS algorithms. Ingests raw resumes in PDF format, performs structured entity extraction, cross-references target job descriptions, computes semantic match scores, and generates precision bullet rewrites tailored for high-ranking interview shortlists in under 60 seconds.',
    latency: 'LATENCY <60s',
    stages: [
      { step: '01 PARSE', title: 'Deterministic', sub: 'PDF Extraction' },
      { step: '02 EMBED', title: 'Cosine Vector', sub: 'JD Matching' },
      { step: '03 REWRITE', title: 'Llama 3.3 70B', sub: '94% Calibrated', highlight: true, subColor: '#22c55e' },
    ],
    metricRow1: {
      label: '8-STAGE PIPELINE',
      desc: 'PDF parsing, vector scoring & bullet rewrites.',
      badge: '100% OPERATIONAL',
    },
    metricRow2: {
      label: 'ATS CALIBRATION',
      info: 'AVG 42.8s',
      value: '94%',
      percent: 94,
    },
    cats: ['React.js', 'FastAPI', 'Llama 3.3 70B', 'Python', 'Vector Search', 'JWT Auth'],
    github: 'https://github.com/Hareshls/Ai-resume-matcher',
    demo: null,
    status: 'LIVE DEMO',
  },
  {
    title: 'ContractIQ',
    num: '02',
    tag: 'RAG + FAISS · LEGAL AI',
    verifiedBadge: 'ZERO HALLUCINATION',
    desc: 'Automated legal contract intelligence and risk assessment platform designed for high-stakes agreements. Breaks down complex commercial contracts into clause-level embeddings stored in FAISS, detects hidden indemnities and high-liability risks against historical precedent, and synthesizes actionable plain-English risk assessments with zero hallucination guarantee.',
    latency: 'LATENCY <120ms',
    stages: [
      { step: '01 CHUNK', title: 'Clause Splitter', sub: 'Semantic Boundary' },
      { step: '02 INDEX', title: 'FAISS Vector', sub: 'Sub-ms Retrieval' },
      { step: '03 REASON', title: 'LLM Risk Audit', sub: 'Citation Grounded', highlight: true, subColor: '#22c55e' },
    ],
    metricRow1: {
      label: 'CLAUSE RISK SCORING',
      desc: 'Calibrated 0–100 scores for high-liability terms.',
      badge: 'PRECEDENT BACKED',
    },
    metricRow2: {
      label: 'VECTOR ACCURACY',
      info: 'RETRIEVAL <1ms',
      value: '98%',
      percent: 98,
    },
    cats: ['React.js', 'FastAPI', 'FAISS Vector DB', 'Python', 'LLM Reasoning', 'JWT Auth'],
    github: 'https://github.com/Hareshls/ContractIQ-Intelligent-Contract-Risk-Analysis-and-RAG-Based-Legal-Assistant',
    demo: null,
    status: 'LIVE DEMO',
  },
  {
    title: 'SpendMind',
    num: '03',
    tag: 'MERN STACK · REAL-TIME ANALYTICS',
    verifiedBadge: 'REAL-TIME SYNC',
    desc: 'Full-stack financial management and real-time budget forecasting application. Features automatic transaction categorization, intelligent monthly burn-rate predictions, custom spending thresholds with instant warning triggers, and interactive data visualization charts to provide complete clarity over cash flow and saving targets.',
    latency: 'LATENCY <45ms',
    stages: [
      { step: '01 INGEST', title: 'Stream Pipeline', sub: 'Raw Transactions' },
      { step: '02 CLASSIFY', title: 'Auto Merchant', sub: 'Category Mapping' },
      { step: '03 FORECAST', title: 'Burn Rate ML', sub: 'Pre-Overrun Alert', highlight: true, subColor: '#22c55e' },
    ],
    metricRow1: {
      label: 'SMART CATEGORIZATION',
      desc: 'Automatic merchant & category classification.',
      badge: '100% OPERATIONAL',
    },
    metricRow2: {
      label: 'PREDICTIVE ACCURACY',
      info: 'BURN FORECAST',
      value: '96%',
      percent: 96,
    },
    cats: ['MongoDB', 'Express.js', 'React.js', 'Node.js', 'REST APIs', 'Chart.js'],
    github: 'https://github.com/Hareshls/Expensetrackers',
    demo: null,
    status: 'LIVE DEMO',
  },
  {
    title: 'RAG Doc Q&A',
    num: '04',
    tag: 'FASTAPI + FAISS · RAG ENGINE',
    verifiedBadge: 'STRICT CITATIONS',
    desc: 'High-throughput document intelligence engine that transforms large PDFs and enterprise knowledge bases into conversational agents. Features smart document chunking with semantic overlap, dense embedding generation, FAISS vector indexing, and grounded context injection to guarantee accurate, context-bound question answers with exact page citations.',
    latency: 'LATENCY <90ms',
    stages: [
      { step: '01 CHUNK', title: 'Smart Chunking', sub: 'Sliding Overlap' },
      { step: '02 EMBED', title: 'Dense Vectors', sub: 'FAISS Top-K Store' },
      { step: '03 GROUND', title: 'Context Inject', sub: 'Exact Page Quotes', highlight: true, subColor: '#22c55e' },
    ],
    metricRow1: {
      label: 'DENSE EMBEDDINGS',
      desc: 'Semantic boundary chunking with sliding context.',
      badge: '100% OPERATIONAL',
    },
    metricRow2: {
      label: 'EXACT CITATIONS',
      info: 'PAGE GROUNDING',
      value: '99%',
      percent: 99,
    },
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
            if (i < totalCards - 1 && p >= (i + 1) / steps) {
              card.style.visibility = 'hidden';
            } else {
              card.style.visibility = 'visible';
            }

            if (i === 0) {
              const card1P = Math.min(1, Math.max(0, p * steps));
              const scale = 1 - card1P * 0.04;
              card.style.transform = `scale(${scale})`;
              card.style.opacity = '1';
            } else {
              const enterStart = (i - 1) / steps;
              const enterEnd = i / steps;

              if (p <= enterStart) {
                card.style.transform = 'translateY(105vh)';
                card.style.opacity = '1';
              } else if (p < enterEnd) {
                const cardP = (p - enterStart) / (enterEnd - enterStart);
                const ease = 1 - Math.pow(1 - cardP, 2.2);
                const translateY = (1 - ease) * 105;
                card.style.transform = `translateY(${translateY}vh) scale(1)`;
                card.style.opacity = '1';
              } else {
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

              {/* TWO-COLUMN GRID: Left = Title, Desc, Tech, Buttons | Right = Architecture HUD Panel */}
              <div className="card-columns">
                {/* LEFT COLUMN */}
                <div className="card-left-col">
                  <div>
                    <div className="p-title-row">
                      <h3 className="p-card-title">{p.title}</h3>
                      {p.verifiedBadge && (
                        <div className="p-verified-badge">
                          <span className="p-dot" />
                          <span>{p.verifiedBadge}</span>
                        </div>
                      )}
                    </div>
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

                {/* RIGHT COLUMN: SYSTEM ARCHITECTURE HUD PANEL */}
                <div className="card-right-col">
                  <div className="arch-panel">
                    {/* Panel Header */}
                    <div className="arch-header">
                      <div className="arch-header-title">
                        <span className="arch-dot" />
                        <span>SYSTEM ARCHITECTURE</span>
                      </div>
                      <span className="arch-latency-badge">{p.latency}</span>
                    </div>

                    {/* 3-Stage Pipeline Boxes */}
                    <div className="arch-stages-grid">
                      {p.stages.map((stg) => (
                        <div
                          key={stg.step}
                          className={`arch-stage-box ${stg.highlight ? 'arch-stage-highlight' : ''}`}
                        >
                          <span className="arch-stage-step">{stg.step}</span>
                          <h4 className="arch-stage-title">{stg.title}</h4>
                          <span
                            className="arch-stage-sub"
                            style={{ color: stg.subColor || '#71717a' }}
                          >
                            {stg.sub}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Metric Row 1: Pipeline Status */}
                    <div className="arch-metric-row-1">
                      <div className="arch-metric-info">
                        <div className="arch-metric-title">
                          <span className="arch-dot" />
                          <span>{p.metricRow1.label}</span>
                        </div>
                        <p className="arch-metric-desc">{p.metricRow1.desc}</p>
                      </div>
                      <span className="arch-badge-operational">{p.metricRow1.badge}</span>
                    </div>

                    {/* Metric Row 2: Calibration & Glowing Progress Track */}
                    <div className="arch-metric-row-2">
                      <div className="arch-progress-header">
                        <div className="arch-metric-title">
                          <span className="arch-dot" />
                          <span>{p.metricRow2.label}</span>
                        </div>
                        <div className="arch-progress-meta">
                          <span className="arch-progress-info">{p.metricRow2.info}</span>
                          <span className="arch-progress-val">{p.metricRow2.value}</span>
                        </div>
                      </div>
                      <div className="arch-progress-track">
                        <div
                          className="arch-progress-fill"
                          style={{ width: `${p.metricRow2.percent}%` }}
                        />
                      </div>
                    </div>
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
