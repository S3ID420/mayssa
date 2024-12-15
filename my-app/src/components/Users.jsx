import React, { useState, useEffect } from 'react';
import axios from 'axios';
import"./Users.css"
const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'user'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios.get('http://localhost:5000/api/users')
      .then(response => {
        setUsers(response.data);
       
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
        
        setLoading(false);
      });
  };

  const handleRemoveUser = (userId) => {
    axios.delete(`http://localhost:5000/api/users/${userId}`)
      .then(() => {
        setUsers(users.filter(user => user.id !== userId));
      })
      .catch(error => {
        console.error('Error removing user:', error);
      });
  };

  const handlePromoteUser = (user) => {
    const newRole = user.role === 'user' ? 'admin' : 'superadmin';
    axios.patch(`http://localhost:5000/api/users/${user.id}`, { role: newRole })
      .then(() => {
        setUsers(users.map(u => 
          u.id === user.id ? {...u, role: newRole} : u
        ));
      })
      .catch(error => {
        console.error('Error promoting user:', error);
      });
  };

  const handleDemoteUser = (user) => {
    const newRole = user.role === 'superadmin' ? 'admin' : 'user';
    axios.patch(`http://localhost:5000/api/users/${user.id}`, { role: newRole })
      .then(() => {
        setUsers(users.map(u => 
          u.id === user.id ? {...u, role: newRole} : u
        ));
      })
      .catch(error => {
        console.error('Error demoting user:', error);
      });
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/users', newUser)
      .then((response) => {
        setUsers([...users, response.data]);
        setShowAddUserModal(false);
        setNewUser({ name: '', email: '', role: 'user' });
      })
      .catch(error => {
        console.error('Error adding user:', error);
      });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        
      </div>
    );
  }

  return (
    <div className="users-management-container">
      <div className="header">
        <h2> User Management</h2>
        <button 
          className="add-user-btn" 
          onClick={() => setShowAddUserModal(true)}
        >
          + Add New User
        </button>
      </div>

      {showAddUserModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add New User</h3>
            <form onSubmit={handleAddUser}>
              <input 
                type="text" 
                placeholder="Name" 
                value={newUser.name}
                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                required 
              />
              <input 
                type="email" 
                placeholder="Email" 
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                required 
              />
              <select 
                value={newUser.role}
                onChange={(e) => setNewUser({...newUser, role: e.target.value})}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="superadmin">Super Admin</option>
              </select>
              <div className="modal-actions">
                <button type="submit" className="confirm-btn">Add User</button>
                <button 
                  type="button" 
                  className="cancel-btn" 
                  onClick={() => setShowAddUserModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="users-grid">
        {users.map(user => (
          <div key={user.id} className="user-card">
            <div className="user-header">
              <h3>{user.name}</h3>
              <span className={`role-badge ${user.role}`}>{user.role}</span>
            </div>
            <div className="user-details">
              <p>📧 {user.email}</p>
            </div>
            <div className="user-actions">
              <button 
                className="remove-btn" 
                onClick={() => handleRemoveUser(user.id)}
              >
                 Remove
              </button>
              <div className="role-actions">
                {user.role !== 'superadmin' && (
                  <button 
                    className="promote-btn" 
                    onClick={() => handlePromoteUser(user)}
                  >
                     Promote
                  </button>
                )}
                {user.role !== 'user' && (
                  <button 
                    className="demote-btn" 
                    onClick={() => handleDemoteUser(user)}
                  >
                     Demote
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Users;