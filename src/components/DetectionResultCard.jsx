import React from "react";
import "../styles/DetectionResultCard.css";

/**
 * DetectionResultCard
 * -------------------
 * Props:
 * - title: string (e.g., "Black Soil", "Clay Soil")
 * - confidence: number (0.0–1.0)
 * - color: string (optional border color indicator)
 * - extraInfo: optional notes like coordinates or region name
 */

const DetectionResultCard = ({ title, confidence, color = "#06b6d4", extraInfo }) => {
  const percentage = (confidence * 100).toFixed(2);

  return (
    <div className="result-card" style={{ borderTopColor: color }}>
      <div className="result-header">
        <h3>{title}</h3>
        <span className="confidence">{percentage}%</span>
      </div>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        ></div>
      </div>
      {extraInfo && <p className="extra-info">{extraInfo}</p>}
    </div>
  );
};

export default DetectionResultCard;
