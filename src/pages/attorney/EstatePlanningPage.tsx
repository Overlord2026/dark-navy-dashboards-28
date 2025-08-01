import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FileText, Users, Calendar, Shield, Plus, AlertTriangle } from 'lucide-react';

interface EstatePlan {
  id: string;
  clientName: string;
  type: 'simple_will' | 'trust' | 'complex_estate';
  status: 'draft' | 'review' | 'executed' | 'needs_update';
  created: string;
  lastUpdated: string;
  documents: string[];
  value: number;
}

export default function EstatePlanningPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'plans' | 'documents' | 'calendar'>('dashboard');

  const mockPlans: EstatePlan[] = [
    {
      id: '1',
      clientName: 'Smith Family Trust',
      type: 'trust',
      status: 'review',
      created: '2024-02-15',
      lastUpdated: '2024-03-01',
      documents: ['Living Trust', 'Pour-over Will', 'Financial POA'],
      value: 2500000
    },
    {
      id: '2',
      clientName: 'Johnson Estate',
      type: 'complex_estate',
      status: 'draft',
      created: '2024-03-01',
      lastUpdated: '2024-03-10',
      documents: ['Will', 'Healthcare Directive'],
      value: 5800000
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: 'secondary',
      review: 'default',
      executed: 'default',
      needs_update: 'destructive'
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants]}>{status.replace('_', ' ')}</Badge>;
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      simple_will: 'Simple Will',
      trust: 'Trust Planning',
      complex_estate: 'Complex Estate'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <MainLayout>
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Estate Planning</h1>
            <p className="text-muted-foreground">Comprehensive estate planning and document management</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Estate Plan
          </Button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-6">
          {['dashboard', 'plans', 'documents', 'calendar'].map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? 'default' : 'ghost'}
              onClick={() => setActiveTab(tab as any)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Button>
          ))}
        </div>

        {activeTab === 'dashboard' && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Plans</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">15</div>
                  <p className="text-xs text-muted-foreground">3 need review</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Estate Value</CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(45800000)}</div>
                  <p className="text-xs text-muted-foreground">Under management</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Documents Pending</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">7</div>
                  <p className="text-xs text-muted-foreground">Awaiting signatures</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Reviews Due</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">Wilson Trust executed</div>
                      <div className="text-xs text-muted-foreground">2 hours ago</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">Brown Estate documents sent for review</div>
                      <div className="text-xs text-muted-foreground">1 day ago</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">Davis Will needs annual review</div>
                      <div className="text-xs text-muted-foreground">3 days ago</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === 'plans' && (
          <Card>
            <CardHeader>
              <CardTitle>Estate Plans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockPlans.map((plan) => (
                  <div key={plan.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{plan.clientName}</div>
                        <div className="text-sm text-muted-foreground">
                          {getTypeLabel(plan.type)} • Estate Value: {formatCurrency(plan.value)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {plan.documents.length} documents • Updated {plan.lastUpdated}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {getStatusBadge(plan.status)}
                      <Button variant="outline" size="sm">
                        View Plan
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'documents' && (
          <Card>
            <CardHeader>
              <CardTitle>Document Library</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {['Wills', 'Trusts', 'Powers of Attorney', 'Healthcare Directives', 'Tax Elections', 'Business Succession'].map((docType) => (
                  <Card key={docType} className="p-4 cursor-pointer hover:bg-muted/50">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-8 w-8 text-primary" />
                      <div>
                        <div className="font-medium">{docType}</div>
                        <div className="text-sm text-muted-foreground">
                          {Math.floor(Math.random() * 20) + 5} templates
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'calendar' && (
          <Card>
            <CardHeader>
              <CardTitle>Estate Planning Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Review Schedule</h3>
                <p className="text-muted-foreground">
                  Track estate plan reviews, document expirations, and important deadlines
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}