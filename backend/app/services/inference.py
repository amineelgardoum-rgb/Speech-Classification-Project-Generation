import torch
import os
from .audio_service import transcribe_audio, extract_audio_features
from .text_service import extract_text_embeddings, generate_llm_response, text_to_speech
from ..models.model_manager import model_manager

def run_inference(file_path: str):
    """Runs the full multimodal inference pipeline."""
    # 1. Transcription
    text = transcribe_audio(file_path)

    # 2. Extract Features
    audio_feat = extract_audio_features(file_path)
    text_feat = extract_text_embeddings(text)

    # 3. Model Prediction
    with torch.no_grad():
        logits = model_manager.fusion_model(audio_feat, text_feat)
        probs = torch.softmax(logits, dim=1).squeeze()
        pred_idx = torch.argmax(probs).item()

    sentiment = model_manager.classes[pred_idx]

    # 4. Generate LLM Response
    llm_reply = generate_llm_response(text, sentiment)

    # 5. Convert LLM Response to Speech
    # Define an output path for the response audio
    output_audio_path = os.path.join(os.path.dirname(file_path), "response.wav")
    audio_response_path = text_to_speech(llm_reply, output_audio_path)

    result = {
        "transcription": text,
        "sentiment": sentiment,
        "confidence": probs[pred_idx].item(),
        "probabilities": {
            cls: prob.item() for cls, prob in zip(model_manager.classes, probs)
        },
        "llm_response": llm_reply,
        "audio_response_path": audio_response_path
    }

    return result
