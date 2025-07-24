import React from "react";
import "./CardModal.css";
function CardModal({ children, onClose, title }) {
  return (
    <div className="card-modal-overlay" onClick={onClose}>
      <div className="card-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="card-modal-close-button" onClick={onClose}>
          &times;
        </button>
        {title && <h3 className="card-modal-title">{title}</h3>}
        {children}
      </div>
    </div>
  );
}

export default CardModal;
