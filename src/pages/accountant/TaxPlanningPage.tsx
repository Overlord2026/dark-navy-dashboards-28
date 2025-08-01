import React, { useState } from 'react';
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout';
import { DashboardHeader } from '@/components/ui/DashboardHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calculator, 
  FileText, 
  TrendingUp, 
  Calendar, 
  DollarSign,
  PieChart,
  Target,
  AlertTriangle 
} from 'lucide-react';

export default function AccountantTaxPlanningPage() {
  const [selectedClient, setSelectedClient] = useState('');
  const [taxYear, setTaxYear] = useState('2024');

  const taxStrategies = [
    {
      name: 'Retirement Contributions',
      potential_savings: '$2,400',
      deadline: '04/15/2024',
      status: 'recommended'
    },
    {
      name: 'Business Equipment Purchase',
      potential_savings: '$8,500',
      deadline: '12/31/2024',
      status: 'in_progress'
    },
    {
      name: 'Tax-Loss Harvesting',
      potential_savings: '$1,200',
      deadline: '12/31/2024',
      status: 'completed'
    }
  ];

  const upcomingDeadlines = [
    { task: 'Quarterly Estimated Taxes', date: '01/15/2024', client: 'Smith Corp' },
    { task: 'Annual Tax Return Filing', date: '04/15/2024', client: 'Johnson LLC' },
    { task: 'Extension Filing', date: '10/15/2024', client: 'Davis Enterprises' }
  ];

  return (
    <ThreeColumnLayout title="Tax Planning Services">
      <div className="space-y-6">
        <DashboardHeader 
          heading="Tax Planning & Strategy"
          text="Advanced tax planning tools and optimization strategies for your clients."
        />

        <Tabs defaultValue="planning" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="planning">Planning</TabsTrigger>
            <TabsTrigger value="strategies">Strategies</TabsTrigger>
            <TabsTrigger value="deadlines">Deadlines</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="planning" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Strategies</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">
                    Across all clients
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Potential Savings</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">$45,200</div>
                  <p className="text-xs text-muted-foreground">
                    This tax year
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Upcoming Deadlines</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">8</div>
                  <p className="text-xs text-muted-foreground">
                    Next 30 days
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Client Tax Planning</CardTitle>
                <CardDescription>
                  Create and manage tax planning strategies for your clients
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="client">Select Client</Label>
                    <Select value={selectedClient} onValueChange={setSelectedClient}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a client" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="smith-corp">Smith Corp</SelectItem>
                        <SelectItem value="johnson-llc">Johnson LLC</SelectItem>
                        <SelectItem value="davis-ent">Davis Enterprises</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tax-year">Tax Year</Label>
                    <Select value={taxYear} onValueChange={setTaxYear}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2023">2023</SelectItem>
                        <SelectItem value="2022">2022</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-end">
                    <Button className="w-full">
                      <Calculator className="h-4 w-4 mr-2" />
                      Generate Plan
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="strategies" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tax Strategies</CardTitle>
                <CardDescription>
                  Review and implement tax optimization strategies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {taxStrategies.map((strategy, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <div className="font-medium">{strategy.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Deadline: {strategy.deadline}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-medium text-green-600">{strategy.potential_savings}</div>
                          <div className="text-xs text-muted-foreground">Potential savings</div>
                        </div>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deadlines" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Deadlines</CardTitle>
                <CardDescription>
                  Important tax deadlines for all clients
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingDeadlines.map((deadline, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="h-5 w-5 text-orange-500" />
                        <div>
                          <div className="font-medium">{deadline.task}</div>
                          <div className="text-sm text-muted-foreground">{deadline.client}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{deadline.date}</div>
                        <Button variant="outline" size="sm" className="mt-1">
                          Set Reminder
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tax Planning Reports</CardTitle>
                <CardDescription>
                  Generate comprehensive tax planning reports for clients
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-20 flex-col">
                    <PieChart className="h-6 w-6 mb-2" />
                    Tax Projection Report
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <TrendingUp className="h-6 w-6 mb-2" />
                    Strategy Analysis
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <FileText className="h-6 w-6 mb-2" />
                    Compliance Summary
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Calendar className="h-6 w-6 mb-2" />
                    Deadline Calendar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ThreeColumnLayout>
  );
}