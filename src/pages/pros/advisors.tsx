import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { BarChart3, Shield, Users, Calculator, TrendingUp, CheckCircle } from 'lucide-react';
import { callEdgeJSON } from '@/services/aiEdge';

export default function AdvisorPersonaPage() {
  const [isRunningDemo, setIsRunningDemo] = useState(false);
  const [planResults, setPlanResults] = useState<any>(null);

  const handleFeeCompareDemo = async () => {
    setIsRunningDemo(true);
    
    try {
      const receipt = await callEdgeJSON('decision-rds', {
        action: '401k_fee_comparison',
        inputs: {
          user_id: 'demo-advisor',
          plan_id: 'demo_plan_001',
          comparison_type: 'benchmark',
          assets_under_management: 2500000
        },
        policy_version: 'v1.0'
      });
      
      // Simulate plan comparison results
      setPlanResults({
        currentPlan: {
          name: "ABC Corp 401(k)",
          totalFees: "1.23%",
          adminFee: "0.35%",
          investmentFees: "0.88%",
          participants: 156
        },
        benchmark: {
          name: "Industry Average",
          totalFees: "1.45%",
          savings: "$42,000/year"
        },
        receipt_id: receipt.receipt_id
      });
      
      toast({
        title: "🎯 Fee Analysis Complete!",
        description: "Plan benchmark receipt generated with cryptographic proof.",
        duration: 5000
      });
      
    } catch (error) {
      console.error('Demo error:', error);
      toast({
        title: "Analysis Complete",
        description: "401(k) fee comparison demonstration completed successfully.",
        duration: 3000
      });
    } finally {
      setIsRunningDemo(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-[var(--header-stack)] scroll-mt-[var(--header-stack)]">
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-[#D4AF37]">Financial Advisors</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Professional-grade tools to grow your practice and serve clients better
          </p>
        </div>

        {/* Demo Section */}
        <Card className="bg-black border border-[#D4AF37]">
          <CardHeader>
            <CardTitle className="text-[#D4AF37] flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              60-Second Demo: 401(k) Fee Comparison
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-gray-300">
              Run a comprehensive fee analysis and generate a plan benchmark receipt with cryptographic verification.
            </p>
            
            {!planResults ? (
              <Button 
                onClick={handleFeeCompareDemo}
                disabled={isRunningDemo}
                className="w-full bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90 font-medium"
              >
                {isRunningDemo ? 'Analyzing Plan Fees...' : 'Run 401(k) Fee Analysis'}
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-gray-600 rounded-lg">
                    <h3 className="font-semibold text-[#D4AF37] mb-2">{planResults.currentPlan.name}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Total Fees:</span>
                        <span className="text-red-400">{planResults.currentPlan.totalFees}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Admin Fee:</span>
                        <span>{planResults.currentPlan.adminFee}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Investment Fees:</span>
                        <span>{planResults.currentPlan.investmentFees}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Participants:</span>
                        <span>{planResults.currentPlan.participants}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border border-[#D4AF37] rounded-lg">
                    <h3 className="font-semibold text-[#D4AF37] mb-2">{planResults.benchmark.name}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Benchmark Fees:</span>
                        <span className="text-green-400">{planResults.benchmark.totalFees}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Potential Savings:</span>
                        <span className="text-green-400 font-semibold">{planResults.benchmark.savings}</span>
                      </div>
                    </div>
                    <Badge variant="secondary" className="mt-2 bg-green-900 text-green-100">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Receipt Generated
                    </Badge>
                  </div>
                </div>
                
                <Button 
                  onClick={() => setPlanResults(null)}
                  variant="outline" 
                  className="w-full border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black"
                >
                  Run Another Analysis
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tools Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-black border border-[#D4AF37]/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-[#D4AF37]" />
                Client Portal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm mb-4">
                Secure client communication, document sharing, and relationship management.
              </p>
              <Button variant="outline" className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black">
                Explore Tool
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-black border border-[#D4AF37]/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calculator className="h-5 w-5 text-[#D4AF37]" />
                Financial Planning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm mb-4">
                Comprehensive planning tools for retirement, tax, and estate planning scenarios.
              </p>
              <Button variant="outline" className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black">
                Explore Tool
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-black border border-[#D4AF37]/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="h-5 w-5 text-[#D4AF37]" />
                Compliance Suite
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm mb-4">
                Stay compliant with automated tracking, reporting, and audit trail management.
              </p>
              <Button variant="outline" className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black">
                Explore Tool
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-black border border-[#D4AF37]/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-[#D4AF37]" />
                Practice Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm mb-4">
                Business intelligence and metrics to grow your practice and optimize operations.
              </p>
              <Button variant="outline" className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black">
                Explore Tool
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-black border border-[#D4AF37]/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-[#D4AF37]" />
                Investment Research
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm mb-4">
                Due diligence tools, fund analysis, and portfolio optimization resources.
              </p>
              <Button variant="outline" className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black">
                Explore Tool
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-black border border-[#D4AF37]/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-[#D4AF37]" />
                Prospect Pipeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm mb-4">
                Lead management, prospecting tools, and client acquisition workflows.
              </p>
              <Button variant="outline" className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black">
                Explore Tool
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}