import React from "react";
import "../styles/LoadingSpinner.css";

/**
 * LoadingSpinner Component
 * ------------------------
 * Reusable spinner displayed during API calls or heavy model inferences.
 */

const LoadingSpinner = ({ message = "Processing..." }) => {
  return (
    <div className="spinner-overlay">
      <div className="spinner" />
      <p className="spinner-text">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
