const PRINCIPLES = [
  {
    num: '01',
    title: 'Grounded, not guessed',
    desc: 'RAG pipelines with FAISS retrieve real precedent so model answers stay context-grounded and hallucinations stay low.',
  },
  {
    num: '02',
    title: 'Pixel-accurate interfaces',
    desc: 'Responsive React frontends crafted straight from Figma specs, consistent across devices and browsers.',
    delay: 90,
  },
  {
    num: '03',
    title: 'Clean API integration',
    desc: 'Frontends wired to REST backends for smooth, reliable data flow — Node, Express and FastAPI.',
    delay: 180,
  },
  {
    num: '04',
    title: 'Performance matters',
    desc: 'Optimised load speed and rendering so products feel fast, not just look right.',
    delay: 270,
  },
];

export default function Story() {
  return (
    <section id="story">
      <div className="g12">
        <div className="c6">
          <p className="eb">The Story</p>
          <h2
            className="d h2 h2s"
            style={{ marginTop: '1.5rem', maxWidth: '16ch', lineHeight: 0.95 }}
            data-a="lines"
            data-st="90"
          >
            <span>Ship AI products end to end.</span>
          </h2>
          <p className="lead fu">
            AI Full-Stack Engineer skilled in the MERN stack and LLM application development with FastAPI, Llama 3.3, RAG
            pipelines and FAISS. Four end-to-end AI products spanning prompt engineering, vector search and responsive
            interfaces — now looking to grow on product-focused teams.
          </p>
        </div>
        <div className="c6" style={{ paddingTop: '0.5rem' }}>
          <ul className="pr">
            {PRINCIPLES.map((p) => (
              <li key={p.num} className="fu" data-d={p.delay || 0}>
                <em>{p.num}</em>
                <div>
                  <h3>{p.title}</h3>
                  <p>{p.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
