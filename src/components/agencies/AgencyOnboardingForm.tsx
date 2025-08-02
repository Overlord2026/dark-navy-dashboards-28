import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Building, Mail, Phone, Globe, DollarSign, Users, CheckCircle } from 'lucide-react';

const agencyOnboardingSchema = z.object({
  name: z.string().min(2, 'Agency name must be at least 2 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  contact_email: z.string().email('Invalid email address'),
  contact_phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  specializations: z.array(z.string()).min(1, 'Please select at least one specialization'),
  fee_structure: z.string().min(1, 'Please describe your fee structure'),
  minimum_budget: z.number().min(1000, 'Minimum budget must be at least $1,000'),
  years_experience: z.number().min(1, 'Years of experience must be at least 1'),
  team_size: z.number().min(1, 'Team size must be at least 1'),
  case_studies: z.string().min(100, 'Please provide detailed case studies (min 100 characters)'),
  certifications: z.string().optional(),
  references: z.string().optional(),
  terms_accepted: z.boolean().refine(val => val === true, 'You must accept the terms'),
});

type AgencyOnboardingForm = z.infer<typeof agencyOnboardingSchema>;

interface AgencyOnboardingFormProps {
  onSuccess?: () => void;
}

export const AgencyOnboardingForm: React.FC<AgencyOnboardingFormProps> = ({ onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<AgencyOnboardingForm>({
    resolver: zodResolver(agencyOnboardingSchema),
    defaultValues: {
      specializations: [],
      minimum_budget: 5000,
      years_experience: 1,
      team_size: 1,
      terms_accepted: false,
    },
  });

  const specializationOptions = [
    'Facebook Advertising',
    'Google Ads',
    'LinkedIn Marketing',
    'Dinner Seminars',
    'Webinar Marketing',
    'Direct Mail',
    'SEO/Content Marketing',
    'Email Marketing',
    'Radio Advertising',
    'TV Advertising',
    'Print Advertising',
    'Referral Programs',
  ];

  const onSubmit = async (data: AgencyOnboardingForm) => {
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const agencyData = {
        name: data.name,
        description: data.description,
        website: data.website || null,
        contact_email: data.contact_email,
        contact_phone: data.contact_phone,
        specializations: data.specializations,
        fee_structure: data.fee_structure,
        minimum_budget: data.minimum_budget,
        years_experience: data.years_experience,
        team_size: data.team_size,
        case_studies: data.case_studies,
        certifications: data.certifications || null,
        references: data.references || null,
        status: 'pending',
        created_by: user.id,
        average_rating: 0,
        total_reviews: 0,
        is_featured: false,
      };

      const { error } = await supabase
        .from('marketing_agencies')
        .insert([agencyData]);

      if (error) throw error;

      toast({
        title: "Application Submitted!",
        description: "Your agency application has been submitted for review. We'll contact you within 2-3 business days.",
      });

      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error('Error submitting agency application:', error);
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Join Our Agency Marketplace</h1>
        <p className="text-muted-foreground">
          Partner with top financial advisors and grow your business with our transparent marketplace
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Company Information
              </CardTitle>
              <CardDescription>
                Tell us about your marketing agency
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agency Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Acme Marketing Solutions" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Description *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your agency, mission, and what makes you unique..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        Website
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="https://www.yourwebsite.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="years_experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Years of Experience *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Contact Information
              </CardTitle>
              <CardDescription>
                How can advisors reach you?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="contact_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Email *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="contact@yourcompany.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contact_phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Contact Phone *
                      </FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="(555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Services & Pricing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Services & Pricing
              </CardTitle>
              <CardDescription>
                What services do you offer and how do you charge?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="specializations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specializations * (Select all that apply)</FormLabel>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                      {specializationOptions.map((spec) => (
                        <div key={spec} className="flex items-center space-x-2">
                          <Checkbox
                            id={spec}
                            checked={field.value.includes(spec)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                field.onChange([...field.value, spec]);
                              } else {
                                field.onChange(field.value.filter((item) => item !== spec));
                              }
                            }}
                          />
                          <label htmlFor={spec} className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {spec}
                          </label>
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fee_structure"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fee Structure *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your pricing model (e.g., flat fee, percentage of ad spend, performance-based, etc.)"
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="minimum_budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Monthly Budget *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1000"
                          step="1000"
                          placeholder="5000"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 1000)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="team_size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Team Size *
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Portfolio & Credentials */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Portfolio & Credentials
              </CardTitle>
              <CardDescription>
                Show us your track record and qualifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="case_studies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Case Studies & Results *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Provide specific examples of successful campaigns, including metrics like cost per lead, conversion rates, ROI, etc."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="certifications"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Certifications & Awards</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="List relevant certifications, awards, or industry recognition..."
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="references"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client References</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Provide contact information for 2-3 client references (optional but recommended)"
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Terms & Conditions */}
          <Card>
            <CardContent className="pt-6">
              <FormField
                control={form.control}
                name="terms_accepted"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm">
                        I accept the terms and conditions *
                      </FormLabel>
                      <p className="text-xs text-muted-foreground">
                        By checking this box, you agree to our agency partnership terms, 
                        platform fees, and performance standards. You also confirm that 
                        all information provided is accurate and up-to-date.
                      </p>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="min-w-[200px]"
            >
              {isSubmitting ? "Submitting Application..." : "Submit Application"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};