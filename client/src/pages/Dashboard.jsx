import { usePractice } from "../context/PracticeContext";

export default function Dashboard({ onNavigate }) {
  // Get practice data from PracticeContext
  const { dailyTarget, stats } = usePractice();

  // Get the 6 topics with the fewest solved questions
  const topics = Object.entries(stats.byTopic)
    .sort((a, b) => a[1].solved - b[1].solved)
    .slice(0, 6);

  return (
    <div className="page-stack">

      {/* Welcome Section */}
      <section className="welcome-row">
        <div>
          <div className="eyebrow">
            DAILY DSA / YOUR PRACTICE
          </div>

          <h1>Build a steady solving habit.</h1>

          <p>
            Practice real problems and let your checkpoints guide
            tomorrow’s question mix.
          </p>
        </div>

        <button
          className="button-primary"
          onClick={() => onNavigate("practice")}
        >
          Start today’s set →
        </button>
      </section>

      {/* Practice Metrics */}
      <section className="metrics-grid">

        {/* Daily Target */}
        <article className="metric-card">
          <div className="metric-top">
            <span>DAILY TARGET</span>
          </div>

          <div className="metric-value">
            {dailyTarget}
          </div>

          <div className="metric-note">
            questions per day
          </div>
        </article>

        {/* Solved Questions */}
        <article className="metric-card">
          <div className="metric-top">
            <span>SOLVED</span>
          </div>

          <div className="metric-value">
            {stats.solved}
          </div>

          <div className="metric-note">
            problems logged
          </div>
        </article>

        {/* Questions to Revisit */}
        <article className="metric-card">
          <div className="metric-top">
            <span>REVISIT</span>
          </div>

          <div className="metric-value">
            {stats.review}
          </div>

          <div className="metric-note">
            questions to reinforce
          </div>
        </article>

      </section>

      {/* Topic Progress Section */}
      <section className="panel topic-progress">
        <div className="panel-kicker">
          TOPIC HISTORY
        </div>

        <h2>Your practice balance</h2>

        <p>
          Topics with several solves get less space in upcoming sets.
          Weaker areas and review questions come up more often.
        </p>

        {topics.length ? (
          <div className="topic-progress-grid">
            {topics.map(([topic, record]) => (
              <div
                className="topic-progress-row"
                key={topic}
              >
                <span>{topic}</span>

                <b>{record.solved} solved</b>

                <small>{record.review} to revisit</small>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-card">
            Topic insights will appear after your first checkpoint.
          </div>
        )}
      </section>

    </div>
  );
}
