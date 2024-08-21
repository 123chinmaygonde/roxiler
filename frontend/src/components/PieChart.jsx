import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Tooltip } from 'recharts';

const TransactionsPieChart = () => {
    const [data, setData] = useState([]);
    const [month, setMonth] = useState('03');

    useEffect(() => {
        axios.get('/piechart', { params: { month } })
            .then(res => setData(res.data));
    }, [month]);

    return (
        <PieChart width={400} height={400}>
            <Pie dataKey="count" isAnimationActive={false} data={data} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label />
            <Tooltip />
        </PieChart>
    );
};

export default TransactionsPieChart;
