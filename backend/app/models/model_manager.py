import os
import torch
import whisper
from transformers import BertTokenizer, BertModel
from .fusion_model import MultiModalSentimentModel

class ModelManager:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ModelManager, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if self._initialized:
            return

        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

        # Load Whisper
        print("Loading Whisper model...")
        self.whisper_model = whisper.load_model("base", device=self.device)

        # Load BERT
        print("Loading BERT model...")
        self.tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")
        self.bert_model = BertModel.from_pretrained("bert-base-uncased").to(self.device)
        self.bert_model.eval()

        # Load Fusion Model
        print("Loading Fusion model...")
        self.fusion_model = MultiModalSentimentModel(num_classes=3).to(self.device)
        model_path = os.path.join("weights", "model.pth")
        if os.path.exists(model_path):
            self.fusion_model.load_state_dict(torch.load(model_path, map_location=self.device))
            print(f"Loaded fusion model weights from {model_path}")
        else:
            print(f"Warning: Fusion model weights not found at {model_path}")
        self.fusion_model.eval()

        self.classes = ['Negative', 'Neutral', 'Positive']
        self._initialized = True

model_manager = ModelManager()
