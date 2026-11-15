
export default function QuestionStatement({ question }) {
  return (
    <article className="statement">
      {/* Problem Description */}
      <div className="panel-kicker">
        AI-GENERATED PROBLEM STATEMENT
      </div>

      <p>{question.description}</p>

      {/* Platform Links */}
      <div className="platform-links">
        {question.platformLinks?.map((link) => (
          <a
            key={link.platform}
            href={link.url}
            target="_blank"
            rel="noreferrer"
          >
            Search {link.platform} ↗
          </a>
        ))}
      </div>

      {/* Examples */}
      <div className="panel-kicker example-label">
        EXAMPLES
      </div>

      {(question.examples || []).map((example, index) => {
        const input = Array.isArray(example)
          ? example[0]
          : example.input;

        const output = Array.isArray(example)
          ? example[1]
          : example.output;

        return (
          <div className="example-block" key={index}>
            <div className="example-heading">
              EXAMPLE {String(index + 1).padStart(2, "0")}
            </div>

            <pre>
              <span>Input</span>   {input}
              <br />
              <span>Output</span>  {output}
            </pre>

            {example.explanation && (
              <p>{example.explanation}</p>
            )}
          </div>
        );
      })}

      {/* Constraints */}
      {question.constraints?.length > 0 && (
        <div className="constraints">
          <b>CONSTRAINTS</b>

          <ul>
            {question.constraints.map((constraint, index) => (
              <li key={index}>{constraint}</li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}
