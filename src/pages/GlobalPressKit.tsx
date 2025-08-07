import React from 'react';
import { useTranslation } from 'react-i18next';
import PressKitManager from '@/components/campaign/PressKitManager';

const GlobalPressKit: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <PressKitManager />
      </div>
    </div>
  );
};

export default GlobalPressKit;