import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, ROLES, ROLE_INFO } from '../context/AuthContext.jsx';

const STAFF_ROLES = [ROLES.ADMIN, ROLES.MECHANIC, ROLES.SERVICE_ADVISOR];

const StaffLoginPage = () => {
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !selectedRole || !passcode) return;

    const roleInfo = ROLE_INFO[selectedRole];
    if (passcode !== roleInfo.passcode) {
      setError('❌ Incorrect passcode. Please try again.');
      return;
    }

    setSubmitting(true);
    login(name.trim(), selectedRole);
    navigate('/dashboard');
  };

  return (
    <div className="login-page staff-login-page">
      <div className="login-card">
        {/* Header */}
        <div className="login-header">
          <div className="login-logo">🏢</div>
          <h1>
            <span className="gradient-text">Staff Portal</span>
          </h1>
          <p>Authorized personnel only</p>
        </div>

        {/* Warning banner */}
        <div className="staff-warning-banner">
          <span>🔒</span>
          <span>This portal is restricted to MyGarage employees. Unauthorized access is prohibited.</span>
        </div>

        <form onSubmit={handleLogin}>
          {/* Name */}
          <div className="login-input-group">
            <label htmlFor="staff-name">Full Name</label>
            <input
              type="text"
              id="staff-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
              autoFocus
            />
          </div>

          {/* Role Selection */}
          <div className="login-input-group">
            <label>Select Your Role</label>
            <div className="login-roles">
              {STAFF_ROLES.map((roleKey) => {
                const info = ROLE_INFO[roleKey];
                return (
                  <div
                    key={roleKey}
                    className={`login-role-card ${selectedRole === roleKey ? 'selected' : ''}`}
                    onClick={() => { setSelectedRole(roleKey); setPasscode(''); setError(''); }}
                    style={{ '--role-color': info.color }}
                  >
                    <div className="role-card-icon">{info.icon}</div>
                    <div className="role-card-info">
                      <h3>{info.label}</h3>
                      <p>{info.description}</p>
                    </div>
                    <div className="role-card-check">
                      {selectedRole === roleKey ? '✓' : ''}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Passcode — only shown after selecting a role */}
          {selectedRole && (
            <div className="login-input-group passcode-group" style={{ animation: 'fadeInUp 0.3s ease-out' }}>
              <label htmlFor="staff-passcode">
                {ROLE_INFO[selectedRole].icon} {ROLE_INFO[selectedRole].label} Passcode
              </label>
              <input
                type="password"
                id="staff-passcode"
                value={passcode}
                onChange={(e) => { setPasscode(e.target.value); setError(''); }}
                placeholder="Enter your role passcode"
                required
                autoComplete="off"
              />
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="staff-login-error">{error}</div>
          )}

          <button
            type="submit"
            className="btn btn-primary login-submit"
            disabled={!name.trim() || !selectedRole || !passcode || submitting}
            style={{ background: selectedRole ? `linear-gradient(135deg, ${ROLE_INFO[selectedRole]?.color}, #7c3aed)` : undefined }}
          >
            {submitting ? '⏳ Verifying...' : `🔐 Sign in as ${selectedRole ? ROLE_INFO[selectedRole].label : '...'}`}
          </button>
        </form>

        {/* Back to customer login */}
        <div className="login-staff-link">
          <span>Not a staff member?</span>
          <Link to="/login" id="customer-login-link">👤 Customer Login</Link>
        </div>
      </div>
    </div>
  );
};

export default StaffLoginPage;
