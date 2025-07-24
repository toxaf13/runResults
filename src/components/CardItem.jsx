import React from "react";
import "./CardItem.css";

function CardItem({ card, isOwner, onEdit, onDelete }) {
  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const STATIC_URL = API_URL.replace("/api", "");

  const getCardTypeLabel = (type) => {
    switch (type) {
      case "running":
        return "Біг 🏃‍♂️";
      case "coding":
        return "Кодування 💻";
      case "general":
        return "Загальне 💡";
      default:
        return "Інше";
    }
  };

  return (
    <div
      className="card-item"
      style={{ backgroundImage: `url(${card.backgroundImage})` }}
    >
      <div className="card-overlay">
        {card.owner && (
          <div className="card-owner">
            Власник: {card.owner.username}{" "}
            <img
              src={`${STATIC_URL}${card.owner.avatar}`}
              alt="Аватар власника"
              className="card-owner-avatar"
            />
          </div>
        )}
        <div className="card-description">{card.description}</div>
        <div className="card-type">Тип: {getCardTypeLabel(card.type)}</div>
        {card.results && card.results.length > 0 && (
          <div className="card-results">
            <h4>Результати:</h4>
            <ul>
              {card.results.map((result, index) => (
                <li key={index}>
                  {result.date
                    ? new Date(result.date).toLocaleDateString("uk-UA") + ": "
                    : ""}
                  {result.value}
                </li>
              ))}
            </ul>
          </div>
        )}
        <p className="card-visibility">
          {card.isPublic ? "Публічна" : "Приватна"}
        </p>

        {isOwner && (
          <div className="card-actions">
            <button onClick={() => onEdit(card)} className="edit-button">
              Змінити
            </button>
            <button
              onClick={() => onDelete(card._id)}
              className="delete-button"
            >
              Видалити
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CardItem;
