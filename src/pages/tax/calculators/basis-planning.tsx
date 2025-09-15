import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calculator, Clock, ArrowRight } from 'lucide-react';

export function TaxBasisPlanning() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Basis Planning Calculator</h1>
        <p className="text-muted-foreground">
          Cost basis tracking and step-up planning strategies for tax optimization.
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Calculator className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Cost Basis Planning Tool</CardTitle>
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
              This calculator will help optimize cost basis strategies, including step-up planning, 
              gifting vs bequest analysis, and basis tracking for complex positions.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="p-4 bg-muted/30 rounded-lg">
                <h3 className="font-medium mb-2">Features Coming Soon</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Step-up basis planning</li>
                  <li>• Gift vs bequest optimization</li>
                  <li>• Basis tracking for partnerships</li>
                  <li>• Installment sale planning</li>
                  <li>• Like-kind exchange tracking</li>
                </ul>
              </div>
              
              <div className="p-4 bg-muted/30 rounded-lg">
                <h3 className="font-medium mb-2">Estate Integration</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Multi-generational planning</li>
                  <li>• Trust basis calculations</li>
                  <li>• Charitable remainder trusts</li>
                  <li>• Generation-skipping strategies</li>
                </ul>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-muted">
              <span className="text-sm text-muted-foreground">Implementation Status:</span>
              <Badge variant="secondary">Missing Feature</Badge>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <Badge variant="default">Priority 2 Implementation</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}