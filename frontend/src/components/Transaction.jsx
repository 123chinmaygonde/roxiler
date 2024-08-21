import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TransactionsTable = () => {
    const [transactions, setTransactions] = useState([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [month, setMonth] = useState('03');

    useEffect(() => {
        axios.get(`/transactions`, {
            params: { page, perPage: 10, search, month }
        }).then(res => setTransactions(res.data.transactions));
    }, [page, search, month]);

    return (
        <div>
            <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Sold</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((txn) => (
                        <tr key={txn.id}>
                            <td>{txn.title}</td>
                            <td>{txn.description}</td>
                            <td>{txn.price}</td>
                            <td>{txn.category}</td>
                            <td>{txn.sold ? 'Yes' : 'No'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={() => setPage(page - 1)} disabled={page === 1}>Previous</button>
            <button onClick={() => setPage(page + 1)}>Next</button>
        </div>
    );
};

export default TransactionsTable;
