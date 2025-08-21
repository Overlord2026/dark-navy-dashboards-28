import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface WizardHouseholdStepProps {
  onComplete: (facts: any) => void;
}

export function WizardHouseholdStep({ onComplete }: WizardHouseholdStepProps) {
  const [birthYearBand, setBirthYearBand] = useState<string>('');
  const [filingStatus, setFilingStatus] = useState<string>('');
  const [hasSpouse, setHasSpouse] = useState<boolean>(false);
  const [ownsBusiness, setOwnsBusiness] = useState<boolean>(false);
  const [ownsMultipleProperties, setOwnsMultipleProperties] = useState<boolean>(false);
  const [receivesK1, setReceivesK1] = useState<boolean>(false);
  const [hasPrivateInvestments, setHasPrivateInvestments] = useState<boolean>(false);

  const birthYearBands = [
    { value: '1945-1954', label: 'Born 1945-1954 (70+)' },
    { value: '1955-1964', label: 'Born 1955-1964 (60-69)' },
    { value: '1965-1974', label: 'Born 1965-1974 (50-59)' },
    { value: '1975-1984', label: 'Born 1975-1984 (40-49)' },
    { value: '1985-1994', label: 'Born 1985-1994 (30-39)' },
    { value: '1995-2004', label: 'Born 1995-2004 (20-29)' }
  ];

  const handleSubmit = () => {
    const facts = {
      birth_year_band: birthYearBand,
      filing_status: filingStatus,
      has_spouse: hasSpouse,
      owns_business: ownsBusiness,
      owns_multiple_properties: ownsMultipleProperties,
      receives_k1: receivesK1,
      has_private_investments: hasPrivateInvestments
    };

    onComplete(facts);
  };

  const canSubmit = birthYearBand && filingStatus;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Tell us about your household</h2>
        <p className="text-muted-foreground">This helps us personalize your financial plan</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Birth Year Band */}
          <div className="space-y-2">
            <Label>Age Range</Label>
            <Select value={birthYearBand} onValueChange={setBirthYearBand}>
              <SelectTrigger>
                <SelectValue placeholder="Select your age range" />
              </SelectTrigger>
              <SelectContent>
                {birthYearBands.map((band) => (
                  <SelectItem key={band.value} value={band.value}>
                    {band.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filing Status */}
          <div className="space-y-3">
            <Label>Tax Filing Status</Label>
            <RadioGroup value={filingStatus} onValueChange={setFilingStatus}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="single" id="single" />
                <Label htmlFor="single">Single</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="joint" id="joint" />
                <Label htmlFor="joint">Married Filing Jointly</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Spouse Toggle */}
          <div className="flex items-center justify-between">
            <Label htmlFor="spouse">I have a spouse/partner</Label>
            <Switch
              id="spouse"
              checked={hasSpouse}
              onCheckedChange={setHasSpouse}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Financial Complexity Check</CardTitle>
          <p className="text-sm text-muted-foreground">
            These help us determine the right tools and features for you
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="business">Own a business?</Label>
              <p className="text-xs text-muted-foreground">Sole proprietorship, LLC, corporation, etc.</p>
            </div>
            <Switch
              id="business"
              checked={ownsBusiness}
              onCheckedChange={setOwnsBusiness}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="properties">Own ≥2 properties?</Label>
              <p className="text-xs text-muted-foreground">Primary residence plus investment/vacation properties</p>
            </div>
            <Switch
              id="properties"
              checked={ownsMultipleProperties}
              onCheckedChange={setOwnsMultipleProperties}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="k1">Receive K-1 forms?</Label>
              <p className="text-xs text-muted-foreground">Partnership, S-Corp, or trust distributions</p>
            </div>
            <Switch
              id="k1"
              checked={receivesK1}
              onCheckedChange={setReceivesK1}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="alts">Private/alternative investments?</Label>
              <p className="text-xs text-muted-foreground">Private equity, hedge funds, real estate funds, etc.</p>
            </div>
            <Switch
              id="alts"
              checked={hasPrivateInvestments}
              onCheckedChange={setHasPrivateInvestments}
            />
          </div>
        </CardContent>
      </Card>

      <Button 
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="w-full"
        size="lg"
      >
        Continue
      </Button>
    </div>
  );
}