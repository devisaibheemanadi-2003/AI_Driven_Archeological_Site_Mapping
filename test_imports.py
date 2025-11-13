print("Checking Python package imports:\n")

def try_import(package_name, import_statement):
    try:
        exec(import_statement)
        print(f"✅ {package_name} imported successfully")
    except Exception as e:
        print(f"❌ {package_name} import failed: {e}")

# List of packages to verify
packages = {
    "FastAPI": "from fastapi import FastAPI",
    "Uvicorn": "import uvicorn",
    "Pillow (PIL)": "from PIL import Image",
    "NumPy": "import numpy",
    "OpenCV (cv2)": "import cv2",
    "Ultralytics YOLO": "from ultralytics import YOLO",
    "Roboflow": "from roboflow import Roboflow",
    "Pydantic": "import pydantic"
}

for pkg_name, import_cmd in packages.items():
    try_import(pkg_name, import_cmd)
