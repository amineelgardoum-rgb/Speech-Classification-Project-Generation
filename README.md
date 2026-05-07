# Multimodal Speech Sentiment Analysis

A deep learning powered application that performs real-time sentiment analysis on audio input. The system transcribes speech, analyzes emotional tone using a multimodal fusion model, and generates an intelligent voice response.

## 🚀 Key Features
- **Multimodal Fusion:** Combines audio features (MFCC) and text embeddings (BERT) for superior accuracy.
- **ASR Integration:** Uses OpenAI's **Whisper** for high-precision speech-to-text.
- **Intelligent Response:** Generates context-aware responses based on sentiment using LLMs.
- **Voice Feedback:** Converts AI responses back to speech using Text-to-Speech (TTS).
- **Modern UI:** Responsive React dashboard with real-time probability visualization.

---

## 🏗️ Architecture

The system follows a modular architecture split into a high-performance Python backend and a modern React frontend.

### Pipeline Flow
1. **Audio Input:** User uploads or records audio (.wav, .mp3, .m4a).
2. **Transcription (ASR):** Whisper model converts speech to text.
3. **Feature Extraction:** 
   - **Audio:** MFCC features extracted via Librosa.
   - **Text:** Embeddings generated using a pre-trained BERT model.
4. **Fusion Model:** A custom PyTorch neural network fuses audio and text branches to classify sentiment (Positive, Negative, Neutral).
5. **LLM & TTS:** The system generates a text response and synthesizes it into a `.wav` file.
6. **Result:** Frontend displays transcription, sentiment confidence, and plays the response audio.

---

## 🛠️ Tech Stack

### Backend
- **Framework:** FastAPI
- **Deep Learning:** PyTorch, Transformers (HuggingFace)
- **Audio Processing:** Librosa, Torchaudio, OpenAI Whisper
- **Response Generation:** Google Gemini / gTTS

### Frontend
- **Framework:** React 18
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Communication:** Axios

---

## 📡 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/predict` | Upload audio file for full sentiment analysis pipeline. |
| `GET` | `/api/v1/health` | Check API status and model availability. |
| `GET` | `/audio/{filename}` | Retrieve generated TTS response files. |

---

## 🚦 Getting Started

### Prerequisites
- Python 3.9+
- Node.js 16+
- FFmpeg (for audio processing)

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python -m app.main
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

---

## 📂 Project Structure
```text
├── backend/
│   ├── app/
│   │   ├── api/          # FastAPI Routes
│   │   ├── models/       # PyTorch Fusion Model architecture
│   │   ├── services/     # Inference, ASR, and TTS logic
│   │   └── main.py       # API Entry point
│   ├── weights/          # Model checkpoints (.pth)
│   └── temp_uploads/     # Buffer for processing files
├── frontend/
│   ├── src/
│   │   ├── App.js        # Main UI Component
│   │   └── index.js      # React Root
│   └── package.json
└── README.md             # Project documentation
```

---

## 📝 License
This project is licensed under the MIT License - see the LICENSE file for details.
