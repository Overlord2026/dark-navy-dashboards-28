import React from 'react';
import { useTranslation } from 'react-i18next';
import OutreachManager from '@/components/campaign/OutreachManager';

const GlobalOutreach: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <OutreachManager />
      </div>
    </div>
  );
};

export default GlobalOutreach;