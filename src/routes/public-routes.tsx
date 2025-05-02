
import React from "react";
import { RouteObject } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import SecureLogin from "@/pages/SecureLogin";

export const publicRoutes: RouteObject[] = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/secure-login",
    element: <SecureLogin />,
  },
  {
    path: "/advisor/login",
    element: <LoginPage isAdvisor={true} />,
  },
];
