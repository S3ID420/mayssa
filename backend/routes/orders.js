const express = require('express');
const db = require('../config/db');
const router = express.Router();

// Fetch all orders
router.get('/', async (req, res) => {
  try {
    const [orders] = await db.query(`
      SELECT 
        o.id, 
        o.user_id, 
        o.status, 
        o.total_price, 
        o.created_at,
        u.name AS user_name,
        u.email AS user_email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `);
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ 
      message: 'Error fetching orders',
      error: error.message 
    });
  }
});

// Get a single order by ID
router.get('/:id', async (req, res) => {
  try {
    const [orders] = await db.query(
      `SELECT * FROM orders WHERE id = ?`, 
      [req.params.id]
    );
    
    if (orders.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(orders[0]);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ 
      message: 'Error fetching order',
      error: error.message 
    });
  }
});

// Create a new order
router.post('/', async (req, res) => {
  const { user_id, total_price, status = 'Pending' } = req.body;
  
  try {
    // Validate input
    if (!user_id  || !total_price) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const [result] = await db.query(
      `INSERT INTO orders 
        (user_id, total_price, status, created_at) 
      VALUES (?, ?, ?, NOW())`, 
      [user_id, total_price, status]
    );

    const [newOrder] = await db.query(
      'SELECT * FROM orders WHERE id = ?', 
      [result.insertId]
    );

    res.status(201).json(newOrder[0]);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ 
      message: 'Error creating order',
      error: error.message 
    });
  }
});

// Update order status
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  try {
    // Validate status
    const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Canceled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid order status' });
    }

    const [result] = await db.query(
      'UPDATE orders SET status = ? WHERE id = ?', 
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const [updatedOrder] = await db.query(
      'SELECT * FROM orders WHERE id = ?', 
      [id]
    );

    res.json(updatedOrder[0]);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ 
      message: 'Error updating order status',
      error: error.message 
    });
  }
});

// Delete an order
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const [result] = await db.query(
      'DELETE FROM orders WHERE id = ?', 
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ 
      message: 'Error deleting order',
      error: error.message 
    });
  }
});

// Get orders by user
router.get('/user/:userId', async (req, res) => {
  try {
    const [orders] = await db.query(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', 
      [req.params.userId]
    );
    
    res.json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ 
      message: 'Error fetching user orders',
      error: error.message 
    });
  }
});

module.exports = router;
