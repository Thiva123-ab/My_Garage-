import React, { useState, useEffect } from 'react';
import hero1 from '../assets/hero1.png';
import hero2 from '../assets/hero2.png';
import hero3 from '../assets/hero3.png';

const slides = [
  {
    img: hero1,
    tagline: '🏆 Trusted by 5,000+ Vehicle Owners',
    headline: <>Expert Vehicle <span className="gradient-text">Repair &amp; Service</span></>,
    sub: 'From engine overhauls to precision diagnostics — our certified mechanics deliver top-tier automotive care with cutting-edge equipment.',
  },
  {
    img: hero2,
    tagline: '🔧 State-of-the-Art Facility',
    headline: <>Your Car Deserves <span className="gradient-text">the Best</span></>,
    sub: 'We use the latest diagnostic computers and professional tools to get your vehicle back on the road quickly and safely.',
  },
  {
    img: hero3,
    tagline: '⚡ Fast, Reliable & Transparent',
    headline: <>Premium Service, <span className="gradient-text">Honest Pricing</span></>,
    sub: 'No hidden fees, no surprises. Get a full quote before we start — and watch your car transform in our modern workshop.',
  },
];

const Hero = () => {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      goNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [current]);

  const goTo = (index) => {
    if (index === current) return;
    setFading(true);
    setTimeout(() => {
      setCurrent(index);
      setFading(false);
    }, 400);
  };

  const goNext = () => goTo((current + 1) % slides.length);
  const goPrev = () => goTo((current - 1 + slides.length) % slides.length);

  const slide = slides[current];

  return (
    <section className="hero" id="home">
      {/* Background images — preload all, show current */}
      {slides.map((s, i) => (
        <img
          key={i}
          src={s.img}
          alt={`Garage background ${i + 1}`}
          className={`hero-bg hero-bg-slide ${i === current ? 'hero-bg-active' : ''}`}
          style={{ opacity: i === current ? 1 : 0 }}
        />
      ))}

      {/* Multi-layer dramatic overlay */}
      <div className="hero-overlay" />
      <div className="hero-overlay-gradient" />
      <div className="hero-overlay-vignette" />

      {/* Animated accent particles */}
      <div className="hero-particles">
        <div className="particle particle-1" />
        <div className="particle particle-2" />
        <div className="particle particle-3" />
      </div>

      {/* Main content */}
      <div className={`hero-content ${fading ? 'hero-content-fading' : ''}`}>
        <div className="hero-badge">{slide.tagline}</div>
        <h1>{slide.headline}</h1>
        <p className="hero-subtitle">{slide.sub}</p>

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
            <div className="stat-number">4.9⭐</div>
            <div className="stat-label">Star Rating</div>
          </div>
        </div>
      </div>

      {/* Slide controls */}
      <button className="hero-arrow hero-arrow-left" onClick={goPrev} aria-label="Previous slide">‹</button>
      <button className="hero-arrow hero-arrow-right" onClick={goNext} aria-label="Next slide">›</button>

      {/* Dot indicators */}
      <div className="hero-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`hero-dot ${i === current ? 'active' : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className="hero-slide-counter">
        {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
      </div>

      {/* Scroll indicator */}
      <div className="hero-scroll-hint">
        <span>Scroll</span>
        <div className="scroll-line" />
      </div>
    </section>
  );
};

export default Hero;
