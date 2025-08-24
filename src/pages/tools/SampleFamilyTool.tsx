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
import { Calculator } from 'lucide-react';

// Example implementation showing the pattern for all Family tools
export default function SampleFamilyTool() {
  const [inputs, setInputs] = useState({
    age: 65,
    balance: 100000,
    rate: 4.5
  });
  const [results, setResults] = useState<any>(null);
  const [proofSlip, setProofSlip] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleLoadDemo = () => {
    setInputs({
      age: 74,
      balance: 485000,
      rate: 4.2
    });
    // Simulate creating a proof slip
    setTimeout(() => {
      setProofSlip({
        title: 'RMD Calculation Complete',
        summary: 'Required distribution: $18,653 for 2024',
        anchored: true,
        timestamp: new Date().toISOString()
      });
    }, 1000);
  };

  const handleCalculate = () => {
    setLoading(true);
    // Simulate calculation
    setTimeout(() => {
      const rmd = inputs.balance * 0.0385; // Sample RMD factor
      setResults({ rmd });
      setProofSlip({
        title: 'RMD Calculation Complete',
        summary: `Required distribution: $${rmd.toLocaleString()} for 2024`,
        anchored: true,
        timestamp: new Date().toISOString()
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <ToolHeader title="RMD Calculator" />
      
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Tool Disclaimer */}
        <ToolDisclaimer type="rmd" />
        
        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="age">Current Age</Label>
                <Input
                  id="age"
                  type="number"
                  min="70"
                  max="120"
                  step="1"
                  value={inputs.age}
                  onChange={(e) => setInputs(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
                  placeholder="e.g., 74"
                  className="focus-visible:ring-2 focus-visible:ring-cyan-400"
                />
              </div>
              
              <div>
                <Label htmlFor="balance">Account Balance ($)</Label>
                <Input
                  id="balance"
                  type="number"
                  min="0"
                  step="1000"
                  value={inputs.balance}
                  onChange={(e) => setInputs(prev => ({ ...prev, balance: parseInt(e.target.value) || 0 }))}
                  placeholder="e.g., 485000"
                  className="focus-visible:ring-2 focus-visible:ring-cyan-400"
                />
              </div>
              
              <div>
                <Label htmlFor="rate">Expected Return (%)</Label>
                <Input
                  id="rate"
                  type="number"
                  min="0"
                  max="20"
                  step="0.1"
                  value={inputs.rate}
                  onChange={(e) => setInputs(prev => ({ ...prev, rate: parseFloat(e.target.value) || 0 }))}
                  placeholder="e.g., 4.5"
                  className="focus-visible:ring-2 focus-visible:ring-cyan-400"
                />
              </div>

              <div className="flex items-center gap-2 pt-4">
                <Button 
                  onClick={handleCalculate}
                  disabled={loading}
                  className="focus-visible:ring-2 focus-visible:ring-cyan-400"
                >
                  {loading ? 'Calculating...' : 'Calculate RMD'}
                </Button>
                
                <LoadDemoButton
                  toolKey="rmd-check"
                  onLoadDemo={handleLoadDemo}
                  hasData={!!results}
                />
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <div className="space-y-4">
            {results && (
              <Card>
                <CardHeader>
                  <CardTitle>Required Minimum Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary mb-2">
                    ${results.rmd.toLocaleString()}
                  </div>
                  <p className="text-muted-foreground">
                    For tax year 2024, based on current balance and age
                  </p>
                </CardContent>
              </Card>
            )}

            {proofSlip && (
              <ProofSlipPreview
                title={proofSlip.title}
                summary={proofSlip.summary}
                anchored={proofSlip.anchored}
                timestamp={proofSlip.timestamp}
              />
            )}

            <ExportButtons
              exports={{ csv: !!results, zip: !!results }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}