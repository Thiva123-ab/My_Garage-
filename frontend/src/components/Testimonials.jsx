import React, { useEffect, useState } from 'react';

const API_URL = 'http://localhost:3001';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/testimonials`)
      .then(r => r.json())
      .then(data => setTestimonials(data))
      .catch(console.error);
  }, []);

  if (testimonials.length === 0) return null;

  return (
    <section className="section testimonials-section" id="testimonials">
      <div className="container">
        <div className="section-header">
          <div className="section-label">⭐ Customer Reviews</div>
          <h2 className="section-title">What Our Clients Say</h2>
          <p className="section-subtitle">
            Real feedback from real vehicle owners who trust MyGarage.
          </p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((t, index) => (
            <div
              className="testimonial-card fade-in-up"
              key={t.id}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="testimonial-stars">
                {'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}
              </div>
              <p className="testimonial-text">"{t.text}"</p>
              <div className="testimonial-author">
                <div className="testimonial-author-avatar">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="testimonial-author-name">{t.name}</div>
                  <div className="testimonial-author-vehicle">{t.vehicle}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
