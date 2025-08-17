import React from 'react';
import { ProSegment } from '@/lib/persona';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface ProQuickActionsProps {
  segment: ProSegment;
}

const SEGMENT_ACTIONS = {
  'advisor': [
    { title: 'Client Portal Setup', description: 'Configure client access portal', action: 'Setup Portal' },
    { title: 'Compliance Dashboard', description: 'View compliance status', action: 'Open Dashboard' },
    { title: 'AdvisorOS', description: 'Access full practice management', action: 'Launch OS', link: '/pros/solutions/advisor-os' }
  ],
  'cpa': [
    { title: 'Tax Workflow Setup', description: 'Configure tax preparation flow', action: 'Setup Workflow' },
    { title: 'Client Document Portal', description: 'Share secure documents', action: 'Open Portal' },
    { title: 'AccountingOS', description: 'Full accounting practice suite', action: 'Launch OS', link: '/pros/solutions/accounting-os' }
  ],
  'attorney-estate': [
    { title: 'Document Assembly', description: 'Generate estate documents', action: 'Start Assembly' },
    { title: 'Trust Administration', description: 'Manage trust accounts', action: 'Open Dashboard' },
    { title: 'LegalOS', description: 'Complete legal practice management', action: 'Launch OS', link: '/pros/solutions/legal-os' }
  ],
  'realtor': [
    { title: 'Lead Management', description: 'Track potential clients', action: 'View Leads' },
    { title: 'Transaction Pipeline', description: 'Monitor active deals', action: 'Open Pipeline' },
    { title: 'RealtorOS', description: 'Complete real estate toolkit', action: 'Launch OS', link: '/pros/solutions/realtor-os' }
  ],
  'insurance-medicare': [
    { title: 'Plan Comparison Tool', description: 'Compare Medicare plans', action: 'Open Tool' },
    { title: 'Enrollment Tracking', description: 'Track client enrollments', action: 'View Status' },
    { title: 'Compliance Guide', description: 'Medicare recording compliance tips', action: 'View Guide' }
  ]
};

export function ProQuickActions({ segment }: ProQuickActionsProps) {
  const actions = SEGMENT_ACTIONS[segment] || SEGMENT_ACTIONS['advisor'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>
          Essential tools and workflows for your practice
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {actions.map((action, index) => (
          <div key={index} className="p-4 border rounded-lg space-y-2">
            <h4 className="font-semibold">{action.title}</h4>
            <p className="text-sm text-muted-foreground">{action.description}</p>
            {action.link ? (
              <Link to={action.link}>
                <Button variant="outline" size="sm" className="w-full">
                  {action.action}
                </Button>
              </Link>
            ) : (
              <Button variant="outline" size="sm" className="w-full">
                {action.action}
              </Button>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}