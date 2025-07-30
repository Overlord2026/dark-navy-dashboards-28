import React from 'react';
import { QABypassIndicator } from '@/components/security/QABypassIndicator';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      <QABypassIndicator />
      {children}
    </div>
  );
};