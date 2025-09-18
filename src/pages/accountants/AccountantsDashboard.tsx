import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Clock, 
  Users, 
  TrendingUp, 
  FileSpreadsheet,
  Upload,
  Download,
  Calendar
} from 'lucide-react';

export function AccountantsDashboard() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Accountant Dashboard</h1>
            <p className="text-muted-foreground">
              Manage client documents, tax returns, and compliance tracking
            </p>
          </div>
          <div className="flex gap-3">
            <Button asChild>
              <Link to="/pros/accountants/documents">
                <FileText className="w-4 h-4 mr-2" />
                Review Documents
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/pros/accountants/exports">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Link>
            </Button>
          </div>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Returns to Review</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">
                +3 from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Docs Pending</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                -2 from yesterday
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">
                +12 this month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-20 flex-col gap-2" asChild>
                <Link to="/pros/accountants/documents">
                  <FileText className="w-6 h-6" />
                  <span className="text-sm">Review Documents</span>
                </Link>
              </Button>
              
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Upload className="w-6 h-6" />
                <span className="text-sm">Upload Returns</span>
              </Button>
              
              <Button variant="outline" className="h-20 flex-col gap-2" asChild>
                <Link to="/pros/accountants/exports">
                  <FileSpreadsheet className="w-6 h-6" />
                  <span className="text-sm">Export CSV</span>
                </Link>
              </Button>
              
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Calendar className="w-6 h-6" />
                <span className="text-sm">Schedule Review</span>
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Smith Family - 2023 Tax Return</p>
                    <p className="text-xs text-muted-foreground">Completed review 2 hours ago</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Johnson LLC - Quarterly Report</p>
                    <p className="text-xs text-muted-foreground">Pending review since yesterday</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Brown Estate - Estate Tax Filing</p>
                    <p className="text-xs text-muted-foreground">Uploaded 3 days ago</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Davis Corp - Amendment Filed</p>
                    <p className="text-xs text-muted-foreground">Completed 1 week ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Upcoming Deadlines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Q4 Corporate Returns</p>
                  <p className="text-sm text-muted-foreground">15 clients pending</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-red-600">Due in 5 days</p>
                  <p className="text-xs text-muted-foreground">March 15, 2024</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Individual Tax Extensions</p>
                  <p className="text-sm text-muted-foreground">23 clients pending</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-yellow-600">Due in 12 days</p>
                  <p className="text-xs text-muted-foreground">October 15, 2024</p>
                </div>
              </div>

              <div className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Partnership Returns</p>
                  <p className="text-sm text-muted-foreground">8 clients pending</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">Due in 25 days</p>
                  <p className="text-xs text-muted-foreground">September 15, 2024</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}