import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductionReadinessTest } from "@/components/testing/ProductionReadinessTest";
import { StripeWebhookTest } from "@/components/testing/StripeWebhookTest";
import { AnalyticsChecklist } from "@/components/testing/AnalyticsChecklist";
import { PlaidConnectionTest } from "@/components/accounts/PlaidConnectionTest";
import { PlaidDiagnosticRunner } from "@/components/testing/PlaidDiagnosticRunner";
import { PlaidEnvironmentChecker } from "@/components/testing/PlaidEnvironmentChecker";
import { PlaidSecretTester } from "@/components/testing/PlaidSecretTester";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProductionTest() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Production Readiness Testing</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Comprehensive testing suite for validating Stripe, Plaid, Analytics, and Database integrations
          before staging deployment.
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="stripe">Stripe</TabsTrigger>
          <TabsTrigger value="plaid">Plaid</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <ProductionReadinessTest />
          
          <Card>
            <CardHeader>
              <CardTitle>UAT Acceptance Criteria</CardTitle>
              <CardDescription>
                Complete these requirements before staging deployment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">🏦 Stripe Integration</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>✓ Checkout session creation</li>
                      <li>✓ Customer portal access</li>
                      <li>✓ Webhook endpoint handling</li>
                      <li>✓ Subscription management</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">🔗 Plaid Integration</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>✓ Link token generation</li>
                      <li>✓ Account linking flow</li>
                      <li>✓ Account sync functionality</li>
                      <li>✓ Error handling</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">📊 Analytics Tracking</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>✓ Core events (login, page view)</li>
                      <li>✓ Business events (payments, conversions)</li>
                      <li>✓ Error tracking</li>
                      <li>✓ PostHog dashboard verification</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">⚡ Database Performance</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>✓ Query performance &lt; 2s</li>
                      <li>✓ No timeout errors</li>
                      <li>✓ Proper indexing</li>
                      <li>✓ RLS policies working</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stripe" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Stripe Test Checklist</CardTitle>
                <CardDescription>Production integration validation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Required Environment Variables:</h4>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• STRIPE_SECRET_KEY (live_sk_...)</li>
                    <li>• STRIPE_WEBHOOK_SECRET</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Test Scenarios:</h4>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• New customer subscription</li>
                    <li>• Existing customer subscription</li>
                    <li>• Subscription cancellation</li>
                    <li>• Payment method update</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Live Payment Test</CardTitle>
                <CardDescription>Test with actual Stripe configuration</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-amber-700 bg-amber-50 p-3 rounded border mb-4">
                  ⚠️ This will create real Stripe sessions. Use test mode or small amounts.
                </p>
                <div className="space-y-2 text-sm">
                  <p><strong>Test Card:</strong> 4242 4242 4242 4242</p>
                  <p><strong>Expiry:</strong> Any future date</p>
                  <p><strong>CVC:</strong> Any 3 digits</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="plaid" className="space-y-6">
          <PlaidSecretTester />
          <PlaidEnvironmentChecker />
          <PlaidDiagnosticRunner />
          <PlaidConnectionTest />
        </TabsContent>

        <TabsContent value="analytics">
          <AnalyticsChecklist />
        </TabsContent>

        <TabsContent value="webhooks">
          <StripeWebhookTest />
        </TabsContent>
      </Tabs>
    </div>
  );
}