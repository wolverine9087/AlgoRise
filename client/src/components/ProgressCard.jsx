export default function ProgressCard({
  total = 0,
  solved = 0,
  review = 0,
  compact = false,
}) {
  const left = Math.max(0, total - solved);

  const percent = total
    ? Math.round((solved / total) * 100)
    : 0;

  return (
    <section className={`progress-card ${compact ? "compact" : ""}`}>
      {/* Progress Header */}
      <div className="panel-kicker">
        PROGRESS / CURRENT TRACK
      </div>

      {/* Progress Ring */}
      <div
        className="progress-ring"
        style={{ "--progress": `${percent}%` }}
      >
        <div>
          <strong>
            {percent}
            <small>%</small>
          </strong>

          <span>complete</span>
        </div>
      </div>

      {/* Progress Legend */}
      <div className="progress-legend">
        <span>
          <i className="legend-solved" />
          Solved <b>{solved}</b>
        </span>

        <span>
          <i className="legend-review" />
          Review <b>{review}</b>
        </span>

        <span>
          <i className="legend-open" />
          Remaining <b>{left}</b>
        </span>
      </div>
    </section>
  );
}
