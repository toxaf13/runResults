// my-todo-app-vite/src/context/AuthContext.jsx

import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get(`${API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          // Просто використовуємо user.avatar, який приходить з бекенду
          setUser(response.data.user);
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        })
        .catch((error) => {
          console.error("Помилка завантаження користувача:", error);
          localStorage.removeItem("token");
          setUser(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [API_URL]);

  const login = async (username, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        username,
        password,
      });
      // Просто використовуємо дані, які прийшли з бекенду (включаючи avatar)
      const { token, ...userData } = response.data;

      localStorage.setItem("token", token);
      setUser(userData);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      return true;
    } catch (error) {
      console.error(
        "Помилка входу:",
        error.response?.data?.message || error.message
      );
      return false;
    }
  };

  const register = async (username, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        username,
        password,
      });
      // Просто використовуємо дані, які прийшли з бекенду (включаючи avatar)
      const { token, ...userData } = response.data;

      localStorage.setItem("token", token);
      setUser(userData);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      return true;
    } catch (error) {
      console.error(
        "Помилка реєстрації:",
        error.response?.data?.message || error.message
      );
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    delete axios.defaults.headers.common["Authorization"];
  };

  if (loading) {
    return <div>Завантаження...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
