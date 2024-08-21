import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const TransactionsBarChart = () => {
    const [data, setData] = useState([]);
    const [month, setMonth] = useState('03');

    useEffect(() => {
        axios.get('/barchart', { params: { month } })
            .then(res => setData(res.data));
    }, [month]);

    return (
        <BarChart width={600} height={300} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="range" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
    );
};

export default TransactionsBarChart;
