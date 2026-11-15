import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { authApi } from "../services/api";

const AuthContext = createContext(null);

const TOKEN_KEY = "algorise-token";
const USER_KEY = "algorise-user";

export function AuthProvider({ children }) {
  // Initialize user from localStorage
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY) || "null");
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(Boolean(localStorage.getItem(TOKEN_KEY)));

  const [error, setError] = useState("");

  // Verify the user's existing session
  useEffect(() => {
    if (!localStorage.getItem(TOKEN_KEY)) return;

    authApi
      .me()
      .then((data) => {
        setUser(data.user);

        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);

        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Handle login and registration
  async function authenticate(mode, values) {
    setError("");

    try {
      const data = mode === "register" ? await authApi.register(values) : await authApi.login(values);

      localStorage.setItem(TOKEN_KEY, data.token);

      localStorage.setItem(USER_KEY, JSON.stringify(data.user));

      setUser(data.user);

      return data.user;
    } catch (err) {
      setError(err.message || "Could not connect to the account service.");

      throw err;
    }
  }

  // Log out the current user
  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    setUser(null);
  }

  // Share authentication data with the application
  const value = useMemo(() => ({
      user,
      loading,
      error,
      setError,
      authenticate,
      logout,
    }),
    [user, loading, error]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to access authentication context
// eslint-disable-next-line react/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
