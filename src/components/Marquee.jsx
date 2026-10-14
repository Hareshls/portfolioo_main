import { useEffect } from 'react';

const WORDS = ['Prompt Engineering', 'RAG Pipelines', 'Vector Search', 'React.js', 'FastAPI'];

export default function Marquee() {
  // Doubles are already rendered statically, no JS needed
  return (
    <section className="mq" aria-label="Skills" style={{ paddingInline: 0 }}>
      <div id="mq">
        {[...WORDS, ...WORDS].map((w, i) => (
          <span key={i} className="d">{w}</span>
        ))}
      </div>
    </section>
  );
}
