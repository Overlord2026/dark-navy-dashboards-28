import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PropertyManagerUserFlows() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Property Manager User Flows</h1>
        <p className="text-muted-foreground">
          Visual workflows for key property management processes.
        </p>
      </div>

      {/* Onboarding Flow */}
      <Card>
        <CardHeader>
          <CardTitle>Property Manager Onboarding Flow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-4 bg-muted rounded-lg">
            <p className="text-sm font-mono">
              Welcome Modal → Profile Setup → Portfolio Import → Client Linking → 
              Compliance Checklist → Preview/Activate Listing → Success Animation + Badge → 
              Marketplace Access + Next Steps
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            This flow guides new property managers through the complete onboarding process, 
            from initial welcome to marketplace activation with celebration effects.
          </p>
        </CardContent>
      </Card>

      {/* Lead Management Flow */}
      <Card>
        <CardHeader>
          <CardTitle>Property Assignment & Lead Management Flow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-4 bg-muted rounded-lg">
            <p className="text-sm font-mono">
              Dashboard → New Lead Notification → Review Lead Details → 
              Assign Agent/Team → Send Proposal or Invite Family → 
              Ongoing Collaboration/Docs → Closed/Active Property Status
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            This workflow shows how property managers handle incoming leads from families, 
            assign them to team members, and manage the entire client lifecycle.
          </p>
        </CardContent>
      </Card>

      {/* VIP Activation Flow */}
      <Card>
        <CardHeader>
          <CardTitle>VIP Activation & Marketplace Integration Flow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-4 bg-muted rounded-lg">
            <p className="text-sm font-mono">
              Admin Uploads List → Automated Welcome Sent → Manager Clicks Activation Link → 
              Profile Setup → Portfolio Import → Client/Team Assignment → 
              Marketplace Listing Live → VIP Wall Placement & Ongoing Nurture/Support
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            This flow illustrates the complete VIP activation process from admin invitation 
            to marketplace listing and ongoing engagement.
          </p>
        </CardContent>
      </Card>

      {/* Property Management Workflow */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Property Management Workflow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-4 bg-muted rounded-lg">
            <p className="text-sm font-mono">
              Daily Dashboard Login → Check Notifications → 
              [If Yes: Review Alerts → Handle Maintenance/Rent/Communications] 
              [If No: Check Property Status → Review Financial Reports] → 
              Update Property Records → End of Day Summary
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            This workflow shows the typical daily routine for property managers using the platform,
            from login to end-of-day summary with all key touchpoints.
          </p>
        </CardContent>
      </Card>

      {/* Client Onboarding Flow */}
      <Card>
        <CardHeader>
          <CardTitle>Family/Client Onboarding to Platform</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-4 bg-muted rounded-lg">
            <p className="text-sm font-mono">
              PM Invites Family → Family Receives Invitation → Family Creates Account → 
              Property Assignment → Document Sharing Setup → Communication Preferences → 
              Dashboard Access Granted → Ongoing Collaboration
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            This flow demonstrates how property managers onboard their family office clients 
            to the platform for enhanced collaboration and transparency.
          </p>
        </CardContent>
      </Card>

      {/* Maintenance Request Flow */}
      <Card>
        <CardHeader>
          <CardTitle>Maintenance Request & Resolution Flow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-4 bg-muted rounded-lg">
            <p className="text-sm font-mono">
              Maintenance Issue Reported → PM Receives Notification → Assess Urgency → 
              [If Emergency: Immediate Contractor Contact → Real-time Updates to Family] 
              [If Routine: Schedule Maintenance → Vendor Assignment] → 
              Work Completion Tracking → Quality Review & Photos → Invoice Processing → 
              Family Notification Complete
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            This workflow shows how maintenance requests flow through the system from initial 
            report to completion, with different paths for emergency vs. routine issues.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}