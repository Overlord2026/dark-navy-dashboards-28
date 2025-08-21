import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { UserCheck, Shield, GraduationCap, Users, Lock, Mail } from 'lucide-react';

interface ProfessionalInviteProps {
  onInvite: (inviteData: any) => void;
  onSkip: () => void;
  isLoading?: boolean;
  hasFeature: boolean;
  onFeatureGating: () => void;
}

export function ProfessionalInvite({ onInvite, onSkip, isLoading, hasFeature, onFeatureGating }: ProfessionalInviteProps) {
  const [inviteType, setInviteType] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [relationship, setRelationship] = useState<string>('');
  const [consentGiven, setConsentGiven] = useState<boolean>(false);

  const professionalTypes = [
    {
      id: 'advisor',
      name: 'Financial Advisor',
      description: 'Investment guidance and financial planning',
      icon: TrendingUp,
      premium: false
    },
    {
      id: 'cpa',
      name: 'CPA/Tax Professional',
      description: 'Tax planning and preparation',
      icon: Shield,
      premium: true
    },
    {
      id: 'attorney',
      name: 'Estate Attorney',
      description: 'Legal planning and document preparation',
      icon: GraduationCap,
      premium: true
    }
  ];

  const relationships = [
    { id: 'current', label: 'I already work with them' },
    { id: 'referred', label: 'They were referred to me' },
    { id: 'researched', label: 'I found them through research' },
    { id: 'platform', label: 'I want to find one through your platform' }
  ];

  const handleProfessionalSelect = (typeId: string) => {
    const type = professionalTypes.find(t => t.id === typeId);
    if (type?.premium && !hasFeature) {
      onFeatureGating();
      return;
    }
    
    setInviteType(typeId);
  };

  const handleSubmit = () => {
    onInvite({
      professional_type: inviteType,
      email: email || undefined,
      relationship,
      consent_given: consentGiven
    });
  };

  const selectedType = professionalTypes.find(t => t.id === inviteType);
  const canSubmit = inviteType && relationship && (relationship === 'platform' || email) && consentGiven;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Connect with a Professional</h2>
        <p className="text-muted-foreground">
          Get expert guidance to accelerate your financial journey
        </p>
      </div>

      {/* Professional Type Selection */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">What type of professional would help you most?</Label>
        <div className="space-y-2">
          {professionalTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = inviteType === type.id;
            
            return (
              <Card 
                key={type.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-sm relative ${
                  isSelected ? 'ring-2 ring-primary bg-primary/5' : 'hover:border-primary/50'
                } ${type.premium && !hasFeature ? 'opacity-75' : ''}`}
                onClick={() => handleProfessionalSelect(type.id)}
              >
                {type.premium && !hasFeature && (
                  <Badge 
                    variant="secondary" 
                    className="absolute -top-2 -right-2 text-xs bg-gradient-to-r from-yellow-400 to-orange-500 text-white"
                  >
                    <Lock className="h-3 w-3 mr-1" />
                    Premium
                  </Badge>
                )}
                
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Icon className={`h-5 w-5 ${
                      type.premium && !hasFeature ? 'text-yellow-600' : 'text-primary'
                    }`} />
                    <div className="flex-1">
                      <h3 className="font-medium">{type.name}</h3>
                      <p className="text-sm text-muted-foreground">{type.description}</p>
                    </div>
                    {isSelected && (
                      <UserCheck className="h-5 w-5 text-primary" />
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Relationship & Contact Info */}
      {selectedType && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Invitation Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label>What's your relationship with this professional?</Label>
              <RadioGroup 
                value={relationship} 
                onValueChange={setRelationship}
                className="space-y-2"
              >
                {relationships.map((rel) => (
                  <div key={rel.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={rel.id} id={rel.id} />
                    <Label htmlFor={rel.id} className="text-sm cursor-pointer">
                      {rel.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {relationship && relationship !== 'platform' && (
              <div className="space-y-2">
                <Label htmlFor="email">Professional's Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    placeholder="advisor@example.com"
                  />
                </div>
              </div>
            )}

            {relationship === 'platform' && (
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-blue-800 mb-1">Professional Matching</p>
                      <p className="text-blue-700">
                        We'll connect you with verified professionals in our network who specialize in your needs.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Consent Checkbox */}
            <div className="flex items-start space-x-2 pt-4 border-t">
              <input
                type="checkbox"
                id="consent"
                checked={consentGiven}
                onChange={(e) => setConsentGiven(e.target.checked)}
                className="mt-1"
              />
              <Label htmlFor="consent" className="text-sm text-muted-foreground cursor-pointer">
                I consent to sharing my financial goals and basic information with this professional 
                to help them provide better guidance. I can revoke this consent at any time.
              </Label>
            </div>

            <Button 
              onClick={handleSubmit}
              disabled={!canSubmit || isLoading}
              className="w-full"
            >
              {isLoading ? 'Sending Invitation...' : 
               relationship === 'platform' ? 'Find Me a Professional' : 
               'Send Invitation'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Skip Option */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-4">
          <div className="text-center">
            <p className="text-sm text-orange-700 mb-3">
              You can always invite professionals later from your dashboard.
            </p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={onSkip}
              className="border-orange-300 text-orange-800 hover:bg-orange-100"
            >
              Continue without inviting anyone
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function TrendingUp({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  );
}