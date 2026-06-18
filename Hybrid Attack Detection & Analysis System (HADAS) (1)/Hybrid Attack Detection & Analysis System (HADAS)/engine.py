import torch
import numpy as np

class HADASEngine:
    def __init__(self, lstm_model, xgb_model, threshold=0.1):
        self.lstm = lstm_model
        self.xgb = xgb_model
        self.threshold = threshold
        self.labels = {0: "Normal", 1: "Write_Attack", 2: "Scan_Attack", 3: "DoS_Attack"}

    def process_packet(self, sequence):
        with torch.no_grad():
            reconstruction = self.lstm(sequence)
            loss = torch.mean(torch.abs(sequence - reconstruction)).item()
        
        if loss > self.threshold:
            flat_data = sequence.numpy().reshape(1, -1)
            prediction = self.xgb.predict(flat_data)[0]
            return "HIGH", self.labels.get(prediction, "Unknown_Anomaly"), loss
        
        return "LOW", "Normal", loss