# Speech Sentiment Analysis Project - User Guide

This guide provides a comprehensive walkthrough of the **Speech Sentiment Analysis** project, covering everything from initial setup to running the application.

## Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Prerequisites](#prerequisites)
4. [Installation](#installation)
   - [Backend Setup](#backend-setup)
   - [Frontend Setup](#frontend-setup)
5. [Running the Application](#running-the-application)
6. [Project Structure](#project-structure)
7. [How It Works](#how-it-works)
8. [Troubleshooting](#troubleshooting)

---

## Project Overview
The Speech Sentiment Analysis project is a multimodal deep learning application that analyzes the sentiment of spoken language. It transcribes audio input, determines the emotional tone (Positive, Negative, or Neutral), and provides an AI-generated response along with text-to-speech feedback.

## Tech Stack
- **Backend:** FastAPI (Python), PyTorch, OpenAI Whisper (ASR), Transformers (BERT), gTTS.
- **Frontend:** React, Tailwind CSS, Lucide React (Icons), Axios.
- **Models:** Whisper for transcription, BERT for text analysis, and a Fusion Model for integrated sentiment classification.

## Prerequisites
Before you begin, ensure you have the following installed:
- Python 3.8 or higher
- Node.js (v16+) and npm
- Git

## Installation

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Ensure you have the model weights:
   - Place your `model.pth` file in `backend/weights/`.

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the npm packages:
   ```bash
   npm install
   ```

---

## Running the Application

To run the full application, you need to start both the backend server and the frontend development server.

### 1. Start the Backend
From the `backend` directory:
```bash
python -m app.main
```
The API will be available at `http://127.0.0.1:8000`. You can access the interactive API documentation at `http://127.0.0.1:8000/docs`.

### 2. Start the Frontend
From the `frontend` directory:
```bash
npm start
```
The application will open in your browser at `http://localhost:3000`.

---

## Project Structure
```text
.
├── backend/
│   ├── app/
│   │   ├── api/            # API endpoints (predict, health)
│   │   ├── models/         # Model definitions (Fusion model, BERT)
│   │   ├── services/       # Business logic (inference, audio processing)
│   │   └── main.py         # Entry point
│   ├── weights/            # Trained model weights (.pth)
│   └── requirements.txt    # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── App.js          # Main React component
│   │   └── index.js        # React entry point
│   └── package.json        # Frontend dependencies
└── speech_sentiment_analysis.ipynb # Research & Training notebook
```

---

## How It Works
1. **Upload:** User uploads a `.wav`, `.mp3`, or `.m4a` file via the React frontend.
2. **ASR (Speech-to-Text):** The backend uses OpenAI's **Whisper** to transcribe the audio into text.
3. **Inference:**
   - The text is processed by a **BERT** model.
   - A **Fusion Model** combines features to classify the sentiment.
4. **LLM & TTS:** The system generates a text response based on the sentiment and converts it to audio using **gTTS**.
5. **Display:** The frontend displays the transcription, sentiment label, confidence scores, and plays the assistant's audio response.

## Troubleshooting
- **CORS Errors:** Ensure the backend is running and that the `allow_origins` in `main.py` includes your frontend URL.
- **Model Loading:** If the backend fails to start, verify that `backend/weights/model.pth` exists.
- **Port Conflict:** If port 8000 or 3000 is occupied, you can change them in `app/main.py` or by using environment variables.
- **Audio Format:** For best results, use standard WAV or MP3 files under 10MB.
