import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useApp } from "./context/AppContext";
import Navbar from "./components/Navbar";
import LoadingSpinner from "./components/LoadingSpinner";
import Notification from "./components/Notification";
import HomePage from "./routes/HomePage";
import SoilDetection from "./routes/SoilDetection";
import VegetationDetection from "./routes/VegetationDetection";
import "./styles/global.css";

function App() {
  const { loading, notification, clearNotification } = useApp();

  return (
    <Router>
      <Navbar />
      {loading && <LoadingSpinner />}
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={clearNotification}
          duration={notification.duration}
        />
      )}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/soil-detection" element={<SoilDetection />} />
        <Route path="/vegetation-detection" element={<VegetationDetection />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
