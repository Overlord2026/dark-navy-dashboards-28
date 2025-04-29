
import { lazy } from "react";
import { Route } from "react-router-dom";
import Dashboard from "@/pages/dashboard"; // Fixed casing issue here

const dashboardRoutes = (
  <Route path="/dashboard" element={<Dashboard />} />
);

export default dashboardRoutes;
