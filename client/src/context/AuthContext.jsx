import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("tv-user")) || null
  );
  const [token, setToken] = useState(localStorage.getItem("tv-token") || null);

  useEffect(() => {
    if (token) {
      localStorage.setItem("tv-token", token);
    } else {
      localStorage.removeItem("tv-token");
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("tv-user", JSON.stringify(user));
    } else {
      localStorage.removeItem("tv-user");
    }
  }, [user]);

  const login = async (email, password) => {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/auth/login`,
      { email, password }
    );
    setToken(res.data.token);
    setUser({ username: res.data.username, email: res.data.email });
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const register = async (username, email, password) => {
    await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
      username,
      email,
      password,
    });
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}
