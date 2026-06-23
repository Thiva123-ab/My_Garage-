import React, { useEffect, useState } from 'react';

const API_URL = 'http://localhost:3001';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [showForm, setShowForm] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTestimonials = () => {
    fetch(`${API_URL}/api/testimonials`)
      .then(r => r.json())
      .then(data => setTestimonials(data))
      .catch(console.error);
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/api/testimonials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, vehicle, rating, text }),
      });
      if (response.ok) {
        setShowForm(false);
        setName('');
        setVehicle('');
        setRating(5);
        setText('');
        fetchTestimonials(); // Refresh the list
      }
    } catch (error) {
      console.error('Failed to submit review', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (testimonials.length === 0 && !showForm) return null;

  return (
    <section className="section testimonials-section" id="testimonials">
      <div className="container">
        <div className="section-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="section-label">⭐ Customer Reviews</div>
          <h2 className="section-title">What Our Clients Say</h2>
          <p className="section-subtitle" style={{ marginBottom: '1.5rem' }}>
            Real feedback from real vehicle owners who trust MyGarage.
          </p>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            ✏️ Write a Review
          </button>
        </div>

        {/* Modal Form */}
        {showForm && (
          <div className="modal-overlay" style={modalOverlayStyle}>
            <div className="modal-content login-card" style={modalContentStyle}>
              <h3 style={{ marginBottom: '1.5rem', color: '#fff' }}>Leave a Review</h3>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Your Name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                />
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Your Vehicle (e.g. 2022 Toyota Corolla)" 
                  value={vehicle} 
                  onChange={(e) => setVehicle(e.target.value)} 
                  required 
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left' }}>
                  <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Rating</label>
                  <select 
                    className="form-input" 
                    value={rating} 
                    onChange={(e) => setRating(Number(e.target.value))}
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                    <option value={3}>⭐⭐⭐ (3 Stars)</option>
                    <option value={2}>⭐⭐ (2 Stars)</option>
                    <option value={1}>⭐ (1 Star)</option>
                  </select>
                </div>
                <textarea 
                  className="form-input" 
                  placeholder="Tell us about your experience..." 
                  rows="4" 
                  value={text} 
                  onChange={(e) => setText(e.target.value)} 
                  required 
                  style={{ resize: 'vertical' }}
                />
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                  <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowForm(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

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
                  {t.name.charAt(0).toUpperCase()}
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

// Inline styles for quick modal implementation that perfectly matches the dark theme
const modalOverlayStyle = {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  background: 'rgba(0, 0, 0, 0.75)',
  backdropFilter: 'blur(8px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 10000,
  padding: '1rem'
};

const modalContentStyle = {
  width: '100%',
  maxWidth: '500px',
  position: 'relative'
};

export default Testimonials;
