
import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import AccountDetails from "../pages/AccountDetails";
import Education from "../pages/Education";
import CourseDetail from "../pages/CourseDetail";
import TaxPlanning from "../pages/TaxPlanning";
import Insurance from "../pages/Insurance";
import Lending from "../pages/Lending";
import Properties from "../pages/Properties";
import Documents from "../pages/Documents";
import Professionals from "../pages/Professionals";
import EstatePlanning from "../pages/EstatePlanning";
import Sharing from "../pages/Sharing";
import Profile from "../pages/Profile";
import Accounts from "../pages/Accounts";
import Investments from "../pages/Investments";
import AllModelPortfolios from "../pages/AllModelPortfolios";
import AllAlternativeInvestments from "../pages/AllAlternativeInvestments";
import AlternativeAssetCategory from "../pages/AlternativeAssetCategory";
import InvestmentBuilder from "../pages/InvestmentBuilder";
import InvestmentPerformance from "../pages/InvestmentPerformance";
import InvestmentRisk from "../pages/InvestmentRisk";
import PortfolioModelDetail from "../pages/PortfolioModelDetail";
import NotFound from "../pages/NotFound";

const MainRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/accounts" element={<Accounts />} />
      <Route path="/accounts/:accountId" element={<AccountDetails />} />
      <Route path="/education" element={<Education />} />
      <Route path="/education/course/:courseId" element={<CourseDetail />} />
      <Route path="/education/tax-planning" element={<TaxPlanning />} />
      <Route path="/insurance" element={<Insurance />} />
      <Route path="/lending" element={<Lending />} />
      <Route path="/properties" element={<Properties />} />
      <Route path="/documents" element={<Documents />} />
      <Route path="/professionals" element={<Professionals />} />
      <Route path="/estate-planning" element={<EstatePlanning />} />
      <Route path="/sharing" element={<Sharing />} />
      <Route path="/profile" element={<Profile />} />
      
      {/* Investment Routes */}
      <Route path="/investments" element={<Investments />} />
      <Route path="/investments/models/all" element={<AllModelPortfolios />} />
      <Route path="/investments/alternative/all" element={<AllAlternativeInvestments />} />
      <Route path="/investments/alternative/:category" element={<AlternativeAssetCategory />} />
      <Route path="/investments/builder" element={<InvestmentBuilder />} />
      <Route path="/investments/performance" element={<InvestmentPerformance />} />
      <Route path="/investments/risk" element={<InvestmentRisk />} />
      <Route path="/investments/models/:modelId" element={<PortfolioModelDetail />} />
      
      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default MainRoutes;
