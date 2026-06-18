import React, { useEffect, useState } from 'react';

const ServicesList = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would be an environment variable
    fetch('http://localhost:3001/api/services')
      .then(res => res.json())
      .then(data => {
        setServices(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch services:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div style={{textAlign: 'center', padding: '2rem'}}>Loading Services...</div>;
  }

  return (
    <div className="services-grid">
      {services.map(service => (
        <div className="service-card" key={service.id}>
          <h3>{service.name}</h3>
          <p>{service.description}</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="price-tag">${service.price}</span>
            <button className="btn" style={{ padding: '0.5rem 1.5rem', fontSize: '0.9rem' }}>Book Now</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServicesList;
