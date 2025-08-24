import React, { useState } from 'react';
import { ToolHeader } from '@/components/tools/ToolHeader';
import { ToolDisclaimer } from '@/components/tools/ToolDisclaimer';
import { ProofSlipPreview } from '@/components/tools/ProofSlipPreview';
import { ExportButtons } from '@/components/tools/ExportButtons';
import { LoadDemoButton } from '@/components/tools/LoadDemoButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { DollarSign, Users } from 'lucide-react';
import seedSocialSecurity from '@/tools/seeds/social-security';

export default function SocialSecurityTool() {
  const [inputs, setInputs] = useState({
    currentAge: 62,
    fullRetirementAge: 67,
    estimatedBenefit: 2850,
    includeSpousal: false,
    spouseAge: 60,
    spouseBenefit: 1200
  });
  const [results, setResults] = useState<any>(null);
  const [proofSlip, setProofSlip] = useState<any>(null);

  const calculateOptimization = () => {
    const earlyAge = 62;
    const fullAge = inputs.fullRetirementAge;
    const delayedAge = 70;
    
    // Early filing (30% reduction)
    const earlyBenefit = Math.round(inputs.estimatedBenefit * 0.70);
    
    // Full retirement age
    const fullBenefit = inputs.estimatedBenefit;
    
    // Delayed retirement (8% increase per year after FRA)
    const delayYears = delayedAge - fullAge;
    const delayedBenefit = Math.round(fullBenefit * (1 + 0.08 * delayYears));
    
    // Lifetime value calculations (assuming life expectancy of 85)
    const earlyLifetime = earlyBenefit * 12 * (85 - earlyAge);
    const fullLifetime = fullBenefit * 12 * (85 - fullAge);
    const delayedLifetime = delayedBenefit * 12 * (85 - delayedAge);
    
    let recommendation = 'File at full retirement age';
    if (delayedLifetime > fullLifetime && delayedLifetime > earlyLifetime) {
      recommendation = 'Consider delaying to age 70';
    } else if (earlyLifetime > fullLifetime) {
      recommendation = 'Early filing may be beneficial';
    }
    
    const calculatedResults = {
      earlyFiling: { age: earlyAge, monthly: earlyBenefit, lifetime: earlyLifetime },
      fullFiling: { age: fullAge, monthly: fullBenefit, lifetime: fullLifetime },
      delayedFiling: { age: delayedAge, monthly: delayedBenefit, lifetime: delayedLifetime },
      recommendation,
      breakEvenAge: Math.round((delayedBenefit - fullBenefit) * 12 / (delayedBenefit - fullBenefit) + delayedAge)
    };
    
    setResults(calculatedResults);
    
    // Create proof slip
    const proof = {
      id: `ss-${Date.now()}`,
      type: 'SS Timing Analysis',
      tool: 'social-security',
      timestamp: new Date().toISOString(),
      anchored: true,
      data: {
        ...inputs,
        ...calculatedResults
      }
    };
    
    setProofSlip(proof);
    
    // Store in localStorage
    const existingSlips = JSON.parse(localStorage.getItem('proofSlips') || '[]');
    existingSlips.unshift(proof);
    localStorage.setItem('proofSlips', JSON.stringify(existingSlips));
  };

  const handleExport = (format: string) => {
    if (format === 'csv') {
      const csvData = [
        'Filing Strategy,Age,Monthly Benefit,Lifetime Value',
        `Early Filing,${results.earlyFiling.age},$${results.earlyFiling.monthly},$${results.earlyFiling.lifetime.toLocaleString()}`,
        `Full Retirement,${results.fullFiling.age},$${results.fullFiling.monthly},$${results.fullFiling.lifetime.toLocaleString()}`,
        `Delayed Filing,${results.delayedFiling.age},$${results.delayedFiling.monthly},$${results.delayedFiling.lifetime.toLocaleString()}`,
        `Recommendation,${results.recommendation},,`
      ].join('\n');
      
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'social-security-analysis.csv';
      a.click();
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <ToolHeader title="Social Security Optimizer" />
      
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <ToolDisclaimer type="social-security" />
          <LoadDemoButton 
            toolKey="social-security"
            onLoadDemo={() => seedSocialSecurity()}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Social Security Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="currentAge">Current Age</Label>
                <Input
                  id="currentAge"
                  type="number"
                  value={inputs.currentAge}
                  onChange={(e) => setInputs({...inputs, currentAge: parseInt(e.target.value) || 0})}
                />
              </div>
              <div>
                <Label htmlFor="fullRetirementAge">Full Retirement Age</Label>
                <Input
                  id="fullRetirementAge"
                  type="number"
                  value={inputs.fullRetirementAge}
                  onChange={(e) => setInputs({...inputs, fullRetirementAge: parseInt(e.target.value) || 0})}
                />
              </div>
              <div>
                <Label htmlFor="estimatedBenefit">Estimated Monthly Benefit at FRA ($)</Label>
                <Input
                  id="estimatedBenefit"
                  type="number"
                  value={inputs.estimatedBenefit}
                  onChange={(e) => setInputs({...inputs, estimatedBenefit: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="includeSpousal"
                checked={inputs.includeSpousal}
                onCheckedChange={(checked) => setInputs({...inputs, includeSpousal: checked})}
              />
              <Label htmlFor="includeSpousal">Include Spousal Strategy</Label>
            </div>
            
            {inputs.includeSpousal && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                <div>
                  <Label htmlFor="spouseAge">Spouse Age</Label>
                  <Input
                    id="spouseAge"
                    type="number"
                    value={inputs.spouseAge}
                    onChange={(e) => setInputs({...inputs, spouseAge: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <Label htmlFor="spouseBenefit">Spouse Estimated Benefit ($)</Label>
                  <Input
                    id="spouseBenefit"
                    type="number"
                    value={inputs.spouseBenefit}
                    onChange={(e) => setInputs({...inputs, spouseBenefit: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>
            )}
            
            <Button onClick={calculateOptimization} className="w-full">
              <Users className="w-4 h-4 mr-2" />
              Analyze Filing Strategies
            </Button>
          </CardContent>
        </Card>

        {results && (
          <Card>
            <CardHeader>
              <CardTitle>Filing Strategy Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-lg font-semibold">Early Filing (Age {results.earlyFiling.age})</div>
                  <div className="text-2xl font-bold text-red-600">${results.earlyFiling.monthly}/month</div>
                  <div className="text-sm text-muted-foreground">
                    Lifetime: ${results.earlyFiling.lifetime.toLocaleString()}
                  </div>
                </div>
                <div className="text-center p-4 border rounded-lg bg-primary/5">
                  <div className="text-lg font-semibold">Full Retirement (Age {results.fullFiling.age})</div>
                  <div className="text-2xl font-bold text-primary">${results.fullFiling.monthly}/month</div>
                  <div className="text-sm text-muted-foreground">
                    Lifetime: ${results.fullFiling.lifetime.toLocaleString()}
                  </div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-lg font-semibold">Delayed Filing (Age {results.delayedFiling.age})</div>
                  <div className="text-2xl font-bold text-green-600">${results.delayedFiling.monthly}/month</div>
                  <div className="text-sm text-muted-foreground">
                    Lifetime: ${results.delayedFiling.lifetime.toLocaleString()}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-blue-800">
                  <strong>Recommendation:</strong> {results.recommendation}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {proofSlip && (
          <ProofSlipPreview 
            title={proofSlip.type}
            summary={`Filing strategy analysis completed - ${results.recommendation}`}
            anchored={proofSlip.anchored}
            timestamp={proofSlip.timestamp}
          />
        )}

        <div className="flex justify-end">
          <ExportButtons 
            exports={{ csv: !!results, zip: false }}
            onExport={(type) => handleExport(type)}
            toolKey="social-security"
          />
        </div>
      </div>
    </div>
  );
}