import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  const location = useLocation();

  return (
    <div className="sidebar">
      <div className="sidebar-content">
        <h1 className="dashboard-title">Dashboard</h1>
        <nav>
          <ul>
            <li>
              <Link 
                to="/users" 
                className={`nav-link ${location.pathname === '/users' ? 'active' : ''}`}
              >
                
                Users
              </Link>
            </li>
            <div className="sidebar-divider"></div>
            <li>
              <Link 
                to="/products" 
                className={`nav-link ${location.pathname === '/products' ? 'active' : ''}`}
              >
                
                Products
              </Link>
            </li>
            <div className="sidebar-divider"></div>
            <li>
              <Link 
                to="/orders" 
                className={`nav-link ${location.pathname === '/orders' ? 'active' : ''}`}
              >
                
                Orders
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default Sidebar;