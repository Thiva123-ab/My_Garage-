import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ServicesList from './components/ServicesList';
import JobBoard from './components/JobBoard';
import Team from './components/Team';
import Testimonials from './components/Testimonials';
import BookingForm from './components/BookingForm';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <ServicesList />
      <JobBoard />
      <Team />
      <Testimonials />
      <BookingForm />
      <Footer />
    </>
  );
}

export default App;
