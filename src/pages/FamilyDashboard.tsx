import React from 'react';
import { FamilyHero } from '@/components/dashboard/FamilyHero';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Calendar, 
  Bell, 
  FileText, 
  Users, 
  Target,
  ArrowUpRight,
  Clock
} from 'lucide-react';

const recentActivities = [
  {
    title: 'Portfolio Rebalancing Completed',
    description: 'Your investment portfolio has been rebalanced according to your target allocation',
    time: '2 hours ago',
    type: 'investment',
    icon: TrendingUp
  },
  {
    title: 'Quarterly Review Scheduled',
    description: 'Your Q4 financial review meeting with Sarah Johnson',
    time: '1 day ago',
    type: 'meeting',
    icon: Calendar
  },
  {
    title: 'Tax Document Uploaded',
    description: 'W-2 form for 2024 has been securely uploaded to your vault',
    time: '3 days ago',
    type: 'document',
    icon: FileText
  }
];

const upcomingTasks = [
  {
    title: 'Review Life Insurance Policy',
    description: 'Annual review of your $500k term life policy',
    dueDate: 'Dec 15, 2024',
    priority: 'high',
    category: 'Insurance'
  },
  {
    title: 'Update Beneficiaries',
    description: 'Review and update beneficiaries on all accounts',
    dueDate: 'Dec 20, 2024',
    priority: 'medium',
    category: 'Estate Planning'
  },
  {
    title: 'Tax Planning Session',
    description: 'Year-end tax planning with your CPA',
    dueDate: 'Dec 22, 2024',
    priority: 'high',
    category: 'Tax Planning'
  }
];

const portfolioSummary = {
  totalValue: 2400000,
  monthlyChange: 8.2,
  ytdReturn: 12.5,
  allocations: [
    { name: 'Stocks', percentage: 65, value: 1560000 },
    { name: 'Bonds', percentage: 25, value: 600000 },
    { name: 'Real Estate', percentage: 7, value: 168000 },
    { name: 'Cash', percentage: 3, value: 72000 }
  ]
};

export default function FamilyDashboard() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Family Hero Section */}
      <FamilyHero 
        userName="John"
        familyName="The Johnson Family"
        totalAssets={2400000}
        recentActivity="Last login: Today at 10:30 AM"
      />

      {/* Main Dashboard Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Portfolio & Activities */}
          <div className="lg:col-span-2 space-y-6">
            {/* Portfolio Summary */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                      Portfolio Overview
                    </CardTitle>
                    <CardDescription>Your investment performance and allocation</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                    <ArrowUpRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">
                      {formatCurrency(portfolioSummary.totalValue)}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Value</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      +{portfolioSummary.monthlyChange}%
                    </p>
                    <p className="text-sm text-muted-foreground">This Month</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      +{portfolioSummary.ytdReturn}%
                    </p>
                    <p className="text-sm text-muted-foreground">YTD Return</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Asset Allocation</h4>
                  {portfolioSummary.allocations.map((allocation, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">{allocation.name}</span>
                            <span className="text-sm text-muted-foreground">
                              {allocation.percentage}% • {formatCurrency(allocation.value)}
                            </span>
                          </div>
                          <div className="w-full bg-secondary rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${allocation.percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2 text-primary" />
                  Recent Activities
                </CardTitle>
                <CardDescription>Stay updated with your latest financial activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <activity.icon className="h-5 w-5 mt-0.5 text-primary" />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{activity.title}</h4>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                        <div className="flex items-center mt-2">
                          <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{activity.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View All Activities
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Tasks & Quick Actions */}
          <div className="space-y-6">
            {/* Upcoming Tasks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2 text-primary" />
                  Upcoming Tasks
                </CardTitle>
                <CardDescription>Important items that need your attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingTasks.map((task, index) => (
                    <div key={index} className="p-3 border rounded-lg hover:shadow-sm transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm">{task.title}</h4>
                        <Badge variant={getPriorityColor(task.priority)} className="text-xs">
                          {task.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                      <div className="flex items-center justify-between text-xs">
                        <Badge variant="outline" className="text-xs">
                          {task.category}
                        </Badge>
                        <span className="text-muted-foreground">Due: {task.dueDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View All Tasks
                </Button>
              </CardContent>
            </Card>

            {/* Family Members */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-primary" />
                  Family Members
                </CardTitle>
                <CardDescription>Manage your family's financial planning</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">J</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">John Johnson</p>
                      <p className="text-xs text-muted-foreground">Primary Account Holder</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50">
                    <div className="w-8 h-8 bg-secondary/50 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium">S</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Sarah Johnson</p>
                      <p className="text-xs text-muted-foreground">Spouse</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50">
                    <div className="w-8 h-8 bg-secondary/50 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium">E</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Emma Johnson</p>
                      <p className="text-xs text-muted-foreground">Dependent (Age 16)</p>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4">
                  Manage Family
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}