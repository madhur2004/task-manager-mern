import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { authService } from "../services/authService.js";

const AuthContext = createContext(undefined);

const saveAuth = ({ token, user }) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
};

const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    if (!token) {
      setLoading(false);
      return;
    }

    const verifyUser = async () => {
      try {
        const currentUser = await authService.getMe();

        if (!active) return;

        setUser(currentUser);
        saveAuth({
          token,
          user: currentUser,
        });
      } catch {
        if (!active) return;

        clearAuth();
        setUser(null);
        setToken(null);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    verifyUser();

    return () => {
      active = false;
    };
  }, [token]);

  const login = useCallback(async (email, password) => {
    const response = await authService.login(email, password);

    saveAuth(response);

    setToken(response.token);
    setUser(response.user);
  }, []);

  const register = useCallback(async (name, email, password) => {
    const response = await authService.register(name, email, password);

    saveAuth(response);

    setToken(response.token);
    setUser(response.user);
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      login,
      register,
      logout,
      isAuthenticated: Boolean(token),
    }),
    [user, token, loading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
