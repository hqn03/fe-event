import { useEffect } from "react";
import { useContext } from "react";
import { useCallback } from "react";
import { useState, createContext } from "react";
import api from "./services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // optional: to avoid flash of unauthenticated
  const isAuthenticated = !!user;

  const login = async (credentials) => {
    try {
      const { data } = await api.post("auth/login", credentials);
      const { access_token, user } = data;
      localStorage.setItem("access_token", access_token);

      setUser(user);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("access_token");
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) return;

    api
      .get("auth/me")
      .then(({ data }) => setUser(data))
      .catch(() => {
        setUser(null);
        localStorage.removeItem("access_token");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, setUser, isAuthenticated, logout, login, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("use Auth must be used within an Auth Provider");
  }

  return context;
}
