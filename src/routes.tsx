
import React from "react";
import { createBrowserRouter } from "react-router-dom";
import { IndexPage } from "@/routes/IndexPage";
import { Dashboard } from "@/routes/Dashboard";
import { Settings } from "@/routes/Settings";
import { Professionals } from "@/routes/Professionals";
import { DebugPage } from "@/routes/DebugPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <IndexPage />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },
  {
    path: "/professionals",
    element: <Professionals />,
  },
  {
    path: "/debug",
    element: <DebugPage />,
  },
]);
