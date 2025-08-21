import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { SegmentCard } from '@/components/ui/SegmentCard';
import { 
  User, 
  Building2, 
  Scale, 
  TrendingUp, 
  Users, 
  Trophy,
  Shield,
  BookOpen,
  FileCheck,
  AlertTriangle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PersonaData {
  name: string;
  email: string;
  jurisdiction: string;
  metadata: any;
}

type PersonaType = 'family' | 'advisor' | 'cpa' | 'attorney' | 'brand' | 'athlete';

const personaConfig = {
  family: {
    icon: <Users className="h-5 w-5" />,
    title: 'Family Household',
    description: 'Monitor and support athlete family members',
    segment: 'retiree' as const,
    fields: ['name', 'email', 'jurisdiction', 'household_type', 'children']
  },
  advisor: {
    icon: <TrendingUp className="h-5 w-5" />,
    title: 'Financial Advisor',
    description: 'Sports finance and NIL planning expertise',
    segment: 'advisor' as const,
    fields: ['name', 'email', 'jurisdiction', 'specialty', 'license']
  },
  cpa: {
    icon: <BookOpen className="h-5 w-5" />,
    title: 'CPA / Accountant',
    description: 'Tax planning and compliance for athletes',
    segment: 'cpa' as const,
    fields: ['name', 'email', 'jurisdiction', 'specialty', 'license']
  },
  attorney: {
    icon: <Scale className="h-5 w-5" />,
    title: 'Sports Attorney',
    description: 'Legal counsel for NIL agreements',
    segment: 'attorney' as const,
    fields: ['name', 'email', 'jurisdiction', 'specialty', 'bar_admission']
  },
  brand: {
    icon: <Building2 className="h-5 w-5" />,
    title: 'Brand / Company',
    description: 'Partner with athletes for marketing',
    segment: 'provider' as const,
    fields: ['name', 'email', 'jurisdiction', 'industry', 'target_sports']
  },
  athlete: {
    icon: <Trophy className="h-5 w-5" />,
    title: 'Student Athlete',
    description: 'Monetize name, image, and likeness',
    segment: 'aspiring' as const,
    fields: ['name', 'email', 'jurisdiction', 'sport', 'year', 'school']
  }
};

export default function NILOnboardingPage() {
  const [selectedPersona, setSelectedPersona] = useState<PersonaType | null>(null);
  const [personaData, setPersonaData] = useState<PersonaData>({
    name: '',
    email: '',
    jurisdiction: 'US',
    metadata: {}
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handlePersonaSelect = (personaType: PersonaType) => {
    setSelectedPersona(personaType);
    setPersonaData({
      name: '',
      email: '',
      jurisdiction: 'US',
      metadata: {}
    });
  };

  const handleInputChange = (field: string, value: string) => {
    if (['name', 'email', 'jurisdiction'].includes(field)) {
      setPersonaData(prev => ({ ...prev, [field]: value }));
    } else {
      setPersonaData(prev => ({
        ...prev,
        metadata: { ...prev.metadata, [field]: value }
      }));
    }
  };

  const handleSubmit = async () => {
    if (!selectedPersona || !personaData.name || !personaData.email) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('nil-onboarding-automation', {
        body: {
          personaType: selectedPersona,
          personaData: personaData,
          requiredEducation: [`${selectedPersona}_nil_basics`],
          requiredDisclosures: ['social_media', 'endorsement']
        }
      });

      if (error) throw error;

      toast({
        title: "Onboarding Successful!",
        description: `Welcome to NIL platform as ${personaConfig[selectedPersona].title}`,
      });

      // Navigate to appropriate dashboard
      const nextRoute = getNextRoute(selectedPersona);
      window.location.href = nextRoute;

    } catch (error) {
      console.error('Onboarding error:', error);
      toast({
        title: "Onboarding Failed",
        description: "Please try again or contact support",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getNextRoute = (personaType: PersonaType): string => {
    switch (personaType) {
      case 'athlete': return '/nil/education';
      case 'brand': return '/nil/marketplace';
      case 'family': return '/nil/education';
      default: return '/nil/admin';
    }
  };

  const renderPersonaFields = () => {
    if (!selectedPersona) return null;

    const config = personaConfig[selectedPersona];
    
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={personaData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter full name"
            />
          </div>
          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={personaData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter email address"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="jurisdiction">Jurisdiction</Label>
          <Select 
            value={personaData.jurisdiction} 
            onValueChange={(value) => handleInputChange('jurisdiction', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select jurisdiction" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="US">United States</SelectItem>
              <SelectItem value="CA">Canada</SelectItem>
              <SelectItem value="UK">United Kingdom</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Dynamic fields based on persona type */}
        {config.fields.slice(3).map((field) => (
          <div key={field}>
            <Label htmlFor={field}>{field.replace('_', ' ').toUpperCase()}</Label>
            {field === 'specialty' || field === 'industry' ? (
              <Textarea
                id={field}
                value={personaData.metadata[field] || ''}
                onChange={(e) => handleInputChange(field, e.target.value)}
                placeholder={`Enter ${field}`}
                rows={2}
              />
            ) : (
              <Input
                id={field}
                value={personaData.metadata[field] || ''}
                onChange={(e) => handleInputChange(field, e.target.value)}
                placeholder={`Enter ${field.replace('_', ' ')}`}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-xl font-semibold text-ink">NIL Platform Onboarding</h1>
        <p className="text-slate/80 text-sm max-w-2xl mx-auto">
          Join the comprehensive Name, Image, and Likeness platform with policy-as-code gates, 
          receipt generation, and compliance automation.
        </p>
        
        {/* Demo Notice */}
        <div className="bg-sand/50 rounded-2xl p-4 max-w-md mx-auto">
          <div className="flex items-center gap-2 justify-center">
            <Shield className="h-4 w-4 text-gold-base" />
            <span className="text-sm font-medium text-ink">Demo Environment</span>
          </div>
          <p className="text-xs text-ink/70 mt-1">
            All data is for demonstration purposes only
          </p>
        </div>
      </div>

      {/* Persona Selection */}
      {!selectedPersona && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-ink text-center">Select Your Role</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(personaConfig).map(([type, config]) => (
              <SegmentCard
                key={type}
                segment={config.segment}
                title={config.title}
                subtitle={config.description}
                icon={config.icon}
                buttonText="Select Role"
                onOpen={() => handlePersonaSelect(type as PersonaType)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Persona Form */}
      {selectedPersona && (
        <div className="max-w-2xl mx-auto">
          <Card className="rounded-2xl shadow-soft">
            <CardHeader className="p-6">
              <div className="flex items-center gap-3">
                <div className="text-gold-hi">
                  {personaConfig[selectedPersona].icon}
                </div>
                <div>
                  <CardTitle className="text-[15px] font-semibold">
                    {personaConfig[selectedPersona].title}
                  </CardTitle>
                  <p className="text-sm text-slate/80 mt-1">
                    {personaConfig[selectedPersona].description}
                  </p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-6 pt-0 space-y-6">
              {renderPersonaFields()}
              
              {/* Policy Gates Notice */}
              <div className="bg-sand/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-4 w-4 text-gold-base mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-ink">Policy Gates Will Be Applied</h4>
                    <p className="text-xs text-ink/70 mt-1">
                      Based on your role, specific compliance gates will be automatically configured:
                      education freshness, disclosure packs, budget policies, and co-sign requirements.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedPersona(null)}
                  className="flex-1"
                >
                  Back to Selection
                </Button>
                <Button 
                  variant="gold" 
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? 'Creating Account...' : 'Complete Onboarding'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Process Overview */}
      <div className="max-w-4xl mx-auto">
        <h3 className="text-lg font-semibold text-ink text-center mb-6">
          NIL Platform Process Overview
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-gold-base/10 rounded-full flex items-center justify-center mx-auto">
              <Shield className="h-6 w-6 text-gold-base" />
            </div>
            <h4 className="text-sm font-semibold text-ink">Gate</h4>
            <p className="text-xs text-slate/80">Policy-as-code compliance checks</p>
          </div>
          
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-mint/10 rounded-full flex items-center justify-center mx-auto">
              <FileCheck className="h-6 w-6 text-mint" />
            </div>
            <h4 className="text-sm font-semibold text-ink">Receipt</h4>
            <p className="text-xs text-slate/80">Decision-RDS, Consent-RDS generation</p>
          </div>
          
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-sky/10 rounded-full flex items-center justify-center mx-auto">
              <BookOpen className="h-6 w-6 text-sky" />
            </div>
            <h4 className="text-sm font-semibold text-ink">Anchor</h4>
            <p className="text-xs text-slate/80">Blockchain/timestamping proof</p>
          </div>
          
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-burgundy/10 rounded-full flex items-center justify-center mx-auto">
              <Trophy className="h-6 w-6 text-burgundy" />
            </div>
            <h4 className="text-sm font-semibold text-ink">Replay</h4>
            <p className="text-xs text-slate/80">Audit trail and verification</p>
          </div>
        </div>
      </div>
    </div>
  );
}