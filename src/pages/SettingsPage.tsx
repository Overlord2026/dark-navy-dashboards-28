import React, { useState } from 'react';
import { SettingsLayout } from '@/components/settings/SettingsLayout';
import { AccountSettings } from '@/components/settings/AccountSettings';
import { SubscriptionSettings } from '@/components/settings/SubscriptionSettings';
import { SecuritySettings } from '@/components/settings/SecuritySettings';
import { NotificationSettings } from '@/components/settings/NotificationSettings';

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState('account');

  const renderContent = () => {
    switch (activeTab) {
      case 'account':
        return <AccountSettings />;
      case 'subscription':
        return <SubscriptionSettings />;
      case 'security':
        return <SecuritySettings />;
      case 'notifications':
        return <NotificationSettings />;
      default:
        return <AccountSettings />;
    }
  };

  return (
    <SettingsLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </SettingsLayout>
  );
}