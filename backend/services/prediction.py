import numpy as np
import pandas as pd
from typing import List, Dict

from tensorflow.keras.models import load_model as keras_load_model
from sklearn.preprocessing import MinMaxScaler
from datetime import timedelta

def load_ml_model(path: str):
    """
    Load and return the trained model.
    """
    model = keras_load_model(path)
    return model

def prepare_data_for_prediction(df: pd.DataFrame, feature_col: str = "Close", window_size: int = 60):
    """
    Scale and create sequences for LSTM. Return scaler and sequences.
    """
    scaler = MinMaxScaler(feature_range=(0, 1))
    values = df[[feature_col]].values
    scaled = scaler.fit_transform(values)
    return scaler, scaled

def predict_prices(model, df: pd.DataFrame, days: int = 7, feature_col: str = "Close", window_size: int = 60) -> List[Dict]:
    """
    Predict next `days` closing prices using iterative forecasting.
    """
    df = df.copy()
    scaler, scaled = prepare_data_for_prediction(df, feature_col, window_size)
    last_sequence = scaled[-window_size:]
    sequence = last_sequence.reshape(1, window_size, 1)

    preds = []
    last_date = df.index[-1].date()

    current_seq = sequence.copy()
    for i in range(days):
        pred_scaled = model.predict(current_seq, verbose=0)
        preds.append(float(pred_scaled[0][0]))
        new_val = pred_scaled.reshape(1,1,1)
        current_seq = np.concatenate([current_seq[:, 1:, :], new_val], axis=1)

    preds_np = np.array(preds).reshape(-1,1)
    preds_inv = scaler.inverse_transform(preds_np).flatten()

    out = []
    for i, v in enumerate(preds_inv):
        pred_date = last_date + timedelta(days=i+1)
        out.append({"date": str(pred_date), "predicted_close": float(round(float(v), 4))})
    return out