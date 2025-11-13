// src/components/DetectionCard.jsx
import React from "react";
import "../styles/DetectionCard.css";

/**
 * DetectionCard Component
 * -----------------------
 * Props:
 * - title: Card heading (e.g. "Soil Detection")
 * - description: Short text about the module
 * - icon: JSX icon (optional)
 * - onClick: callback for navigation
 */

const DetectionCard = ({ title, description, icon, onClick }) => {
  return (
    <div className="detection-card" onClick={onClick}>
      <div className="detection-icon">{icon}</div>
      <h3 className="detection-title">{title}</h3>
      <p className="detection-description">{description}</p>
      <button className="detection-btn">Open Module</button>
    </div>
  );
};

export default DetectionCard;
