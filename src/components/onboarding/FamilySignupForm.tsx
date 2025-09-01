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
import { TrendingUp, Shield, Sparkles } from 'lucide-react';

// Family signup schema - only 4 required fields
const familySignupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please provide a valid email address'),
  family_stage: z.enum(['aspiring', 'retirees']),
  goals: z.string().min(10, 'Please describe your primary goals (minimum 10 characters)')
});

type FamilySignupFormData = z.infer<typeof familySignupSchema>;

interface FamilySignupFormProps {
  onComplete?: (data: FamilySignupFormData) => void;
}

const FAMILY_STAGES = [
  {
    key: 'aspiring' as const,
    title: 'Aspiring Wealthy',
    description: 'Building wealth systematically',
    icon: TrendingUp
  },
  {
    key: 'retirees' as const, 
    title: 'Retirees',
    description: 'Preserving and optimizing wealth',
    icon: Shield
  }
];

export function FamilySignupForm({ onComplete }: FamilySignupFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStage, setSelectedStage] = useState<'aspiring' | 'retirees' | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<FamilySignupFormData>({
    resolver: zodResolver(familySignupSchema)
  });

  const handleStageSelect = (stage: 'aspiring' | 'retirees') => {
    setSelectedStage(stage);
    setValue('family_stage', stage);
  };

  const onSubmit = async (data: FamilySignupFormData) => {
    setIsLoading(true);
    
    try {
      // Store profile data locally for now
      localStorage.setItem('family_profile', JSON.stringify({
        name: data.name,
        email: data.email,
        family_stage: data.family_stage,
        goals: data.goals,
        created_at: new Date().toISOString()
      }));

      toast({
        title: 'Welcome to your Family Office!',
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
            <Sparkles className="h-8 w-8 text-bfo-gold" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            Join Your Family Office
          </CardTitle>
          <p className="text-white/80">
            Complete your profile in just 4 simple steps
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
                placeholder="john@example.com"
                className="bg-white/10 border-bfo-gold/30 text-white placeholder:text-white/50"
              />
              {errors.email && (
                <p className="text-red-400 text-sm">{errors.email.message}</p>
              )}
            </div>

            {/* Family Stage Selection */}
            <div className="space-y-3">
              <Label className="text-white">Family Stage *</Label>
              <div className="grid grid-cols-1 gap-3">
                {FAMILY_STAGES.map((stage) => {
                  const IconComponent = stage.icon;
                  const isSelected = selectedStage === stage.key;
                  
                  return (
                    <button
                      key={stage.key}
                      type="button"
                      onClick={() => handleStageSelect(stage.key)}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        isSelected 
                          ? 'border-bfo-gold bg-bfo-gold/10' 
                          : 'border-white/20 hover:border-bfo-gold/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <IconComponent className={`h-5 w-5 ${
                          isSelected ? 'text-bfo-gold' : 'text-white'
                        }`} />
                        <div>
                          <h3 className={`font-medium ${
                            isSelected ? 'text-bfo-gold' : 'text-white'
                          }`}>
                            {stage.title}
                          </h3>
                          <p className="text-sm text-white/70">
                            {stage.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              {errors.family_stage && (
                <p className="text-red-400 text-sm">{errors.family_stage.message}</p>
              )}
            </div>

            {/* Goals */}
            <div className="space-y-2">
              <Label htmlFor="goals" className="text-white">Primary Goals *</Label>
              <textarea
                id="goals"
                {...register('goals')}
                placeholder="Describe your main financial goals and objectives..."
                rows={3}
                className="w-full p-3 rounded-md bg-white/10 border border-bfo-gold/30 text-white placeholder:text-white/50 resize-none"
              />
              {errors.goals && (
                <p className="text-red-400 text-sm">{errors.goals.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bfo-cta h-12 text-lg font-medium"
            >
              {isLoading ? 'Creating Your Profile...' : 'Create Family Office Profile'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}