const choices = [
  {
    value: "EASY_ONE_TRY",
    icon: "✓",
    title: "Solved",
    detail: "On my own",
    tone: "success",
  },
  {
    value: "SOLVED_AFTER_TRIES",
    icon: "↻",
    title: "Solved after tries",
    detail: "Needed more attempts",
    tone: "warning",
  },
  {
    value: "SOLUTION_VIEWED",
    icon: "↗",
    title: "Need to revisit",
    detail: "Couldn’t solve it yet",
    tone: "violet",
  },
];

export default function CheckpointCard({
  onCheckpoint,
  busy = false,
}) {
  return (
    <section className="checkpoint-card">
      {/* Checkpoint Header */}
      <div className="checkpoint-heading">
        <span>CHECKPOINT</span>

        <h3>How did it go?</h3>

        <p>
          Your answer tunes the questions in your next daily set.
        </p>
      </div>

      {/* Checkpoint Choices */}
      <div className="checkpoint-choices">
        {choices.map((choice) => (
          <button
            key={choice.value}
            disabled={busy}
            onClick={() => onCheckpoint(choice.value)}
          >
            <span className={`checkpoint-icon ${choice.tone}`}>
              {choice.icon}
            </span>

            <b>{choice.title}</b>

            <small>{choice.detail}</small>
          </button>
        ))}
      </div>
    </section>
  );
}
