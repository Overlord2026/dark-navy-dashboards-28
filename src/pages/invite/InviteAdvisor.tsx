import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { 
  UserPlus, 
  Mail, 
  Send, 
  ArrowRight,
  Shield,
  Clock,
  CheckCircle
} from 'lucide-react';

const inviteSchema = z.object({
  familyEmail: z.string().email('Please enter a valid email address').min(1, 'Your email is required'),
  advisorEmail: z.string().email('Please enter a valid advisor email').min(1, 'Advisor email is required'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  paymentResponsibility: z.enum(['family_paid', 'advisor_paid']).default('family_paid'),
  personalNote: z.string().optional()
});

type InviteFormData = z.infer<typeof inviteSchema>;

export default function InviteAdvisor() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<InviteFormData>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      familyEmail: '',
      advisorEmail: '',
      firstName: '',
      lastName: '',
      paymentResponsibility: 'family_paid',
      personalNote: ''
    }
  });

  const onSubmit = async (data: InviteFormData) => {
    setIsSubmitting(true);
    
    try {
      // Generate unique token
      const inviteToken = crypto.randomUUID();
      
      // Insert invite into public.invites table
      const { data: invite, error } = await supabase
        .from('prospect_invitations')
        .insert({
          email: data.advisorEmail,
          advisor_id: null, // Family-initiated, no advisor ID yet
          magic_token: inviteToken,
          status: 'pending',
          payment_responsibility: data.paymentResponsibility,
          first_name: data.firstName,
          last_name: data.lastName,
          personal_note: data.personalNote,
          inviter_email: data.familyEmail,
          invite_type: 'family_to_advisor'
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Send invitation via edge function
      const { error: sendError } = await supabase.functions.invoke('leads-invite', {
        body: {
          invite_id: invite.id,
          email: data.advisorEmail,
          magic_token: inviteToken,
          inviter_email: data.familyEmail,
          first_name: data.firstName,
          last_name: data.lastName,
          personal_note: data.personalNote,
          invite_type: 'family_to_advisor'
        }
      });

      if (sendError) {
        throw sendError;
      }

      toast.success('Advisor invitation sent successfully!', {
        description: `${data.advisorEmail} will receive an invitation to connect with your family.`
      });
      
      form.reset();

    } catch (error) {
      console.error('Failed to send advisor invite:', error);
      toast.error('Failed to send invitation', {
        description: 'Please try again or check the advisor email address.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Invite Your Advisor | Family Office Platform</title>
        <meta name="description" content="Connect with your financial advisor through our secure family office platform" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-12 px-4">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <UserPlus className="h-10 w-10 text-primary" />
                <ArrowRight className="h-6 w-6 text-muted-foreground" />
                <Shield className="h-10 w-10 text-primary" />
              </div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                Invite Your Advisor
              </h1>
              <p className="text-xl text-muted-foreground">
                Connect securely with your financial advisor on our platform
              </p>
            </div>

            {/* Main Form */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-primary" />
                  Advisor Connection Request
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Your Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-foreground">Your Information</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name *</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="John" disabled={isSubmitting} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name *</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Smith" disabled={isSubmitting} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="familyEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your Email Address *</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="email"
                                placeholder="you@example.com"
                                disabled={isSubmitting}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Advisor Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-foreground">Advisor Information</h3>
                      
                      <FormField
                        control={form.control}
                        name="advisorEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Advisor Email Address *</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="email"
                                placeholder="advisor@firm.com"
                                disabled={isSubmitting}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="paymentResponsibility"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Payment Responsibility</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="family_paid">We'll pay for our account</SelectItem>
                                <SelectItem value="advisor_paid">Advisor will cover costs</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="personalNote"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Personal Message (Optional)</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                placeholder="Add a personal note to your advisor..."
                                disabled={isSubmitting}
                                rows={3}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isSubmitting}
                      size="lg"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                          Sending Invitation...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Invitation to Advisor
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* How it Works */}
            <Card className="mt-8 border-border bg-card">
              <CardHeader>
                <CardTitle className="text-lg">What Happens Next?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <Mail className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Secure Invitation Sent</p>
                      <p className="text-sm text-muted-foreground">
                        Your advisor receives a secure invitation email with connection details
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <Clock className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Advisor Reviews & Accepts</p>
                      <p className="text-sm text-muted-foreground">
                        Your advisor can review the invitation and accept the connection
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Secure Collaboration</p>
                      <p className="text-sm text-muted-foreground">
                        Once accepted, you'll have secure access to collaborate through the platform
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}