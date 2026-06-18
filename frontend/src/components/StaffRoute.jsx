import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, isStaffRole } from '../context/AuthContext.jsx';

/**
 * StaffRoute — Only allows staff roles (admin, mechanic, service_advisor).
 * Customers are redirected to the home page.
 * Unauthenticated users are redirected to staff login.
 */
const StaffRoute = ({ children }) => {
  const { user, isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/staff-login" replace />;
  }

  if (!isStaffRole(user.role)) {
    // Customer tried to access staff dashboard — send them home
    return <Navigate to="/" replace />;
  }

  return children;
};

export default StaffRoute;
