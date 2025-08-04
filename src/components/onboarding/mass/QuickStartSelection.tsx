import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { User, Users, Building2, Upload, Phone } from 'lucide-react';

interface QuickStartSelectionProps {
  onboardingType: 'solo' | 'firm' | null;
  setOnboardingType: (type: 'solo' | 'firm' | null) => void;
  selectedCustodian: string | null;
  setSelectedCustodian: (custodian: string | null) => void;
}

const custodians = [
  { id: 'schwab', name: 'Schwab', logo: '🏦' },
  { id: 'fidelity', name: 'Fidelity', logo: '🏛️' },
  { id: 'altruist', name: 'Altruist', logo: '🚀' },
  { id: 'pershing', name: 'Pershing', logo: '🏢' },
  { id: 'other', name: 'Other', logo: '➕' }
];

export const QuickStartSelection = ({ 
  onboardingType, 
  setOnboardingType, 
  selectedCustodian, 
  setSelectedCustodian 
}: QuickStartSelectionProps) => {
  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          Quick Start: Advisor/Firm Selection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-base font-medium mb-4 block">Are you onboarding as:</Label>
          <RadioGroup 
            value={onboardingType || ''} 
            onValueChange={(value) => setOnboardingType(value as 'solo' | 'firm')}
            className="grid grid-cols-2 gap-4"
          >
            <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
              <RadioGroupItem value="solo" id="solo" />
              <Label htmlFor="solo" className="flex items-center gap-2 cursor-pointer">
                <User className="h-4 w-4" />
                Solo Advisor
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
              <RadioGroupItem value="firm" id="firm" />
              <Label htmlFor="firm" className="flex items-center gap-2 cursor-pointer">
                <Users className="h-4 w-4" />
                Firm/Team (Bulk Import)
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label className="text-base font-medium mb-4 block">Connect Custodian:</Label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {custodians.map((custodian) => (
              <Button
                key={custodian.id}
                variant={selectedCustodian === custodian.id ? "default" : "outline"}
                onClick={() => setSelectedCustodian(custodian.id)}
                className="h-16 flex flex-col gap-1"
              >
                <span className="text-lg">{custodian.logo}</span>
                <span className="text-xs">{custodian.name}</span>
              </Button>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <Button variant="outline" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Bulk Import (CSV, PDF, API)
          </Button>
          <Button variant="secondary" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Request White-Glove Onboarding
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};