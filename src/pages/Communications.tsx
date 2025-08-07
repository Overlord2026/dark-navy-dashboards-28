import React from 'react';
import { CommunicationsActivation } from '@/components/communications/CommunicationsActivation';

export default function Communications() {
  // Default to advisor persona for now - would be determined by user role
  const persona = 'advisor';

  return (
    <div className="container mx-auto p-6">
      <CommunicationsActivation persona={persona} />
    </div>
  );
}