import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Clock, ArrowRight } from 'lucide-react';
import { TaxPlanningModal } from '@/components/calculators/TaxPlanningModal';

export function TaxCharitableGift() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Charitable Gift Optimizer</h1>
        <p className="text-muted-foreground">
          Tax-efficient charitable giving strategies and timing optimization.
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Charitable Giving Calculator</CardTitle>
                <CardDescription>Enhanced version of existing modal calculator</CardDescription>
              </div>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-300">
              <Clock className="h-3 w-3 mr-1" />
              Enhance
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              A basic charitable gift calculator exists in modal form. This standalone version 
              will provide enhanced features and comprehensive planning capabilities.
            </p>
            
            <div className="mb-6">
              <h3 className="font-medium mb-3">Current Basic Calculator</h3>
              <div className="border rounded-lg p-4 bg-muted/20">
                <p className="text-sm text-muted-foreground">
                  Basic charitable gift calculator exists in modal form - will be enhanced for standalone use.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="p-4 bg-muted/30 rounded-lg">
                <h3 className="font-medium mb-2">Enhanced Features Planned</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Charitable remainder trust planning</li>
                  <li>• Charitable lead trust strategies</li>
                  <li>• Bunching vs annual giving optimization</li>
                  <li>• Asset selection for giving (cash vs appreciated)</li>
                  <li>• Multi-year giving scenarios</li>
                </ul>
              </div>
              
              <div className="p-4 bg-muted/30 rounded-lg">
                <h3 className="font-medium mb-2">Advanced Strategies</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Qualified charitable distributions</li>
                  <li>• Private foundation planning</li>
                  <li>• Charitable gift annuities</li>
                  <li>• Conservation easements</li>
                </ul>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-muted">
              <span className="text-sm text-muted-foreground">Current Status:</span>
              <Badge variant="secondary">Basic Modal Version</Badge>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <Badge variant="default">Needs Standalone Enhancement</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}