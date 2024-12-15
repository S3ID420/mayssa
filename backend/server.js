const express = require('express');
const dotenv = require('dotenv');
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(express.json()); 
app.use(cors());

// Route setup
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ error: 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
