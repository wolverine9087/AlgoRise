export default function MetricCard({
  icon,
  label,
  value,
  suffix = "",
  tone = "violet",
  note,
}) {
  return (
    <article className="metric-card">
      {/* Metric Header */}
      <div className="metric-top">
        <span>{label}</span>

        <i className={`metric-icon ${tone}`}>
          {icon}
        </i>
      </div>

      {/* Metric Value */}
      <div className="metric-value">
        {value}
        <small>{suffix}</small>
      </div>

      {/* Metric Note */}
      <div className="metric-note">
        {note}
      </div>
    </article>
  );
}
