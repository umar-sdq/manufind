import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../AuthContext/AuthContext.jsx";

const ProtectedRoute = ({ allowedRoles }) => {
  const { authData } = useAuth();

  if (!authData) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(authData.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
