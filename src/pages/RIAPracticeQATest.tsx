import React from 'react';
import { RIAPracticeNavigationQA } from '@/components/qa/RIAPracticeNavigationQA';
import { CRMPipelineQATest } from '@/components/qa/CRMPipelineQATest';
import { BillingSubscriptionRMDQATest } from '@/components/qa/BillingSubscriptionRMDQATest';
import { ComplianceWorkflowQATest } from '@/components/qa/ComplianceWorkflowQATest';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Users, BarChart3, DollarSign, FileText, Shield, Settings } from 'lucide-react';

export default function RIAPracticeQATest() {
  const expectedFeatures = [
    { name: 'Dashboard', icon: Briefcase, description: 'Practice overview with KPIs and quick actions' },
    { name: 'CRM', icon: Users, description: 'Client and prospect management system' },
    { name: 'Pipeline', icon: BarChart3, description: 'Sales pipeline with Kanban board' },
    { name: 'Billing', icon: DollarSign, description: 'Fee calculation and invoice generation' },
    { name: 'RMD Management', icon: FileText, description: 'Required Minimum Distribution automation' },
    { name: 'Compliance', icon: Shield, description: 'Compliance tracking and audit preparation' },
    { name: 'Analytics', icon: BarChart3, description: 'Performance reporting and insights' },
    { name: 'Settings', icon: Settings, description: 'Practice configuration and preferences' }
  ];

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">RIA Practice Management QA Test</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Comprehensive quality assurance testing for the RIA Practice Management system, 
          including navigation, functionality, and user experience validation.
        </p>
      </div>

      {/* Expected Features Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Expected RIA Practice Features</CardTitle>
          <CardDescription>
            Key modules and functionality that should be available in the RIA Practice system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {expectedFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="p-4 border rounded-lg space-y-2">
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-primary" />
                    <h3 className="font-medium">{feature.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                  <Badge variant="outline" className="text-xs">
                    Core Module
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
        </Card>

        {/* CRM & Pipeline QA Test Component */}
        <CRMPipelineQATest />

        {/* Billing, Subscription & RMD QA Test Component */}
        <BillingSubscriptionRMDQATest />

        {/* Compliance & Workflow QA Test Component */}
        <ComplianceWorkflowQATest />

        {/* Navigation QA Test Component */}
        <RIAPracticeNavigationQA />

      {/* Test Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>QA Test Instructions</CardTitle>
          <CardDescription>
            Manual testing checklist for comprehensive RIA Practice validation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">1. Navigation Testing</h4>
            <ul className="text-sm space-y-1 text-muted-foreground ml-4">
              <li>• Verify all sidebar navigation items are visible and functional</li>
              <li>• Confirm header contains account menu, notifications, and help</li>
              <li>• Test mobile hamburger menu opens and closes properly</li>
              <li>• Ensure all menu items link to real pages (no 404 errors)</li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-2">2. Theme & Responsive Testing</h4>
            <ul className="text-sm space-y-1 text-muted-foreground ml-4">
              <li>• Toggle between dark and light themes</li>
              <li>• Test on mobile, tablet, and desktop viewports</li>
              <li>• Verify navigation adapts appropriately to screen size</li>
              <li>• Confirm touch targets are adequate on mobile devices</li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-2">3. Role-Based Access</h4>
            <ul className="text-sm space-y-1 text-muted-foreground ml-4">
              <li>• Confirm only advisors can access RIA Practice features</li>
              <li>• Test that protected routes require proper authentication</li>
              <li>• Verify role-based menu items display correctly</li>
              <li>• Check that unauthorized users are redirected appropriately</li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-2">4. Module Functionality</h4>
            <ul className="text-sm space-y-1 text-muted-foreground ml-4">
              <li>• Test each module loads without errors</li>
              <li>• Verify KPI cards display mock data appropriately</li>
              <li>• Confirm forms and modals function correctly</li>
              <li>• Check that data tables load and are interactive</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}