
import React from "react";
import { Route, Routes } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Notifications from "../pages/Notifications";
import Settings from "../pages/Settings";
import Help from "../pages/Help";
import CustomerProfile from "../pages/CustomerProfile";
import AdvisorProfile from "../pages/AdvisorProfile";
import Education from "../pages/Education";
import AllAssets from "../pages/AllAssets";
import Investments from "../pages/Investments";
import PersonalInsurance from "../pages/PersonalInsurance";
import Insurance from "../pages/Insurance";
import NotFound from "../pages/NotFound";
import Properties from "../pages/Properties";
import BillPay from "../pages/BillPay";
import Lending from "../pages/Lending";

const MainRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/help" element={<Help />} />
      <Route path="/profile" element={<CustomerProfile />} />
      <Route path="/advisor-profile" element={<AdvisorProfile />} />
      <Route path="/education" element={<Education />} />
      <Route path="/education/:categoryId" element={<Education />} />
      <Route path="/all-assets" element={<AllAssets />} />
      <Route path="/investments" element={<Investments />} /> 
      <Route path="/investments/alternative/:category" element={<Investments />} />
      <Route path="/investments/alternative/all" element={<Investments />} />
      <Route path="/insurance" element={<Insurance />} />
      <Route path="/personal-insurance" element={<PersonalInsurance />} />
      <Route path="/properties" element={<Properties />} />
      <Route path="/billpay" element={<BillPay />} />
      <Route path="/lending" element={<Lending />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default MainRoutes;
