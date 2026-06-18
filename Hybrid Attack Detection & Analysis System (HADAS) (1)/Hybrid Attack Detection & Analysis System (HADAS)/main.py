import torch
import numpy as np
import time
import re
import os
import joblib
from datetime import datetime
from models import LSTM_AE, get_classifier
from engine import HADASEngine
from forensics import generate_forensics_report
from retrain_logic import retrain_system

def parse_conpot_log(log_line):
    try:
        match = re.search(r"modbus.*request: (\d+) .* addr: (\d+) value: (\d+)", log_line)
        if match:
            func_code = int(match.group(1))
            addr = int(match.group(2))
            val = int(match.group(3))
            return [0.1, func_code, addr, val]
    except:
        pass
    return None

def run_hadas(log_file_path="conpot.log"):
    print("-" * 45)
    print("HADAS: ICS Attack Detection & Analysis System")
    print(f"Status: Monitoring {log_file_path}...")
    print("-" * 45)
    
    if not os.path.exists('hadas_xgb.pkl'):
        print("Error: hadas_xgb.pkl not found. Please run training first.")
        return

    lstm = LSTM_AE()
    xgb_model = joblib.load('hadas_xgb.pkl')
    engine = HADASEngine(lstm, xgb_model)
    
    buffer = []
    
    if not os.path.exists(log_file_path):
        with open(log_file_path, "w") as f:
            f.write("")

    with open(log_file_path, "r") as f:
        f.seek(0, 2)
        
        counter = 0
        while True:
            line = f.readline()
            if not line:
                time.sleep(0.1)
                continue
            
            features = parse_conpot_log(line)
            if features:
                buffer.append(features)
            
            if len(buffer) >= 10:
                data_tensor = torch.tensor([buffer]).float()
                risk, attack, score = engine.process_packet(data_tensor)
                
                ts = datetime.now().strftime("%H:%M:%S")
                if risk == "HIGH":
                    print(f"[{ts}] !!! ALERT: {attack} Detected | Confidence: {score:.4f}")
                    generate_forensics_report(attack, score, data_tensor.numpy())
                else:
                    print(f"[{ts}] Traffic Analyzed: Normal")
                
                counter += 1
                if counter % 10 == 0:
                    engine.xgb = retrain_system(engine.xgb)
                
                buffer.pop(0)

if __name__ == "__main__":
    run_hadas()