// SecureRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AppContext } from './context/AppContext'; // Adjust import path as necessary

const SecureRoute = ({ element, ...rest }) => {
  const { state } = useContext(AppContext); // Access context to get user state

  // Check if user is admin
  const isAdmin = state?.role === 'admin';

  return isAdmin ? element : <Navigate to="/" />;
};

export default SecureRoute;
