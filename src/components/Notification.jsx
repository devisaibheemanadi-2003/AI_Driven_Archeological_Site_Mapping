import React, { useEffect } from "react";
import "../styles/Notification.css";

/**
 * Notification Component
 * -----------------------
 * Props:
 * - type: "success" | "error" | "warning"
 * - message: string (content to display)
 * - onClose: callback when auto-hidden or manually closed
 * - duration: optional (default 3000ms)
 */

const Notification = ({ type = "success", message, onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose && onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`notification ${type}`}>
      <span className="notification-text">{message}</span>
      <button className="notification-close" onClick={onClose}>
        ×
      </button>
    </div>
  );
};

export default Notification;
