import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RIAStateLicensing from '@/components/ria/RIAStateLicensing';
import RIALicenseWizard from '@/components/ria/RIALicenseWizard';

export default function RIALicensingPage() {
  return (
    <Routes>
      <Route path="/" element={<RIAStateLicensing />} />
      <Route path="/wizard" element={<RIALicenseWizard />} />
      <Route path="/wizard/:requestId" element={<RIALicenseWizard />} />
    </Routes>
  );
}