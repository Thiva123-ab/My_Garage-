import React from 'react';

const Footer = () => {
  return (
    <footer className="footer" id="contact">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h3>🔧 <span className="gradient-text">MyGarage</span></h3>
            <p>
              Your trusted partner for professional vehicle repair, maintenance, and care. 
              We keep your vehicle running at its best — always.
            </p>
          </div>

          <div className="footer-col">
            <h4>Services</h4>
            <a href="#services">Engine Repair</a>
            <a href="#services">Oil Change</a>
            <a href="#services">Brake Service</a>
            <a href="#services">Tire & Alignment</a>
            <a href="#services">AC Repair</a>
            <a href="#services">Body & Paint</a>
          </div>

          <div className="footer-col">
            <h4>Company</h4>
            <a href="#team">Our Team</a>
            <a href="#testimonials">Reviews</a>
            <a href="#job-board">Job Board</a>
            <a href="#booking">Book Now</a>
          </div>

          <div className="footer-col">
            <h4>Contact</h4>
            <a href="tel:+15550001234">📞 +1 (555) 000-1234</a>
            <a href="mailto:info@mygarage.com">✉️ info@mygarage.com</a>
            <a href="#">📍 123 Garage Lane, Auto City</a>
            <a href="#">🕐 Mon–Sat: 8AM – 6PM</a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} MyGarage. All rights reserved.</span>
          <div className="footer-social">
            <a href="#" aria-label="Facebook">📘</a>
            <a href="#" aria-label="Instagram">📸</a>
            <a href="#" aria-label="Twitter">🐦</a>
            <a href="#" aria-label="YouTube">▶️</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
