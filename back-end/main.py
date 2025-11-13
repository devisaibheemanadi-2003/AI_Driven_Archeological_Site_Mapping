from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Dict, Optional
import io
import cv2
import numpy as np
from PIL import Image
from ultralytics import YOLO
from roboflow import Roboflow
import os
from datetime import datetime

# Initialize FastAPI app
app = FastAPI(title="Soil & Vegetation Detection API")

# Configure CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== MODEL INITIALIZATION ====================

try:
    rf = Roboflow(api_key="Ca2js2JVnapmZqt4h5ID")
    project = rf.workspace("taufans-qnmrz").project("soil-detection-2uaco")
    soil_model = project.version(4).model
    print("✅ Roboflow Soil Detection Model loaded successfully")
except Exception as e:
    print(f"❌ Error loading Roboflow model: {e}")
    soil_model = None

try:
    vegetation_model = YOLO("../model/best.pt")
    print("✅ Local Vegetation Detection Model loaded successfully")
except Exception as e:
    print(f"❌ Error loading vegetation model: {e}")
    vegetation_model = None

# ==================== RESPONSE MODELS ====================

class DetectionResult(BaseModel):
    class_name: str
    confidence: float
    bbox: List[float]

class PredictionResponse(BaseModel):
    model_type: str
    detections: List[DetectionResult]
    image_size: Dict[str, int]
    inference_time: float
    detection_count: int

class CombinedResponse(BaseModel):
    soil_detection: Optional[PredictionResponse]
    vegetation_detection: Optional[PredictionResponse]
    total_detections: int

# ==================== HELPER FUNCTIONS ====================

def convert_upload_to_image(file_bytes: bytes):
    """Convert uploaded file bytes to image array"""
    image = Image.open(io.BytesIO(file_bytes))
    return np.array(image)

# ✅ NEW FUNCTION — image resizing
def resize_image(image: np.ndarray, target_size=(640, 640)):
    """Resize uploaded image to 640x640 (maintain consistency for YOLO input)."""
    try:
        resized = cv2.resize(image, target_size, interpolation=cv2.INTER_LINEAR)
        print(f"✅ Image resized to {target_size[0]}x{target_size[1]}")
        return resized
    except Exception as e:
        print(f"⚠️ Image resizing failed: {e}")
        return image  # fallback

def process_roboflow_predictions(predictions, inference_time):
    detections = []
    if hasattr(predictions, 'json') and 'predictions' in predictions.json():
        for pred in predictions.json()['predictions']:
            detections.append(DetectionResult(
                class_name=pred.get('class', 'unknown'),
                confidence=pred.get('confidence', 0.0),
                bbox=[
                    pred.get('x', 0),
                    pred.get('y', 0),
                    pred.get('width', 0),
                    pred.get('height', 0)
                ]
            ))
    return detections

def process_yolo_predictions(results):
    detections = []
    for result in results:
        boxes = result.boxes
        for box in boxes:
            xyxy = box.xyxy[0].cpu().numpy()
            x1, y1, x2, y2 = xyxy
            x_center = (x1 + x2) / 2
            y_center = (y1 + y2) / 2
            width = x2 - x1
            height = y2 - y1

            detections.append(DetectionResult(
                class_name=result.names[int(box.cls)],
                confidence=float(box.conf),
                bbox=[float(x_center), float(y_center), float(width), float(height)]
            ))
    return detections

# ==================== API ENDPOINTS ====================

@app.get("/")
async def root():
    return {
        "message": "Soil & Vegetation Detection API",
        "version": "1.0.0",
        "endpoints": {
            "/detect/soil": "POST - Detect soil using Roboflow model",
            "/detect/vegetation": "POST - Detect vegetation using local YOLO model",
            "/detect/combined": "POST - Run both detections on same image",
            "/health": "GET - Check API and model health"
        }
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "models": {
            "soil_detection": "loaded" if soil_model else "not loaded",
            "vegetation_detection": "loaded" if vegetation_model else "not loaded"
        },
        "timestamp": datetime.now().isoformat()
    }

@app.post("/detect/soil", response_model=PredictionResponse)
async def detect_soil(file: UploadFile = File(...)):
    if not soil_model:
        raise HTTPException(status_code=503, detail="Soil detection model not loaded")

    try:
        contents = await file.read()
        image = convert_upload_to_image(contents)
        image = resize_image(image, target_size=(640, 640))  # ✅ added

        temp_path = "temp_image.jpg"
        Image.fromarray(image).save(temp_path)

        start_time = datetime.now()
        predictions = soil_model.predict(temp_path, confidence=40, overlap=30)
        inference_time = (datetime.now() - start_time).total_seconds()

        if os.path.exists(temp_path):
            os.remove(temp_path)

        detections = process_roboflow_predictions(predictions, inference_time)

        return PredictionResponse(
            model_type="soil",
            detections=detections,
            image_size={"width": image.shape[1], "height": image.shape[0]},
            inference_time=inference_time,
            detection_count=len(detections)
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Soil detection failed: {str(e)}")

@app.post("/detect/vegetation", response_model=PredictionResponse)
async def detect_vegetation(file: UploadFile = File(...)):
    if not vegetation_model:
        raise HTTPException(status_code=503, detail="Vegetation detection model not loaded")

    try:
        contents = await file.read()
        image = convert_upload_to_image(contents)
        image = resize_image(image, target_size=(640, 640))  # ✅ added

        start_time = datetime.now()
        results = vegetation_model.predict(image, conf=0.4, iou=0.3)
        inference_time = (datetime.now() - start_time).total_seconds()

        detections = process_yolo_predictions(results)

        return PredictionResponse(
            model_type="vegetation",
            detections=detections,
            image_size={"width": image.shape[1], "height": image.shape[0]},
            inference_time=inference_time,
            detection_count=len(detections)
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Vegetation detection failed: {str(e)}")

@app.post("/detect/combined", response_model=CombinedResponse)
async def detect_combined(file: UploadFile = File(...)):
    if not soil_model or not vegetation_model:
        raise HTTPException(status_code=503, detail="One or both models not loaded")

    try:
        contents = await file.read()
        image = convert_upload_to_image(contents)
        image = resize_image(image, target_size=(640, 640))  # ✅ added

        temp_path = "temp_image.jpg"
        Image.fromarray(image).save(temp_path)

        start_time = datetime.now()
        soil_predictions = soil_model.predict(temp_path, confidence=40, overlap=30)
        soil_time = (datetime.now() - start_time).total_seconds()

        if os.path.exists(temp_path):
            os.remove(temp_path)

        soil_detections = process_roboflow_predictions(soil_predictions, soil_time)

        start_time = datetime.now()
        veg_results = vegetation_model.predict(image, conf=0.4, iou=0.3)
        veg_time = (datetime.now() - start_time).total_seconds()

        veg_detections = process_yolo_predictions(veg_results)

        soil_response = PredictionResponse(
            model_type="soil",
            detections=soil_detections,
            image_size={"width": image.shape[1], "height": image.shape[0]},
            inference_time=soil_time,
            detection_count=len(soil_detections)
        )

        vegetation_response = PredictionResponse(
            model_type="vegetation",
            detections=veg_detections,
            image_size={"width": image.shape[1], "height": image.shape[0]},
            inference_time=veg_time,
            detection_count=len(veg_detections)
        )

        return CombinedResponse(
            soil_detection=soil_response,
            vegetation_detection=vegetation_response,
            total_detections=len(soil_detections) + len(veg_detections)
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Combined detection failed: {str(e)}")

# ==================== RUN SERVER ====================
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
