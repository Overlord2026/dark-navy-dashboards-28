import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Clock, ArrowRight } from 'lucide-react';

export function TaxLossHarvest() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Tax Loss Harvesting Calculator</h1>
        <p className="text-muted-foreground">
          Systematic tax loss harvesting strategies and wash sale rule optimization.
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Tax Loss Harvesting Optimizer</CardTitle>
                <CardDescription>Consolidate scattered features into dedicated tool</CardDescription>
              </div>
            </div>
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-300">
              <Clock className="h-3 w-3 mr-1" />
              Consolidate
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Features for tax loss harvesting exist in various scenario tools and advisor workflows. 
              This dedicated calculator will consolidate and enhance these capabilities.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="p-4 bg-muted/30 rounded-lg">
                <h3 className="font-medium mb-2">Features to Consolidate</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Wash sale rule avoidance</li>
                  <li>• Loss harvesting opportunity identification</li>
                  <li>• Tax alpha calculation</li>
                  <li>• Multi-account coordination</li>
                </ul>
              </div>
              
              <div className="p-4 bg-muted/30 rounded-lg">
                <h3 className="font-medium mb-2">Enhanced Features</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Automated loss harvesting calendar</li>
                  <li>• Substitute security suggestions</li>
                  <li>• Annual loss budget tracking</li>
                  <li>• Integration with portfolio rebalancing</li>
                </ul>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-muted">
              <span className="text-sm text-muted-foreground">Current Status:</span>
              <Badge variant="secondary">Features Scattered</Badge>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <Badge variant="default">Needs Consolidation</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}