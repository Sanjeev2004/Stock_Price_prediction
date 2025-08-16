from fastapi import FastAPI, HTTPException
from pydantic import BaseModel,Field    
from typing import List
import tensorflow as tf
import numpy as np
import os
from fastapi.middleware.cors import CORSMiddleware

# from your new sentiment.py file
from services.sentiment import get_news_sentiment

# FastAPI app
app = FastAPI()
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    # Aap apne aur bhi frontend URLs yahan add kar sakte hain
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Models ko shuru me hi load karein
MODEL_DIR = "models"
MODEL_PATHS = {
    "AAPL": os.path.join(MODEL_DIR, "AAPL_lstm_model.keras"),
    "GOOGL": os.path.join(MODEL_DIR, "GOOGL_lstm_model.keras"),
    "MSFT": os.path.join(MODEL_DIR, "MSFT_lstm_model.keras")
}

MODELS = {}
for company, path in MODEL_PATHS.items():
    try:
        MODELS[company] = tf.keras.models.load_model(path)
        print(f"Successfully loaded model for {company}")
    except Exception as e:
        print(f"Error loading model for {company}: {e}")
        MODELS[company] = None

class StockRequest(BaseModel):
    company: str = Field(..., example="AAPL")
    input_data: List[List[float]] = Field(
        ..., 
        example=[[135.5, 136.0, 137.2, 138.1, 139.0]]
    )

@app.post("/predict")
def predict_stock(data: StockRequest):
    company = data.company.upper()

    if company not in MODELS or MODELS[company] is None:
        raise HTTPException(status_code=400, detail="Invalid company symbol or model not loaded")

    # Load model
    model = MODELS[company]

    # Prepare input
    input_array = np.array(data.input_data)
    
    # Predict
    prediction = model.predict(input_array).tolist()

    return {"company": company, "prediction": prediction}
    
@app.get("/ping")
def ping():
    return {"status": "Backend is working!"}

@app.get("/sentiment/{company}")
def get_sentiment_data(company: str):
    sentiment_score = get_news_sentiment(company)
    return {"company": company, "sentiment_score": sentiment_score}