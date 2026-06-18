import React from 'react';
import { useAuth, ROLES } from '../context/AuthContext.jsx';
import AdminDashboard from './AdminDashboard';
import MechanicDashboard from './MechanicDashboard';
import ServiceAdvisorDashboard from './ServiceAdvisorDashboard';
import { Navigate } from 'react-router-dom';

const DashboardPage = () => {
  const { user, isLoggedIn } = useAuth();

  if (!isLoggedIn) return <Navigate to="/login" />;

  switch (user.role) {
    case ROLES.ADMIN:
      return <AdminDashboard />;
    case ROLES.MECHANIC:
      return <MechanicDashboard />;
    case ROLES.SERVICE_ADVISOR:
      return <ServiceAdvisorDashboard />;
    default:
      return <Navigate to="/" />;
  }
};

export default DashboardPage;
