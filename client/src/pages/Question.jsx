import QuestionStatement from "../components/QuestionStatement";

export default function Question({ question }) {
  if (!question) {
    return (
      <div className="empty-card">
        Choose a question to inspect its prompt.
      </div>
    );
  }

  return (
    <div className="panel question-page">
      <div className="panel-kicker">
        QUESTION DETAIL / {question.topic?.toUpperCase()}
      </div>

      <div className="problem-title">
        <h2>{question.title}</h2>

        <span
          className={`difficulty ${question.difficulty?.toLowerCase()}`}
        >
          {question.difficulty}
        </span>
      </div>

      <QuestionStatement question={question} />
    </div>
  );
}
