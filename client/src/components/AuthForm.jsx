export default function AuthForm({mode, onSubmit, onSwitch, error, busy,}) {
  const registering = mode === "register";

  return (
    <form className="auth-form" onSubmit={onSubmit}>
      {/* Form heading */}
      <div className="panel-kicker">
        {registering ? "NEW DEVELOPER PROFILE" : "RETURNING DEVELOPER"}
      </div>

      <h2>
        {registering ? "Create your account" : "Sign in"}
      </h2>

      <p>
        {registering 
        ? "Save your checkpoints and train across company tracks." 
        : "Restore your practice history and continue your sequence."}
      </p>

      {/* Name field - Only for registration */}
      {registering && (
        <label>
          NAME

          <input
            name="name"
            autoComplete="name"
            placeholder="Ada Lovelace"
            required
          />
        </label>
      )}

      {/* Email field */}
      <label>
        EMAIL

        <input
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@domain.com"
          required
        />
      </label>

      {/* Password field */}
      <label>
        PASSWORD

        <input
          name="password"
          type="password"
          autoComplete={registering ? "new-password" : "current-password"}
          minLength="6"
          placeholder="6 characters minimum"
          required
        />
      </label>

      {/* Authentication error */}
      {error && (<div className="auth-error"> {error} </div>)}

      {/* Submit button */}
      <button
        className="button-primary auth-submit"
        disabled={busy}
      >
        {busy
          ? "CONNECTING…"
          : registering
            ? "Create account"
            : "Sign in"}

        <span>→</span>
      </button>

      {/* Switch between Login and Register */}
      <div className="auth-switch">
        {registering
          ? "Already have an account?"
          : "New here?"}

        <button
          type="button"
          onClick={onSwitch}
        >
          {registering ? "Sign in" : "Create an account"}
        </button>
      </div>
    </form>
  );
}
