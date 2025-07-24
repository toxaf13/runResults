import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import "./AuthForms.css";

function LoginForm({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const success = await login(username, password);
    if (success) {
      onLoginSuccess();
      navigate("/dashboard");
    } else {
      setError("Невірне ім'я користувача або пароль. Спробуйте ще раз.");
    }
  };

  return (
    <div className="auth-form-container">
      <h3>Login</h3>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="text"
          placeholder="Ім'я користувача"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="auth-input"
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="auth-input"
        />
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="auth-submit-button">
          Увійти
        </button>
      </form>
    </div>
  );
}

export default LoginForm;
