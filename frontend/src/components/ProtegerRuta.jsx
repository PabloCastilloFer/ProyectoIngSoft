import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtegerRuta = ({ element: Element, roles, ...rest }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (!roles.includes(user.roles[0])) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Element {...rest} />;
};

export default ProtegerRuta;
