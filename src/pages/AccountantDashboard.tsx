import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, FileSpreadsheet, DollarSign, Calendar } from 'lucide-react';

export function AccountantDashboard() {
  return (
    <MainLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Accountant Dashboard</h1>
        <p className="text-muted-foreground mb-8">Manage client accounting, tax preparation, and financial reporting.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Tax Preparation
              </CardTitle>
              <CardDescription>
                Prepare and review client tax returns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Access client tax documents and prepare comprehensive tax returns.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5" />
                Financial Reports
              </CardTitle>
              <CardDescription>
                Generate client financial statements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Create detailed financial reports and analysis for clients.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Bookkeeping
              </CardTitle>
              <CardDescription>
                Manage client books and records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Maintain accurate financial records and reconciliations.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Tax Calendar
              </CardTitle>
              <CardDescription>
                Important tax deadlines and reminders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Stay on top of critical tax filing deadlines and compliance requirements.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}