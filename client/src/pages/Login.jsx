import AuthForm from "../components/AuthForm";

export default function Login({onSubmit, onSwitch, error, busy,}) {
  return (
    <AuthLayout>
      <AuthForm
        mode="login"
        onSubmit={onSubmit}
        onSwitch={onSwitch}
        error={error}
        busy={busy}
      />
    </AuthLayout>
  );
}

export function AuthLayout({ children }) {
  return (
    <main className="auth-page">
      {/* Brand */}
      <a className="brand auth-brand" href="#home">
        <span className="brand-symbol">&lt;/&gt;</span>

        <span>
          algorise<span className="brand-accent">_</span>
        </span>
      </a>

      <div className="auth-columns">
        {/* Left side: Introduction */}
        <section className="auth-pitch">
          <div className="eyebrow">
            DEVELOPER MODE / INTERVIEW PREP
          </div>

          <h1>
            Think in patterns.
            <br />
            <span>Level up every rep.</span>
          </h1>

          <p>
            A focused practice workspace that learns from your
            checkpoints and keeps the next problem at the right
            edge of your ability.
          </p>

          <div className="auth-points">
            <span>
              <b>01</b>
              Company-specific question tracks
            </span>

            <span>
              <b>02</b>
              Difficulty that adapts to your work
            </span>

            <span>
              <b>03</b>
              Progress that stays in your account
            </span>
          </div>

          {/* Terminal preview */}
          <div className="auth-terminal">
            <span>
              <i /> TRAINING SESSION / READY
            </span>

            <code>
              <em>const</em> nextMove ={" "}
              <strong>yourCheckpoint</strong>( );
              <br />
              <small>
                // build the signal, one problem at a time
              </small>
            </code>
          </div>
        </section>

        {/* Right side: Login/Register form */}
        <div>{children}</div>
      </div>

      {/* Footer */}
      <footer>
        © 2026 ALGORISE
        <span>BUILT FOR THE NEXT LEVEL</span>
      </footer>
    </main>
  );
}
