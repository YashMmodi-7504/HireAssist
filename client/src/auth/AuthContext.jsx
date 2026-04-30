import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const AuthContext = createContext({
  user: null,
  token: null,
  role: null,
  isAuthed: false,
  loading: true,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

const STORAGE_KEYS = {
  token: "token",
  user: "user",
  role: "role",
};

const readStoredUser = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.user);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Bootstrap from localStorage on mount, then revalidate with the server.
  // The revalidation step keeps the UI in sync if the backend user record
  // changes (e.g. name/role update) without forcing a sign-out + sign-in.
  useEffect(() => {
    const t = localStorage.getItem(STORAGE_KEYS.token);
    const u = readStoredUser();
    if (!t || !u) {
      setLoading(false);
      return undefined;
    }
    setToken(t);
    setUser(u);
    setLoading(false);

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${t}` },
        });
        if (cancelled) return;
        if (res.status === 401) {
          // Token rejected — clear and force a fresh sign-in
          localStorage.removeItem(STORAGE_KEYS.token);
          localStorage.removeItem(STORAGE_KEYS.user);
          localStorage.removeItem(STORAGE_KEYS.role);
          setToken(null);
          setUser(null);
          return;
        }
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled && data?.user) {
          setUser(data.user);
          localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(data.user));
          if (data.user.role) {
            localStorage.setItem(STORAGE_KEYS.role, data.user.role);
          }
        }
      } catch {
        // Network failure — keep cached user, stay signed in
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback((nextToken, nextUser) => {
    localStorage.setItem(STORAGE_KEYS.token, nextToken);
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(nextUser));
    if (nextUser?.role) {
      localStorage.setItem(STORAGE_KEYS.role, nextUser.role);
    }
    setToken(nextToken);
    setUser(nextUser);
    console.log("[auth] logged in role:", nextUser?.role);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.token);
    localStorage.removeItem(STORAGE_KEYS.user);
    localStorage.removeItem(STORAGE_KEYS.role);
    setToken(null);
    setUser(null);
    console.log("[auth] logged out");
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      role: user?.role || null,
      isAuthed: !!token && !!user,
      loading,
      login,
      logout,
    }),
    [user, token, loading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Helper for components that need the canonical landing route per role.
export const dashboardPathForRole = (role) => {
  if (role === "admin") return "/admin";
  if (role === "director") return "/director";
  if (role === "trainer") return "/trainer";
  if (role === "student") return "/student";
  return "/";
};
