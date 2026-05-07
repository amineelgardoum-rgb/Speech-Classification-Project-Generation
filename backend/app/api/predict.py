from fastapi import APIRouter, UploadFile, File, HTTPException
import shutil
import os
import uuid
from ..services.inference import run_inference

router = APIRouter()

TEMP_DIR = "temp_uploads"
os.makedirs(TEMP_DIR, exist_ok=True)

@router.post("/predict")
async def predict_sentiment(file: UploadFile = File(...)):
    if not file.filename.endswith(('.wav', '.mp3', '.m4a')):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a WAV, MP3, or M4A file.")

    file_id = str(uuid.uuid4())
    temp_path = os.path.join(TEMP_DIR, f"{file_id}_{file.filename}")

    try:
        # Save uploaded file
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Run inference
        result = run_inference(temp_path)

        # Add a public URL for the generated audio response if it exists
        if "audio_response_path" in result and result["audio_response_path"]:
            filename = os.path.basename(result["audio_response_path"])
            result["audio_url"] = f"/audio/{filename}"

        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Cleanup uploaded file (keep generated audio for now, it's served statically)
        if os.path.exists(temp_path):
            os.remove(temp_path)

@router.get("/health")
async def health_check():
    return {"status": "healthy"}
