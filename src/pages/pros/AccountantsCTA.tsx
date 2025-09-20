import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserCheck, Send, Calculator, FileSpreadsheet } from 'lucide-react';
import { BFOHeader } from '@/components/site/BFOHeader';
import { BrandedFooter } from '@/components/ui/BrandedFooter';

export default function AccountantsCTA() {
  return (
    <div className="min-h-screen bg-background">
      <BFOHeader />
      <main className="pt-[var(--header-stack)] scroll-mt-[var(--header-stack)]">
        <div className="container mx-auto px-4 py-16 space-y-6">
          {/* Header */}
          <div className="text-center space-y-6">
            <h1 className="text-2xl font-bold">CPA & Accountant Access</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join our professional platform for advanced tax planning, client document management, and practice optimization tools.
            </p>
          </div>

          {/* CTA Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="rounded-2xl shadow-sm border p-6 md:p-8">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserCheck className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Accept Your Invite</CardTitle>
                <CardDescription className="text-lg">
                  Already received an invitation? Complete your setup and access your dashboard.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Tax planning and optimization tools</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Client document collection portal</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Automated quarterly reporting</span>
                  </div>
                </div>
                <Button asChild size="lg" className="w-full">
                  <Link to="/invite/:token">
                    <UserCheck className="w-4 h-4 mr-2" />
                    Accept Invite
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-sm border p-6 md:p-8">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="h-8 w-8 text-secondary" />
                </div>
                <CardTitle className="text-xl">Request an Invite</CardTitle>
                <CardDescription className="text-lg">
                  New to our platform? Request access to join our growing network of professionals.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Professional practice management</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Secure client communication</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">K-1 and partnership tracking</span>
                  </div>
                </div>
                <Button asChild variant="outline" size="lg" className="w-full">
                  <Link to="/pros">
                    <Send className="w-4 h-4 mr-2" />
                    Request an Invite
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Tools Preview */}
          <div className="max-w-4xl mx-auto pt-12">
            <h2 className="text-xl font-bold text-center mb-8">Professional Tools Available</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-4 p-4 border rounded-lg">
                <Calculator className="w-8 h-8 text-primary" />
                <div>
                  <h3 className="font-medium">Tax Planning Suite</h3>
                  <p className="text-sm text-muted-foreground">Advanced optimization and strategy tools</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 border rounded-lg">
                <FileSpreadsheet className="w-8 h-8 text-primary" />
                <div>
                  <h3 className="font-medium">Document Management</h3>
                  <p className="text-sm text-muted-foreground">Secure client file organization</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <BrandedFooter />
    </div>
  );
}