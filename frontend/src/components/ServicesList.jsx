import React, { useEffect, useState } from 'react';
import { useBooking } from '../context/BookingContext.jsx';

const API_URL = 'http://localhost:3001';

const ServicesList = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const { bookService } = useBooking();

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/api/services`).then(r => r.json()),
      fetch(`${API_URL}/api/services/categories`).then(r => r.json()),
    ])
      .then(([servicesData, categoriesData]) => {
        setServices(servicesData);
        setCategories(['All', ...categoriesData]);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch services:', err);
        setLoading(false);
      });
  }, []);

  const filteredServices =
    activeCategory === 'All'
      ? services
      : services.filter(s => s.category === activeCategory);

  if (loading) {
    return (
      <section className="section services-section" id="services">
        <div className="container">
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Loading services...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="section services-section" id="services">
      <div className="container">
        <div className="section-header">
          <div className="section-label">⚙️ What We Do</div>
          <h2 className="section-title">Complete Garage Services</h2>
          <p className="section-subtitle">
            From routine maintenance to major repairs — we handle everything your vehicle needs.
          </p>
        </div>

        <div className="category-tabs">
          {categories.map(cat => (
            <button
              key={cat}
              className={`category-tab ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="services-grid">
          {filteredServices.map((service, index) => (
            <div
              className="service-card fade-in-up"
              key={service.id}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="service-card-header">
                <div className="service-icon">{service.icon}</div>
                <span className="service-duration">⏱ {service.duration}</span>
              </div>
              <h3>{service.name}</h3>
              <p>{service.description}</p>
              <div className="service-card-footer">
                <div className="service-price">
                  Rs.{service.price.toLocaleString('en-IN')} <small>starting</small>
                </div>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => bookService(service.name)}
                >
                  Book
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesList;
