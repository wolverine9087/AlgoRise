import { useState } from "react";

import Navbar from "./components/Navbar";
import Topbar from "./components/Topbar";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { PracticeProvider } from "./context/PracticeContext";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Practice from "./pages/Practice";
import Register from "./pages/Register";

import "./App.css";

function Workspace() {
  const { authenticate, error, setError, user } = useAuth();

  const [page, setPage] = useState("dashboard");
  const [questionId, setQuestionId] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  // Navigation handler
  function navigate(destination, targetQuestionId = null) {
    if (["login", "register"].includes(destination)) {
      setError("");
    }

    setPage(destination);

    setQuestionId(targetQuestionId);

    setMobileOpen(false);
  }

  // Authentication form submission
  async function submitAuth(event) {
    event.preventDefault();

    if (busy) return;

    setBusy(true);

    const values = Object.fromEntries(
      new FormData(event.currentTarget).entries()
    );

    try {
      await authenticate(page, values);

      setPage("dashboard");
      setQuestionId(null);
    } catch {
      // AuthContext handles and displays authentication errors.
    } finally {
      setBusy(false);
    }
  }

  // Authentication pages
  if (page === "login") {
    return (
      <Login
        onSubmit={submitAuth}
        onSwitch={() => navigate("register")}
        error={error}
        busy={busy}
      />
    );
  }

  if (page === "register") {
    return (
      <Register
        onSubmit={submitAuth}
        onSwitch={() => navigate("login")}
        error={error}
        busy={busy}
      />
    );
  }

  // Main application pages
  const renderPage = () => {
    switch (page) {
      case "practice":
        return (
          <Practice
            key={questionId || "practice"}
            initialQuestionId={questionId}
          />
        );

      case "dashboard":
      default:
        return <Dashboard onNavigate={navigate} />;
    }
  };

  return (
    <div className="app-shell">
      <Navbar
        page={page}
        onNavigate={navigate}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <main className="main-area">
        <Topbar
          page={page}
          onNavigate={navigate}
          onMenu={() => setMobileOpen((current) => !current)}
        />

        <div className="page-content">
          {renderPage()}

          <footer className="site-footer">
            <span>ALGORISE / BUILD YOUR SIGNAL</span>

            <span>
              {user
                ? `SESSION / ${user.name?.toUpperCase()}`
                : "GUEST SESSION"}
            </span>

            <span>v0.2.0</span>
          </footer>
        </div>
      </main>
    </div>
  );
}

// Root application component
export default function App() {
  return (
    <AuthProvider>
      <PracticeProvider>
        <Workspace />
      </PracticeProvider>
    </AuthProvider>
  );
}
