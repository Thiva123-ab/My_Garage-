import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, ROLES, ROLE_INFO } from '../context/AuthContext.jsx';

const LoginPage = () => {
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (!name.trim() || !selectedRole) return;
    login(name.trim(), selectedRole);
    // Navigate based on role
    if (selectedRole === ROLES.CUSTOMER) {
      navigate('/');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">🔧</div>
          <h1>Welcome to <span className="gradient-text">MyGarage</span></h1>
          <p>Select your role to continue</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="login-input-group">
            <label htmlFor="login-name">Your Name</label>
            <input
              type="text"
              id="login-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="login-roles">
            {Object.entries(ROLE_INFO).map(([key, info]) => (
              <div
                key={key}
                className={`login-role-card ${selectedRole === key ? 'selected' : ''}`}
                onClick={() => setSelectedRole(key)}
                style={{ '--role-color': info.color }}
              >
                <div className="role-card-icon">{info.icon}</div>
                <div className="role-card-info">
                  <h3>{info.label}</h3>
                  <p>{info.description}</p>
                </div>
                <div className="role-card-check">
                  {selectedRole === key ? '✓' : ''}
                </div>
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="btn btn-primary login-submit"
            disabled={!name.trim() || !selectedRole}
          >
            Continue as {selectedRole ? ROLE_INFO[selectedRole].label : '...'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
