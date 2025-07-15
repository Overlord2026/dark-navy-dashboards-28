import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HealthcareDashboard from '@/pages/healthcare/HealthcareDashboard';
import MedicalRecords from '@/pages/healthcare/MedicalRecords';
import HealthMetrics from '@/pages/healthcare/HealthMetrics';

// Legacy health routes (keeping for backward compatibility)
import HealthDashboard from "@/pages/health/HealthDashboard";
import HSAAccounts from "@/pages/health/HSAAccounts";
import HSACalculator from "@/pages/health/HSACalculator";
import DailyMetrics from "@/pages/health/DailyMetrics";
import LabBiomarkers from "@/pages/health/LabBiomarkers";
import Epigenetics from "@/pages/health/Epigenetics";
import Screenings from "@/pages/health/Screenings";
import TrendsCoach from "@/pages/health/TrendsCoach";
import Providers from "@/pages/health/Providers";
import ShareData from "@/pages/health/ShareData";
import Medications from "@/pages/health/Medications";
import Supplements from "@/pages/health/Supplements";
import DocsDirectives from "@/pages/health/DocsDirectives";
import CoachingKB from "@/pages/health/CoachingKB";
import EducationKB from "@/pages/health/EducationKB";
import RecommendationsKB from "@/pages/health/RecommendationsKB";
import HealthSettings from "@/pages/health/HealthSettings";

export const HealthcareRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main healthcare routes */}
      <Route index element={<HealthcareDashboard />} />
      <Route path="records" element={<MedicalRecords />} />
      <Route path="metrics" element={<HealthMetrics />} />
      
      {/* Legacy health routes for backward compatibility */}
      <Route path="dashboard" element={<HealthDashboard />} />
      <Route path="hsa/accounts" element={<HSAAccounts />} />
      <Route path="hsa/calculator" element={<HSACalculator />} />
      <Route path="tracking/daily" element={<DailyMetrics />} />
      <Route path="tracking/biomarkers" element={<LabBiomarkers />} />
      <Route path="tracking/epigenetics" element={<Epigenetics />} />
      <Route path="tracking/screenings" element={<Screenings />} />
      <Route path="insights/trends" element={<TrendsCoach />} />
      <Route path="care/providers" element={<Providers />} />
      <Route path="care/share" element={<ShareData />} />
      <Route path="pharmacy/meds" element={<Medications />} />
      <Route path="pharmacy/supps" element={<Supplements />} />
      <Route path="docs" element={<DocsDirectives />} />
      <Route path="knowledge/coaching" element={<CoachingKB />} />
      <Route path="knowledge/education" element={<EducationKB />} />
      <Route path="knowledge/recommendations" element={<RecommendationsKB />} />
      <Route path="settings" element={<HealthSettings />} />
      
      {/* Coming soon placeholders for future routes */}
      <Route 
        path="hsa-accounts" 
        element={
          <div className="p-6 min-h-screen bg-background">
            <h1 className="text-2xl font-bold">HSA Accounts - Coming Soon</h1>
          </div>
        } 
      />
      <Route 
        path="savings" 
        element={
          <div className="p-6 min-h-screen bg-background">
            <h1 className="text-2xl font-bold">Healthcare Savings - Coming Soon</h1>
          </div>
        } 
      />
      <Route 
        path="providers" 
        element={
          <div className="p-6 min-h-screen bg-background">
            <h1 className="text-2xl font-bold">Healthcare Providers - Coming Soon</h1>
          </div>
        } 
      />
      <Route 
        path="medications" 
        element={
          <div className="p-6 min-h-screen bg-background">
            <h1 className="text-2xl font-bold">Medications - Coming Soon</h1>
          </div>
        } 
      />
      <Route 
        path="supplements" 
        element={
          <div className="p-6 min-h-screen bg-background">
            <h1 className="text-2xl font-bold">Supplements - Coming Soon</h1>
          </div>
        } 
      />
      <Route 
        path="healthspan" 
        element={
          <div className="p-6 min-h-screen bg-background">
            <h1 className="text-2xl font-bold">HealthSpan Expansion - Coming Soon</h1>
          </div>
        } 
      />
      <Route 
        path="documents" 
        element={
          <div className="p-6 min-h-screen bg-background">
            <h1 className="text-2xl font-bold">Healthcare Documents - Coming Soon</h1>
          </div>
        } 
      />
      <Route 
        path="knowledge" 
        element={
          <div className="p-6 min-h-screen bg-background">
            <h1 className="text-2xl font-bold">Knowledge & Support - Coming Soon</h1>
          </div>
        } 
      />
      <Route 
        path="share-data" 
        element={
          <div className="p-6 min-h-screen bg-background">
            <h1 className="text-2xl font-bold">Share Data - Coming Soon</h1>
          </div>
        } 
      />
    </Routes>
  );
};
