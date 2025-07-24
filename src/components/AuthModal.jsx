import React from "react";
import LoginForm from "./LoginForm.jsx";
import RegisterForm from "./RegisterForm.jsx";
import "./AuthModal.css";

function AuthModal({ onClose, isLoginMode, onSwitchMode }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>
          &times;
        </button>
        <div className="auth-switch">
          <button
            className={`switch-button ${isLoginMode ? "active" : ""}`}
            onClick={() => onSwitchMode(true)}
          >
            Вхід
          </button>
          <button
            className={`switch-button ${!isLoginMode ? "active" : ""}`}
            onClick={() => onSwitchMode(false)}
          >
            Реєстрація
          </button>
        </div>
        {isLoginMode ? (
          <LoginForm onLoginSuccess={onClose} />
        ) : (
          <RegisterForm onRegisterSuccess={onClose} />
        )}
      </div>
    </div>
  );
}

export default AuthModal;
