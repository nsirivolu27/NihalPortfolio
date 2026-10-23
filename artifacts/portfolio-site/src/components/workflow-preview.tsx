const stages = [
  {
    name: "Draft",
    title: "Start with a draft.",
    detail:
      "AI prepares a draft for a person to review before the work moves forward.",
    note: "AI proposes",
    icon: "01",
  },
  {
    name: "Human review",
    title: "Check the draft and its sources.",
    detail:
      "A reviewer checks the draft against its supporting evidence before deciding whether it is ready for the next stage.",
    note: "Human judgment",
    icon: "02",
  },
  {
    name: "Sign-off",
    title: "Sign off on the reviewed version.",
    detail:
      "An independent reviewer signs off using a content hash, which records the exact version they approved.",
    note: "Independent review",
    icon: "03",
  },
  {
    name: "Next stage",
    title: "Move forward after approval.",
    detail:
      "Each stage needs human approval. This preview illustrates the process; it does not run or approve real tasks.",
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
                ? "Approval linked to a specific version"
                : "Check the evidence before proceeding"}
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
