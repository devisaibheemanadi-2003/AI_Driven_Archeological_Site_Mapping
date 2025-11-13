import React, { useState } from "react";
import "../styles/FileUploader.css";

const FileUploader = ({ onFileSelect }) => {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setFileName(file.name);
      onFileSelect(file);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      onFileSelect(file);
    }
  };

  return (
    <div className="file-uploader-container">
      <div
        className={`drop-zone ${dragActive ? "active" : ""}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="fileUploadInput"
          className="file-input"
          accept="image/*"
          onChange={handleChange}
        />
        <label htmlFor="fileUploadInput" className="upload-label">
          {fileName ? (
            <span className="file-name">📁 {fileName}</span>
          ) : (
            <>
              <span className="upload-icon">📤</span>
              <span className="upload-text">
                Drag & drop an image here or <strong>browse</strong>
              </span>
            </>
          )}
        </label>
      </div>
    </div>
  );
};

export default FileUploader;
