import { createContext, useContext, useState, useCallback } from "react";
import { loginUser, registerUser } from "../api/requests";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("ledger_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("ledger_token"));

  const persist = (userData, jwt) => {
    localStorage.setItem("ledger_token", jwt);
    localStorage.setItem("ledger_user", JSON.stringify(userData));
    setUser(userData);
    setToken(jwt);
  };

  const login = useCallback(async (email, password) => {
    const { data } = await loginUser({ email, password });
    persist(data.data.user, data.data.token);
    return data.data.user;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const { data } = await registerUser({ name, email, password });
    persist(data.data.user, data.data.token);
    return data.data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("ledger_token");
    localStorage.removeItem("ledger_user");
    setUser(null);
    setToken(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated: !!token, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
