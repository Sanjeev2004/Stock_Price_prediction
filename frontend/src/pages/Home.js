import React, { useState } from "react";
import { getPrediction } from "../services/api";
import PredictionTable from "../components/PredictionTable";
import StockChart from "../components/StockChart";
import NewsSentiment from "../components/NewsSentiment"; // Ensure this is imported
import './Home.css'; // Home.js me is tarah import karein
// ...baaki code
function Home() {
    const [company, setCompany] = useState("AAPL");
    const [prediction, setPrediction] = useState(null);
    const [inputData, setInputData] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handlePredict = async () => {
        setLoading(true);
        setError(null);
        setPrediction(null);

        try {
            // Brackets aur spaces ko remove karein
            const cleanedInput = inputData.replace(/[\[\]\s]/g, '');
            const historicalData = cleanedInput.split(',').map(Number);

            if (historicalData.some(isNaN) || historicalData.length === 0) {
                setError("Please enter valid comma-separated numbers.");
                setLoading(false);
                return;
            }

            const formattedData = [historicalData];
            const result = await getPrediction(company, formattedData);

            if (result && result.prediction) {
                setPrediction(result.prediction[0]);
            } else {
                setError("No prediction found. Please check your input and the backend server.");
            }
        } catch (err) {
            console.error("Prediction error:", err);
            setError("Failed to get a prediction. The server might be down.");
        } finally {
            setLoading(false);
        }
    };

    // Ek hi return statement hona chahiye
    return (
        <div>
            <h1>Stock Price Prediction</h1>
            <p>Select a company and enter the last few days' stock prices to get a prediction.</p>

            <select onChange={(e) => setCompany(e.target.value)} value={company}>
                <option value="AAPL">Apple (AAPL)</option>
                <option value="GOOGL">Google (GOOGL)</option>
                <option value="MSFT">Microsoft (MSFT)</option>
            </select>

            <input
                type="text"
                value={inputData}
                onChange={(e) => setInputData(e.target.value)}
                placeholder="Enter historical data (e.g., 150, 152, 151, 155, 158)"
                style={{ width: '300px', margin: '10px' }}
            />

            <button onClick={handlePredict} disabled={loading}>
                {loading ? "Predicting..." : "Predict"}
            </button>

            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}

            {/* Render components only when there is a prediction result */}
            {prediction && (
                <div>
                    <PredictionTable data={prediction} />
                    <StockChart historical={inputData.split(',').map(Number)} predicted={prediction} />
                    <NewsSentiment company={company} />
                </div>
            )}
        </div>
    );
}

export default Home;