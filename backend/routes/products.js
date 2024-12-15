const express = require('express');
const db = require('../config/db');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const [products] = await db.query('SELECT * FROM products');
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { name, description, price,image } = req.body;
        const [result] = await db.query('INSERT INTO products (name, description, price, image) VALUES (?, ?, ?, ?)', [name, description, price, image]);
        res.status(201).json({ id: result.insertId, name, description, price });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
