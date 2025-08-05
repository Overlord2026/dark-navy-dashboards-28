import React, { useState } from 'react';
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ContactBook } from '@/components/crm/ContactBook';
import { PipelineManager } from '@/components/crm/PipelineManager';
import { ActivityFeed } from '@/components/crm/ActivityFeed';
import { SmartReminders } from '@/components/crm/SmartReminders';
import { CRMAnalytics } from '@/components/crm/CRMAnalytics';
import { ImportExport } from '@/components/crm/ImportExport';
import { SWAGLeadScoreCard } from '@/components/leads/SWAGLeadScoreCard';
import { SWAGViralShare } from '@/components/leads/SWAGViralShare';
import { Users, ArrowRightLeft, Activity, Bell, BarChart3, Upload, Trophy, Share2 } from 'lucide-react';

export default function CRMDashboard() {
  const [activeTab, setActiveTab] = useState('contacts');

  return (
    <ThreeColumnLayout title="CRM Dashboard">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">CRM Dashboard</h1>
            <p className="text-muted-foreground">
              Unified contact management and pipeline tracking
            </p>
          </div>
        </div>

        {/* CRM Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="contacts" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Contacts
            </TabsTrigger>
            <TabsTrigger value="swag-leads" className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-gold" />
              SWAG Leads™
            </TabsTrigger>
            <TabsTrigger value="pipeline" className="flex items-center gap-2">
              <ArrowRightLeft className="h-4 w-4" />
              Pipeline
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Activity
            </TabsTrigger>
            <TabsTrigger value="reminders" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Reminders
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="viral-share" className="flex items-center gap-2">
              <Share2 className="h-4 w-4 text-emerald" />
              Share SWAG
            </TabsTrigger>
            <TabsTrigger value="import" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Import/Export
            </TabsTrigger>
          </TabsList>

          <TabsContent value="contacts" className="mt-6">
            <ContactBook />
          </TabsContent>

          <TabsContent value="swag-leads" className="mt-6">
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-gold/10 to-emerald/10 rounded-lg p-4 border border-gold/20">
                <h3 className="text-lg font-semibold text-deep-blue mb-2 flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-gold" />
                  SWAG Lead Score™ Dashboard
                </h3>
                <p className="text-muted-foreground">
                  Strategic Wealth Alpha GPS™ - Your AI-powered lead qualification system. Got SWAG?
                </p>
              </div>
              
              {/* Mock SWAG leads */}
              <div className="grid gap-4">
                {[
                  { id: '1', name: 'Michael Chen', email: 'mchen@wealthgroup.com', swag_score: 92, plaid_verification_status: 'verified', lead_status: 'qualified', persona: 'advisor', source: 'LinkedIn' },
                  { id: '2', name: 'Sarah Johnson', email: 'sarah@familyoffice.com', swag_score: 87, plaid_verification_status: 'pending', lead_status: 'contacted', persona: 'cpa', source: 'Referral' },
                  { id: '3', name: 'David Thompson', email: 'dthompson@lawfirm.com', swag_score: 74, plaid_verification_status: 'not_requested', lead_status: 'new', persona: 'attorney', source: 'Website' }
                ].map((lead) => (
                  <SWAGLeadScoreCard
                    key={lead.id}
                    lead={lead as any}
                    onViewDetails={(lead) => console.log('View details:', lead)}
                    onShare={(lead) => console.log('Share SWAG:', lead)}
                    onUpdateStatus={(id, status) => console.log('Update status:', id, status)}
                  />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="pipeline" className="mt-6">
            <PipelineManager />
          </TabsContent>

          <TabsContent value="activity" className="mt-6">
            <ActivityFeed />
          </TabsContent>

          <TabsContent value="reminders" className="mt-6">
            <SmartReminders />
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <CRMAnalytics />
          </TabsContent>

          <TabsContent value="viral-share" className="mt-6">
            <SWAGViralShare
              leadData={{
                name: 'Michael Chen',
                swagScore: 92,
                band: 'Gold SWAG™'
              }}
            />
          </TabsContent>

          <TabsContent value="import" className="mt-6">
            <ImportExport />
          </TabsContent>
        </Tabs>
      </div>
    </ThreeColumnLayout>
  );
}