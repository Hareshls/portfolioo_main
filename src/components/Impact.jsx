const STATS = [
  { value: '4',    label: 'AI products shipped end to end', delay: 0 },
  { value: '<60s', label: 'CareerLens full analysis pipeline', delay: 110 },
  { value: '5',    label: 'Months building real-time frontends', delay: 220 },
  { value: '2',    label: 'Industry certifications earned', delay: 330 },
];

export default function Impact() {
  return (
    <section id="impact">
      <p className="eb">By The Numbers</p>
      <h2 className="d h2" style={{ marginTop: '1.5rem' }} data-a="lines" data-st="90">
        <span>Early career, measured.</span>
      </h2>
      <dl className="st">
        {STATS.map((s) => (
          <div key={s.label} className="fu" data-d={s.delay}>
            <dd className="d">{s.value}</dd>
            <dt>{s.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}
