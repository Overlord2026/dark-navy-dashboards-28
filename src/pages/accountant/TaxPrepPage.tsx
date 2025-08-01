import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Upload, User, Calendar, CheckCircle, AlertCircle } from 'lucide-react';

interface TaxReturn {
  id: string;
  clientName: string;
  taxYear: number;
  type: 'individual' | 'business' | 'estate';
  status: 'draft' | 'in_review' | 'completed' | 'filed';
  dueDate: string;
  lastUpdated: string;
}

export default function TaxPrepPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'returns' | 'documents'>('dashboard');

  const mockReturns: TaxReturn[] = [
    {
      id: '1',
      clientName: 'John Smith',
      taxYear: 2024,
      type: 'individual',
      status: 'in_review',
      dueDate: '2024-04-15',
      lastUpdated: '2024-03-10'
    },
    {
      id: '2', 
      clientName: 'ABC Corp',
      taxYear: 2024,
      type: 'business',
      status: 'draft',
      dueDate: '2024-03-15',
      lastUpdated: '2024-03-08'
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: 'secondary',
      in_review: 'default', 
      completed: 'default',
      filed: 'default'
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants]}>{status.replace('_', ' ')}</Badge>;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'filed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in_review':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Tax Preparation</h1>
            <p className="text-muted-foreground">Manage tax returns and compliance workflows</p>
          </div>
          <Button>
            <Upload className="h-4 w-4 mr-2" />
            Upload Documents
          </Button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-6">
          {['dashboard', 'returns', 'documents'].map((tab) => (
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Returns</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">+2 from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Due This Week</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">Filing deadlines</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">This quarter</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Refund</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$2,450</div>
                <p className="text-xs text-muted-foreground">Individual returns</p>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'returns' && (
          <Card>
            <CardHeader>
              <CardTitle>Tax Returns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockReturns.map((taxReturn) => (
                  <div key={taxReturn.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(taxReturn.status)}
                      <div>
                        <div className="font-medium">{taxReturn.clientName}</div>
                        <div className="text-sm text-muted-foreground">
                          {taxReturn.taxYear} {taxReturn.type} return
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm">Due: {taxReturn.dueDate}</div>
                        <div className="text-xs text-muted-foreground">
                          Updated: {taxReturn.lastUpdated}
                        </div>
                      </div>
                      {getStatusBadge(taxReturn.status)}
                      <Button variant="outline" size="sm">
                        View
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
              <CardTitle>Document Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Upload Tax Documents</h3>
                <p className="text-muted-foreground mb-4">
                  Drag and drop files or click to upload W-2s, 1099s, and other tax documents
                </p>
                <Button>
                  <Upload className="h-4 w-4 mr-2" />
                  Choose Files
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}