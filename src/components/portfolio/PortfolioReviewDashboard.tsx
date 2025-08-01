import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/lib/formatters';
import { RiskScoreCalculator } from './RiskScoreCalculator';
import { SideBySideComparison } from './SideBySideComparison';
import { ClientRiskProfileQuiz } from './ClientRiskProfileQuiz';
import { ManualEntryForm } from './ManualEntryForm';

interface Portfolio {
  name: string;
  holdings: Array<{
    symbol: string;
    name: string;
    allocation: number;
    value: number;
    marketData?: {
      beta?: number;
      alpha?: number;
      volatility?: number;
      yield?: number;
      ytdReturn?: number;
      oneYearReturn?: number;
    };
  }>;
  riskScore: number;
  annualIncome: number;
  totalValue: number;
}

export function PortfolioReviewDashboard() {
  const [clientName, setClientName] = useState('');
  const [currentPortfolio, setCurrentPortfolio] = useState<Portfolio | null>(null);
  const [proposedPortfolio, setProposedPortfolio] = useState<Portfolio | null>(null);
  const [showRiskQuiz, setShowRiskQuiz] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);

  // Sample current portfolio data
  const sampleCurrentPortfolio: Portfolio = {
    name: "Current Portfolio",
    holdings: [
      { symbol: "AAPL", name: "Apple Inc.", allocation: 23, value: 115000 },
      { symbol: "NVDA", name: "NVIDIA Corp.", allocation: 11, value: 55000 },
      { symbol: "MSFT", name: "Microsoft Corp.", allocation: 9, value: 45000 },
      { symbol: "GOOGL", name: "Alphabet Inc.", allocation: 8, value: 40000 },
      { symbol: "TSLA", name: "Tesla Inc.", allocation: 7, value: 35000 }
    ],
    riskScore: 72,
    annualIncome: 12300,
    totalValue: 500000
  };

  // Sample proposed portfolio data
  const sampleProposedPortfolio: Portfolio = {
    name: "AWM Income Model",
    holdings: [
      { symbol: "AWM-IB", name: "AWM Income Blend", allocation: 35, value: 175000 },
      { symbol: "PMA", name: "Private Market Alpha", allocation: 20, value: 100000 },
      { symbol: "BOND-MIX", name: "Diversified Bonds", allocation: 25, value: 125000 },
      { symbol: "REIT", name: "Real Estate", allocation: 15, value: 75000 },
      { symbol: "CASH", name: "Cash & Equivalents", allocation: 5, value: 25000 }
    ],
    riskScore: 38,
    annualIncome: 22500,
    totalValue: 500000
  };

  const getRiskLabel = (score: number) => {
    if (score <= 25) return { label: "Conservative", color: "bg-green-500" };
    if (score <= 45) return { label: "Moderate-Income", color: "bg-blue-500" };
    if (score <= 65) return { label: "Growth", color: "bg-yellow-500" };
    return { label: "Aggressive", color: "bg-red-500" };
  };

  const loadSampleData = () => {
    setCurrentPortfolio(sampleCurrentPortfolio);
    setProposedPortfolio(sampleProposedPortfolio);
  };

  const pieData = (portfolio: Portfolio) => 
    portfolio.holdings.map(holding => ({
      name: holding.symbol,
      value: holding.allocation,
      fullName: holding.name
    }));

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', '#8884d8', '#82ca9d'];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Portfolio Review Generator</h1>
        <p className="text-muted-foreground mt-2">Comprehensive portfolio analysis and proposal generation</p>
      </div>

      {/* Section 1: Client Name/Search */}
      <Card>
        <CardHeader>
          <CardTitle>1. Client Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium">Client Name</label>
              <Input
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Enter client name or search..."
                className="mt-1"
              />
            </div>
            <Button variant="outline">Lookup/Import</Button>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Portfolio Import/Upload */}
      <Card>
        <CardHeader>
          <CardTitle>2. Portfolio Import/Upload</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button variant="outline">Upload Statements</Button>
            <Button variant="outline">Connect Account</Button>
            <Button 
              variant="outline"
              onClick={() => setShowManualEntry(true)}
            >
              Manual Entry
            </Button>
            <Button onClick={loadSampleData}>Load Sample Data</Button>
          </div>
        </CardContent>
      </Card>

      {/* Sections 3 & 4: Current vs Proposed Portfolio */}
      {currentPortfolio && proposedPortfolio && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current Portfolio */}
          <Card>
            <CardHeader>
              <CardTitle>3. Portfolio Snapshot (CURRENT)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData(currentPortfolio)}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {pieData(currentPortfolio).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Allocation']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm">Risk Score:</span>
                  <Badge className={getRiskLabel(currentPortfolio.riskScore).color}>
                    {currentPortfolio.riskScore} {getRiskLabel(currentPortfolio.riskScore).label}
                  </Badge>
                </div>
                <p className="text-sm">
                  <span className="font-medium">Income Yield:</span> {formatCurrency(currentPortfolio.annualIncome)}/yr
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Top 5 Holdings:</h4>
                <div className="space-y-1">
                  {currentPortfolio.holdings.slice(0, 5).map((holding, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{holding.symbol}</span>
                      <span>{holding.allocation}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Proposed Portfolio */}
          <Card>
            <CardHeader>
              <CardTitle>4. Model/Proposal (PROPOSED)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData(proposedPortfolio)}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {pieData(proposedPortfolio).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Allocation']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm">Risk Score:</span>
                  <Badge className={getRiskLabel(proposedPortfolio.riskScore).color}>
                    {proposedPortfolio.riskScore} {getRiskLabel(proposedPortfolio.riskScore).label}
                  </Badge>
                </div>
                <p className="text-sm">
                  <span className="font-medium">Income Yield:</span> {formatCurrency(proposedPortfolio.annualIncome)}/yr
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Model Holdings:</h4>
                <div className="space-y-1">
                  {proposedPortfolio.holdings.map((holding, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{holding.name}</span>
                      <span>{holding.allocation}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Section 5: Visual Side-by-Side Comparison */}
      {currentPortfolio && proposedPortfolio && (
        <SideBySideComparison 
          currentPortfolio={currentPortfolio}
          proposedPortfolio={proposedPortfolio}
        />
      )}

      {/* Section 6: Client Risk Profile */}
      <Card>
        <CardHeader>
          <CardTitle>6. Client Risk Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button 
              variant="outline"
              onClick={() => setShowRiskQuiz(true)}
            >
              Take Risk Quiz
            </Button>
            <Button variant="outline">Import Profile</Button>
          </div>
        </CardContent>
      </Card>

      {/* Section 7: PDF/Export & Branding */}
      <Card>
        <CardHeader>
          <CardTitle>7. Export & Sharing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button variant="outline">Export PDF</Button>
            <Button variant="outline">Email Proposal</Button>
            <Button variant="outline">Customize Branding</Button>
          </div>
        </CardContent>
      </Card>

      {/* Section 8: Call to Action */}
      <Card>
        <CardHeader>
          <CardTitle>8. Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button className="bg-primary">Schedule a Review</Button>
            <Button variant="outline">Send to Client</Button>
            <Button variant="outline">Save as Draft</Button>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      {showRiskQuiz && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <ClientRiskProfileQuiz 
              onClose={() => setShowRiskQuiz(false)}
              onComplete={(profile) => {
                console.log('Risk profile completed:', profile);
                setShowRiskQuiz(false);
              }}
            />
          </div>
        </div>
      )}

      {showManualEntry && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div>
              <h3 className="text-lg font-semibold mb-4">Manual Portfolio Entry</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Enter portfolio holdings manually if you don't have statements to upload.
              </p>
              <div className="flex gap-2">
                <Button onClick={() => setShowManualEntry(false)} variant="outline">
                  Cancel
                </Button>
                <Button onClick={() => {
                  // This would be replaced with actual form submission
                  setShowManualEntry(false);
                }}>
                  Save Portfolio
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}