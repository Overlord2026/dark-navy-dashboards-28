import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function TermsOfServicePage() {
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
            <CardTitle className="text-3xl">Terms of Service</CardTitle>
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
              <p>By using our family office platform, you agree to these terms. Our services are designed for sophisticated investors and require compliance with applicable regulations.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. Service Description</h2>
              <p>We provide financial planning tools, investment management resources, and family office administration services. Our platform facilitates communication between clients and their professional advisors.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. User Responsibilities</h2>
              <p>Users must provide accurate information, maintain account security, comply with applicable laws, and use the platform only for its intended purposes.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Financial Disclaimers</h2>
              <p>Our tools provide estimates and analysis but do not constitute financial advice. Always consult with qualified professionals before making investment decisions. Past performance does not guarantee future results.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Intellectual Property</h2>
              <p>All platform content, tools, and features are proprietary. Users receive a limited license to use our services but may not copy, distribute, or reverse engineer our technology.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Limitation of Liability</h2>
              <p>Our liability is limited to the extent permitted by law. We are not responsible for investment losses, market fluctuations, or decisions made based on platform information.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Contact Information</h2>
              <p>For legal matters, contact legal@familyoffice.com or (555) 123-4567.</p>
            </section>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}