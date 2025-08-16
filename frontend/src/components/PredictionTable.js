import React from 'react';

function PredictionTable({ data }) {
    if (!data || data.length === 0) {
        return null;
    }

    return (
        <div>
            <h2>Prediction Table</h2>
            <table>
                <thead>
                    <tr>
                        <th>Predicted Value</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((value, index) => (
                        <tr key={index}>
                            <td>{value.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default PredictionTable;