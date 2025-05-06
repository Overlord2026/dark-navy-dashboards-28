
import React from "react";
import { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Landing from "@/pages/Landing";
import SecureLogin from "@/pages/SecureLogin";

export const publicRoutes: RouteObject[] = [
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/login",
    element: <Navigate to="/secure-login" replace />,
  },
  {
    path: "/advisor/login",
    element: <Navigate to="/secure-login?advisor=true" replace />,
  },
  {
    path: "/secure-login",
    element: <SecureLogin />,
  },
];
