import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, Database, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function DataProcessingPage() {
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
            <CardTitle className="text-3xl flex items-center gap-3">
              <Database className="h-8 w-8 text-primary" />
              Data Processing Agreement
            </CardTitle>
            <p className="text-muted-foreground">GDPR and CCPA compliance information</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardContent className="pt-6">
                  <Shield className="h-8 w-8 text-green-600 mb-3" />
                  <h3 className="font-semibold mb-2">Data Protection</h3>
                  <p className="text-sm text-muted-foreground">Bank-level encryption and security protocols</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <Eye className="h-8 w-8 text-blue-600 mb-3" />
                  <h3 className="font-semibold mb-2">Transparency</h3>
                  <p className="text-sm text-muted-foreground">Clear data usage and retention policies</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <Database className="h-8 w-8 text-purple-600 mb-3" />
                  <h3 className="font-semibold mb-2">Data Rights</h3>
                  <p className="text-sm text-muted-foreground">Access, portability, and deletion rights</p>
                </CardContent>
              </Card>
            </div>

            <div className="prose prose-sm max-w-none space-y-6">
              <section>
                <h2 className="text-xl font-semibold mb-3">Legal Basis for Processing</h2>
                <p>We process personal data based on:</p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Contractual necessity for service delivery</li>
                  <li>Legitimate interests in platform improvement</li>
                  <li>Regulatory compliance requirements</li>
                  <li>Explicit consent for marketing communications</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">Data Categories</h2>
                <p>We process the following types of data:</p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Identity and contact information</li>
                  <li>Financial data for planning purposes</li>
                  <li>Usage analytics and performance metrics</li>
                  <li>Communication and support records</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">Data Retention</h2>
                <p>Data is retained according to:</p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Active account: Duration of service relationship</li>
                  <li>Inactive account: 7 years for regulatory compliance</li>
                  <li>Marketing data: Until consent is withdrawn</li>
                  <li>Analytics data: 24 months maximum</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">International Transfers</h2>
                <p>Data may be transferred to secure facilities in the US and EU with appropriate safeguards including Standard Contractual Clauses and adequacy decisions.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">Your Rights</h2>
                <p>Under GDPR and CCPA, you have rights to access, rectify, erase, restrict, port, and object to processing. Contact privacy@familyoffice.com to exercise these rights.</p>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}