// ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element }) => {
  // Check if authUser is in local storage
  const authUser = localStorage.getItem('authUser');

  return authUser ? element : <Navigate to="/" />;
};

export default ProtectedRoute;
