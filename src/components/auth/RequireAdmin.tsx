import React from 'react';
import { Navigate } from 'react-router-dom';

export default function RequireAdmin({ children }: { children: React.ReactNode }) {
  // TODO: swap this for your real role check
  const isAdmin = true;
  return isAdmin ? <>{children}</> : <Navigate to="/" replace />;
}