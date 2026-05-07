import torch
import os
from gtts import gTTS
from google import genai
from ..models.model_manager import model_manager

# Initialize GenAI client
# Note: In production, use environment variables for API keys
API_KEY = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=API_KEY)

def extract_text_embeddings(text: str) -> torch.Tensor:
    """Extract BERT [CLS] embedding from text."""
    inputs = model_manager.tokenizer(text, return_tensors="pt", truncation=True, padding=True).to(model_manager.device)
    with torch.no_grad():
        outputs = model_manager.bert_model(**inputs)
    # Extract [CLS] token embedding
    return outputs.last_hidden_state[:, 0, :].to(model_manager.device)

def generate_llm_response(user_text: str, sentiment: str) -> str:
    """Generate a response using Gemini LLM based on user text and sentiment."""
    prompt = f"""
    User said: {user_text}
    Sentiment detected: {sentiment}

    Respond naturally like a friendly assistant.
    """
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        return response.text
    except Exception as e:
        print(f"Error generating LLM response: {e}")
        return "I'm sorry, I couldn't generate a response at this time."

def text_to_speech(text: str, output_path: str = "response.wav") -> str:
    """Convert text to speech and save as a wav file."""
    try:
        tts = gTTS(text=text, lang="en")
        tts.save(output_path)
        return output_path
    except Exception as e:
        print(f"Error in text-to-speech: {e}")
        return ""
