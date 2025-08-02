import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { ArrowLeft, DollarSign, Phone, Mail, User, Target, CheckCircle, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import confetti from 'canvas-confetti';

const leadFormSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: z.string()
    .email('Please enter a valid email address'),
  phone: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number'),
  interest: z.string()
    .min(1, 'Please select an area of interest'),
  budget: z.array(z.number())
    .length(1, 'Please select a budget range'),
  source: z.string().optional(),
});

type LeadFormData = z.infer<typeof leadFormSchema>;

const interestOptions = [
  { value: 'retirement', label: 'Retirement Planning' },
  { value: 'tax', label: 'Tax Optimization' },
  { value: 'estate', label: 'Estate Planning' },
  { value: 'investment', label: 'Investment Management' },
  { value: 'other', label: 'Other Financial Services' },
];

const budgetRanges = [
  { min: 0, max: 50000, label: 'Under $50K' },
  { min: 50000, max: 250000, label: '$50K - $250K' },
  { min: 250000, max: 1000000, label: '$250K - $1M' },
  { min: 1000000, max: 5000000, label: '$1M - $5M' },
  { min: 5000000, max: 25000000, label: '$5M - $25M' },
  { min: 25000000, max: 100000000, label: '$25M+' },
];

export function LeadIntakeForm() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [budgetValue, setBudgetValue] = useState([250000]);

  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      interest: '',
      budget: [250000],
      source: detectSource(),
    },
  });

  function detectSource(): string {
    const urlParams = new URLSearchParams(window.location.search);
    const utm_source = urlParams.get('utm_source');
    const utm_campaign = urlParams.get('utm_campaign');
    const referrer = document.referrer;
    
    if (utm_source) return `${utm_source}${utm_campaign ? ` - ${utm_campaign}` : ''}`;
    if (referrer.includes('google')) return 'Google Search';
    if (referrer.includes('facebook')) return 'Facebook';
    if (referrer.includes('linkedin')) return 'LinkedIn';
    if (referrer) return `Referral - ${new URL(referrer).hostname}`;
    return 'Direct Visit';
  }

  function getBudgetLabel(value: number): string {
    const range = budgetRanges.find(r => value >= r.min && value <= r.max);
    return range?.label || '$250K - $1M';
  }

  async function onSubmit(data: LeadFormData) {
    setIsSubmitting(true);
    
    try {
      // Insert lead into database
      const { error } = await supabase
        .from('leads')
        .insert({
          first_name: data.name.split(' ')[0] || data.name,
          last_name: data.name.split(' ').slice(1).join(' ') || '',
          email: data.email,
          phone: data.phone,
          lead_source: data.source || 'Unknown',
          lead_status: 'new',
          notes: `Interest: ${data.interest}, Budget: ${getBudgetLabel(data.budget[0])}`,
          advisor_id: '00000000-0000-0000-0000-000000000000', // Placeholder - will be assigned later
        });

      if (error) {
        throw error;
      }

      // Trigger confetti celebration immediately
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#169873', '#00D2FF'],
      });

      toast.success('Thank you! Your information has been submitted successfully.');
      
      // Navigate to confirmation page with form data
      navigate('/leads/confirmation', { 
        state: { 
          formData: {
            ...data,
            budgetLabel: getBudgetLabel(data.budget[0])
          }
        }
      });
      
    } catch (error) {
      console.error('Error submitting lead:', error);
      toast.error('There was an error submitting your information. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#172042] via-[#202D5A] to-[#172042] p-4">
      {/* Header */}
      <div className="max-w-md mx-auto mb-8">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white">Get Started</h1>
            <p className="text-white/70 text-sm">Connect with a financial advisor</p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <Card className="max-w-md mx-auto bg-card border-border shadow-2xl">
        <div className="p-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-[#00D2FF] to-[#FFC700] rounded-full mx-auto mb-4 flex items-center justify-center">
              <Target className="h-8 w-8 text-[#172042]" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">
              Tell Us About Your Goals
            </h2>
            <p className="text-muted-foreground text-sm">
              Help us match you with the right financial advisor
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-foreground">
                      <User className="h-4 w-4 text-[#00D2FF]" />
                      Full Name *
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter your full name"
                        className="h-12 text-base bg-input border-border focus:border-[#00D2FF] focus:ring-[#00D2FF]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-foreground">
                      <Mail className="h-4 w-4 text-[#00D2FF]" />
                      Email Address *
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="Enter your email"
                        className="h-12 text-base bg-input border-border focus:border-[#00D2FF] focus:ring-[#00D2FF]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone Field */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-foreground">
                      <Phone className="h-4 w-4 text-[#00D2FF]" />
                      Phone Number *
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="tel"
                        placeholder="(555) 123-4567"
                        className="h-12 text-base bg-input border-border focus:border-[#00D2FF] focus:ring-[#00D2FF]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Interest Field */}
              <FormField
                control={form.control}
                name="interest"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-foreground">
                      <Target className="h-4 w-4 text-[#00D2FF]" />
                      Primary Interest *
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 text-base bg-input border-border focus:border-[#00D2FF] focus:ring-[#00D2FF]">
                          <SelectValue placeholder="Select your primary interest" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-popover border-border">
                        {interestOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Budget Range Slider */}
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-foreground">
                      <DollarSign className="h-4 w-4 text-[#00D2FF]" />
                      Investment Budget
                    </FormLabel>
                    <div className="space-y-4">
                      <FormControl>
                        <Slider
                          value={budgetValue}
                          onValueChange={(value) => {
                            setBudgetValue(value);
                            field.onChange(value);
                          }}
                          min={0}
                          max={25000000}
                          step={50000}
                          className="w-full"
                        />
                      </FormControl>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-[#FFC700]">
                          {getBudgetLabel(budgetValue[0])}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Assets under management
                        </div>
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Source (Hidden) */}
              <FormField
                control={form.control}
                name="source"
                render={({ field }) => (
                  <input type="hidden" {...field} />
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 text-lg font-bold bg-gradient-to-r from-[#00D2FF] to-[#FFC700] hover:from-[#00D2FF]/90 hover:to-[#FFC700]/90 text-[#172042] shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isSubmitting ? 'Submitting...' : 'Connect Me With An Advisor'}
              </Button>

              {/* Privacy Notice */}
              <p className="text-xs text-muted-foreground text-center">
                By submitting this form, you agree to our Terms of Service and Privacy Policy. 
                We will only contact you about financial advisory services.
              </p>
            </form>
          </Form>
        </div>
      </Card>
    </div>
  );
}