import React from 'react';
import Hero from '../components/Hero';
import ServicesList from '../components/ServicesList';
import JobBoard from '../components/JobBoard';
import Team from '../components/Team';
import Testimonials from '../components/Testimonials';
import BookingForm from '../components/BookingForm';
import Footer from '../components/Footer';

const HomePage = () => {
  return (
    <>
      <Hero />
      <ServicesList />
      <JobBoard />
      <Team />
      <Testimonials />
      <BookingForm />
      <Footer />
    </>
  );
};

export default HomePage;
