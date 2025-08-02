import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, Check, Star, Zap, Shield, Globe } from 'lucide-react';
import { OnboardingStepData, CustodianConfig, CustodianType } from '@/types/onboarding';

interface CustodianSelectionStepProps {
  data: OnboardingStepData;
  onComplete: (stepData: Partial<OnboardingStepData>) => void;
  onNext: () => void;
  onPrevious: () => void;
  isLoading?: boolean;
}

const CUSTODIAN_CONFIGS: CustodianConfig[] = [
  {
    id: 'schwab',
    name: 'Charles Schwab',
    apiSupported: true,
    accountTypes: ['Individual', 'Joint', 'IRA', 'Roth IRA', 'Trust'],
    supportedFeatures: {
      digitalApplication: true,
      acatsTransfer: true,
      docusignIntegration: true,
      realTimeStatus: true
    }
  },
  {
    id: 'fidelity',
    name: 'Fidelity Investments',
    apiSupported: true,
    accountTypes: ['Individual', 'Joint', 'IRA', 'Roth IRA', 'Trust', '401k Rollover'],
    supportedFeatures: {
      digitalApplication: true,
      acatsTransfer: true,
      docusignIntegration: true,
      realTimeStatus: true
    }
  },
  {
    id: 'altruist',
    name: 'Altruist',
    apiSupported: true,
    accountTypes: ['Individual', 'Joint', 'IRA', 'Roth IRA'],
    supportedFeatures: {
      digitalApplication: true,
      acatsTransfer: true,
      docusignIntegration: false,
      realTimeStatus: true
    }
  },
  {
    id: 'ibkr',
    name: 'Interactive Brokers',
    apiSupported: false,
    accountTypes: ['Individual', 'Joint', 'IRA', 'Margin'],
    supportedFeatures: {
      digitalApplication: false,
      acatsTransfer: true,
      docusignIntegration: false,
      realTimeStatus: false
    }
  },
  {
    id: 'other',
    name: 'Other Custodian',
    apiSupported: false,
    accountTypes: ['Individual', 'Joint', 'IRA', 'Roth IRA', 'Trust'],
    supportedFeatures: {
      digitalApplication: false,
      acatsTransfer: false,
      docusignIntegration: false,
      realTimeStatus: false
    }
  }
];

