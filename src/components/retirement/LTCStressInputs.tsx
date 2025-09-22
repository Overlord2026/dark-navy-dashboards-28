/**
 * LTC Stress Testing Input Form Component
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Play, RefreshCw, User, Users, DollarSign, MapPin, Shield } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LTC_COST_DATABASE } from '@/data/ltcCostDatabase';
import type { LTCStressTestInputs } from '@/engines/stressTesting/ltcStressEngine';
import { formatCurrency } from '@/lib/utils';

interface LTCStressInputsProps {
  inputs: LTCStressTestInputs;
  onInputsChange: (updates: Partial<LTCStressTestInputs>) => void;
  onRunAnalysis: () => void;
  loading: boolean;
  error: string | null;
  onClearResults: () => void;
}

export function LTCStressInputs({
  inputs,
  onInputsChange,
  onRunAnalysis,
  loading,
  error,
  onClearResults
}: LTCStressInputsProps) {
  const stateOptions = Object.entries(LTC_COST_DATABASE).map(([code, data]) => ({
    value: code,
    label: data.state
  }));

  const updatePrimaryPerson = (updates: Partial<LTCStressTestInputs['primaryPerson']>) => {
    onInputsChange({
      primaryPerson: { ...inputs.primaryPerson, ...updates }
    });
  };

  const updateSpouse = (updates: Partial<LTCStressTestInputs['spouse']>) => {
    onInputsChange({
      spouse: inputs.spouse ? { ...inputs.spouse, ...updates } : {
        currentAge: 55,
        gender: 'female',
        healthStatus: 'good',
        familyHistory: 'average',
        smoker: false,
        exerciseLevel: 'moderate',
        chronicConditions: [],
        ...updates
      }
    });
  };

  const updatePrimaryInsurance = (updates: Partial<LTCStressTestInputs['primaryInsurance']>) => {
    onInputsChange({
      primaryInsurance: { ...inputs.primaryInsurance, ...updates }
    });
  };

  const updateSpouseInsurance = (updates: Partial<LTCStressTestInputs['spouseInsurance']>) => {
    onInputsChange({
      spouseInsurance: inputs.spouseInsurance ? { ...inputs.spouseInsurance, ...updates } : {
        hasInsurance: false,
        ...updates
      }
    });
  };

  const toggleSpouse = (hasSpouse: boolean) => {
    if (hasSpouse && !inputs.spouse) {
      updateSpouse({});
    } else if (!hasSpouse) {
      onInputsChange({ spouse: undefined, spouseInsurance: undefined });
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personal" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Personal
          </TabsTrigger>
          <TabsTrigger value="financial" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Financial
          </TabsTrigger>
          <TabsTrigger value="location" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Location
          </TabsTrigger>
          <TabsTrigger value="insurance" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Insurance
          </TabsTrigger>
        </TabsList>

        {/* Personal Information */}
        <TabsContent value="personal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Primary Person
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primary-age">Current Age</Label>
                <Input
                  id="primary-age"
                  type="number"
                  value={inputs.primaryPerson.currentAge}
                  onChange={(e) => updatePrimaryPerson({ currentAge: parseInt(e.target.value) || 0 })}
                  min="30"
                  max="85"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="primary-gender">Gender</Label>
                <Select
                  value={inputs.primaryPerson.gender}
                  onValueChange={(value) => updatePrimaryPerson({ gender: value as 'male' | 'female' })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="primary-health">Health Status</Label>
                <Select
                  value={inputs.primaryPerson.healthStatus}
                  onValueChange={(value) => updatePrimaryPerson({ 
                    healthStatus: value as 'excellent' | 'good' | 'fair' | 'poor' 
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excellent">Excellent</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="poor">Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="primary-family-history">Family History</Label>
                <Select
                  value={inputs.primaryPerson.familyHistory}
                  onValueChange={(value) => updatePrimaryPerson({ 
                    familyHistory: value as 'good' | 'average' | 'concerning' 
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="average">Average</SelectItem>
                    <SelectItem value="concerning">Concerning</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="primary-exercise">Exercise Level</Label>
                <Select
                  value={inputs.primaryPerson.exerciseLevel}
                  onValueChange={(value) => updatePrimaryPerson({ 
                    exerciseLevel: value as 'sedentary' | 'light' | 'moderate' | 'active' 
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentary</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="primary-smoker"
                  checked={inputs.primaryPerson.smoker}
                  onCheckedChange={(checked) => updatePrimaryPerson({ smoker: checked })}
                />
                <Label htmlFor="primary-smoker">Smoker</Label>
              </div>
            </CardContent>
          </Card>

          {/* Spouse Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Spouse Information
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="has-spouse"
                    checked={!!inputs.spouse}
                    onCheckedChange={toggleSpouse}
                  />
                  <Label htmlFor="has-spouse" className="text-sm">Include Spouse</Label>
                </div>
              </CardTitle>
            </CardHeader>
            
            {inputs.spouse && (
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="spouse-age">Current Age</Label>
                  <Input
                    id="spouse-age"
                    type="number"
                    value={inputs.spouse.currentAge}
                    onChange={(e) => updateSpouse({ currentAge: parseInt(e.target.value) || 0 })}
                    min="30"
                    max="85"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="spouse-gender">Gender</Label>
                  <Select
                    value={inputs.spouse.gender}
                    onValueChange={(value) => updateSpouse({ gender: value as 'male' | 'female' })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="spouse-health">Health Status</Label>
                  <Select
                    value={inputs.spouse.healthStatus}
                    onValueChange={(value) => updateSpouse({ 
                      healthStatus: value as 'excellent' | 'good' | 'fair' | 'poor' 
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                      <SelectItem value="poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            )}
          </Card>
        </TabsContent>

        {/* Financial Information */}
        <TabsContent value="financial" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Financial Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="net-worth">Current Net Worth</Label>
                <Input
                  id="net-worth"
                  type="number"
                  value={inputs.currentNetWorth}
                  onChange={(e) => onInputsChange({ currentNetWorth: parseFloat(e.target.value) || 0 })}
                  placeholder="2000000"
                />
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(inputs.currentNetWorth)}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="liquid-assets">Liquid Assets</Label>
                <Input
                  id="liquid-assets"
                  type="number"
                  value={inputs.liquidAssets}
                  onChange={(e) => onInputsChange({ liquidAssets: parseFloat(e.target.value) || 0 })}
                  placeholder="500000"
                />
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(inputs.liquidAssets)}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="retirement-income">Annual Retirement Income</Label>
                <Input
                  id="retirement-income"
                  type="number"
                  value={inputs.annualRetirementIncome}
                  onChange={(e) => onInputsChange({ annualRetirementIncome: parseFloat(e.target.value) || 0 })}
                  placeholder="120000"
                />
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(inputs.annualRetirementIncome)} annually
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="inflation-rate">Inflation Rate (%)</Label>
                <Input
                  id="inflation-rate"
                  type="number"
                  step="0.1"
                  value={inputs.inflationRate * 100}
                  onChange={(e) => onInputsChange({ inflationRate: (parseFloat(e.target.value) || 0) / 100 })}
                  placeholder="3.0"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Location Information */}
        <TabsContent value="location" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Geographic Considerations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="current-state">Current State</Label>
                  <Select
                    value={inputs.currentState}
                    onValueChange={(value) => onInputsChange({ currentState: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {stateOptions.map((state) => (
                        <SelectItem key={state.value} value={state.value}>
                          {state.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {inputs.currentState && LTC_COST_DATABASE[inputs.currentState] && (
                    <div className="text-sm text-muted-foreground">
                      <p>Nursing Home (Private): {formatCurrency(LTC_COST_DATABASE[inputs.currentState].costs.nursing_home.private_room)}/year</p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="retirement-state">Retirement State (Optional)</Label>
                  <Select
                    value={inputs.retirementState || ''}
                    onValueChange={(value) => onInputsChange({ retirementState: value || undefined })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Same as current" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Same as current</SelectItem>
                      {stateOptions.map((state) => (
                        <SelectItem key={state.value} value={state.value}>
                          {state.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Insurance Information */}
        <TabsContent value="insurance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Long-Term Care Insurance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Primary Insurance */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">Primary Person Insurance</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="primary-has-insurance"
                      checked={inputs.primaryInsurance.hasInsurance}
                      onCheckedChange={(checked) => updatePrimaryInsurance({ hasInsurance: checked })}
                    />
                    <Label htmlFor="primary-has-insurance">Has LTC Insurance</Label>
                  </div>
                </div>

                {inputs.primaryInsurance.hasInsurance && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
                    <div className="space-y-2">
                      <Label htmlFor="primary-daily-benefit">Daily Benefit ($)</Label>
                      <Input
                        id="primary-daily-benefit"
                        type="number"
                        value={inputs.primaryInsurance.dailyBenefit || ''}
                        onChange={(e) => updatePrimaryInsurance({ 
                          dailyBenefit: parseFloat(e.target.value) || undefined 
                        })}
                        placeholder="200"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="primary-benefit-period">Benefit Period (Years)</Label>
                      <Input
                        id="primary-benefit-period"
                        type="number"
                        value={inputs.primaryInsurance.benefitPeriod || ''}
                        onChange={(e) => updatePrimaryInsurance({ 
                          benefitPeriod: parseFloat(e.target.value) || undefined 
                        })}
                        placeholder="3"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="primary-inflation-protection"
                        checked={inputs.primaryInsurance.inflationProtection || false}
                        onCheckedChange={(checked) => updatePrimaryInsurance({ inflationProtection: checked })}
                      />
                      <Label htmlFor="primary-inflation-protection">Inflation Protection</Label>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Spouse Insurance */}
              {inputs.spouse && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-medium">Spouse Insurance</Label>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="spouse-has-insurance"
                        checked={inputs.spouseInsurance?.hasInsurance || false}
                        onCheckedChange={(checked) => updateSpouseInsurance({ hasInsurance: checked })}
                      />
                      <Label htmlFor="spouse-has-insurance">Has LTC Insurance</Label>
                    </div>
                  </div>

                  {inputs.spouseInsurance?.hasInsurance && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
                      <div className="space-y-2">
                        <Label htmlFor="spouse-daily-benefit">Daily Benefit ($)</Label>
                        <Input
                          id="spouse-daily-benefit"
                          type="number"
                          value={inputs.spouseInsurance?.dailyBenefit || ''}
                          onChange={(e) => updateSpouseInsurance({ 
                            dailyBenefit: parseFloat(e.target.value) || undefined 
                          })}
                          placeholder="200"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="spouse-benefit-period">Benefit Period (Years)</Label>
                        <Input
                          id="spouse-benefit-period"
                          type="number"
                          value={inputs.spouseInsurance?.benefitPeriod || ''}
                          onChange={(e) => updateSpouseInsurance({ 
                            benefitPeriod: parseFloat(e.target.value) || undefined 
                          })}
                          placeholder="3"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 pt-6">
        <Button
          onClick={onRunAnalysis}
          disabled={loading}
          size="lg"
          className="px-8"
        >
          {loading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Run LTC Stress Analysis
            </>
          )}
        </Button>

        <Button
          onClick={onClearResults}
          variant="outline"
          size="lg"
        >
          Clear Results
        </Button>
      </div>
    </div>
  );
}