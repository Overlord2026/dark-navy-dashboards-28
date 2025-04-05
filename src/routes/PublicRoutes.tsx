
import React from "react";
import { Route, Routes } from "react-router-dom";

// Import pages
import HomePage from "../pages/HomePage";
import ServicesPage from "../pages/ServicesPage";
import AboutUsPage from "../pages/AboutUsPage";
import TeamPage from "../pages/TeamPage";
import CareersPage from "../pages/CareersPage";
import ContactPage from "../pages/ContactPage";
import PrivacyPolicyPage from "../pages/PrivacyPolicyPage";
import TermsOfServicePage from "../pages/TermsOfServicePage";
import DisclosuresPage from "../pages/DisclosuresPage";
import AccessibilityPage from "../pages/AccessibilityPage";
import LoginPage from "../pages/LoginPage";
import ClientPortal from "../pages/ClientPortal";
import NotFound from "../pages/NotFound";

const PublicRoutes = () => {
  return (
    <Routes>
      <Route path="/home" element={<HomePage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/about" element={<AboutUsPage />} />
      <Route path="/team" element={<TeamPage />} />
      <Route path="/careers" element={<CareersPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      <Route path="/terms-of-service" element={<TermsOfServicePage />} />
      <Route path="/disclosures" element={<DisclosuresPage />} />
      <Route path="/accessibility" element={<AccessibilityPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/client-portal" element={<ClientPortal />} />
      <Route path="/" element={<HomePage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default PublicRoutes;
