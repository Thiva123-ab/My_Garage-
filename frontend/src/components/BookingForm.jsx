import React, { useEffect, useState } from 'react';
import { useBooking } from '../context/BookingContext.jsx';

const API_URL = 'http://localhost:3001';

const BookingForm = () => {
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    vehicle: '',
    service: '',
    date: '',
    notes: '',
  });
  const [message, setMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { selectedService, setSelectedService } = useBooking();

  // Auto-fill the service dropdown when a service is selected from the cards
  useEffect(() => {
    if (selectedService) {
      setFormData(prev => ({ ...prev, service: selectedService }));
    }
  }, [selectedService]);

  useEffect(() => {
    fetch(`${API_URL}/api/services`)
      .then(r => r.json())
      .then(data => setServices(data))
      .catch(console.error);
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch(`${API_URL}/api/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: `✅ ${data.message} Booking ID: ${data.booking.id}` });
        setFormData({ name: '', phone: '', vehicle: '', service: '', date: '', notes: '' });
        setSelectedService(''); // clear the context selection too
      } else {
        setMessage({ type: 'error', text: `❌ ${data.error}` });
      }
    } catch (err) {
      setMessage({ type: 'error', text: '❌ Something went wrong. Please try again.' });
    }
    setSubmitting(false);
  };

  return (
    <section className="section booking-section" id="booking">
      <div className="container">
        <div className="section-header">
          <div className="section-label">📅 Schedule Service</div>
          <h2 className="section-title">Book an Appointment</h2>
          <p className="section-subtitle">
            Fill out the form below and we will confirm your appointment within 30 minutes.
          </p>
        </div>

        <form className="booking-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="booking-name">Full Name *</label>
            <input
              type="text"
              id="booking-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="booking-phone">Phone Number *</label>
            <input
              type="tel"
              id="booking-phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (555) 000-0000"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="booking-vehicle">Vehicle (Make, Model, Year) *</label>
            <input
              type="text"
              id="booking-vehicle"
              name="vehicle"
              value={formData.vehicle}
              onChange={handleChange}
              placeholder="e.g. 2022 Toyota Camry"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="booking-service">
              Service Needed *
              {formData.service && (
                <span className="service-autofill-badge">✨ Auto-filled</span>
              )}
            </label>
            <select
              id="booking-service"
              name="service"
              value={formData.service}
              onChange={handleChange}
              required
              className={formData.service ? 'select-prefilled' : ''}
            >
              <option value="">Select a service...</option>
              {services.map(s => (
                <option key={s.id} value={s.name}>
                  {s.name} — ${s.price}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="booking-date">Preferred Date</label>
            <input
              type="date"
              id="booking-date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="booking-notes">Additional Notes</label>
            <input
              type="text"
              id="booking-notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any details about the issue..."
            />
          </div>

          <div className="form-submit">
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? '⏳ Submitting...' : '📅 Confirm Appointment'}
            </button>
          </div>

          {message && (
            <div className={`form-message ${message.type}`}>
              {message.text}
            </div>
          )}
        </form>
      </div>
    </section>
  );
};

export default BookingForm;
