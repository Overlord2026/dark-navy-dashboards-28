import React from 'react';
import { Link } from 'react-router-dom';
import { proSegments } from '@/lib/persona';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ProsHubPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">
          Professional Partners Hub
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Join our network of trusted professionals serving high-net-worth families. 
          Access tools, resources, and collaboration platforms designed for your practice.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {proSegments.map((segment) => (
          <Card key={segment.href} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">{segment.label}</CardTitle>
              <CardDescription>
                Professional tools and resources for {segment.label.toLowerCase()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to={segment.href}>
                <Button variant="outline" className="w-full">
                  Explore Tools
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-muted/50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">Operating Systems</h2>
        <p className="text-muted-foreground mb-6">
          Comprehensive practice management solutions tailored to your profession
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/pros/solutions/advisor-os">
            <Button variant="secondary">AdvisorOS</Button>
          </Link>
          <Link to="/pros/solutions/accounting-os">
            <Button variant="secondary">AccountingOS</Button>
          </Link>
          <Link to="/pros/solutions/legal-os">
            <Button variant="secondary">LegalOS</Button>
          </Link>
          <Link to="/pros/solutions/realtor-os">
            <Button variant="secondary">RealtorOS</Button>
          </Link>
          <Link to="/pros/solutions/marketing-os">
            <Button variant="secondary">MarketingOS</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}