import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  FileCheck, 
  Clock, 
  Users, 
  TrendingUp, 
  Scale,
  FileText,
  Shield,
  Calendar
} from 'lucide-react';

export function AttorneysDashboard() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Attorney Dashboard</h1>
            <p className="text-muted-foreground">
              Manage entities, trusts, estate documents and client matters
            </p>
          </div>
          <div className="flex gap-3">
            <Button asChild>
              <Link to="/pros/attorneys/entities">
                <Building2 className="w-4 h-4 mr-2" />
                Manage Entities
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/pros/attorneys/vault">
                <Shield className="w-4 h-4 mr-2" />
                Estate Vault
              </Link>
            </Button>
          </div>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Entities</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">47</div>
              <p className="text-xs text-muted-foreground">
                +5 created this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Trusts</CardTitle>
              <Scale className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">28</div>
              <p className="text-xs text-muted-foreground">
                +3 established recently
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Docs Pending Signature</CardTitle>
              <FileCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">14</div>
              <p className="text-xs text-muted-foreground">
                -3 from last week
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
                <Link to="/pros/attorneys/entities">
                  <Building2 className="w-6 h-6" />
                  <span className="text-sm">Create Entity</span>
                </Link>
              </Button>
              
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Scale className="w-6 h-6" />
                <span className="text-sm">Setup Trust</span>
              </Button>
              
              <Button variant="outline" className="h-20 flex-col gap-2" asChild>
                <Link to="/pros/attorneys/vault">
                  <FileText className="w-6 h-6" />
                  <span className="text-sm">Review Documents</span>
                </Link>
              </Button>
              
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Calendar className="w-6 h-6" />
                <span className="text-sm">Schedule Meeting</span>
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
                    <p className="text-sm font-medium">Smith Family Trust - Established</p>
                    <p className="text-xs text-muted-foreground">Completed setup 3 hours ago</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Johnson LLC - Amendment Filed</p>
                    <p className="text-xs text-muted-foreground">Operating agreement updated yesterday</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Brown Estate - Will Review</p>
                    <p className="text-xs text-muted-foreground">Pending client signature since 2 days ago</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Davis Foundation - Formation</p>
                    <p className="text-xs text-muted-foreground">501(c)(3) application submitted</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Matters Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Active Matters Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 border rounded-lg">
                <h3 className="font-semibold text-lg">Estate Planning</h3>
                <p className="text-2xl font-bold text-primary">18</p>
                <p className="text-sm text-muted-foreground">Active wills & trusts</p>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <h3 className="font-semibold text-lg">Entity Formation</h3>
                <p className="text-2xl font-bold text-primary">12</p>
                <p className="text-sm text-muted-foreground">LLCs & corporations</p>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <h3 className="font-semibold text-lg">Tax Planning</h3>
                <p className="text-2xl font-bold text-primary">8</p>
                <p className="text-sm text-muted-foreground">Active strategies</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Upcoming Deadlines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Johnson LLC Annual Filing</p>
                  <p className="text-sm text-muted-foreground">State registration renewal required</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-red-600">Due in 7 days</p>
                  <p className="text-xs text-muted-foreground">Jan 31, 2024</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Smith Trust Tax Return</p>
                  <p className="text-sm text-muted-foreground">Form 1041 preparation deadline</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-yellow-600">Due in 15 days</p>
                  <p className="text-xs text-muted-foreground">March 15, 2024</p>
                </div>
              </div>

              <div className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Brown Estate Settlement</p>
                  <p className="text-sm text-muted-foreground">Final distribution to beneficiaries</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">Due in 30 days</p>
                  <p className="text-xs text-muted-foreground">April 15, 2024</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}