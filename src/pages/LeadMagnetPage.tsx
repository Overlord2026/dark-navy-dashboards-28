import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LeadMagnetLanding } from '@/components/lead-magnet/LeadMagnetLanding';
import { ThankYouPage } from '@/components/lead-magnet/ThankYouPage';
import { supabase } from '@/integrations/supabase/client';

interface LeadMagnetFormData {
  name: string;
  email: string;
  phone?: string;
  persona: string;
}

export const LeadMagnetPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'landing' | 'thankyou'>('landing');
  const [leadData, setLeadData] = useState<LeadMagnetFormData | null>(null);
  const navigate = useNavigate();

  const handleFormSubmit = async (data: LeadMagnetFormData) => {
    try {
      // Call edge function to process lead magnet signup
      const { error } = await supabase.functions.invoke('process-lead-magnet', {
        body: {
          name: data.name,
          email: data.email,
          phone: data.phone || null,
          persona: data.persona,
          source: 'lead_magnet_download'
        }
      });

      if (error) throw error;

      setLeadData(data);
      setCurrentStep('thankyou');
    } catch (error) {
      console.error('Error processing lead magnet:', error);
      throw error;
    }
  };

  const handleAccessDashboard = () => {
    // Navigate to appropriate dashboard based on persona
    const dashboardRoutes: Record<string, string> = {
      client: '/client-dashboard',
      advisor: '/advisor-dashboard',
      cpa: '/cpa-dashboard',
      attorney: '/attorney-dashboard',
      insurance_agent: '/insurance-dashboard',
      healthcare_consultant: '/healthcare-dashboard',
      realtor: '/property-dashboard',
      enterprise_admin: '/admin-dashboard',
      coach: '/consultant-dashboard'
    };

    const route = dashboardRoutes[leadData?.persona || 'client'] || '/client-dashboard';
    navigate(route);
  };

  const downloadUrl = 'https://example.com/bfo-wealth-health-playbook.pdf'; // This should be the actual PDF URL

  if (currentStep === 'thankyou' && leadData) {
    return (
      <ThankYouPage
        userName={leadData.name}
        persona={leadData.persona}
        downloadUrl={downloadUrl}
        onAccessDashboard={handleAccessDashboard}
      />
    );
  }

  return <LeadMagnetLanding onSubmit={handleFormSubmit} />;
};