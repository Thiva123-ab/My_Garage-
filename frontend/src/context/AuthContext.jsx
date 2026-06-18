import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Available roles
export const ROLES = {
  CUSTOMER: 'customer',
  ADMIN: 'admin',
  MECHANIC: 'mechanic',
  SERVICE_ADVISOR: 'service_advisor',
};

// Staff roles — customers are NOT in this list
export const STAFF_ROLES = [ROLES.ADMIN, ROLES.MECHANIC, ROLES.SERVICE_ADVISOR];

export const ROLE_INFO = {
  [ROLES.CUSTOMER]: {
    label: 'Customer',
    icon: '👤',
    color: '#00d4ff',
    description: 'Browse services, book appointments, track your vehicle',
    isStaff: false,
  },
  [ROLES.ADMIN]: {
    label: 'Admin',
    icon: '🛡️',
    color: '#7c3aed',
    description: 'Manage all operations, users, inventory, and reports',
    isStaff: true,
    passcode: '1234', // demo passcode — change in production
  },
  [ROLES.MECHANIC]: {
    label: 'Mechanic',
    icon: '👨‍🔧',
    color: '#ff9100',
    description: 'View assigned jobs, update repair status, log parts',
    isStaff: true,
    passcode: '5678',
  },
  [ROLES.SERVICE_ADVISOR]: {
    label: 'Service Advisor',
    icon: '📋',
    color: '#00e676',
    description: 'Handle bookings, assign jobs, communicate with customers',
    isStaff: true,
    passcode: '9012',
  },
};

export const isStaffRole = (role) => STAFF_ROLES.includes(role);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('mygarage-user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (name, role) => {
    const userData = { name, role };
    setUser(userData);
    localStorage.setItem('mygarage-user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mygarage-user');
  };

  const switchRole = (role) => {
    if (user) {
      const updated = { ...user, role };
      setUser(updated);
      localStorage.setItem('mygarage-user', JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, switchRole, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
