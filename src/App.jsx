import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import "./App.css";

function App() {
  const { user } = useAuth();

  return (
    <Router>
      {" "}
      <Routes>
        <Route path="/" element={<HomePage />} />
        {user ? (
          <Route path="/dashboard" element={<DashboardPage />} />
        ) : (
          <Route path="/dashboard" element={<HomePage />} />
        )}
        <Route path="*" element={<h1>404 - Сторінка не знайдена</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
