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
import { Calculator, TrendingUp, Users } from 'lucide-react';
import { seedRetirementRoadmap } from '@/tools/seeds/retirement-roadmap';
import { ProfessionalRequestModal } from '@/components/professional-collaboration/ProfessionalRequestModal';

export default function RetirementRoadmapTool() {
  const [inputs, setInputs] = useState({
    currentAge: 45,
    retirementAge: 65,
    currentSavings: 250000,
    monthlyContribution: 2000,
    expectedReturn: 7
  });
  const [results, setResults] = useState<any>(null);
  const [proofSlip, setProofSlip] = useState<any>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);

  const calculateRoadmap = () => {
    const years = inputs.retirementAge - inputs.currentAge;
    const monthlyReturn = inputs.expectedReturn / 100 / 12;
    const totalMonths = years * 12;
    
    // Future value calculation
    const futureValue = inputs.currentSavings * Math.pow(1 + inputs.expectedReturn / 100, years) +
      inputs.monthlyContribution * ((Math.pow(1 + monthlyReturn, totalMonths) - 1) / monthlyReturn);
    
    const projectedNeeded = 1200000; // Example target
    const shortfall = Math.max(0, projectedNeeded - futureValue);
    
    const calculatedResults = {
      projectedValue: futureValue,
      projectedNeeded,
      shortfall,
      onTrack: shortfall === 0,
      recommendedIncrease: shortfall > 0 ? Math.ceil(shortfall / totalMonths) : 0
    };
    
    setResults(calculatedResults);
    
    // Create proof slip
    const proof = {
      id: `rr-${Date.now()}`,
      type: 'Retirement Analysis',
      tool: 'retirement-roadmap',
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
        'Field,Value',
        `Current Age,${inputs.currentAge}`,
        `Retirement Age,${inputs.retirementAge}`,
        `Current Savings,$${inputs.currentSavings.toLocaleString()}`,
        `Monthly Contribution,$${inputs.monthlyContribution}`,
        `Expected Return,${inputs.expectedReturn}%`,
        ...(results ? [
          `Projected Value,$${Math.round(results.projectedValue).toLocaleString()}`,
          `Target Needed,$${results.projectedNeeded.toLocaleString()}`,
          `Shortfall,$${results.shortfall.toLocaleString()}`
        ] : [])
      ].join('\n');
      
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'retirement-roadmap.csv';
      a.click();
    }
  };

  return (
    <div className="min-h-screen bg-bfo-navy">
      <div className="container mx-auto p-6 max-w-4xl">
      <ToolHeader title="Retirement Roadmap" />
      
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <ToolDisclaimer type="general" />
          <LoadDemoButton 
            toolKey="retirement-roadmap"
            onLoadDemo={() => seedRetirementRoadmap()}
          />
        </div>

        <Card className="bg-[hsl(210_65%_13%)] border-4 border-bfo-gold shadow-lg shadow-bfo-gold/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Calculator className="w-5 h-5 text-bfo-gold" />
              Retirement Planning Inputs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="currentAge" className="text-white">Current Age</Label>
                <Input
                  id="currentAge"
                  type="number"
                  value={inputs.currentAge}
                  onChange={(e) => setInputs({...inputs, currentAge: parseInt(e.target.value) || 0})}
                />
              </div>
              <div>
                <Label htmlFor="retirementAge" className="text-white">Target Retirement Age</Label>
                <Input
                  id="retirementAge"
                  type="number"
                  value={inputs.retirementAge}
                  onChange={(e) => setInputs({...inputs, retirementAge: parseInt(e.target.value) || 0})}
                />
              </div>
              <div>
                <Label htmlFor="currentSavings" className="text-white">Current Savings ($)</Label>
                <Input
                  id="currentSavings"
                  type="number"
                  value={inputs.currentSavings}
                  onChange={(e) => setInputs({...inputs, currentSavings: parseInt(e.target.value) || 0})}
                />
              </div>
              <div>
                <Label htmlFor="monthlyContribution" className="text-white">Monthly Contribution ($)</Label>
                <Input
                  id="monthlyContribution"
                  type="number"
                  value={inputs.monthlyContribution}
                  onChange={(e) => setInputs({...inputs, monthlyContribution: parseInt(e.target.value) || 0})}
                />
              </div>
              <div>
                <Label htmlFor="expectedReturn" className="text-white">Expected Annual Return (%)</Label>
                <Input
                  id="expectedReturn"
                  type="number"
                  step="0.1"
                  value={inputs.expectedReturn}
                  onChange={(e) => setInputs({...inputs, expectedReturn: parseFloat(e.target.value) || 0})}
                />
              </div>
            </div>
            
            <Button onClick={calculateRoadmap} className="w-full bg-bfo-gold text-black hover:bg-bfo-gold/90">
              <TrendingUp className="w-4 h-4 mr-2" />
              Calculate Retirement Roadmap
            </Button>
          </CardContent>
        </Card>

        {results && (
          <Card className="bg-[hsl(210_65%_13%)] border-4 border-bfo-gold shadow-lg shadow-bfo-gold/20">
            <CardHeader>
              <CardTitle className="text-white">Your Retirement Projection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-bfo-gold">
                    ${Math.round(results.projectedValue).toLocaleString()}
                  </div>
                  <div className="text-sm text-white/70">Projected Value</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    ${results.projectedNeeded.toLocaleString()}
                  </div>
                  <div className="text-sm text-white/70">Target Needed</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${results.shortfall === 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {results.shortfall === 0 ? '✓ On Track' : `$${results.shortfall.toLocaleString()} Short`}
                  </div>
                  <div className="text-sm text-white/70">Status</div>
                </div>
              </div>
              
              {results.recommendedIncrease > 0 && (
                <div className="mt-4 p-4 bg-bfo-gold/10 rounded-lg border border-bfo-gold/30">
                  <p className="text-bfo-gold">
                    <strong>Recommendation:</strong> Increase monthly contributions by ${results.recommendedIncrease} to meet your retirement goal.
                  </p>
                </div>
              )}
              
              {/* Professional Review Request */}
              <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-primary mb-2">Need Professional Guidance?</h4>
                    <p className="text-sm text-muted-foreground">
                      Get your SWAG™ retirement analysis reviewed by a qualified financial advisor
                    </p>
                  </div>
                  <Button 
                    onClick={() => setShowRequestModal(true)}
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary/10"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Request Advisor Review
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {proofSlip && (
          <ProofSlipPreview 
            title={proofSlip.type}
            summary={`Analysis completed for retirement at age ${inputs.retirementAge}`}
            anchored={proofSlip.anchored}
            timestamp={proofSlip.timestamp}
          />
        )}

        <div className="flex justify-end">
          <ExportButtons 
            csvEnabled={!!results}
            zipEnabled={false}
            onCsvExport={() => handleExport('csv')}
          />
        </div>
      </div>
      </div>

      {/* Professional Request Modal */}
      <ProfessionalRequestModal
        open={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        toolData={{
          tool_type: 'swag_retirement_roadmap',
          inputs,
          results,
          analysis_date: new Date().toISOString()
        }}
        defaultRequestType="swag_analysis_review"
        defaultProfessionalType="advisor"
      />
    </div>
  );
}