import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const userId = localStorage.getItem("userId");

  // If there is no userId in storage, send them back to login
  if (!userId) {
    return <Navigate to="/" replace />;
  }

  // If they are logged in, show the page they asked for
  return children;
};

export default ProtectedRoute;