import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Users from './components/Users.jsx';
import Orders from './components/Orders';
import Products from './components/Products';
import HomePage from './components/HomePage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/users" element={<Users />} />
            <Route path="/products" element={<Products />} />
            <Route path="/orders" element={<Orders/>} />
            <Route path="/" element={<HomePage/>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;