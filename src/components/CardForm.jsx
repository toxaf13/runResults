import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CardForm.css";

const DEFAULT_EMPTY_RESULT = { date: "", value: "" };

function CardForm({ cardToEdit, onSave, onCancelEdit }) {
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [type, setType] = useState("general");
  const [results, setResults] = useState([DEFAULT_EMPTY_RESULT]);
  const [backgroundImage, setBackgroundImage] = useState("");
  const [error, setError] = useState("");
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (cardToEdit) {
      setDescription(cardToEdit.description || "");
      setIsPublic(cardToEdit.isPublic);
      setType(cardToEdit.type || "general");
      setResults(
        cardToEdit.results && cardToEdit.results.length > 0
          ? cardToEdit.results
          : [DEFAULT_EMPTY_RESULT]
      );
      setBackgroundImage(cardToEdit.backgroundImage || "");
    } else {
      setDescription("");
      setIsPublic(false);
      setType("general");
      setResults([DEFAULT_EMPTY_RESULT]);
      setBackgroundImage("");
    }
  }, [cardToEdit]);

  const handleResultChange = (index, field, value) => {
    const newResults = [...results];
    newResults[index][field] = value;
    setResults(newResults);
  };

  const addResultField = () => {
    setResults([...results, DEFAULT_EMPTY_RESULT]);
  };

  const removeResultField = (index) => {
    if (results.length === 1 && index === 0) {
      setResults([DEFAULT_EMPTY_RESULT]);
    } else {
      const newResults = results.filter((_, i) => i !== index);
      setResults(newResults);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const cardData = {
      title: description.substring(0, 50) || "Без заголовка",
      description,
      isPublic,
      type,
      results: results.filter((r) => r.value.trim() !== ""),
      backgroundImage:
        backgroundImage ||
        "https://via.placeholder.com/600x200/555555/FFFFFF?text=Card+Background",
    };

    try {
      let response;
      if (cardToEdit) {
        response = await axios.put(
          `${API_URL}/cards/${cardToEdit._id}`,
          cardData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        alert("Картку успішно оновлено!");
      } else {
        response = await axios.post(`${API_URL}/cards`, cardData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        alert("Картку успішно створено!");
      }
      onSave(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Помилка збереження картки.");
      console.error("Помилка збереження картки:", err);
    }
  };

  return (
    <div className="card-form-container">
      <form onSubmit={handleSubmit} className="card-form">
        <textarea
          placeholder="Опис картки *"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="form-textarea"
          required
        />

        <div className="form-group">
          <label htmlFor="cardType" className="form-label">
            Тип картки:
          </label>
          <select
            id="cardType"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="form-select"
          >
            <option value="general">Загальне</option>
            <option value="running">Біг</option>
            <option value="coding">Кодування</option>
            <option value="other">Інше</option>
          </select>
        </div>
        {type === "running" && (
          <div className="results-section">
            <h4>Результати для бігу:</h4>
            {results.map((result, index) => (
              <div key={index} className="result-input-group">
                <input
                  type="date"
                  value={
                    result.date
                      ? new Date(result.date).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    handleResultChange(index, "date", e.target.value)
                  }
                  className="form-input small"
                />
                <input
                  type="text"
                  placeholder="Наприклад: 5км за 30хв"
                  value={result.value}
                  onChange={(e) =>
                    handleResultChange(index, "value", e.target.value)
                  }
                  className="form-input"
                />
                {
                  <button
                    type="button"
                    onClick={() => removeResultField(index)}
                    className="remove-result-button danger"
                  >
                    X
                  </button>
                }
              </div>
            ))}
            <button
              type="button"
              onClick={addResultField}
              className="add-result-button"
            >
              Додати результат
            </button>
          </div>
        )}
        {backgroundImage && (
          <img
            src={backgroundImage}
            alt="Фон картки"
            className="image-preview"
          />
        )}

        {error && <p className="error-message">{error}</p>}

        <div className="form-actions">
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="form-checkbox"
              />
              Загальнодоступна
            </label>
          </div>
          <button type="submit" className="submit-button primary">
            {cardToEdit ? "Оновити Картку" : "Створити Картку"}
          </button>
          {cardToEdit && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="cancel-button secondary"
            >
              Скасувати
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default CardForm;
