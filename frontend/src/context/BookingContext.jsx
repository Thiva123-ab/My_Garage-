import React, { createContext, useContext, useState } from 'react';

const BookingContext = createContext();

export const useBooking = () => useContext(BookingContext);

export const BookingProvider = ({ children }) => {
  const [selectedService, setSelectedService] = useState('');

  const bookService = (serviceName) => {
    setSelectedService(serviceName);
    // Scroll to booking section
    const bookingEl = document.getElementById('booking');
    if (bookingEl) {
      bookingEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <BookingContext.Provider value={{ selectedService, setSelectedService, bookService }}>
      {children}
    </BookingContext.Provider>
  );
};
