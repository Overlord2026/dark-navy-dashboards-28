import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Clock, ArrowRight } from 'lucide-react';

export function TaxSocialSecurity() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Social Security Tax Planner</h1>
        <p className="text-muted-foreground">
          Social Security taxation optimization and claiming strategy coordination.
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Social Security Tax Calculator</CardTitle>
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
              This tool will integrate Social Security taxation rules with overall retirement 
              income planning to minimize the tax impact of benefits.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="p-4 bg-muted/30 rounded-lg">
                <h3 className="font-medium mb-2">Tax Optimization Features</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Provisional income management</li>
                  <li>• 0%, 50%, 85% taxation thresholds</li>
                  <li>• Roth conversion coordination</li>
                  <li>• Income timing strategies</li>
                  <li>• Multi-year tax minimization</li>
                </ul>
              </div>
              
              <div className="p-4 bg-muted/30 rounded-lg">
                <h3 className="font-medium mb-2">Strategy Integration</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Claiming strategy coordination</li>
                  <li>• Withdrawal sequencing alignment</li>
                  <li>• Medicare IRMAA consideration</li>
                  <li>• Spousal optimization</li>
                </ul>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-muted">
              <span className="text-sm text-muted-foreground">Implementation Status:</span>
              <Badge variant="secondary">Missing Feature</Badge>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <Badge variant="default">Awaiting Source Import</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}