export const CustodianSelectionStep: React.FC<CustodianSelectionStepProps> = ({
  data,
  onComplete,
  onNext,
  onPrevious,
  isLoading
}) => {
  const [selectedCustodians, setSelectedCustodians] = useState<string[]>(
    data.custodianSelection?.selectedCustodians || []
  );
  
  const [accountTypes, setAccountTypes] = useState(
    data.custodianSelection?.accountTypes || []
  );

  const toggleCustodian = (custodianId: string) => {
    setSelectedCustodians(prev => {
      const newSelection = prev.includes(custodianId)
        ? prev.filter(id => id !== custodianId)
        : [...prev, custodianId];
      
      // Remove account types for deselected custodians
      if (!newSelection.includes(custodianId)) {
        setAccountTypes(prevTypes => 
          prevTypes.filter(type => type.custodian !== custodianId)
        );
      }
      
      return newSelection;
    });
  };

  const addAccountType = (custodian: string) => {
    setAccountTypes(prev => [
      ...prev,
      {
        custodian,
        accountType: '',
        transferAmount: 0,
        currentInstitution: ''
      }
    ]);
  };

  const updateAccountType = (index: number, field: string, value: any) => {
    setAccountTypes(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const removeAccountType = (index: number) => {
    setAccountTypes(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    return selectedCustodians.length > 0 && 
           accountTypes.length > 0 && 
           accountTypes.every(type => type.accountType);
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    const custodianData = {
      custodianSelection: {
        selectedCustodians,
        accountTypes
      }
    };

    onComplete(custodianData);
  };

  const getCustodianConfig = (id: string) => 
    CUSTODIAN_CONFIGS.find(config => config.id === id);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground">
          Choose Your Custodian
        </h2>
        <p className="text-muted-foreground">
          Select where you'd like to custody your assets. You can choose multiple custodians.
        </p>
      </div>

      {/* Custodian Selection */}
      <div className="grid gap-4">
        {CUSTODIAN_CONFIGS.map((custodian) => (
          <Card 
            key={custodian.id}
            className={`premium-card cursor-pointer transition-all duration-200 ${
              selectedCustodians.includes(custodian.id)
                ? 'ring-2 ring-primary bg-primary/5'
                : 'hover:bg-muted/50'
            }`}
            onClick={() => toggleCustodian(custodian.id)}
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <Checkbox
                    checked={selectedCustodians.includes(custodian.id)}
                    onChange={() => toggleCustodian(custodian.id)}
                    className="mt-1"
                  />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg text-foreground">
                      {custodian.name}
                    </h3>
                    {custodian.apiSupported && (
                      <Badge variant="secondary" className="text-xs">
                        <Zap className="h-3 w-3 mr-1" />
                        API Supported
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {custodian.supportedFeatures.digitalApplication && (
                      <Badge variant="outline" className="text-xs">
                        <Globe className="h-3 w-3 mr-1" />
                        Digital Applications
                      </Badge>
                    )}
                    {custodian.supportedFeatures.acatsTransfer && (
                      <Badge variant="outline" className="text-xs">
                        <Shield className="h-3 w-3 mr-1" />
                        ACATS Transfer
                      </Badge>
                    )}
                    {custodian.supportedFeatures.docusignIntegration && (
                      <Badge variant="outline" className="text-xs">
                        <Check className="h-3 w-3 mr-1" />
                        DocuSign
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    Available account types: {custodian.accountTypes.join(', ')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Account Type Configuration */}
      {selectedCustodians.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-display font-semibold text-foreground">
            Account Configuration
          </h3>
          
          {selectedCustodians.map((custodianId) => {
            const config = getCustodianConfig(custodianId);
            const custodianAccounts = accountTypes.filter(
              type => type.custodian === custodianId
            );
            
            return (
              <Card key={custodianId} className="premium-card">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">{config?.name}</CardTitle>
                  <Button
                    onClick={() => addAccountType(custodianId)}
                    variant="outline"
                    size="sm"
                  >
                    Add Account
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {custodianAccounts.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      No accounts configured. Click "Add Account" to start.
                    </p>
                  ) : (
                    custodianAccounts.map((account, accountIndex) => {
                      const globalIndex = accountTypes.findIndex(
                        type => type.custodian === custodianId && 
                                accountTypes.indexOf(type) === 
                                custodianAccounts.indexOf(account)
                      );
                      
                      return (
                        <Card key={accountIndex} className="border border-border">
                          <CardContent className="p-4 space-y-4">
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium">Account {accountIndex + 1}</h4>
                              <Button
                                onClick={() => removeAccountType(globalIndex)}
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive"
                              >
                                Remove
                              </Button>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Account Type</Label>
                                <Select
                                  value={account.accountType}
                                  onValueChange={(value) => 
                                    updateAccountType(globalIndex, 'accountType', value)
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select account type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {config?.accountTypes.map(type => (
                                      <SelectItem key={type} value={type.toLowerCase().replace(' ', '_')}>
                                        {type}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div className="space-y-2">
                                <Label>Current Institution</Label>
                                <Input
                                  value={account.currentInstitution}
                                  onChange={(e) => 
                                    updateAccountType(globalIndex, 'currentInstitution', e.target.value)
                                  }
                                  placeholder="e.g., Vanguard, TD Ameritrade"
                                />
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <Label>Transfer Amount (Optional)</Label>
                              <Input
                                type="number"
                                value={account.transferAmount || ''}
                                onChange={(e) => 
                                  updateAccountType(globalIndex, 'transferAmount', Number(e.target.value))
                                }
                                placeholder="$0"
                              />
                              <p className="text-xs text-muted-foreground">
                                Approximate value of assets to transfer
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Information Panel */}
      <Card className="premium-card bg-accent/5 border-accent/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-accent mt-1" />
            <div>
              <h4 className="font-semibold text-foreground mb-2">Why Choose Multiple Custodians?</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Diversify custodial risk across institutions</li>
                <li>• Access different investment platforms and tools</li>
                <li>• Take advantage of various fee structures</li>
                <li>• Maintain existing relationships while adding new ones</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button onClick={onPrevious} variant="outline">
          Previous
        </Button>
        <Button 
          onClick={handleSave}
          disabled={!validateForm() || isLoading}
          className="btn-primary-gold"
        >
          {isLoading ? 'Saving...' : 'Save & Continue'}
        </Button>
      </div>
    </div>
  );
};