import React from "react";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token) return <Navigate to="/login" />;
  if (!user?.isApproved && window.location.pathname === "/upload") {
    return <Navigate to="/" />;
  }

  return children;
}
