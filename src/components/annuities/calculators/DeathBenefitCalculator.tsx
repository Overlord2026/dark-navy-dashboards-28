import React, { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Shield, Calculator, Users, TrendingUp } from "lucide-react";

interface DeathBenefitInputs {
  premiumAmount: string;
  currentAge: string;
  benefitType: string;
  guaranteedPeriod: string;
  expectedReturn: string;
  withdrawalsTaken: string;
  spouseAge: string;
  jointLife: boolean;
}

export const DeathBenefitCalculator = () => {
  const [inputs, setInputs] = useState<DeathBenefitInputs>({
    premiumAmount: "",
    currentAge: "",
    benefitType: "return_of_premium",
    guaranteedPeriod: "10",
    expectedReturn: "4.5",
    withdrawalsTaken: "0",
    spouseAge: "",
    jointLife: false
  });

  const [results, setResults] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateDeathBenefit = useMemo(() => {
    if (!inputs.premiumAmount || !inputs.currentAge) return null;

    const premium = parseFloat(inputs.premiumAmount);
    const currentAge = parseInt(inputs.currentAge);
    const annualReturn = parseFloat(inputs.expectedReturn) / 100;
    const withdrawals = parseFloat(inputs.withdrawalsTaken) || 0;
    const guaranteedYears = parseInt(inputs.guaranteedPeriod);

    let deathBenefitProjections = [];

    for (let year = 1; year <= 30; year++) {
      const ageAtDeath = currentAge + year;
      let deathBenefit = 0;

      switch (inputs.benefitType) {
        case "return_of_premium":
          deathBenefit = premium - withdrawals;
          break;
        case "enhanced_death_benefit":
          const accumulatedValue = premium * Math.pow(1 + annualReturn, year) - withdrawals;
          deathBenefit = Math.max(premium - withdrawals, accumulatedValue);
          break;
        case "guaranteed_minimum":
          const guaranteedAmount = premium * 1.05; // 5% guaranteed minimum
          const marketValue = premium * Math.pow(1 + annualReturn, year) - withdrawals;
          deathBenefit = Math.max(guaranteedAmount - withdrawals, marketValue);
          break;
        case "stepped_up":
          // Stepped up benefit increases annually
          deathBenefit = (premium * (1 + 0.03 * year)) - withdrawals; // 3% annual step-up
          break;
      }

      deathBenefitProjections.push({
        year,
        age: ageAtDeath,
        deathBenefit: Math.max(0, deathBenefit),
        netBenefit: Math.max(0, deathBenefit - premium)
      });
    }

    // Calculate break-even point
    const breakEvenYear = deathBenefitProjections.findIndex(p => p.netBenefit > 0);

    return {
      projections: deathBenefitProjections.slice(0, 20), // First 20 years
      immediateDeathBenefit: deathBenefitProjections[0].deathBenefit,
      averageBenefit: deathBenefitProjections.slice(0, 20).reduce((sum, p) => sum + p.deathBenefit, 0) / 20,
      breakEvenYear: breakEvenYear >= 0 ? breakEvenYear + 1 : null,
      guaranteedPeriodBenefit: deathBenefitProjections[guaranteedYears - 1]?.deathBenefit || 0
    };
  }, [inputs]);

  const handleCalculate = () => {
    setIsCalculating(true);
    setTimeout(() => {
      setResults(calculateDeathBenefit);
      setIsCalculating(false);
    }, 1000);
  };

  const updateInput = (field: keyof DeathBenefitInputs, value: string | boolean) => {
    setInputs(prev => ({ ...prev, [field]: value }));
    setResults(null);
  };

  const getBenefitTypeDescription = (type: string) => {
    switch (type) {
      case "return_of_premium":
        return "Beneficiaries receive back the premium paid minus any withdrawals";
      case "enhanced_death_benefit":
        return "Higher of premium paid or accumulated account value";
      case "guaranteed_minimum":
        return "Guaranteed minimum plus any market gains";
      case "stepped_up":
        return "Death benefit increases annually";
      default:
        return "";
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Input Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Death Benefit Calculator
          </CardTitle>
          <CardDescription>
            Calculate death benefit projections for your beneficiaries
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="premiumAmount">Premium/Investment ($)</Label>
              <Input
                id="premiumAmount"
                value={inputs.premiumAmount}
                onChange={(e) => updateInput('premiumAmount', e.target.value)}
                placeholder="250000"
                type="number"
              />
            </div>
            <div>
              <Label htmlFor="currentAge">Your Current Age</Label>
              <Input
                id="currentAge"
                value={inputs.currentAge}
                onChange={(e) => updateInput('currentAge', e.target.value)}
                placeholder="65"
                type="number"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="benefitType">Death Benefit Type</Label>
            <Select value={inputs.benefitType} onValueChange={(value) => updateInput('benefitType', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="return_of_premium">Return of Premium</SelectItem>
                <SelectItem value="enhanced_death_benefit">Enhanced Death Benefit</SelectItem>
                <SelectItem value="guaranteed_minimum">Guaranteed Minimum</SelectItem>
                <SelectItem value="stepped_up">Stepped-Up Benefit</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              {getBenefitTypeDescription(inputs.benefitType)}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="guaranteedPeriod">Guaranteed Period (years)</Label>
              <Select value={inputs.guaranteedPeriod} onValueChange={(value) => updateInput('guaranteedPeriod', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 Years</SelectItem>
                  <SelectItem value="10">10 Years</SelectItem>
                  <SelectItem value="15">15 Years</SelectItem>
                  <SelectItem value="20">20 Years</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="expectedReturn">Expected Annual Return (%)</Label>
              <Input
                id="expectedReturn"
                value={inputs.expectedReturn}
                onChange={(e) => updateInput('expectedReturn', e.target.value)}
                placeholder="4.5"
                type="number"
                step="0.1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="withdrawalsTaken">Withdrawals Taken ($)</Label>
            <Input
              id="withdrawalsTaken"
              value={inputs.withdrawalsTaken}
              onChange={(e) => updateInput('withdrawalsTaken', e.target.value)}
              placeholder="0"
              type="number"
            />
          </div>

          <Button 
            onClick={handleCalculate} 
            disabled={isCalculating || !inputs.premiumAmount || !inputs.currentAge}
            className="w-full"
          >
            {isCalculating ? (
              <>
                <Calculator className="h-4 w-4 mr-2 animate-pulse" />
                Calculating...
              </>
            ) : (
              <>
                <Calculator className="h-4 w-4 mr-2" />
                Calculate Death Benefits
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Beneficiary Protection
          </CardTitle>
          <CardDescription>
            Death benefit projections for your beneficiaries
          </CardDescription>
        </CardHeader>
        <CardContent>
          {results ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <div className="text-xl font-bold text-primary">
                    ${results.immediateDeathBenefit.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Immediate Death Benefit</div>
                </div>
                <div className="text-center p-4 bg-secondary/5 rounded-lg">
                  <div className="text-xl font-bold text-secondary">
                    ${results.guaranteedPeriodBenefit.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    After {inputs.guaranteedPeriod} Years
                  </div>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Average 20-Year Benefit</span>
                  <span className="font-medium">${results.averageBenefit.toLocaleString()}</span>
                </div>
                {results.breakEvenYear && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Break-Even Point</span>
                    <span className="font-medium">Year {results.breakEvenYear}</span>
                  </div>
                )}
              </div>

              {/* Death Benefit Projections */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Death Benefit Projections
                </h4>
                <div className="max-h-48 overflow-y-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-1">Year</th>
                        <th className="text-left p-1">Age</th>
                        <th className="text-right p-1">Death Benefit</th>
                        <th className="text-right p-1">Net Gain</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.projections.slice(0, 10).map((projection: any, index: number) => (
                        <tr key={index} className="border-b border-muted/50">
                          <td className="p-1">{projection.year}</td>
                          <td className="p-1">{projection.age}</td>
                          <td className="text-right p-1">${projection.deathBenefit.toLocaleString()}</td>
                          <td className={`text-right p-1 ${projection.netBenefit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            ${projection.netBenefit.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Benefit Features */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Tax-Free to Beneficiaries</Badge>
                <Badge variant="outline">Probate Avoidance</Badge>
                <Badge variant="outline">Guaranteed Payment</Badge>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">Save Calculation</Button>
                <Button variant="outline" className="flex-1">Share with Family</Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Enter your details to calculate death benefit projections</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};