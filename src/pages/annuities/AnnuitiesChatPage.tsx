import React from 'react';
import { UnderConstructionPage } from '@/components/ui/UnderConstructionPage';

export function AnnuitiesChatPage() {
  return (
    <UnderConstructionPage
      featureName="Annuities AI Assistant"
      expectedDate="Q1 2024"
      description="AI-powered chat assistant for annuities questions, product recommendations, and strategy guidance."
      roadmapItems={[
        'Natural language annuity analysis',
        'Product recommendation engine',
        'Risk assessment chatbot',
        'Compliance-checked responses',
        'Multi-language support'
      ]}
      showNotificationSignup={true}
    />
  );
}