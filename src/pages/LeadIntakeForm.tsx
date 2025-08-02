import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Phone, Mail, DollarSign, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const leadIntakeSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  interest: z.string().min(1, 'Please select an interest'),
  budget: z.array(z.number()).min(1, 'Please set a budget range'),
  source: z.string().min(1, 'Please select a source'),
  assigned_advisor: z.string().optional(),
  campaign_id: z.string().optional(),
  agency_id: z.string().optional(),
  notes: z.string().optional(),
});

type LeadIntakeForm = z.infer<typeof leadIntakeSchema>;

export const LeadIntakeForm: React.FC = () => {
  const [advisors, setAdvisors] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [agencies, setAgencies] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<LeadIntakeForm>({
    resolver: zodResolver(leadIntakeSchema),
    defaultValues: {
      budget: [100000],
      notes: '',
    },
  });

  useEffect(() => {
    fetchDropdownData();
    detectUTMParameters();
  }, []);

  const fetchDropdownData = async () => {
    try {
      // Fetch advisors
      const { data: advisorsData } = await supabase
        .from('advisor_profiles')
        .select('id, name, user_id')
        .eq('is_active', true);

      // Fetch campaigns
      const { data: campaignsData } = await supabase
        .from('agency_campaigns')
        .select('id, campaign_name, agency_id')
        .eq('status', 'active');

      // Fetch agencies
      const { data: agenciesData } = await supabase
        .from('marketing_agencies')
        .select('id, name')
        .eq('status', 'approved');

      setAdvisors(advisorsData || []);
      setCampaigns(campaignsData || []);
      setAgencies(agenciesData || []);
    } catch (error) {
      console.error('Error fetching dropdown data:', error);
    }
  };

  const detectUTMParameters = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get('utm_source');
    const utmCampaign = urlParams.get('utm_campaign');
    
    if (utmSource) {
      form.setValue('source', utmSource);
    }
    if (utmCampaign) {
      const campaign = campaigns.find(c => c.campaign_name.toLowerCase().includes(utmCampaign.toLowerCase()));
      if (campaign) {
        form.setValue('campaign_id', campaign.id);
      }
    }
  };

  const onSubmit = async (data: LeadIntakeForm) => {
    setIsSubmitting(true);
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      const leadData = {
        first_name: data.name.split(' ')[0],
        last_name: data.name.split(' ').slice(1).join(' ') || '',
        email: data.email,
        phone: data.phone,
        lead_value: data.budget[0],
        lead_source: data.source,
        campaign_id: data.campaign_id || null,
        agency_id: data.agency_id || null,
        advisor_id: data.assigned_advisor || user?.id,
        lead_status: 'new',
      };

      const { error } = await supabase
        .from('leads')
        .insert([leadData]);

      if (error) throw error;

      toast({
        title: "Lead Created Successfully!",
        description: "The lead has been added to your pipeline.",
      });

      navigate('/leads');
    } catch (error) {
      console.error('Error creating lead:', error);
      toast({
        title: "Error",
        description: "Failed to create lead. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <div className="mobile-form-container">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="touch-target-large"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">New Lead</h1>
            <p className="text-muted-foreground">Add a new prospect to your pipeline</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Lead Information
            </CardTitle>
            <CardDescription>
              Enter the prospect's details and preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Contact Details</h3>
                  
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="mobile-form-field">
                        <FormLabel>Full Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="mobile-form-field">
                        <FormLabel className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Email Address *
                        </FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem className="mobile-form-field">
                        <FormLabel className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          Phone Number *
                        </FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="(555) 123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Preferences */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Preferences & Needs</h3>
                  
                  <FormField
                    control={form.control}
                    name="interest"
                    render={({ field }) => (
                      <FormItem className="mobile-form-field">
                        <FormLabel>Primary Interest *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select an interest" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="retirement_planning">Retirement Planning</SelectItem>
                            <SelectItem value="investment_management">Investment Management</SelectItem>
                            <SelectItem value="financial_planning">Financial Planning</SelectItem>
                            <SelectItem value="insurance">Insurance</SelectItem>
                            <SelectItem value="tax_planning">Tax Planning</SelectItem>
                            <SelectItem value="estate_planning">Estate Planning</SelectItem>
                            <SelectItem value="college_funding">College Funding</SelectItem>
                            <SelectItem value="business_planning">Business Planning</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="budget"
                    render={({ field }) => (
                      <FormItem className="mobile-form-field">
                        <FormLabel className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          Investment Budget: ${field.value?.[0]?.toLocaleString() || 0}
                        </FormLabel>
                        <FormControl>
                          <Slider
                            min={10000}
                            max={5000000}
                            step={10000}
                            value={field.value}
                            onValueChange={field.onChange}
                            className="py-4"
                          />
                        </FormControl>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>$10K</span>
                          <span>$5M+</span>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Source & Campaign */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Source & Assignment</h3>
                  
                  <FormField
                    control={form.control}
                    name="source"
                    render={({ field }) => (
                      <FormItem className="mobile-form-field">
                        <FormLabel>Lead Source *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="How did they find you?" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Facebook">Facebook</SelectItem>
                            <SelectItem value="Google Ads">Google Ads</SelectItem>
                            <SelectItem value="Seminar">Seminar</SelectItem>
                            <SelectItem value="Webinar">Webinar</SelectItem>
                            <SelectItem value="Agency">Marketing Agency</SelectItem>
                            <SelectItem value="Referral">Referral</SelectItem>
                            <SelectItem value="Website">Website</SelectItem>
                            <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                            <SelectItem value="Cold Call">Cold Call</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="assigned_advisor"
                    render={({ field }) => (
                      <FormItem className="mobile-form-field">
                        <FormLabel>Assigned Advisor</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select an advisor" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {advisors.map((advisor) => (
                              <SelectItem key={advisor.id} value={advisor.user_id}>
                                {advisor.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="campaign_id"
                    render={({ field }) => (
                      <FormItem className="mobile-form-field">
                        <FormLabel>Campaign</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a campaign" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {campaigns.map((campaign) => (
                              <SelectItem key={campaign.id} value={campaign.id}>
                                {campaign.campaign_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="agency_id"
                    render={({ field }) => (
                      <FormItem className="mobile-form-field">
                        <FormLabel>Marketing Agency</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select an agency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {agencies.map((agency) => (
                              <SelectItem key={agency.id} value={agency.id}>
                                {agency.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem className="mobile-form-field">
                      <FormLabel>Additional Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Any additional information about this prospect..."
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full mobile-form-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating Lead..." : "Create Lead"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};