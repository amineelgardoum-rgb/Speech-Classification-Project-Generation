import torch
import torch.nn as nn

class MultiModalSentimentModel(nn.Module):
    """
    Fuses audio (MFCC) and text (BERT) branches, then classifies sentiment.

    Architecture:
        audio_branch : 40  → 64
        text_branch  : 768 → 128
        classifier   : (64 + 128) → 64 → num_classes
    """
    def __init__(self, num_classes=3):
        super().__init__()
        self.audio_branch = nn.Sequential(
            nn.Linear(40, 64),
            nn.ReLU(),
            nn.Dropout(0.3),
        )
        self.text_branch = nn.Sequential(
            nn.Linear(768, 128),
            nn.ReLU(),
            nn.Dropout(0.3),
        )
        self.classifier = nn.Sequential(
            nn.Linear(64 + 128, 64),
            nn.ReLU(),
            nn.Linear(64, num_classes),
        )

    def forward(self, audio, text):
        a = self.audio_branch(audio)
        t = self.text_branch(text)
        return self.classifier(torch.cat([a, t], dim=1))
