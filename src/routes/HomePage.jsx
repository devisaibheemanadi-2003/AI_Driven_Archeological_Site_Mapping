import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/HomePage.css";
import DetectionCard from "../components/DetectionCard";

export default function HomePage() {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="homepage-container">
      <header className="homepage-header">
        <h1>🌍 Vegetation & Soil Detection</h1>
        <p>
          Upload satellite or aerial imagery to identify soil types and vegetation regions using AI.
        </p>
      </header>

      <div className="homepage-cards">
        <DetectionCard
          title="Soil Detection"
          description="Detect and classify soil types such as clay, red, black, and alluvial soils."
          buttonText="Start Soil Detection"
          onClick={() => handleNavigate("/soil-detection")}
          icon="🧱"
        />
        <DetectionCard
          title="Vegetation Detection"
          description="Analyze vegetation density and patterns from satellite images."
          buttonText="Start Vegetation Detection"
          onClick={() => handleNavigate("/vegetation-detection")}
          icon="🌿"
        />
      </div>

      <footer className="homepage-footer">
        <p>Developed by <strong>Chinna</strong> | Powered by React.js & FastAPI</p>
      </footer>
    </div>
  );
}
