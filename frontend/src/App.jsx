import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { BookingProvider } from './context/BookingContext.jsx';
import Navbar from './components/Navbar';
import StaffRoute from './components/StaffRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import StaffLoginPage from './pages/StaffLoginPage';
import DashboardPage from './pages/DashboardPage';
import Chatbot from './components/Chatbot';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BookingProvider>
          <Router>
            <Navbar />
            <Chatbot />
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />

              {/* Staff-only route — customers are blocked */}
              <Route path="/staff-login" element={<StaffLoginPage />} />
              <Route
                path="/dashboard"
                element={
                  <StaffRoute>
                    <DashboardPage />
                  </StaffRoute>
                }
              />
            </Routes>
          </Router>
        </BookingProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
