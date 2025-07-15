import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, Calendar, Heart, Info } from "lucide-react";

export default function HealthcareSavingsCalculator() {
  const [portfolioValue, setPortfolioValue] = useState([1000000]);
  const [currentAdvisorFee, setCurrentAdvisorFee] = useState([1.5]);
  const [ourFee, setOurFee] = useState([0.75]);
  const [timeHorizon, setTimeHorizon] = useState("20y");
  const [growthRate] = useState(7); // Fixed at 7% as shown in reference

  // Calculate savings and metrics
  const calculateSavings = () => {
    const portfolio = portfolioValue[0];
    const currentFee = currentAdvisorFee[0] / 100;
    const newFee = ourFee[0] / 100;
    const years = parseInt(timeHorizon.replace('y', ''));
    const rate = growthRate / 100;

    const annualFeeSavings = portfolio * (currentFee - newFee);
    
    // Compound growth calculation
    const currentScenario = portfolio * Math.pow(1 + rate - currentFee, years);
    const ourScenario = portfolio * Math.pow(1 + rate - newFee, years);
    const totalCompoundSavings = ourScenario - currentScenario;
    
    // Additional longevity (how much longer money lasts)
    const additionalYears = Math.log(currentScenario / portfolio) / Math.log(1 + rate - newFee) - 
                           Math.log(ourScenario / portfolio) / Math.log(1 + rate - currentFee);
    
    // Healthcare funding (annual fee savings)
    const healthcareFunding = annualFeeSavings;

    return {
      annualFeeSavings,
      totalCompoundSavings,
      additionalYears: Math.max(0, additionalYears),
      healthcareFunding
    };
  };

  const metrics = calculateSavings();

  const timeHorizonOptions = [
    { value: "5y", label: "5y" },
    { value: "10y", label: "10y" },
    { value: "15y", label: "15y" },
    { value: "20y", label: "20y" },
    { value: "25y", label: "25y" },
    { value: "30y", label: "30y" }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-6xl">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Healthcare Savings Calculator</h1>
        <p className="text-muted-foreground">
          See how our value-driven pricing can fund your family's healthcare optimization
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Investment Details</CardTitle>
          <CardDescription>Adjust these parameters to see your potential savings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Current Portfolio Value */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Label className="text-base font-medium">Current Portfolio Value</Label>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-amber-500 rounded flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-black" />
              </div>
              <Input
                type="text"
                value={portfolioValue[0].toLocaleString()}
                onChange={(e) => {
                  const value = parseInt(e.target.value.replace(/,/g, '')) || 0;
                  setPortfolioValue([value]);
                }}
                className="w-32"
              />
            </div>
          </div>

          {/* Expected Annual Growth Rate */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Label className="text-base font-medium">Expected Annual Growth Rate</Label>
              <Badge variant="secondary" className="bg-amber-500 text-black">7%</Badge>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Time Horizon (Years)</Label>
              <div className="flex gap-2">
                {timeHorizonOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={timeHorizon === option.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTimeHorizon(option.value)}
                    className={timeHorizon === option.value ? "bg-amber-500 text-black hover:bg-amber-600" : ""}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Current Advisor Fee */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Label className="text-base font-medium">Current Advisor Fee</Label>
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-white" />
              </div>
              <Input
                type="text"
                value={`${currentAdvisorFee[0]}%`}
                onChange={(e) => {
                  const value = parseFloat(e.target.value.replace('%', '')) || 0;
                  setCurrentAdvisorFee([value]);
                }}
                className="w-20"
              />
            </div>
            <div className="px-4">
              <Slider
                value={currentAdvisorFee}
                onValueChange={setCurrentAdvisorFee}
                max={3}
                min={0.5}
                step={0.25}
                className="w-full"
              />
            </div>
            <div className="text-sm text-muted-foreground">Rate: {currentAdvisorFee[0]}%</div>
          </div>

          {/* Our Fee */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Our Fee</Label>
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-white" />
              </div>
              <Input
                type="text"
                value={`${ourFee[0]}%`}
                onChange={(e) => {
                  const value = parseFloat(e.target.value.replace('%', '')) || 0;
                  setOurFee([value]);
                }}
                className="w-20"
              />
            </div>
            <div className="px-4">
              <Slider
                value={ourFee}
                onValueChange={setOurFee}
                max={2}
                min={0.25}
                step={0.25}
                className="w-full"
              />
            </div>
            <div className="text-sm text-muted-foreground">Rate: {ourFee[0]}%</div>
          </div>
        </CardContent>
      </Card>

      {/* Results Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Annual Fee Savings</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${metrics.annualFeeSavings.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Every year you save</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Compound Savings</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              ${metrics.totalCompoundSavings.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Over {timeHorizon} years</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Additional Longevity</CardTitle>
            <Calendar className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {metrics.additionalYears.toFixed(1)} years
            </div>
            <p className="text-xs text-muted-foreground">Your money lasts longer</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Healthcare Funding</CardTitle>
            <Heart className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ${metrics.healthcareFunding.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Annual healthcare budget</p>
          </CardContent>
        </Card>
      </div>

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-bold mb-2">Ready to optimize your healthcare savings?</h3>
          <p className="text-muted-foreground mb-4">
            See how our platform can help you achieve these savings while improving your family's health outcomes.
          </p>
          <div className="flex gap-4 justify-center">
            <Button className="bg-amber-500 hover:bg-amber-600 text-black">
              Schedule Consultation
            </Button>
            <Button variant="outline">
              Learn More
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}