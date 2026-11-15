const API_BASE = import.meta.env.VITE_API_URL || "/api";
const TOKEN_KEY = "algorise-token";

// Reusable API request handler
export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem(TOKEN_KEY);

  const headers = {...(options.body ? { "Content-Type": "application/json" } : {}),

    ...(token ? { Authorization: `Bearer ${token}` } : {}),

    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || payload.error || `Request failed (${response.status})`);
  }

  return payload;
}

// Authentication APIs
export const authApi = {
  login: (values) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(values),
    }),

  register: (values) =>
    apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(values),
    }),

  me: () => apiRequest("/auth/me"),
};

// Question APIs
export const questionApi = {
  generateDaily: (data) =>
    apiRequest("/questions/daily-generate", {
      method: "POST",
      body: JSON.stringify(data),
    }),

};

// User progress APIs
export const progressApi = {
  list: async () =>
    (await apiRequest("/progress")).progress,

  save: (data) =>
    apiRequest("/progress", {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
};

