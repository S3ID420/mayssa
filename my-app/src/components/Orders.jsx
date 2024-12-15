import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Orders.css';

const OrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newOrder, setNewOrder] = useState({
    user_id: '',
    total_price: '',
    status: 'Pending'
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/orders');
        
        const validOrders = (Array.isArray(response.data) ? response.data : []).map(order => ({
          ...order,
          total_price: parseFloat(order.total_price).toFixed(2) || '0.00',
          created_at: order.created_at ? new Date(order.created_at).toLocaleString() : 'N/A'
        }));

        setOrders(validOrders);
        setError(null);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to fetch orders. Please try again later.');
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleChangeOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/orders/${orderId}`, { status: newStatus });
      
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      console.error('Error updating order status:', error);
      setError('Failed to update order status.');
    }
  };

  const handleRemoveOrder = async (orderId) => {
    try {
      await axios.delete(`http://localhost:5000/api/orders/${orderId}`);
      
      setOrders(orders.filter(order => order.id !== orderId));
    } catch (error) {
      console.error('Error removing order:', error);
      setError('Failed to remove order.');
    }
  };

  const handleAddOrder = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/orders', newOrder);
      
      const addedOrder = {
        ...response.data,
        total_price: parseFloat(response.data.total_price).toFixed(2),
        created_at: new Date(response.data.created_at).toLocaleString()
      };

      setOrders([...orders, addedOrder]);
      setIsModalOpen(false);
      setNewOrder({
        user_id: '',
        total_price: '',
        status: 'Pending'
      });
    } catch (error) {
      console.error('Error adding order:', error);
      setError('Failed to add order.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewOrder(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="orders-management-container">
      <div className="orders-header">
        <h1>Orders</h1>
        <button 
          className="btn-add-order" 
          onClick={() => setIsModalOpen(true)}
        >
          + Add New Order
        </button>
      </div>
      
      {error && (
        <div className="error-banner">
          <span>❌ {error}</span>
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Create New Order</h2>
            <form onSubmit={handleAddOrder}>
              <div className="form-group">
                <label>User ID</label>
                <input
                  type="text"
                  name="user_id"
                  value={newOrder.user_id}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Total Price</label>
                <input
                  type="number"
                  name="total_price"
                  step="0.01"
                  value={newOrder.total_price}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  name="status"
                  value={newOrder.status}
                  onChange={handleInputChange}
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                </select>
              </div>
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn-cancel"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-submit"
                >
                  Create Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {orders.length === 0 ? (
        <div className="no-orders-cute">
          <p> No orders yet</p>
        </div>
      ) : (
        <div className="orders-grid">
          {orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <span className="order-id">Order #{order.id}</span>
                <span className={`status-tag ${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </div>
              
              <div className="order-details">
                <p>User: {order.user_id}</p>
                <p>Total: ${order.total_price}</p>
                <p>Created: {order.created_at}</p>
              </div>
              
              <div className="order-actions">
                <div className="status-buttons">
                  {order.status !== 'Shipped' && (
                    <button 
                      className="btn-shipped" 
                      onClick={() => handleChangeOrderStatus(order.id, 'Shipped')}
                    >
                      Ship
                    </button>
                  )}
                  {order.status !== 'Canceled' && (
                    <button 
                      className="btn-canceled" 
                      onClick={() => handleChangeOrderStatus(order.id, 'Canceled')}
                    >
                      Cancel
                    </button>
                  )}
                </div>
                <button 
                  className="btn-remove" 
                  onClick={() => handleRemoveOrder(order.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersTable;