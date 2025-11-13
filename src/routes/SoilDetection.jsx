import React, { useState } from "react";
import FileUploader from "../components/FileUploader";
import DetectionResultCard from "../components/DetectionResultCard";
import { useApp } from "../context/AppContext";
import "../styles/SoilDetection.css";

const SoilDetection = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const { showNotification } = useApp();

  const handleFileSelect = (file) => {
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResults(null);
  };

  const handlePredict = async () => {
    if (!image) {
      showNotification("warning", "Please upload an image first.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", image);

    try {
      const res = await fetch("http://127.0.0.1:8000/detect/soil", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to fetch soil detection results");

      const data = await res.json();
      setResults(data);

      if (data.detection_count === 0) {
        showNotification("warning", "No soil type detected in image.");
      } else {
        showNotification("success", `Detected ${data.detection_count} soil regions.`);
      }
    } catch (err) {
      console.error("Soil Detection Error:", err);
      showNotification("error", "Soil detection failed. Please check backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page soil-detect-page">
      <h1 className="page-title">🧪 Soil Type Detection</h1>
      <p className="page-subtitle">Upload a soil image to classify its type using AI.</p>

      <FileUploader onFileSelect={handleFileSelect} />
      {preview && (
        <div className="preview-container">
          <img src={preview} alt="Uploaded soil" className="preview-image" />
        </div>
      )}

      <button className="detect-btn" onClick={handlePredict}>
      🚀 Detect Soil Type
      </button>


      {results && results.detections?.length > 0 && (
        <div className="results-container">
          <h2>Detection Results</h2>
          <div className="result-cards">
            {results.detections.map((d, i) => (
              <DetectionResultCard
                key={i}
                title={d.class_name}
                confidence={d.confidence}
                color={
                  d.class_name === "Red Soil"
                    ? "#ef4444"
                    : d.class_name === "Black Soil"
                    ? "#1e293b"
                    : d.class_name === "Alluvial Soil"
                    ? "#facc15"
                    : d.class_name === "Clay Soil"
                    ? "#06b6d4"
                    : "#06b6d4"
                }
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SoilDetection;
