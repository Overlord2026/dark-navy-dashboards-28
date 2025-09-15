import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Clock, ArrowRight } from 'lucide-react';

export function TaxQsbs() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">QSBS Planning Tool</h1>
        <p className="text-muted-foreground">
          Qualified Small Business Stock Section 1202 optimization and planning strategies.
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>QSBS Section 1202 Calculator</CardTitle>
                <CardDescription>Coming from Neptune React Orbit integration</CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
              <Clock className="h-3 w-3 mr-1" />
              TODO
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              This tool will help you maximize the tax benefits of Qualified Small Business Stock 
              under Section 1202, including the potential for $10M+ in tax-free gains.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="p-4 bg-muted/30 rounded-lg">
                <h3 className="font-medium mb-2">Features Coming Soon</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• QSBS eligibility verification</li>
                  <li>• $10M vs 10x basis calculation</li>
                  <li>• 5-year holding period tracking</li>
                  <li>• State-by-state tax benefits</li>
                  <li>• Gift and estate planning strategies</li>
                </ul>
              </div>
              
              <div className="p-4 bg-muted/30 rounded-lg">
                <h3 className="font-medium mb-2">High-Value Feature</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Up to $10M+ in tax savings</li>
                  <li>• Complex qualification rules</li>
                  <li>• Multi-generational planning</li>
                  <li>• Professional-grade calculations</li>
                </ul>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-muted">
              <span className="text-sm text-muted-foreground">Priority:</span>
              <Badge variant="destructive">High-Value Missing Feature</Badge>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <Badge variant="default">Priority 1 Implementation</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}