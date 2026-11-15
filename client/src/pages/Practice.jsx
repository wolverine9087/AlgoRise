
import { useState } from "react";
import CheckpointCard from "../components/CheckpointCard";
import { usePractice } from "../context/PracticeContext";

export default function Practice({ initialQuestionId }) {
  const {
    questions,
    progress,
    dailyTarget,
    setDailyTarget,
    generateDailySet,
    generationBusy,
    generationError,
    checkpoint,
    stats,
    lastOutcome,
  } = usePractice();

  const [questionId, setQuestionId] = useState(
    initialQuestionId || questions[0]?.id
  );

  const current =
    questions.find((item) => item.id === questionId) || questions[0];

  const [targetInput, setTargetInput] = useState(String(dailyTarget));

  function createPlan(event) {
    event.preventDefault();

    const target = Math.min(60, Math.max(1, Number(targetInput) || 1));

    setTargetInput(String(target));
    setDailyTarget(target);
    generateDailySet(target);
    setQuestionId(null);
  }

  function mark(outcome) {
    checkpoint(current, outcome);

    const index = questions.findIndex(
      (item) => item.id === current?.id
    );

    setQuestionId(questions[(index + 1) % questions.length]?.id);
  }

  const solvedToday = questions.filter(
    (question) => progress[question.id]?.status === "SOLVED"
  ).length;

  const currentTopic = current && stats.byTopic[current.topic];

  return (
    <div className="page-stack practice-page">
      {/* Page Header and Daily Target */}
      <section className="practice-title-row">
        <div>
          <div className="eyebrow">DAILY PRACTICE / PERSONALIZED</div>

          <h1>
            Your DSA question queue
            <span className="cursor">_</span>
          </h1>

          <p>
            Practice real problems. Checkpoints shape the mix of topics
            and reviews you get next.
          </p>
        </div>

        <form className="daily-target-form" onSubmit={createPlan}>
          <label className="filter-control">
            DAILY TARGET

            <input
              aria-label="Daily question target"
              type="number"
              min="1"
              max="60"
              value={targetInput}
              onChange={(event) => setTargetInput(event.target.value)}
            />
          </label>

          <button
            className="button-primary"
            type="submit"
            disabled={generationBusy}
          >
            {generationBusy
              ? "Generating with AI…"
              : questions.length
                ? "Generate next set"
                : "Generate today’s set"}
          </button>
        </form>
      </section>

      {/* Generation Error */}
      {generationError && (
        <div className="auth-error" role="alert">
          {generationError}
        </div>
      )}

      {/* Daily Summary */}
      <section className="daily-summary">
        <div>
          <b>
            {solvedToday} / {questions.length}
          </b>
          <span>today’s questions solved</span>
        </div>

        <div>
          <b>{stats.solved}</b>
          <span>total problems solved</span>
        </div>

        <div>
          <b>{stats.review}</b>
          <span>questions to revisit</span>
        </div>
      </section>

      {/* Empty State or Practice Layout */}
      {!current ? (
        <div className="empty-practice">
          <h1>
            {generationBusy
              ? "Building your personalized question set…"
              : "Build today’s question set"}
          </h1>

          <p>
            {generationBusy
              ? "AI is selecting real LeetCode problems using your target and checkpoint history."
              : "Choose your daily target above to generate questions with AI."}
          </p>
        </div>
      ) : (
        <div className="practice-layout">
          {/* Main Practice Area */}
          <main className="practice-main">
            <section className="panel problem-panel">
              <div className="problem-toolbar">
                <span>
                  <i className="live-dot" />
                  TODAY /{" "}
                  {String(
                    questions.findIndex(
                      (item) => item.id === current.id
                    ) + 1
                  ).padStart(2, "0")}{" "}
                  OF {String(questions.length).padStart(2, "0")}
                </span>

                <span>LINKED PROBLEM</span>
              </div>

              <div className="problem-title">
                <h2>{current.title}</h2>

                <span
                  className={`difficulty ${current.difficulty.toLowerCase()}`}
                >
                  {current.difficulty}
                </span>
              </div>

              <div className="topic-line">
                <span>{current.topic}</span>
                <span className="topic-separator">/</span>
                <span>{currentTopic?.solved || 0} solved in this topic</span>
              </div>

              <div className="terminal-rule" />

              {/* LeetCode Problem Link */}
              <div className="linked-question">
                <p>
                  Open the original problem on LeetCode, solve it there,
                  then record your checkpoint here.
                </p>

                <a
                  className="button-primary"
                  href={current.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  Solve on LeetCode
                  <span aria-hidden="true">↗</span>
                </a>
              </div>

              {/* Topic Progress */}
              <div className="question-topic-note">
                <b>TOPIC PROGRESS</b>

                <p>
                  {currentTopic?.solved >= 3
                    ? "You’ve solved several problems in this topic. Your next set will focus more on other topics."
                    : currentTopic?.solved >= 2
                      ? "You’re building strength here. The next set will include fewer questions from this topic."
                      : "Keep logging checkpoints. Your topic mix will adapt as patterns emerge."}
                </p>
              </div>
            </section>

            {/* Checkpoint Card */}
            <CheckpointCard onCheckpoint={mark} />

            {/* Checkpoint Confirmation */}
            {lastOutcome && (
              <div className="checkpoint-confirmation">
                Checkpoint saved for {lastOutcome.question.title}.
                Your next daily set will use this result.
              </div>
            )}

            {/* Previous and Next Controls */}
            <div className="sequence-controls">
              <button
                onClick={() => {
                  const index = questions.findIndex(
                    (item) => item.id === current.id
                  );

                  setQuestionId(
                    questions[
                      (index - 1 + questions.length) % questions.length
                    ].id
                  );
                }}
              >
                ← Previous
              </button>

              <span>{current.topic.toUpperCase()}</span>

              <button
                className="button-outline"
                onClick={() => {
                  const index = questions.findIndex(
                    (item) => item.id === current.id
                  );

                  setQuestionId(
                    questions[(index + 1) % questions.length].id
                  );
                }}
              >
                Next question →
              </button>
            </div>
          </main>

          {/* Sidebar */}
          <aside className="practice-sidebar">
            {/* Today's Queue */}
            <section className="panel coach-panel">
              <div className="panel-kicker">TODAY’S QUEUE</div>

              <h3>
                {questions.length} questions · target {dailyTarget}
              </h3>

              {questions.map((question, index) => (
                <button
                  className={`queue-item ${
                    question.id === current.id ? "active" : ""
                  }`}
                  key={`${question.id}-${index}`}
                  onClick={() => setQuestionId(question.id)}
                >
                  <span className="question-order">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span>
                    <b>{question.title}</b>
                    <small>{question.topic}</small>
                  </span>

                  <i
                    className={
                      progress[question.id]?.status === "SOLVED"
                        ? "queue-solved"
                        : ""
                    }
                  >
                    {progress[question.id]?.status === "SOLVED" ? "✓" : "·"}
                  </i>
                </button>
              ))}
            </section>

            {/* Personalization Information */}
            <section className="panel coach-panel">
              <div className="panel-kicker">PERSONALIZATION</div>

              <h3>Your history tunes the mix</h3>

              <p className="coach-copy">
                Questions you need to revisit return in a future set.
                After two or three solves in a topic, its share drops
                so you can strengthen other areas.
              </p>

              <div className="coach-status">
                <i />
                CHECKPOINTS SAVED ON THIS DEVICE
              </div>
            </section>
          </aside>
        </div>
      )}
    </div>
  );
}
