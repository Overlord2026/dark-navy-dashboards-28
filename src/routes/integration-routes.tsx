
import React from "react";
import Integration from "@/pages/Integration";
import SecureLogin from "@/pages/SecureLogin";

export const integrationRoutes = [
  {
    path: "/integration",
    element: <Integration />,
  },
  {
    path: "/secure-login",
    element: <SecureLogin />,
  },
  {
    path: "/sign-up",
    element: <SecureLogin />,  // For now, reuse SecureLogin page - can be expanded later
  },
];
