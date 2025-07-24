import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import "./App.css";

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      {user ? (
        <Route path="/dashboard" element={<DashboardPage />} />
      ) : (
        <Route path="/dashboard" element={<HomePage />} />
      )}
      <Route path="*" element={<h1>404 - Сторінка не знайдена</h1>} />
    </Routes>
  );
}

export default App;
