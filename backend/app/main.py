from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from .api import predict

app = FastAPI(title="Speech Sentiment Analysis API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve static files for audio responses
TEMP_DIR = "temp_uploads"
os.makedirs(TEMP_DIR, exist_ok=True)
app.mount("/audio", StaticFiles(directory=TEMP_DIR), name="audio")

# Include Routers
app.include_router(predict.router, prefix="/api/v1", tags=["Inference"])

@app.get("/")
async def root():
    return {"message": "Welcome to the Multimodal Speech Sentiment Analysis API"}

if __name__=="__main__":
    import uvicorn 
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)