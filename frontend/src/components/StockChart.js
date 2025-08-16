import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Chart ke liye zaroori components ko register karein
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

function StockChart({ historical, predicted }) {
    // Historical aur predicted data ko combine karein
    const combinedData = historical.concat(predicted);

    // Labels banayein (e.g., Day 1, Day 2...)
    const labels = combinedData.map((_, index) => `Day ${index + 1}`);

    const data = {
        labels,
        datasets: [
            {
                label: 'Historical Data',
                data: historical,
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
            {
                label: 'Predicted Data',
                data: Array(historical.length).fill(null).concat(predicted),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
        ],
    };

    const options = {
        responsive: true,
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Days'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Price'
                }
            }
        },
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Stock Price Prediction Chart',
            },
        },
    };

    return (
        <div style={{ width: '100%', height: 400 }}>
            <Line options={options} data={data} />
        </div>
    );
    // In StockChart.js
    return (
        <div className="chart-container">
            <h2>Stock Price Chart</h2>
            {/* ...chart code */}
        </div>
    );
}

export default StockChart;