const stages = [
  {
    name: "Draft",
    title: "An AI draft starts the conversation.",
    detail:
      "A proposed stage is ready for a person to inspect. Generated output is a starting point, not an approval.",
    note: "AI proposes",
    icon: "01",
  },
  {
    name: "Human review",
    title: "Evidence, beside the decision.",
    detail:
      "A person reviews the draft alongside its supporting evidence. The next stage waits for deliberate review.",
    note: "Human judgment",
    icon: "02",
  },
  {
    name: "Sign-off",
    title: "Review the exact version.",
    detail:
      "An independent reviewer signs a content hash, tying sign-off to the version that was actually reviewed.",
    note: "Independent review",
    icon: "03",
  },
  {
    name: "Next stage",
    title: "Nothing advances on its own.",
    detail:
      "Progress stays supervised. This illustration shows the workflow concept; it does not run or approve a real task.",
    note: "Supervised progress",
    icon: "04",
  },
];

export function WorkflowPreview({
  progress,
  onChange,
}: {
  progress: number;
  onChange: (value: number) => void;
}) {
  const index = Math.min(3, Math.floor(progress / 25));
  const stage = stages[index];
  return (
    <div className="workflow-preview">
      <div className="workflow-topbar">
        <span className="workflow-brand">
          m<span>·</span>
        </span>
        <div>
          <strong>Review workspace</strong>
          <small>Illustrative project preview</small>
        </div>
        <span className="workflow-badge">Human in the loop</span>
      </div>
      <div className="workflow-layout">
        <div
          className="workflow-steps"
          role="group"
          aria-label="Explore workflow stages"
        >
          <p>Workflow</p>
          {stages.map((item, i) => (
            <button
              type="button"
              key={item.name}
              aria-pressed={i === index}
              onClick={() => onChange(i * 25 + 10)}
            >
              <span>{item.icon}</span>
              {item.name}
            </button>
          ))}
        </div>
        <div
          className="workflow-document"
          aria-live="polite"
          aria-atomic="true"
        >
          <span className="workflow-document-label">{stage.note}</span>
          <h4>{stage.title}</h4>
          <p>{stage.detail}</p>
          <div className="workflow-evidence">
            <span>Review principle</span>
            <strong>
              {index === 2
                ? "Version-bound sign-off"
                : "Evidence before advancement"}
            </strong>
            <div aria-hidden="true">
              <i />
              <i />
              <i />
            </div>
          </div>
          <div className="workflow-gate">
            <span aria-hidden="true">◇</span> Human approval required
          </div>
        </div>
      </div>
      <div className="workflow-bottom">
        <span>Supervised AI workflow</span>
        <span>Magentic.AI</span>
      </div>
    </div>
  );
}
