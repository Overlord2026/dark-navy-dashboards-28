import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Shield, Briefcase, Users } from 'lucide-react';

// Professional signup schema - 5 required fields (4 + firm)
const professionalSignupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please provide a valid email address'),
  firm_name: z.string().min(2, 'Firm name must be at least 2 characters'),
  professional_type: z.enum(['advisor', 'cpa', 'attorney', 'insurance', 'healthcare']),
  specialties: z.string().min(10, 'Please describe your specialties (minimum 10 characters)')
});

type ProfessionalSignupFormData = z.infer<typeof professionalSignupSchema>;

interface ProfessionalSignupFormProps {
  onComplete?: (data: ProfessionalSignupFormData) => void;
}

const PROFESSIONAL_TYPES = [
  {
    key: 'advisor' as const,
    title: 'Financial Advisor',
    description: 'Investment and wealth management',
    icon: Briefcase
  },
  {
    key: 'cpa' as const,
    title: 'CPA / Tax Professional', 
    description: 'Tax planning and accounting',
    icon: Shield
  },
  {
    key: 'attorney' as const,
    title: 'Estate Attorney',
    description: 'Legal and estate planning',
    icon: Users
  },
  {
    key: 'insurance' as const,
    title: 'Insurance Professional',
    description: 'Risk management and protection',
    icon: Shield
  },
  {
    key: 'healthcare' as const,
    title: 'Healthcare Professional',
    description: 'Medical and health planning',
    icon: Users
  }
];

export function ProfessionalSignupForm({ onComplete }: ProfessionalSignupFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<ProfessionalSignupFormData>({
    resolver: zodResolver(professionalSignupSchema)
  });

  const handleTypeSelect = (type: any) => {
    setSelectedType(type);
    setValue('professional_type', type);
  };

  const onSubmit = async (data: ProfessionalSignupFormData) => {
    setIsLoading(true);
    
    try {
      // Store profile data locally for now
      localStorage.setItem('professional_profile', JSON.stringify({
        name: data.name,
        email: data.email,
        firm_name: data.firm_name,
        professional_type: data.professional_type,
        specialties: data.specialties,
        created_at: new Date().toISOString()
      }));

      toast({
        title: 'Welcome to the Professional Network!',
        description: 'Your profile has been created successfully.',
      });

      onComplete?.(data);
      
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: 'Signup failed',
        description: 'Please try again or contact support.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bfo-black flex items-center justify-center p-4">
      <Card className="bfo-card w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Shield className="h-8 w-8 text-bfo-gold" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            Join Professional Network
          </CardTitle>
          <p className="text-white/80">
            Connect with high-net-worth clients in 5 steps
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">Full Name *</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="John Smith"
                className="bg-white/10 border-bfo-gold/30 text-white placeholder:text-white/50"
              />
              {errors.name && (
                <p className="text-red-400 text-sm">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email Address *</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="john@yourfirm.com"
                className="bg-white/10 border-bfo-gold/30 text-white placeholder:text-white/50"
              />
              {errors.email && (
                <p className="text-red-400 text-sm">{errors.email.message}</p>
              )}
            </div>

            {/* Firm Name */}
            <div className="space-y-2">
              <Label htmlFor="firm_name" className="text-white">Firm Name *</Label>
              <Input
                id="firm_name"
                {...register('firm_name')}
                placeholder="Smith Advisory Group"
                className="bg-white/10 border-bfo-gold/30 text-white placeholder:text-white/50"
              />
              {errors.firm_name && (
                <p className="text-red-400 text-sm">{errors.firm_name.message}</p>
              )}
            </div>

            {/* Professional Type Selection */}
            <div className="space-y-3">
              <Label className="text-white">Professional Type *</Label>
              <div className="grid grid-cols-1 gap-2">
                {PROFESSIONAL_TYPES.map((type) => {
                  const IconComponent = type.icon;
                  const isSelected = selectedType === type.key;
                  
                  return (
                    <button
                      key={type.key}
                      type="button"
                      onClick={() => handleTypeSelect(type.key)}
                      className={`p-3 rounded-lg border transition-all text-left ${
                        isSelected 
                          ? 'border-bfo-gold bg-bfo-gold/10' 
                          : 'border-white/20 hover:border-bfo-gold/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <IconComponent className={`h-4 w-4 ${
                          isSelected ? 'text-bfo-gold' : 'text-white'
                        }`} />
                        <div>
                          <h3 className={`font-medium text-sm ${
                            isSelected ? 'text-bfo-gold' : 'text-white'
                          }`}>
                            {type.title}
                          </h3>
                          <p className="text-xs text-white/70">
                            {type.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              {errors.professional_type && (
                <p className="text-red-400 text-sm">{errors.professional_type.message}</p>
              )}
            </div>

            {/* Specialties */}
            <div className="space-y-2">
              <Label htmlFor="specialties" className="text-white">Specialties & Expertise *</Label>
              <textarea
                id="specialties"
                {...register('specialties')}
                placeholder="Describe your areas of expertise and services..."
                rows={3}
                className="w-full p-3 rounded-md bg-white/10 border border-bfo-gold/30 text-white placeholder:text-white/50 resize-none"
              />
              {errors.specialties && (
                <p className="text-red-400 text-sm">{errors.specialties.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bfo-cta h-12 text-lg font-medium"
            >
              {isLoading ? 'Creating Your Profile...' : 'Join Professional Network'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}