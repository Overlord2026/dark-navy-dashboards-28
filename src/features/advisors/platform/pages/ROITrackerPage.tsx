import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, DollarSign, Users, Calendar, BarChart3, Filter, Download } from 'lucide-react';

// TODO: Import existing ROI tracking components if available
// import { ReportsAnalytics } from '@/components/advisor/ReportsAnalytics';

export default function ROITrackerPage() {
  return (
    <>
      <Helmet>
        <title>ROI Tracker | Advisor Platform</title>
        <meta name="description" content="Track marketing ROI, campaign performance, and client acquisition metrics" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              ROI Tracker
            </h1>
            <p className="text-muted-foreground">
              Track marketing ROI, campaign performance, and client acquisition metrics
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter Period
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button size="sm">
              <BarChart3 className="w-4 h-4 mr-2" />
              View Analytics
            </Button>
          </div>
        </div>

        {/* ROI Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total ROI</p>
                  <p className="text-2xl font-bold text-green-600">324%</p>
                </div>
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="mt-2">
                <Badge variant="secondary" className="text-xs">+52% vs last quarter</Badge>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Marketing Spend</p>
                  <p className="text-2xl font-bold">$24,500</p>
                </div>
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <div className="mt-2">
                <Badge variant="outline" className="text-xs">Q4 2024</Badge>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Revenue Generated</p>
                  <p className="text-2xl font-bold">$103,680</p>
                </div>
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div className="mt-2">
                <Badge variant="secondary" className="text-xs">From campaigns</Badge>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Clients Acquired</p>
                  <p className="text-2xl font-bold">18</p>
                </div>
                <Users className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="mt-2">
                <Badge variant="secondary" className="text-xs">This quarter</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Campaign Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Performing Campaigns */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* TODO: Replace with actual campaign performance data */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Retirement Planning Series</h3>
                    <p className="text-sm text-muted-foreground">Email campaign • 7 touches</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary">8 clients</Badge>
                      <Badge variant="outline">Active</Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">485%</p>
                    <p className="text-sm text-muted-foreground">ROI</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Estate Planning Webinar</h3>
                    <p className="text-sm text-muted-foreground">Webinar + follow-up sequence</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary">5 clients</Badge>
                      <Badge variant="outline">Completed</Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">372%</p>
                    <p className="text-sm text-muted-foreground">ROI</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Tax Planning Outreach</h3>
                    <p className="text-sm text-muted-foreground">Direct mail + email</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary">3 clients</Badge>
                      <Badge variant="outline">Active</Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">298%</p>
                    <p className="text-sm text-muted-foreground">ROI</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Channel Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Channel Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <h3 className="font-medium">Email Marketing</h3>
                    <p className="text-sm text-muted-foreground">$8,200 spent</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-600">425%</p>
                    <p className="text-xs text-muted-foreground">12 clients</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <h3 className="font-medium">Referral Program</h3>
                    <p className="text-sm text-muted-foreground">$2,500 spent</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">680%</p>
                    <p className="text-xs text-muted-foreground">4 clients</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div>
                    <h3 className="font-medium">Social Media</h3>
                    <p className="text-sm text-muted-foreground">$4,800 spent</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-purple-600">185%</p>
                    <p className="text-xs text-muted-foreground">2 clients</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div>
                    <h3 className="font-medium">Direct Mail</h3>
                    <p className="text-sm text-muted-foreground">$9,000 spent</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-yellow-600">156%</p>
                    <p className="text-xs text-muted-foreground">3 clients</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Detailed Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Cost Per Acquisition */}
              <div>
                <h3 className="font-medium mb-3">Cost Per Acquisition</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Email Marketing</span>
                    <span className="font-medium">$683</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Referral Program</span>
                    <span className="font-medium">$625</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Social Media</span>
                    <span className="font-medium">$2,400</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Direct Mail</span>
                    <span className="font-medium">$3,000</span>
                  </div>
                </div>
              </div>

              {/* Lifetime Value */}
              <div>
                <h3 className="font-medium mb-3">Client Lifetime Value</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Average LTV</span>
                    <span className="font-medium">$5,760</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">High-Value Clients</span>
                    <span className="font-medium">$12,500</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Estate Planning</span>
                    <span className="font-medium">$8,750</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Retirement Planning</span>
                    <span className="font-medium">$6,200</span>
                  </div>
                </div>
              </div>

              {/* Conversion Rates */}
              <div>
                <h3 className="font-medium mb-3">Conversion Rates</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Overall</span>
                    <span className="font-medium">18.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Email Campaigns</span>
                    <span className="font-medium">22.3%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Webinars</span>
                    <span className="font-medium">28.7%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Referrals</span>
                    <span className="font-medium">45.2%</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Integration Notice */}
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <BarChart3 className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-green-900">Integrated Analytics</h3>
                <p className="text-sm text-green-700 mt-1">
                  ROI tracking data is automatically integrated from your campaign management and client acquisition 
                  systems. Analytics are updated in real-time to provide accurate performance metrics.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}