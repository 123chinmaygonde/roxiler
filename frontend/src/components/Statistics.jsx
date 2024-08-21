import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Statistics = () => {
    const [stats, setStats] = useState({});
    const [month, setMonth] = useState('03');

    useEffect(() => {
        axios.get('/statistics', { params: { month } })
            .then(res => setStats(res.data));
    }, [month]);

    return (
        <div>
            <h3>Statistics for {month}</h3>
            <p>Total Sale Amount: {stats.totalAmount}</p>
            <p>Total Sold Items: {stats.totalSoldItems}</p>
            <p>Total Not Sold Items: {stats.totalNotSoldItems}</p>
        </div>
    );
};

export default Statistics;
