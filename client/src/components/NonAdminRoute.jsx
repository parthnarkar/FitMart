import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

const ADMIN_UID = import.meta.env.VITE_ADMIN_UID || "n5LtrXIGVSVjNktRn1PgDXZbHgq1";

export default function NonAdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null;
  // If the signed-in user is the admin, redirect them to the admin dashboard
  if (user && user.uid === ADMIN_UID) return <Navigate to="/admin/dashboard" replace />;
  return children;
}
