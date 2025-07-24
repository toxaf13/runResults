import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Link, useNavigate } from "react-router-dom";
import CardForm from "../components/CardForm.jsx";
import CardItem from "../components/CardItem.jsx";
import CardModal from "../components/CardModal.jsx";
import axios from "axios";
import "./DashboardPage.css";

function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [myCards, setMyCards] = useState([]);
  const [loadingCards, setLoadingCards] = useState(true);
  const [errorCards, setErrorCards] = useState(null);
  const [editingCard, setEditingCard] = useState(null);
  const [showCardModal, setShowCardModal] = useState(false);

  const API_URL = import.meta.env.VITE_API_BASE_URL;

  const STATIC_URL = API_URL.replace("/api", "");

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    const fetchMyCards = async () => {
      try {
        const response = await axios.get(`${API_URL}/cards/my`);
        setMyCards(response.data);
      } catch (err) {
        setErrorCards("Не вдалося завантажити ваші картки.");
        console.error("Помилка завантаження моїх карток:", err);
      } finally {
        setLoadingCards(false);
      }
    };
    fetchMyCards();
  }, [user, navigate, API_URL]);

  const handleCardCreatedOrUpdated = (newOrUpdatedCard) => {
    if (editingCard) {
      setMyCards(
        myCards.map((card) =>
          card._id === newOrUpdatedCard._id ? newOrUpdatedCard : card
        )
      );
    } else {
      setMyCards([...myCards, newOrUpdatedCard]);
    }
    setEditingCard(null);
    setShowCardModal(false);
  };

  const handleDeleteCard = async (cardId) => {
    if (window.confirm("Ви впевнені, що хочете видалити цю картку?")) {
      try {
        await axios.delete(`${API_URL}/cards/${cardId}`);
        setMyCards(myCards.filter((card) => card._id !== cardId));
        alert("Картку успішно видалено!");
      } catch (err) {
        alert("Помилка при видаленні картки.");
        console.error("Помилка видалення картки:", err);
      }
    }
  };

  const handleEditClick = (card) => {
    setEditingCard(card);
    setShowCardModal(true);
  };

  const handleCreateNewCard = () => {
    setEditingCard(null);
    setShowCardModal(true);
  };
  if (!user) {
    return null;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="user-info">
          <img
            src={`${STATIC_URL}${user.avatar}`}
            alt="Аватар користувача"
            className="user-avatar-lg"
          />
          <span>Привіт, {user.username}!</span>
        </div>
        <nav className="dashboard-actions">
          <button onClick={handleCreateNewCard} className="create-card-button">
            + Створити нову картку
          </button>
        </nav>
        <nav className="dashboard-nav">
          <button onClick={logout} className="header-button danger">
            Вийти
          </button>
        </nav>
      </header>
      <main className="dashboard-content">
        {" "}
        <h2 className="my-cards-heading">Мої Картки Досягнень</h2>
        {loadingCards ? (
          <p>Завантаження ваших карток...</p>
        ) : errorCards ? (
          <p className="error-message">{errorCards}</p>
        ) : myCards.length === 0 ? (
          <p>Поки що немає ваших карток. Створіть свою першу!</p>
        ) : (
          <div className="my-cards-grid">
            {myCards.map((card) => (
              <CardItem
                key={card._id}
                card={card}
                isOwner={true}
                onEdit={handleEditClick}
                onDelete={handleDeleteCard}
              />
            ))}
          </div>
        )}
        {showCardModal && (
          <CardModal
            onClose={() => setShowCardModal(false)}
            title={editingCard ? "Редагувати Картку" : "Створити Нову Картку"}
          >
            <CardForm
              cardToEdit={editingCard}
              onSave={handleCardCreatedOrUpdated}
              onCancelEdit={() => {
                setEditingCard(null);
                setShowCardModal(false);
              }}
            />
          </CardModal>
        )}
      </main>{" "}
    </div>
  );
}

export default DashboardPage;
