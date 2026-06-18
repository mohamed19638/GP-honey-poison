import pandas as pd
import os
import numpy as np

def retrain_system(xgb_model):
    if not os.path.exists("feedback_data.csv"):
        return xgb_model
    
    try:
        data = pd.read_csv("feedback_data.csv", header=None)
        X = data.iloc[:, 1:].values
        y = data.iloc[:, 0].values
        
        if len(np.unique(y)) > 1:
            xgb_model.fit(X, y)
            return xgb_model
    except Exception:
        pass
    return xgb_model