
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
];
