import React, { useState } from "react";
import FileUploader from "../components/FileUploader";
import DetectionResultCard from "../components/DetectionResultCard";
import { useApp } from "../context/AppContext";
import "../styles/VegetationDetection.css";

const VegetationDetection = () => {
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
      showNotification("warning", "Please upload a vegetation image first.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", image);

    try {
      const res = await fetch("http://127.0.0.1:8000/detect/vegetation", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to fetch vegetation detection results");

      const data = await res.json();
      setResults(data);

      if (data.detection_count === 0) {
        showNotification("warning", "No vegetation detected in image.");
      } else {
        showNotification("success", `Detected ${data.detection_count} vegetation regions.`);
      }
    } catch (err) {
      console.error("Vegetation Detection Error:", err);
      showNotification("error", "Vegetation detection failed. Please check backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page veg-detect-page">
      <h1 className="page-title">🌿 Vegetation Detection</h1>
      <p className="page-subtitle">
        Upload a vegetation image to analyze regions and classify types.
      </p>

      <FileUploader onFileSelect={handleFileSelect} />
      {preview && (
        <div className="preview-container">
          <img src={preview} alt="Uploaded vegetation" className="preview-image" />
        </div>
      )}

      <button className="detect-btn" onClick={handlePredict}>
      🌿 Detect Vegetation
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
                  d.class_name === "Dense Vegetation"
                    ? "#16a34a"
                    : d.class_name === "Sparse Vegetation"
                    ? "#84cc16"
                    : d.class_name === "Barren Land"
                    ? "#d97706"
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

export default VegetationDetection;
