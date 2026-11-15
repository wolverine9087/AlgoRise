
export default function AdaptiveSuggestion({
  recommendation,
  loading,
  onContinue,
}) {
  return (
    <section className="adaptive-card">
      {/* AI Coach Header */}
      <div className="ai-chip">
        <span>✧</span> GROQ ADAPTIVE COACH
      </div>

      {/* Loading State */}
      {loading ? (
        <>
          <h3>
            Generating from your last checkpoint
            <span className="blink">_</span>
          </h3>

          <p>
            Groq is creating a new problem and solution for your next rep.
          </p>
        </>
      ) : recommendation?.question ? (
        <>
          {/* Recommendation Details */}
          <h3>{recommendation.question.title}</h3>

          <p>{recommendation.reason}</p>

          <div className="adaptive-meta">
            <span
              className={`difficulty ${recommendation.question.difficulty?.toLowerCase()}`}
            >
              {recommendation.question.difficulty}
            </span>

            <span>{recommendation.question.topic}</span>

            <span>Groq generated</span>
          </div>

          {/* Continue Button */}
          <button
            className="button-primary"
            onClick={onContinue}
          >
            Load next question <span>→</span>
          </button>
        </>
      ) : (
        <>
          {/* Error State */}
          <h3>Groq could not generate your next question</h3>

          <p>
            {recommendation?.reason ||
              "Check the Groq API configuration and try again."}
          </p>
        </>
      )}
    </section>
  );
}
