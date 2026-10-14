import { useState } from 'react';

const VOICES = [
  {
    org: 'Cube AI Solutions',
    role: 'Frontend Developer Intern · Jun – Oct 2025',
    quote: 'Developed responsive React frontends for four real-time projects, built pixel-accurate from Figma specs and integrated with backend REST APIs.',
    abbr: 'CA',
  },
  {
    org: 'Certifications',
    role: 'MongoDB · Oracle University',
    quote: 'MongoDB Certified Associate Developer, and Oracle Certified Foundations Associate in Agentic AI — database design, query optimisation and agentic AI foundations.',
    abbr: 'CE',
  },
  {
    org: 'Recognition',
    role: 'Kongu Engineering College',
    quote: '1st Prize and Best Paper Award for a machine learning paper presentation at CIT Coimbatore, plus Media Head of the Department Association.',
    abbr: '1ST',
  },
];

export default function Proof() {
  const [active, setActive] = useState(0);
  const [go, setGo] = useState(true);

  function activate(i) {
    setGo(false);
    setActive(i);
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        setGo(true);
      })
    );
  }

  const v = VOICES[active];
  const words = v.quote.split(' ');

  return (
    <section id="voices">
      <p className="eb">Proof</p>
      <h2 className="d h2" style={{ marginTop: '1.5rem' }} data-a="lines" data-st="90">
        <span>What's on record.</span>
      </h2>

      <div className="vb">
        <ul className="vl c5" id="vl" style={{ gridColumn: 'span 5' }}>
          {VOICES.map((v, i) => (
            <li key={i}>
              <button
                data-i={i}
                className={active === i ? 'a' : ''}
                onMouseEnter={() => activate(i)}
                onFocus={() => activate(i)}
                onClick={() => activate(i)}
              >
                <small>0{i + 1}</small>
                <span>
                  <strong>{v.org}</strong>
                  <em>{v.role}</em>
                </span>
                <u />
              </button>
            </li>
          ))}
        </ul>

        <div className="fp" style={{ gridColumn: 'span 7' }}>
          <blockquote>
            <p>
              <q className={go ? 'go' : ''}>
                <span className="proof-quote-sym">“</span>
                {words.map((w, k) => (
                  <span
                    key={`${active}-${k}`}
                    className="wd"
                    style={{
                      transitionDelay: `${k * 18}ms`,
                      opacity: go ? 1 : 0,
                      transform: go ? 'none' : 'translateY(16px)',
                    }}
                  >
                    {w}
                  </span>
                ))}
                <span className="proof-quote-sym">”</span>
              </q>
            </p>
            <footer id="who">{v.org} — {v.role}</footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
}

