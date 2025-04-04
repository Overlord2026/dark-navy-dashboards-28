import React from "react";
import { Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Notifications from "../pages/Notifications";
import Settings from "../pages/Settings";
import Help from "../pages/Help";
import CustomerProfile from "../pages/CustomerProfile";
import AdvisorProfile from "../pages/AdvisorProfile";
import Education from "../pages/Education";
import AllAssets from "../pages/AllAssets";
import NotFound from "../pages/NotFound";

const MainRoutes = () => {
  return (
    <>
      <Route path="/" element={<Dashboard />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/help" element={<Help />} />
      <Route path="/profile" element={<CustomerProfile />} />
      <Route path="/advisor-profile" element={<AdvisorProfile />} />
      <Route path="/education" element={<Education />} />
      <Route path="/education/:categoryId" element={<Education />} />
      <Route path="/all-assets" element={<AllAssets />} />
      <Route path="*" element={<NotFound />} />
    </>
  );
};

export default MainRoutes;
