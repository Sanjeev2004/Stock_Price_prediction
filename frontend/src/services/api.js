import axios from "axios";

const API_URL = "http://127.0.0.1:8000";  // backend ka URL

export const getPrediction = async (company, inputData) => {
    try {
        const response = await axios.post(`${API_URL}/predict`, {
            company: company,
            input_data: inputData,
        });
        return response.data;
    } catch (error) {
        console.error("Prediction error:", error);
        return null;
    }
};

export const getSentiment = async (company) => {
    try {
        const response = await axios.get(`${API_URL}/sentiment/${company}`);
        return response.data;
    } catch (error) {
        console.error("Sentiment error:", error);
        return null;
    }
};
