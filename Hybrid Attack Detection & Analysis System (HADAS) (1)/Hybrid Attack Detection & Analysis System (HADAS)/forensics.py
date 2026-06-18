import json
import csv
import os
from datetime import datetime

def generate_forensics_report(attack_type, score, raw_data):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    report = {
        "timestamp": timestamp,
        "attack_type": attack_type,
        "anomaly_score": round(score, 4),
        "mitre_ttps": ["T0812", "T0855"] if attack_type != "Normal" else [],
        "status": "Logged"
    }
    
    with open("hadas_forensics.json", "a") as f:
        f.write(json.dumps(report) + "\n")
    
    if attack_type != "Normal":
        with open("feedback_data.csv", "a", newline='') as f:
            writer = csv.writer(f)
            label_map = {"Write_Attack": 1, "Scan_Attack": 2, "DoS_Attack": 3}
            row = [label_map.get(attack_type, 0)] + list(raw_data.flatten())
            writer.writerow(row)