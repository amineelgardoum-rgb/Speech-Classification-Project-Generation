import React, { useState } from 'react';
import axios from 'axios';
import { Upload, Mic, FileAudio, AlertCircle, CheckCircle2, Loader2, BarChart3, MessageSquare, Volume2 } from 'lucide-react';

const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
        setError('File size too large. Please select a file under 10MB.');
        return;
      }
      setFile(selectedFile);
      setError(null);
      setResult(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API_BASE_URL}/predict`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResult(response.data);
    } catch (err) {
      console.error('Error uploading file:', err);
      setError(err.response?.data?.detail || 'An error occurred during analysis. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive': return 'text-green-600 bg-green-50 border-green-200';
      case 'negative': return 'text-red-600 bg-red-50 border-red-200';
      case 'neutral': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-primary-600 rounded-xl mb-4 shadow-lg shadow-primary-200">
            <Mic className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Speech Sentiment Analysis
          </h1>
          <p className="mt-3 text-lg text-slate-600">
            Upload an audio file to analyze sentiment and transcribe speech.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div
                className={`relative border-2 border-dashed rounded-xl p-10 transition-all duration-200 flex flex-col items-center justify-center
                  ${file ? 'border-primary-400 bg-primary-50' : 'border-slate-300 hover:border-primary-400 hover:bg-slate-50'}`}
              >
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".wav,.mp3,.m4a"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={loading}
                />

                {file ? (
                  <div className="text-center">
                    <div className="p-3 bg-white rounded-full shadow-sm inline-block mb-3">
                      <FileAudio className="h-10 w-10 text-primary-600" />
                    </div>
                    <p className="text-primary-700 font-medium truncate max-w-xs">{file.name}</p>
                    <p className="text-primary-500 text-sm">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="p-3 bg-slate-100 rounded-full inline-block mb-3">
                      <Upload className="h-10 w-10 text-slate-400" />
                    </div>
                    <p className="text-slate-600 font-medium">Click to upload or drag and drop</p>
                    <p className="text-slate-400 text-sm mt-1">WAV, MP3, or M4A (max 10MB)</p>
                  </div>
                )}
              </div>

              {error && (
                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-lg text-red-700 text-sm">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={!file || loading}
                className={`w-full py-4 px-6 rounded-xl font-bold text-lg shadow-lg transition-all duration-200 flex items-center justify-center gap-3
                  ${!file || loading
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                    : 'bg-primary-600 text-white hover:bg-primary-700 active:scale-[0.98] shadow-primary-200'}`}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-6 w-6 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <BarChart3 className="h-6 w-6" />
                    Analyze Sentiment
                  </>
                )}
              </button>
            </form>
          </div>

          {result && (
            <div className="border-t border-slate-100 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="p-8 space-y-8 bg-slate-50/50">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      Analysis Complete
                    </h3>
                    <div className={`inline-flex items-center px-4 py-2 rounded-full border text-2xl font-black ${getSentimentColor(result.sentiment)}`}>
                      {result.sentiment}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-500 mb-1">Confidence Score</p>
                    <div className="text-3xl font-mono font-bold text-slate-900">
                      {(result.confidence * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <h4 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-primary-500" />
                    Transcription
                  </h4>
                  <p className="text-slate-800 text-lg italic leading-relaxed">
                    "{result.transcription}"
                  </p>
                </div>

                {result.llm_response && (
                  <div className="bg-primary-50 p-6 rounded-xl border border-primary-100 shadow-sm">
                    <h4 className="text-sm font-bold text-primary-700 mb-4 flex items-center gap-2">
                      <Volume2 className="h-4 w-4 text-primary-500" />
                      Assistant Response
                    </h4>
                    <p className="text-slate-800 text-lg leading-relaxed mb-4">
                      {result.llm_response}
                    </p>
                    {result.audio_url && (
                      <audio controls className="w-full h-10">
                        <source src={`http://127.0.0.1:8000${result.audio_url}`} type="audio/wav" />
                        Your browser does not support the audio element.
                      </audio>
                    )}
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-primary-500" />
                    Probabilities
                  </h4>
                  <div className="space-y-3">
                    {Object.entries(result.probabilities).map(([sentiment, prob]) => (
                      <div key={sentiment}>
                        <div className="flex justify-between text-sm font-medium text-slate-600 mb-1 capitalize">
                          <span>{sentiment}</span>
                          <span>{(prob * 100).toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-1000 ease-out
                              ${sentiment.toLowerCase() === 'positive' ? 'bg-green-500' :
                                sentiment.toLowerCase() === 'negative' ? 'bg-red-500' : 'bg-blue-500'}`}
                            style={{ width: `${prob * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <p className="text-center mt-8 text-slate-400 text-sm">
          Powered by Whisper (ASR), BERT (Text), and PyTorch (Fusion Model)
        </p>
      </div>
    </div>
  );
}

export default App;