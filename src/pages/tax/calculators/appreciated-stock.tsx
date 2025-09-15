import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Clock, ArrowRight } from 'lucide-react';

export function TaxAppreciatedStock() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Appreciated Stock Calculator</h1>
        <p className="text-muted-foreground">
          Stock option exercise planning and capital gains optimization strategies.
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Appreciated Stock Planning Tool</CardTitle>
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
              This calculator will help you optimize the timing of stock option exercises, 
              RSU vesting events, and ESPP purchases to minimize tax impact.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="p-4 bg-muted/30 rounded-lg">
                <h3 className="font-medium mb-2">Features Coming Soon</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• ISO vs NQSO exercise timing</li>
                  <li>• AMT impact analysis</li>
                  <li>• Capital gains vs ordinary income optimization</li>
                  <li>• Multi-year projection scenarios</li>
                </ul>
              </div>
              
              <div className="p-4 bg-muted/30 rounded-lg">
                <h3 className="font-medium mb-2">Integration Plan</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Import from Neptune React Orbit</li>
                  <li>• Adapt to current design system</li>
                  <li>• Integrate with existing tax calculations</li>
                  <li>• Add premium feature gating</li>
                </ul>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-muted">
              <span className="text-sm text-muted-foreground">Implementation Status:</span>
              <Badge variant="secondary">Awaiting Source Import</Badge>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <Badge variant="default">Ready for Integration</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}