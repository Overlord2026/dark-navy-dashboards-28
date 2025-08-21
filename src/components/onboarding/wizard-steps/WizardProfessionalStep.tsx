import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { UserCheck, Shield, Scale, Clock, Lock } from 'lucide-react';

interface WizardProfessionalStepProps {
  onComplete: (inviteData: any) => void;
  hasFeature: boolean;
}

export function WizardProfessionalStep({ onComplete, hasFeature }: WizardProfessionalStepProps) {
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedScopes, setSelectedScopes] = useState<string[]>([]);
  const [ttlDays, setTtlDays] = useState<string>('30');

  const professionalTypes = [
    {
      id: 'advisor',
      name: 'Financial Advisor',
      description: 'Investment guidance and comprehensive planning',
      premium: false
    },
    {
      id: 'cpa', 
      name: 'CPA',
      description: 'Tax planning and preparation',
      premium: true
    },
    {
      id: 'attorney',
      name: 'Estate Attorney',
      description: 'Legal planning and document preparation',
      premium: true
    }
  ];

  const scopeOptions = [
    { id: 'docs_summary', label: 'Document summaries', description: 'High-level overview of uploaded documents' },
    { id: 'tax_docs', label: 'Tax documents', description: 'Returns, 1099s, K-1s for tax planning' },
    { id: 'health_evidence', label: 'Health evidence', description: 'Medical records for insurance planning' },
    { id: 'goal_progress', label: 'Goal progress', description: 'Current goals and milestone tracking' },
    { id: 'portfolio_view', label: 'Portfolio overview', description: 'Investment accounts and allocations' }
  ];

  const ttlOptions = [
    { value: '7', label: '7 days' },
    { value: '30', label: '30 days (recommended)' },
    { value: '90', label: '90 days' },
    { value: '365', label: '1 year' }
  ];

  const handleTypeSelect = (typeId: string) => {
    const type = professionalTypes.find(t => t.id === typeId);
    if (type?.premium && !hasFeature) {
      onComplete({
        type: 'gated',
        feature_required: 'professional_network',
        professional_type: typeId
      });
      return;
    }
    
    setSelectedType(typeId);
  };

  const handleScopeToggle = (scopeId: string) => {
    setSelectedScopes(prev => 
      prev.includes(scopeId) 
        ? prev.filter(id => id !== scopeId)
        : [...prev, scopeId]
    );
  };

  const handleInvite = () => {
    const inviteData = {
      type: selectedType,
      scope: selectedScopes,
      ttl_days: parseInt(ttlDays),
      sent: true
    };

    onComplete(inviteData);
  };

  const handleSkip = () => {
    onComplete({ type: 'skip' });
  };

  const selectedProfessional = professionalTypes.find(t => t.id === selectedType);
  const canInvite = selectedType && selectedScopes.length > 0;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Invite a professional (optional)</h2>
        <p className="text-muted-foreground">
          Share specific information with professionals who can help accelerate your progress
        </p>
      </div>

      {/* Professional Type Selection */}
      <div className="space-y-3">
        <h3 className="font-medium">Choose professional type:</h3>
        <div className="space-y-2">
          {professionalTypes.map((type) => {
            const isSelected = selectedType === type.id;
            
            return (
              <Card 
                key={type.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-sm relative ${
                  isSelected ? 'ring-2 ring-primary bg-primary/5' : 'hover:border-primary/50'
                } ${type.premium && !hasFeature ? 'opacity-75' : ''}`}
                onClick={() => handleTypeSelect(type.id)}
              >
                {type.premium && !hasFeature && (
                  <Badge className="absolute -top-2 -right-2 text-xs bg-orange-500">
                    <Lock className="h-3 w-3 mr-1" />
                    Premium
                  </Badge>
                )}
                
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <UserCheck className={`h-5 w-5 ${
                      type.premium && !hasFeature ? 'text-orange-500' : 'text-primary'
                    }`} />
                    <div className="flex-1">
                      <h4 className="font-medium">{type.name}</h4>
                      <p className="text-sm text-muted-foreground">{type.description}</p>
                    </div>
                    {isSelected && (
                      <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Scope Configuration */}
      {selectedProfessional && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Information Sharing Scope
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Select what information to share with your {selectedProfessional.name.toLowerCase()}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {scopeOptions.map((scope) => (
                <div key={scope.id} className="flex items-start space-x-3">
                  <Checkbox
                    id={scope.id}
                    checked={selectedScopes.includes(scope.id)}
                    onCheckedChange={() => handleScopeToggle(scope.id)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label 
                      htmlFor={scope.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {scope.label}
                    </label>
                    <p className="text-xs text-muted-foreground">
                      {scope.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Access duration:</span>
              </div>
              
              <Select value={ttlDays} onValueChange={setTtlDays}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ttlOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
                <strong>Privacy Note:</strong> Access will automatically expire after {ttlDays} days. 
                You can revoke access at any time from your dashboard.
              </div>
            </div>

            <Button 
              onClick={handleInvite}
              disabled={!canInvite}
              className="w-full"
            >
              <Scale className="h-4 w-4 mr-2" />
              Issue Consent & Invite
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Skip Option */}
      <div className="text-center pt-4 border-t">
        <p className="text-sm text-muted-foreground mb-3">
          You can invite professionals later from your dashboard
        </p>
        <Button variant="ghost" onClick={handleSkip} size="sm">
          Skip for now
        </Button>
      </div>
    </div>
  );
}