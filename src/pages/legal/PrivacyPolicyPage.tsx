import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function PrivacyPolicyPage() {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Privacy Policy</CardTitle>
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
              <p>We collect information you provide directly, such as account registration details, financial data for planning purposes, and communication preferences. We also collect usage data to improve our services.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
              <p>Your information is used to provide financial planning services, communicate important updates, ensure platform security, and comply with regulatory requirements. We never sell your personal data.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. Data Security</h2>
              <p>We implement industry-standard encryption, secure data centers, regular security audits, and strict access controls to protect your sensitive financial information.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Third-Party Services</h2>
              <p>We work with trusted partners like Plaid for account connectivity and Stripe for payments. These services have their own privacy policies and security measures.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Your Rights</h2>
              <p>You have the right to access, correct, or delete your personal information. You may also opt-out of certain communications and request data portability where applicable.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Contact Us</h2>
              <p>For privacy-related questions, contact us at privacy@familyoffice.com or (555) 123-4567.</p>
            </section>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}