import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Scale, FileText, Shield, Gavel } from 'lucide-react';

export function AttorneyDashboard() {
  return (
    <MainLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Attorney Dashboard</h1>
        <p className="text-muted-foreground mb-8">Provide legal services and estate planning for family office clients.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5" />
                Estate Planning
              </CardTitle>
              <CardDescription>
                Comprehensive estate planning services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Create wills, trusts, and estate planning documents for clients.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Legal Documents
              </CardTitle>
              <CardDescription>
                Draft and review legal documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Prepare contracts, agreements, and other legal documentation.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Compliance
              </CardTitle>
              <CardDescription>
                Regulatory compliance and risk management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Ensure client compliance with applicable laws and regulations.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gavel className="h-5 w-5" />
                Legal Counsel
              </CardTitle>
              <CardDescription>
                Strategic legal advisory services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Provide expert legal advice and representation for complex matters.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}