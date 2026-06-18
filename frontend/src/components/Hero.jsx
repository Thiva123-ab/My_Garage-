import React from 'react';
import heroImage from '../assets/hero.png';

const Hero = () => {
  return (
    <section className="hero" id="home">
      <img src={heroImage} alt="Premium Garage Interior" className="hero-bg" />
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <div className="hero-badge">🏆 Trusted by 5,000+ Vehicle Owners</div>
        <h1>
          Expert Vehicle <span className="gradient-text">Repair & Service</span>
        </h1>
        <p className="hero-subtitle">
          From engine overhauls to precision diagnostics — our certified mechanics deliver 
          top-tier automotive care with cutting-edge equipment and transparent pricing.
        </p>
        <div className="hero-buttons">
          <a href="#booking" className="btn btn-primary">📅 Book Appointment</a>
          <a href="#services" className="btn btn-outline">🔍 View All Services</a>
        </div>
        <div className="hero-stats">
          <div className="hero-stat">
            <div className="stat-number">5K+</div>
            <div className="stat-label">Happy Clients</div>
          </div>
          <div className="hero-stat">
            <div className="stat-number">15+</div>
            <div className="stat-label">Years Experience</div>
          </div>
          <div className="hero-stat">
            <div className="stat-number">34</div>
            <div className="stat-label">Services Offered</div>
          </div>
          <div className="hero-stat">
            <div className="stat-number">4.9</div>
            <div className="stat-label">Star Rating</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
