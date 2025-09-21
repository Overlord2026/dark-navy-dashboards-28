import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserCheck, Send, Scale, Building2 } from 'lucide-react';
import { BFOHeader } from '@/components/site/BFOHeader';
import { BrandedFooter } from '@/components/ui/BrandedFooter';

export default function AttorneysCTA() {
  const [code, setCode] = useState('');
  
  return (
    <div className="min-h-screen bg-background">
      <BFOHeader />
      <main className="pt-[var(--header-stack)] scroll-mt-[var(--header-stack)]">
        <div className="container mx-auto px-4 py-16 space-y-6">
          {/* Header */}
          <div className="text-center space-y-6">
            <h1 className="text-2xl font-bold">Attorney Access</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Access our comprehensive legal platform for estate planning, entity formation, and trust administration.
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
                  Already received an invitation? Complete your setup and access your legal workspace.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Estate planning document generation</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Trust funding and administration</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Entity formation and management</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter invite code"
                    className="flex-1 rounded-md border px-3 py-2 bg-background"
                  />
                  <a
                    href={code ? `/invite/${encodeURIComponent(code)}?persona=attorney` : '#'}
                    aria-disabled={!code}
                    className={`rounded-md px-3 py-2 border ${code ? 'hover:bg-muted' : 'opacity-50 cursor-not-allowed'}`}
                  >
                    Accept
                  </a>
                </div>
                <Button asChild size="lg" className="w-full">
                  <Link to="/invite/:token">
                    <UserCheck className="w-4 h-4 mr-2" />
                    Accept Invite
                  </Link>
                </Button>
                {import.meta.env.MODE !== 'production' && (
                  <a href="/invite/DEMO123?persona=attorney" className="text-xs underline opacity-70">
                    Dev: Accept demo invite
                  </a>
                )}
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-sm border p-6 md:p-8">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="h-8 w-8 text-secondary" />
                </div>
                <CardTitle className="text-xl">Request an Invite</CardTitle>
                <CardDescription className="text-lg">
                  New to our platform? Request access to join our professional legal network.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Asset titling exception tracking</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Client beneficiary management</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Succession planning tools</span>
                  </div>
                </div>
                <Button asChild variant="outline" size="lg" className="w-full">
                  <Link to="/catalog">
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
                <Scale className="w-8 h-8 text-primary" />
                <div>
                  <h3 className="font-medium">Estate Planning Suite</h3>
                  <p className="text-sm text-muted-foreground">Complete will and trust management</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 border rounded-lg">
                <Building2 className="w-8 h-8 text-primary" />
                <div>
                  <h3 className="font-medium">Entity Formation</h3>
                  <p className="text-sm text-muted-foreground">LLC and corporation management</p>
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