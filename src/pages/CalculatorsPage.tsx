import React from 'react';
import { CalculatorGrid } from '@/components/CalculatorGrid';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { usePersonalizationStore } from '@/features/personalization/store';
import { getCalculatorCounts } from '@/features/calculators/catalog';

export default function CalculatorsPage() {
  const { persona, tier } = usePersonalizationStore();
  const counts = getCalculatorCounts(persona, tier);

  // Mock user entitlement - in real app, get from user subscription
  const userEntitlement = tier === 'advanced' ? 'premium' : 'basic';

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Financial Calculators</h1>
        <p className="text-muted-foreground">
          Professional-grade calculators tailored to your {persona} journey
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{counts.available}</div>
            <p className="text-xs text-muted-foreground">Calculators</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Basic</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{counts.basic}</div>
            <p className="text-xs text-muted-foreground">Core tools</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Premium</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{counts.premium}</div>
            <p className="text-xs text-muted-foreground">Advanced</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Elite</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{counts.elite}</div>
            <p className="text-xs text-muted-foreground">Professional</p>
          </CardContent>
        </Card>
      </div>

      {/* Calculator Grid */}
      <CalculatorGrid 
        userEntitlement={userEntitlement as any}
        showGated={true}
      />
    </div>
  );
}