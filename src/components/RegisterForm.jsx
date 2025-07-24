import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import "./AuthForms.css";

function RegisterForm({ onRegisterSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Паролі не співпадають!");
      return;
    }

    const success = await register(username, password);
    if (success) {
      onRegisterSuccess();
      navigate("/dashboard");
    } else {
      setError(
        "Помилка реєстрації. Можливо, ім'я користувача вже зайняте або сталася інша помилка."
      );
    }
  };

  return (
    <div className="auth-form-container">
      <h3>Реєстрація</h3>
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
        <input
          type="password"
          placeholder="Підтвердіть пароль"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="auth-input"
        />
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="auth-submit-button">
          Зареєструватися
        </button>
      </form>
    </div>
  );
}

export default RegisterForm;
