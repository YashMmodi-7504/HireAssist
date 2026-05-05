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

  // Demo build: restore the cached user synchronously from localStorage.
  // No backend round-trip — the deployed Netlify build has no API.
  useEffect(() => {
    const t = localStorage.getItem(STORAGE_KEYS.token);
    const u = readStoredUser();
    if (t && u) {
      setToken(t);
      setUser(u);
    }
    setLoading(false);
  }, []);

  const login = useCallback((nextToken, nextUser) => {
    localStorage.setItem(STORAGE_KEYS.token, nextToken);
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(nextUser));
    if (nextUser?.role) {
      localStorage.setItem(STORAGE_KEYS.role, nextUser.role);
    }
    setToken(nextToken);
    setUser(nextUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.token);
    localStorage.removeItem(STORAGE_KEYS.user);
    localStorage.removeItem(STORAGE_KEYS.role);
    setToken(null);
    setUser(null);
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

export const dashboardPathForRole = (role) => {
  if (role === "admin") return "/admin";
  if (role === "director") return "/director";
  if (role === "trainer") return "/trainer";
  if (role === "student") return "/student";
  return "/";
};
