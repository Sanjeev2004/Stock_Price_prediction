import React, { useState, useEffect } from "react";
import { getSentiment } from "../services/api";

function NewsSentiment({ company }) {
    const [sentiment, setSentiment] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchSentiment = async () => {
            setLoading(true);
            const result = await getSentiment(company);
            if (result && result.sentiment_score) {
                setSentiment(result.sentiment_score);
            }
            setLoading(false);
        };

        if (company) {
            fetchSentiment();
        }
    }, [company]);

    if (loading) return <p>Fetching news sentiment...</p>;
    if (sentiment === null) return <p>No sentiment data available.</p>;

    return (
        <div>
            <h2>News Sentiment Analysis</h2>
            <p>
                Current sentiment for {company}: **{sentiment}**
            </p>
        </div>
    );
}

export default NewsSentiment;