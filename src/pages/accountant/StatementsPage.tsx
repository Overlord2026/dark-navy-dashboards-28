import React, { useState } from 'react';
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout';
import { DashboardHeader } from '@/components/ui/DashboardHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  FileSpreadsheet, 
  Download, 
  Eye, 
  Calendar, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

export default function StatementsPage() {
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('');

  const financialStatements = [
    {
      id: 1,
      client: 'Smith Corporation',
      type: 'Balance Sheet',
      period: 'Q4 2023',
      status: 'completed',
      generated_date: '2024-01-15',
      file_size: '2.4 MB'
    },
    {
      id: 2,
      client: 'Johnson LLC',
      type: 'Income Statement',
      period: 'Q4 2023',
      status: 'in_review',
      generated_date: '2024-01-12',
      file_size: '1.8 MB'
    },
    {
      id: 3,
      client: 'Davis Enterprises',
      type: 'Cash Flow Statement',
      period: 'Q4 2023',
      status: 'pending',
      generated_date: null,
      file_size: null
    }
  ];

  const templates = [
    { name: 'Standard Balance Sheet', category: 'Balance Sheet', last_used: '2024-01-15' },
    { name: 'Detailed Income Statement', category: 'Income Statement', last_used: '2024-01-10' },
    { name: 'Cash Flow - Operating Activities', category: 'Cash Flow', last_used: '2024-01-08' },
    { name: 'Statement of Equity', category: 'Equity', last_used: '2024-01-05' }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in_review':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800">Completed</Badge>;
      case 'in_review':
        return <Badge variant="default" className="bg-yellow-100 text-yellow-800">In Review</Badge>;
      case 'pending':
        return <Badge variant="default" className="bg-red-100 text-red-800">Pending</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <ThreeColumnLayout title="Financial Statements">
      <div className="space-y-6">
        <DashboardHeader 
          heading="Financial Statements"
          text="Generate, review, and manage financial statements for your clients."
        />

        <Tabs defaultValue="statements" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="statements">Statements</TabsTrigger>
            <TabsTrigger value="generate">Generate</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="statements" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                  <p className="text-xs text-muted-foreground">
                    This quarter
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">In Review</CardTitle>
                  <Clock className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">7</div>
                  <p className="text-xs text-muted-foreground">
                    Pending approval
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending</CardTitle>
                  <AlertCircle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">
                    Need generation
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Statements</CardTitle>
                <CardDescription>
                  All financial statements generated for your clients
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {financialStatements.map((statement) => (
                    <div key={statement.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(statement.status)}
                        <div>
                          <div className="font-medium">{statement.client}</div>
                          <div className="text-sm text-muted-foreground">
                            {statement.type} - {statement.period}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(statement.status)}
                        {statement.status === 'completed' && (
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="generate" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Generate New Statement</CardTitle>
                <CardDescription>
                  Create financial statements for your clients
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Client</label>
                    <Select value={selectedClient} onValueChange={setSelectedClient}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select client" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="smith-corp">Smith Corporation</SelectItem>
                        <SelectItem value="johnson-llc">Johnson LLC</SelectItem>
                        <SelectItem value="davis-ent">Davis Enterprises</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Period</label>
                    <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="q1-2024">Q1 2024</SelectItem>
                        <SelectItem value="q4-2023">Q4 2023</SelectItem>
                        <SelectItem value="q3-2023">Q3 2023</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-end">
                    <Button className="w-full">
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      Generate Statements
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Statement Templates</CardTitle>
                <CardDescription>
                  Manage and customize financial statement templates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {templates.map((template, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{template.name}</h4>
                        <Badge variant="outline">{template.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Last used: {template.last_used}
                      </p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm">Use Template</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Statement Analytics</CardTitle>
                <CardDescription>
                  Performance metrics and insights for financial statement generation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                      <h4 className="font-medium">Generation Speed</h4>
                    </div>
                    <div className="text-2xl font-bold">2.3 min</div>
                    <p className="text-sm text-muted-foreground">Average per statement</p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-5 w-5 text-blue-500" />
                      <h4 className="font-medium">Monthly Volume</h4>
                    </div>
                    <div className="text-2xl font-bold">156</div>
                    <p className="text-sm text-muted-foreground">Statements generated</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ThreeColumnLayout>
  );
}