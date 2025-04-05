
import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";

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
      
      {/* Remove login and client-portal routes from here */}
      
      <Route path="/" element={<HomePage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default PublicRoutes;
