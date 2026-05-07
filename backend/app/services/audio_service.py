import librosa
import numpy as np
import torch
from app.models.model_manager import model_manager

def transcribe_audio(file_path: str) -> str:
    """Transcribe audio file to text using Whisper."""
    result = model_manager.whisper_model.transcribe(file_path)
    return result['text']

def extract_audio_features(file_path: str, n_mfcc: int = 40) -> torch.Tensor:
    """Extract MFCC features from audio file."""
    audio, sr = librosa.load(file_path, duration=3, offset=0.5)
    mfcc = librosa.feature.mfcc(y=audio, sr=sr, n_mfcc=n_mfcc)
    mfcc_mean = np.mean(mfcc.T, axis=0)
    return torch.tensor(mfcc_mean, dtype=torch.float32).unsqueeze(0).to(model_manager.device)
