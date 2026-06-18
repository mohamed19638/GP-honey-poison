import torch
import torch.nn as nn
from xgboost import XGBClassifier

class LSTM_AE(nn.Module):
    def __init__(self, input_dim=4, hidden_dim=16):
        super(LSTM_AE, self).__init__()
        self.encoder = nn.LSTM(input_dim, hidden_dim, batch_first=True)
        self.decoder = nn.LSTM(hidden_dim, input_dim, batch_first=True)
        
    def forward(self, x):
        _, (hidden, _) = self.encoder(x)
        repeat_hidden = hidden.repeat(x.shape[1], 1, 1).transpose(0, 1)
        x_recon, _ = self.decoder(repeat_hidden)
        return x_recon

def get_classifier():
    return XGBClassifier(
        n_estimators=100, 
        max_depth=5, 
        learning_rate=0.1, 
        objective='multi:softmax', 
        num_class=4
    )