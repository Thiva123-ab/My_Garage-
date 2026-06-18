import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const LoginPage = () => {
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    login(name.trim(), 'customer');
    navigate('/');
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Header */}
        <div className="login-header">
          <div className="login-logo">🔧</div>
          <h1>Welcome to <span className="gradient-text">MyGarage</span></h1>
          <p>Your trusted vehicle repair partner</p>
        </div>

        {/* Customer login form */}
        <form onSubmit={handleLogin}>
          <div className="login-input-group">
            <label htmlFor="login-name">Your Full Name</label>
            <input
              type="text"
              id="login-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Smith"
              required
              autoFocus
            />
          </div>

          {/* Customer benefits */}
          <div className="customer-benefits">
            <div className="benefit-item">
              <span className="benefit-icon">📅</span>
              <span>Book appointments online</span>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">🚗</span>
              <span>Track your vehicle repairs</span>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">⭐</span>
              <span>View service history & reviews</span>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary login-submit"
            disabled={!name.trim() || submitting}
          >
            {submitting ? '⏳ Signing in...' : '🚀 Continue as Customer'}
          </button>
        </form>

        {/* Staff portal link */}
        <div className="login-staff-link">
          <span>Are you a staff member?</span>
          <Link to="/staff-login" id="staff-portal-link">🔐 Staff Portal</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
