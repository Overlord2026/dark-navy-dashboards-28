import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { 
  Calculator, 
  TrendingUp, 
  PieChart, 
  Home,
  DollarSign,
  Calendar,
  Info
} from "lucide-react";

export const AdvancedCalculators = () => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Interactive Financial Calculators</h2>
        <p className="text-muted-foreground">
          Advanced tools to help with your financial decisions
        </p>
      </div>

      <Tabs defaultValue="portfolio-optimization" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="portfolio-optimization">Portfolio</TabsTrigger>
          <TabsTrigger value="tax-efficiency">Tax Impact</TabsTrigger>
          <TabsTrigger value="estate-planning">Estate</TabsTrigger>
          <TabsTrigger value="business-valuation">Business</TabsTrigger>
        </TabsList>

        <TabsContent value="portfolio-optimization">
          <PortfolioOptimizationCalculator />
        </TabsContent>

        <TabsContent value="tax-efficiency">
          <TaxEfficiencyCalculator />
        </TabsContent>

        <TabsContent value="estate-planning">
          <EstateplanningCalculator />
        </TabsContent>

        <TabsContent value="business-valuation">
          <BusinessValuationCalculator />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const PortfolioOptimizationCalculator = () => {
  const [inputs, setInputs] = useState({
    currentValue: "",
    monthlyContribution: "",
    timeHorizon: "",
    riskTolerance: "moderate"
  });

  const [results, setResults] = useState<any>(null);

  const calculateOptimization = () => {
    const currentValue = parseFloat(inputs.currentValue);
    const monthlyContribution = parseFloat(inputs.monthlyContribution);
    const years = parseFloat(inputs.timeHorizon);

    // Sample calculation - in real implementation, this would be more sophisticated
    const expectedReturn = inputs.riskTolerance === "conservative" ? 0.06 : 
                          inputs.riskTolerance === "moderate" ? 0.08 : 0.10;
    
    const months = years * 12;
    const monthlyReturn = expectedReturn / 12;
    
    const futureValue = currentValue * Math.pow(1 + expectedReturn, years) +
                       monthlyContribution * (Math.pow(1 + monthlyReturn, months) - 1) / monthlyReturn;

    setResults({
      futureValue: futureValue.toFixed(0),
      totalContributions: (currentValue + monthlyContribution * months).toFixed(0),
      totalGrowth: (futureValue - currentValue - monthlyContribution * months).toFixed(0)
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Portfolio Optimization Calculator
        </CardTitle>
        <CardDescription>
          Optimize your portfolio allocation based on your risk tolerance and time horizon
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="currentValue">Current Portfolio Value</Label>
            <Input
              id="currentValue"
              type="number"
              placeholder="500000"
              value={inputs.currentValue}
              onChange={(e) => setInputs(prev => ({ ...prev, currentValue: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="monthlyContribution">Monthly Contribution</Label>
            <Input
              id="monthlyContribution"
              type="number"
              placeholder="5000"
              value={inputs.monthlyContribution}
              onChange={(e) => setInputs(prev => ({ ...prev, monthlyContribution: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeHorizon">Time Horizon (years)</Label>
            <Input
              id="timeHorizon"
              type="number"
              placeholder="20"
              value={inputs.timeHorizon}
              onChange={(e) => setInputs(prev => ({ ...prev, timeHorizon: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="riskTolerance">Risk Tolerance</Label>
            <select
              className="w-full p-2 border rounded-md"
              value={inputs.riskTolerance}
              onChange={(e) => setInputs(prev => ({ ...prev, riskTolerance: e.target.value }))}
            >
              <option value="conservative">Conservative (6% return)</option>
              <option value="moderate">Moderate (8% return)</option>
              <option value="aggressive">Aggressive (10% return)</option>
            </select>
          </div>
        </div>

        <Button onClick={calculateOptimization} className="w-full">
          Calculate Optimization
        </Button>

        {results && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-primary/5 rounded-lg p-6 space-y-4"
          >
            <h3 className="font-semibold text-lg">Projected Results</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  ${parseInt(results.futureValue).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Future Value</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  ${parseInt(results.totalGrowth).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Total Growth</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  ${parseInt(results.totalContributions).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Total Contributions</div>
              </div>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

const TaxEfficiencyCalculator = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChart className="h-5 w-5" />
          Tax Efficiency Calculator
        </CardTitle>
        <CardDescription>
          Calculate the tax impact of your investment decisions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <Info className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Advanced Tax Calculator</h3>
          <p className="text-muted-foreground mb-4">
            This sophisticated calculator helps you understand the tax implications of various investment strategies.
          </p>
          <Button>
            Access Tax Calculator
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const EstateplanningCalculator = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="h-5 w-5" />
          Estate Planning Calculator
        </CardTitle>
        <CardDescription>
          Plan your estate and understand tax implications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <Info className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Estate Planning Tools</h3>
          <p className="text-muted-foreground mb-4">
            Calculate estate taxes, trust benefits, and wealth transfer strategies.
          </p>
          <Button>
            Access Estate Calculator
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const BusinessValuationCalculator = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Business Valuation Calculator
        </CardTitle>
        <CardDescription>
          Estimate your business value using multiple methodologies
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <Info className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Business Valuation Tools</h3>
          <p className="text-muted-foreground mb-4">
            Value your business using DCF, multiples, and asset-based approaches.
          </p>
          <Button>
            Access Valuation Calculator
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};