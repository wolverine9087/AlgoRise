import { useAuth } from "../context/AuthContext";

const labels = {
  dashboard: "Overview",
  practice: "Daily practice",
  login: "Sign in",
  register: "Create account",
};

export default function Topbar({ page, onNavigate, onMenu }) {
  const { user } = useAuth();

  return (
    <header className="topbar">
      {/* Navigation Menu */}
      <button
        className="menu-button"
        onClick={onMenu}
        aria-label="Open navigation"
      >
        ☰
      </button>

      {/* Breadcrumbs */}
      <div className="breadcrumbs">
        <span>workspace</span>
        <i>/</i>
        <b>{labels[page] || "Overview"}</b>
      </div>

      {/* Right Side Actions */}
      <div className="topbar-right">
        <span className="connection">
          <i className="connected" />
          PERSONALIZED SETS
        </span>

        <button
          className="help-button"
          title="Open daily practice"
          onClick={() => onNavigate("practice")}
        >
          ?
        </button>

        {/* User Profile Button */}
        <button
          className="top-user"
          onClick={() => onNavigate(user ? "dashboard" : "login")}
        >
          {user?.name?.[0]?.toUpperCase() || "G"}
        </button>
      </div>
    </header>
  );
}
