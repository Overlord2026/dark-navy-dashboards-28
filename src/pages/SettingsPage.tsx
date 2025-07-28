import React, { useState } from 'react';
import { SettingsLayout } from '@/components/settings/SettingsLayout';
import { AccountSettings } from '@/components/settings/AccountSettings';
import { SubscriptionSettings } from '@/components/settings/SubscriptionSettings';
import { SecuritySettings } from '@/components/settings/SecuritySettings';
import { NotificationSettings } from '@/components/settings/NotificationSettings';
import { PersonalizationSettings } from '@/components/settings/PersonalizationSettings';
import { SupportHelpSettings } from '@/components/settings/SupportHelpSettings';
import { PrivacyDataSettings } from '@/components/settings/PrivacyDataSettings';

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
      case 'personalization':
        return <PersonalizationSettings />;
      case 'support':
        return <SupportHelpSettings />;
      case 'legal':
        return <PrivacyDataSettings />;
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