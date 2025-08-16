import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

function StockChart({ historical, predicted }) {
    // Combine historical and predicted data into a single array
    const combinedData = [...historical, ...predicted];

    // Format the data for the chart
    const data = combinedData.map((value, index) => ({
        name: `Day ${index + 1}`,
        value: value,
        isPredicted: index >= historical.length
    }));

    return (
        <div style={{ width: '100%', height: 400 }}>
            <h2>Stock Price Chart</h2>
            <ResponsiveContainer>
                <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export default StockChart;