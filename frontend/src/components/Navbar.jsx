import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext.jsx';
import { useAuth, ROLES, ROLE_INFO, isStaffRole } from '../context/AuthContext.jsx';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, isLoggedIn, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isDashboard = location.pathname === '/dashboard';
  const isStaff = isLoggedIn && isStaffRole(user?.role);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav className="navbar" id="navbar">
      <div className="container">
        <Link to="/" className="navbar-logo" onClick={() => setMenuOpen(false)}>
          <span className="logo-icon">🔧</span>
          <span>MyGarage</span>
        </Link>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          {/* Public / Customer nav links */}
          {!isStaff && (
            <>
              <a href="/#services" onClick={() => setMenuOpen(false)}>Services</a>
              <a href="/#job-board" onClick={() => setMenuOpen(false)}>Job Board</a>
              <a href="/#team" onClick={() => setMenuOpen(false)}>Our Team</a>
              <a href="/#testimonials" onClick={() => setMenuOpen(false)}>Reviews</a>
              <a href="/#booking" onClick={() => setMenuOpen(false)}>Book Now</a>
            </>
          )}

          {/* Staff nav links */}
          {isStaff && (
            <>
              <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
              <Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
            </>
          )}

          {/* Theme Toggle */}
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {/* Auth section */}
          {isLoggedIn ? (
            <div className="nav-user-menu">
              <div
                className="nav-user-badge"
                style={{ '--role-color': ROLE_INFO[user.role]?.color || '#00d4ff' }}
              >
                <span className="nav-user-icon">{ROLE_INFO[user.role]?.icon}</span>
                <span className="nav-user-name">{user.name}</span>
                <span
                  className="nav-user-role"
                  style={{ background: `${ROLE_INFO[user.role]?.color}20`, color: ROLE_INFO[user.role]?.color }}
                >
                  {ROLE_INFO[user.role]?.label}
                </span>
              </div>
              <button className="btn btn-sm btn-outline nav-logout" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <div className="nav-auth-buttons">
              <Link to="/login" className="btn btn-sm btn-outline" id="customer-login-btn" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link to="/staff-login" className="staff-portal-btn" id="staff-login-btn" onClick={() => setMenuOpen(false)}>
                🔐 Staff
              </Link>
            </div>
          )}
        </div>

        <button
          className="mobile-toggle"
          id="mobile-toggle"
          onClick={() => setMenuOpen(prev => !prev)}
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
