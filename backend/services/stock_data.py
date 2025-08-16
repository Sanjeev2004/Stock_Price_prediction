import yfinance as yf
import pandas as pd
import numpy as np

def fetch_historical_data(symbol: str, period: str = "1y", interval: str = "1d") -> pd.DataFrame:
    """
    Fetch historical OHLCV data using yfinance.
    Returns pandas DataFrame indexed by Date.
    """
    ticker = yf.Ticker(symbol)
    df = ticker.history(period=period, interval=interval, auto_adjust=False)
    if df.empty:
        raise ValueError(f"No historical data found for symbol {symbol}")
    # Ensure standard columns exist
    df = df[["Open", "High", "Low", "Close", "Volume"]]
    df.index = pd.to_datetime(df.index)
    return df

def calculate_technical_indicators(df: pd.DataFrame) -> pd.DataFrame:
    """
    Add some basic technical indicators (MA, EMA, RSI). This is optional for prediction input.
    """
    df = df.copy()
    df["MA_10"] = df["Close"].rolling(window=10).mean()
    df["MA_50"] = df["Close"].rolling(window=50).mean()
    # RSI
    delta = df["Close"].diff()
    up, down = delta.clip(lower=0), -1*delta.clip(upper=0)
    ma_up = up.rolling(14).mean()
    ma_down = down.rolling(14).mean()
    rs = ma_up / ma_down
    df["RSI_14"] = 100 - (100 / (1 + rs))
    df = df.fillna(method="bfill").fillna(0)
    return df
