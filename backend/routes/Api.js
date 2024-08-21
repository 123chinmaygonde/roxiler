const axios = require("axios")
const Product = require('./models/Product')

app.get('/initialize',async(req,res)=>{
    try {
        const response = await axios.get('https:s3.amazonaws.com/roxiler.com/product_transaction.json')
        const data = response.data;
        await Product.deleteMany()
        await Product.insertMany(data)

        res.status(200).send('database initialized with seed data')
        
    } catch (error) {
        res.status(500).send('error initializing database')
        
    }
})

app.get('/transactions', async (req, res) => {
    const { page = 1, perPage = 10, search = '', month } = req.query;

    let query = {};
    if (month) {
        query.dateOfSale = { $regex: `-${month.padStart(2, '0')}-` };
    }

    if (search) {
        query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { price: parseFloat(search) || 0 }
        ];
    }

    try {
        const transactions = await Product.find(query)
            .skip((page - 1) * perPage)
            .limit(parseInt(perPage));
        const total = await Product.countDocuments(query);
        res.json({ transactions, total, page, perPage });
    } catch (error) {
        res.status(500).send('Error fetching transactions');
    }
});
app.get('/statistics', async (req, res) => {
    const { month } = req.query;

    try {
        const query = { dateOfSale: { $regex: `-${month.padStart(2, '0')}-` } };

        const totalSales = await Product.aggregate([
            { $match: query },
            { $group: { _id: null, totalAmount: { $sum: "$price" }, totalItems: { $sum: 1 }, soldItems: { $sum: { $cond: ["$sold", 1, 0] } } } }
        ]);

        const stats = totalSales.length ? totalSales[0] : { totalAmount: 0, totalItems: 0, soldItems: 0 };

        res.json({
            totalAmount: stats.totalAmount,
            totalSoldItems: stats.soldItems,
            totalNotSoldItems: stats.totalItems - stats.soldItems
        });
    } catch (error) {
        res.status(500).send('Error fetching statistics');
    }
});
app.get('/barchart', async (req, res) => {
    const { month } = req.query;

    try {
        const priceRanges = [
            { range: '0-100', min: 0, max: 100 },
            { range: '101-200', min: 101, max: 200 },
            { range: '201-300', min: 201, max: 300 },
            { range: '301-400', min: 301, max: 400 },
            { range: '401-500', min: 401, max: 500 },
            { range: '501-600', min: 501, max: 600 },
            { range: '601-700', min: 601, max: 700 },
            { range: '701-800', min: 701, max: 800 },
            { range: '801-900', min: 801, max: 900 },
            { range: '901-above', min: 901, max: Infinity }
        ];

        const query = { dateOfSale: { $regex: `-${month.padStart(2, '0')}-` } };

        const result = await Product.aggregate([
            { $match: query },
            { $bucket: { groupBy: "$price", boundaries: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, Infinity], default: "Others", output: { count: { $sum: 1 } } } }
        ]);

        const response = priceRanges.map(range => {
            const match = result.find(r => r._id === range.range);
            return { range: range.range, count: match ? match.count : 0 };
        });

        res.json(response);
    } catch (error) {
        res.status(500).send('Error fetching bar chart data');
    }
});
app.get('/piechart', async (req, res) => {
    const { month } = req.query;

    try {
        const query = { dateOfSale: { $regex: `-${month.padStart(2, '0')}-` } };

        const result = await Product.aggregate([
            { $match: query },
            { $group: { _id: "$category", count: { $sum: 1 } } }
        ]);

        res.json(result.map(r => ({ category: r._id, count: r.count })));
    } catch (error) {
        res.status(500).send('Error fetching pie chart data');
    }
});
app.get('/combined-data', async (req, res) => {
    try {
        const { month } = req.query;

        const [transactions, statistics, barchart, piechart] = await Promise.all([
            Product.find({ dateOfSale: { $regex: `-${month.padStart(2, '0')}-` } }),
            Product.aggregate([
                { $match: { dateOfSale: { $regex: `-${month.padStart(2, '0')}-` } } },
                { $group: { _id: null, totalAmount: { $sum: "$price" }, totalItems: { $sum: 1 }, soldItems: { $sum: { $cond: ["$sold", 1, 0] } } } }
            ]),
            Product.aggregate([
                { $match: { dateOfSale: { $regex: `-${month.padStart(2, '0')}-` } } },
                { $bucket: { groupBy: "$price", boundaries: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, Infinity], default: "Others", output: { count: { $sum: 1 } } } }
            ]),
            Product.aggregate([
                { $match: { dateOfSale: { $regex: `-${month.padStart(2, '0')}-` } } },
                { $group: { _id: "$category", count: { $sum: 1 } } }
            ])
        ]);

        res.json({ transactions, statistics, barchart, piechart });
    } catch (error) {
        res.status(500).send('Error fetching combined data');
    }
});
