import React, { useState } from 'react';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar" id="navbar">
      <div className="container">
        <a href="#home" className="navbar-logo">
          <span className="logo-icon">🔧</span>
          <span>MyGarage</span>
        </a>
        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <a href="#services" onClick={() => setMenuOpen(false)}>Services</a>
          <a href="#job-board" onClick={() => setMenuOpen(false)}>Job Board</a>
          <a href="#team" onClick={() => setMenuOpen(false)}>Our Team</a>
          <a href="#testimonials" onClick={() => setMenuOpen(false)}>Reviews</a>
          <a href="#booking" className="nav-cta" onClick={() => setMenuOpen(false)}>Book Now</a>
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
