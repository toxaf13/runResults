import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import AuthModal from "../components/AuthModal.jsx";
import CardItem from "../components/CardItem.jsx";
import axios from "axios";
import "./HomePage.css";

function HomePage() {
  const { user, logout } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [publicCards, setPublicCards] = useState([]);
  const [loadingCards, setLoadingCards] = useState(true);
  const [errorCards, setErrorCards] = useState(null);

  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const STATIC_URL = API_URL.replace("/api", "");

  useEffect(() => {
    const fetchPublicCards = async () => {
      try {
        const response = await axios.get(`${API_URL}/cards/public`);
        setPublicCards(response.data);
      } catch (err) {
        setErrorCards("Не вдалося завантажити публічні картки.");
        console.error("Error fetching public cards:", err);
      } finally {
        setLoadingCards(false);
      }
    };
    fetchPublicCards();
  }, [API_URL]);

  const openLoginModal = () => {
    setIsLoginMode(true);
    setShowModal(true);
  };

  const openRegisterModal = () => {
    setIsLoginMode(false);
    setShowModal(true);
  };

  return (
    <div className="homepage-container">
      <header className="main-header">
        <div className="logo">
          <Link to="/">Загальнодоступні Картки Досягнення</Link>
        </div>
        <nav className="main-nav">
          {user ? (
            <>
              <img
                src={`${STATIC_URL}${user.avatar}`}
                alt="Аватар"
                className="user-avatar"
              />
              <span>Привіт, {user.username}!</span>
              <Link to="/dashboard" className="header-button primary">
                Мій Кабінет
              </Link>
              <button onClick={logout} className="header-button danger">
                Вийти
              </button>
            </>
          ) : (
            <>
              <button
                onClick={openLoginModal}
                className="header-button primary"
              >
                Вхід
              </button>
              <button
                onClick={openRegisterModal}
                className="header-button secondary"
              >
                Реєстрація
              </button>
            </>
          )}
        </nav>
      </header>

      <main className="main-content">
        {loadingCards ? (
          <p>Завантаження публічних карток...</p>
        ) : errorCards ? (
          <p className="error-message">{errorCards}</p>
        ) : Array.isArray(publicCards) && publicCards.length === 0 ? (
          <p>Поки що немає публічних карток!</p>
        ) : (
          <div className="public-cards-grid">
            {Array.isArray(publicCards) &&
              publicCards.map((card) => (
                <CardItem key={card._id} card={card} isOwner={false} />
              ))}
          </div>
        )}
      </main>

      {showModal && (
        <AuthModal
          onClose={() => setShowModal(false)}
          isLoginMode={isLoginMode}
          onSwitchMode={() => setIsLoginMode(!isLoginMode)}
        />
      )}
    </div>
  );
}

export default HomePage;
