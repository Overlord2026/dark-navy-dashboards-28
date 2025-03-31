
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Shield } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface InsurancePolicy {
  id: string;
  name: string;
  type: "life" | "health" | "disability" | "property" | "liability" | "other";
  provider: string;
  premium: number;
  frequency: "yearly" | "monthly" | "quarterly";
  coverage: number;
  isPrimary: boolean;
}

interface InsuranceStepProps {
  onPrevStep: () => void;
  onNextStep: () => void;
}

export const InsuranceStep = ({ onPrevStep, onNextStep }: InsuranceStepProps) => {
  const [policies, setPolicies] = useState<InsurancePolicy[]>([
    { 
      id: '1', 
      name: 'Term Life Insurance', 
      type: 'life', 
      provider: 'BFO Insurance', 
      premium: 420, 
      frequency: 'yearly', 
      coverage: 500000, 
      isPrimary: true 
    },
  ]);

  const addPolicy = () => {
    const newPolicy: InsurancePolicy = {
      id: `policy-${Date.now()}`,
      name: '',
      type: 'health',
      provider: '',
      premium: 0,
      frequency: 'monthly',
      coverage: 0,
      isPrimary: false
    };
    setPolicies([...policies, newPolicy]);
  };

  const updatePolicy = (id: string, field: keyof InsurancePolicy, value: any) => {
    setPolicies(policies.map(policy => 
      policy.id === id ? { ...policy, [field]: value } : policy
    ));
  };

  const removePolicy = (id: string) => {
    setPolicies(policies.filter(policy => policy.id !== id));
  };

  const calculateTotalYearlyPremiums = () => {
    return policies.reduce((total, policy) => {
      let yearlyAmount = policy.premium;
      if (policy.frequency === 'monthly') yearlyAmount *= 12;
      if (policy.frequency === 'quarterly') yearlyAmount *= 4;
      return total + yearlyAmount;
    }, 0);
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'life': return 'Life Insurance';
      case 'health': return 'Health Insurance';
      case 'disability': return 'Disability Insurance';
      case 'property': return 'Property Insurance';
      case 'liability': return 'Liability Insurance';
      case 'other': return 'Other Insurance';
      default: return 'Other';
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Insurance</h2>
      <p className="text-muted-foreground">
        Add details about your current insurance coverage.
      </p>
      
      <div className="space-y-4 mt-6">
        {policies.map((policy, index) => (
          <div key={policy.id} className="p-4 border rounded-md bg-card">
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-green-500" />
                <h3 className="font-medium">{policy.name || `Policy ${index + 1}`}</h3>
              </div>
              <Button variant="ghost" size="icon" onClick={() => removePolicy(policy.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <Label htmlFor={`name-${policy.id}`}>Policy Name</Label>
                <Input
                  id={`name-${policy.id}`}
                  value={policy.name}
                  onChange={(e) => updatePolicy(policy.id, 'name', e.target.value)}
                  placeholder="e.g. Term Life Insurance"
                />
              </div>
              
              <div>
                <Label htmlFor={`type-${policy.id}`}>Policy Type</Label>
                <Select
                  value={policy.type}
                  onValueChange={(value) => updatePolicy(policy.id, 'type', value)}
                >
                  <SelectTrigger id={`type-${policy.id}`}>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="life">Life Insurance</SelectItem>
                    <SelectItem value="health">Health Insurance</SelectItem>
                    <SelectItem value="disability">Disability Insurance</SelectItem>
                    <SelectItem value="property">Property Insurance</SelectItem>
                    <SelectItem value="liability">Liability Insurance</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor={`provider-${policy.id}`}>Provider</Label>
                <Input
                  id={`provider-${policy.id}`}
                  value={policy.provider}
                  onChange={(e) => updatePolicy(policy.id, 'provider', e.target.value)}
                  placeholder="e.g. BFO Insurance"
                />
              </div>
              
              <div>
                <Label htmlFor={`premium-${policy.id}`}>Premium</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">$</span>
                  </div>
                  <Input
                    id={`premium-${policy.id}`}
                    type="number"
                    value={policy.premium}
                    onChange={(e) => updatePolicy(policy.id, 'premium', parseFloat(e.target.value) || 0)}
                    className="pl-7"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor={`frequency-${policy.id}`}>Frequency</Label>
                <Select
                  value={policy.frequency}
                  onValueChange={(value) => updatePolicy(policy.id, 'frequency', value)}
                >
                  <SelectTrigger id={`frequency-${policy.id}`}>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yearly">Yearly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor={`coverage-${policy.id}`}>Coverage Amount</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">$</span>
                  </div>
                  <Input
                    id={`coverage-${policy.id}`}
                    type="number"
                    value={policy.coverage}
                    onChange={(e) => updatePolicy(policy.id, 'coverage', parseFloat(e.target.value) || 0)}
                    className="pl-7"
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex items-center space-x-2">
              <Checkbox 
                id={`primary-${policy.id}`} 
                checked={policy.isPrimary}
                onCheckedChange={(checked) => updatePolicy(policy.id, 'isPrimary', checked)}
              />
              <Label htmlFor={`primary-${policy.id}`}>This is my primary {getTypeLabel(policy.type).toLowerCase()}</Label>
            </div>
          </div>
        ))}
        
        <Button variant="outline" className="w-full" onClick={addPolicy}>
          <Plus className="h-4 w-4 mr-2" />
          Add Insurance Policy
        </Button>
        
        <div className="p-4 border rounded-md bg-card mt-6">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Total Yearly Premiums</h3>
            <p className="text-xl font-semibold">${calculateTotalYearlyPremiums().toLocaleString()}</p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onPrevStep}>Previous</Button>
        <Button onClick={onNextStep}>Next</Button>
      </div>
    </div>
  );
};
