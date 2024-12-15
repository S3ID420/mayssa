const express = require('express');
const db = require('../config/db');

const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
    try {
        const [users] = await db.query('SELECT * FROM users');
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create new user
router.post('/', async (req, res) => {
    try {
        const { name, email, role } = req.body;
        
        // Check if email already exists
        const [existingUsers] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        const [result] = await db.query('INSERT INTO users (name, email, role) VALUES (?, ?, ?)', [name, email, role]);
        res.status(201).json({ id: result.insertId, name, email, role });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update user (role or details)
router.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, role } = req.body;

        // Prepare update fields dynamically
        const updateFields = [];
        const values = [];

        if (name) {
            updateFields.push('name = ?');
            values.push(name);
        }
        if (email) {
            updateFields.push('email = ?');
            values.push(email);
        }
        if (role) {
            updateFields.push('role = ?');
            values.push(role);
        }

        if (updateFields.length === 0) {
            return res.status(400).json({ error: 'No update fields provided' });
        }

        // Add user ID to values
        values.push(id);

        const query = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;
        const [result] = await db.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Fetch and return updated user
        const [updatedUsers] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
        res.json(updatedUsers[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete user
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'User deleted successfully', id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;