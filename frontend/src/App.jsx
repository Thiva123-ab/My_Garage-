import React from 'react';
import ServicesList from './components/ServicesList';
import heroImage from './assets/hero.png';

function App() {
  return (
    <>
      <section className="hero-section">
        <img src={heroImage} alt="Premium Garage Background" className="hero-bg" />
        <div className="hero-content">
          <h1>Elite Garage Services</h1>
          <p>Precision tuning, premium care, and ultimate performance.</p>
          <button className="btn">Explore Services</button>
        </div>
      </section>

      <main className="container">
        <h2 className="section-title">Our Services</h2>
        <ServicesList />
      </main>
    </>
  );
}

export default App;
