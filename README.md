# 🌍 AI-Based Soil & Vegetation Detection System

## 📌 Project Overview

This project is an AI-powered web application that detects and classifies soil types and vegetation regions from images. It integrates deep learning models with a full-stack web interface to provide accurate land analysis and visual insights using bounding boxes and confidence scores.

The system automates soil and vegetation detection, helping in agricultural analysis, environmental monitoring, and archaeological mapping by reducing manual effort and improving decision accuracy.

---

## 🧠 Problem Statement

Identifying soil types and vegetation coverage manually from images is time-consuming, inconsistent, and error-prone, especially for large-scale land analysis. This project solves that problem by providing an automated AI-based solution that performs real-time detection, classification, and visualization of land features.

---

## 🛠️ Tech Stack

### Frontend
- React.js
- React Router DOM
- Context API
- HTML5, CSS3, JavaScript

### Backend
- FastAPI
- Uvicorn (ASGI Server)
- Python

### AI / Machine Learning
- YOLOv8 (Ultralytics) – Vegetation Detection
- Roboflow API – Soil Detection
- OpenCV – Image processing & bounding boxes
- NumPy & PIL – Image handling

---

## ⭐ Key Features

- Soil type detection using a Roboflow-trained model
- Vegetation detection using YOLOv8 with bounding boxes
- Confidence scores for each detected region
- Annotated output images highlighting detected areas
- Automatic image resizing to 640×640 for consistent inference
- Drag-and-drop image upload interface
- Real-time notifications and error handling
- Clean and modular frontend-backend architecture

---

## 🧩 System Architecture

React Frontend

|

|-- Image Upload & Preview

|-- Detection Results Display

|

FastAPI Backend

|

|-- /detect/soil -> Roboflow Model

|-- /detect/vegetation -> YOLOv8 Model

|-- /detect/combined -> Combined Detection

|

Image Processing Pipeline

|

|-- Image Resize (640x640)

|-- Model Inference

|-- Bounding Box Drawing

|-- Base64 Image Response



---

## 🚀 Functional Capabilities

- End-to-end AI inference pipeline
- Bounding box visualization for vegetation regions
- Confidence-based classification results
- REST API-based frontend-backend communication
- CORS-enabled secure frontend access
- Scalable and production-ready backend design

---

## ⚠️ Challenges Faced and Solutions

### Small Dataset
- Limited labeled data affected model generalization.
- Addressed using Roboflow preprocessing and confidence thresholds.

### Bounding Box Visualization
- Initial detection did not visually mark regions.
- Implemented OpenCV-based bounding box drawing and returned annotated images.

### Image Size Variations
- Different image sizes affected detection accuracy.
- Implemented automatic resizing to 640×640 before inference.

### Frontend Rendering Issues
- Images initially occupied the full screen and routes appeared blank.
- Fixed using proper React Router configuration and responsive CSS styling.

---

## 📂 Clean Code Structure

archaeological-mapping/
│

├── backend/

│ ├── main.py

│ ├── model/

│ └── requirements.txt

│

├── frontend/

│ ├── src/

│ │ ├── components/

│ │ ├── routes/

│ │ ├── context/

│ │ ├── styles/

│ │ ├── App.jsx

│ │ └── main.jsx

│
├── README.md

└── package.json


🔮 Future Enhancements

Download annotated result images

Vegetation density heatmap

Adjustable confidence thresholds

Cloud deployment (AWS / Render / Vercel)

Mobile-responsive UI enhancements

enhancements

👨‍💻 Author

Devi Sai Bheemanadi
Final Year CSE Student
Aspiring Generative AI Engineer & Data Analyst

Focused on building real-world AI-powered applications with clean architecture, scalable design, and strong problem-solving skills.
