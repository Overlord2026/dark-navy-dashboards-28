import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, FileText, Send, BarChart3, Settings } from 'lucide-react';
import { ProPersona } from '@/features/pro/types';
import { FEATURE_FLAGS } from '@/features/pro/config/flags';
import { getPipelineStages } from '@/features/pro/config/persona-settings';

interface ProDashboardNavProps {
  persona: ProPersona;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const PERSONA_LABELS = {
  advisor: 'Financial Advisor',
  cpa: 'CPA',
  attorney: 'Attorney',
  insurance: 'Insurance Professional',
  healthcare: 'Healthcare Professional',
  realtor: 'Real Estate Professional'
};

export function ProDashboardNav({ persona, activeTab, onTabChange }: ProDashboardNavProps) {
  const stages = getPipelineStages(persona);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{PERSONA_LABELS[persona]} Dashboard</h1>
          <p className="text-muted-foreground">Manage your professional practice with compliance tracking</p>
        </div>
        <Badge variant="outline" className="px-3 py-1">
          Pro System Enabled
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          
          {FEATURE_FLAGS.PRO_LEADS_ENABLED && (
            <TabsTrigger value="leads" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Lead Capture
            </TabsTrigger>
          )}
          
          {FEATURE_FLAGS.PRO_MEETINGS_ENABLED && (
            <TabsTrigger value="meetings" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Meetings
            </TabsTrigger>
          )}
          
          {FEATURE_FLAGS.PRO_CAMPAIGNS_ENABLED && (
            <TabsTrigger value="campaigns" className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              Campaigns
            </TabsTrigger>
          )}
          
          <TabsTrigger value="compliance" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Proof & Compliance
          </TabsTrigger>
          
          <TabsTrigger value="pipeline" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Pipeline
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Leads</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Meetings This Week</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">3 imported, 5 scheduled</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">98%</div>
                <p className="text-xs text-muted-foreground">All receipts current</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pipeline" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pipeline Stages - {PERSONA_LABELS[persona]}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {stages.map((stage, index) => (
                  <div key={stage} className="text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                      <span className="text-sm font-medium">{index + 1}</span>
                    </div>
                    <p className="text-sm font-medium">{stage}</p>
                    <p className="text-xs text-muted-foreground">
                      {Math.floor(Math.random() * 20)} leads
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Compliance Receipts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center p-2 border rounded">
                  <div>
                    <p className="font-medium">Consent-RDS</p>
                    <p className="text-sm text-muted-foreground">Lead capture consent</p>
                  </div>
                  <Badge variant="default">Valid</Badge>
                </div>
                <div className="flex justify-between items-center p-2 border rounded">
                  <div>
                    <p className="font-medium">Decision-RDS</p>
                    <p className="text-sm text-muted-foreground">Meeting import decision</p>
                  </div>
                  <Badge variant="default">Valid</Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Vault Protection</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Protected Documents</span>
                  <span className="font-medium">15</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Active Grants</span>
                  <span className="font-medium">8</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Anchor Coverage</span>
                  <span className="font-medium">12</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}