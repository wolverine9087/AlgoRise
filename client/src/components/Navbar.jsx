
import { useAuth } from "../context/AuthContext";
import { usePractice } from "../context/PracticeContext";

export default function Navbar({
  page,
  onNavigate,
  mobileOpen,
  setMobileOpen,
}) {
  const { user, logout } = useAuth();
  const { dailyTarget, stats } = usePractice();

  return (
    <>
      {/* Sidebar */}
      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        {/* Brand Logo */}
        <a
          className="brand"
          href="#overview"
          onClick={(event) => {
            event.preventDefault();
            onNavigate("dashboard");
          }}
        >
          <span className="brand-symbol">&lt;/&gt;</span>

          <span>
            algorise
            <span className="brand-accent">_</span>
          </span>
        </a>

        {/* Workspace Navigation */}
        <div className="side-label">WORKSPACE</div>

        <button
          className={`side-link ${
            page === "dashboard" ? "active" : ""
          }`}
          onClick={() => {
            onNavigate("dashboard");
            setMobileOpen(false);
          }}
        >
          <span>◫</span>
          Overview
        </button>

        <button
          className={`side-link ${
            page === "practice" ? "active" : ""
          }`}
          onClick={() => {
            onNavigate("practice");
            setMobileOpen(false);
          }}
        >
          <span>⌘</span>
          Daily practice
          <small>{dailyTarget}</small>
        </button>

        {/* Progress Section */}
        <div className="side-rule" />

        <div className="side-label">YOUR PROGRESS</div>

        <div className="goal-widget">
          <div>
            <span>PROBLEMS SOLVED</span>
            <span>✦</span>
          </div>

          <strong>
            {stats.solved}
            <small> / {stats.review} to revisit</small>
          </strong>

          <div className="goal-hint">
            Your checkpoints personalize upcoming sets
          </div>
        </div>

        {/* User Profile and Authentication */}
        <div className="sidebar-end">
          <button
            className="profile-row"
            onClick={() =>
              user ? logout() : onNavigate("login")
            }
          >
            <span className="profile-avatar">
              {user?.name?.[0]?.toUpperCase() || "G"}
            </span>

            <span className="profile-copy">
              <b>{user?.name || "Guest developer"}</b>
              <small>{user ? "Sign out" : "Sign in"}</small>
            </span>

            <span className="profile-menu">···</span>
          </button>
        </div>
      </aside>

      {/* Mobile Navigation Overlay */}
      {mobileOpen && (
        <button
          className="nav-scrim"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        />
      )}
    </>
  );
}
