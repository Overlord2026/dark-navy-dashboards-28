import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { sendAdvisorInvite, getAdvisorInvitations, type AdvisorInviteRequest } from '@/features/advisors/platform/state/invite.mock';
import { Mail, Send, UserPlus, Clock, CheckCircle, XCircle, DollarSign } from 'lucide-react';

const inviteSchema = z.object({
  email: z.string().email('Please enter a valid email address').min(1, 'Email is required'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  clientSegment: z.string().optional(),
  paymentResponsibility: z.enum(['advisor_paid', 'client_paid']).default('advisor_paid'),
  personalNote: z.string().optional()
});

type InviteFormData = z.infer<typeof inviteSchema>;

export default function InviteFamily() {
  const [isLoading, setIsLoading] = useState(false);
  const [invitations, setInvitations] = useState<any[]>([]);
  
  const form = useForm<InviteFormData>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      clientSegment: 'general',
      paymentResponsibility: 'advisor_paid',
      personalNote: ''
    }
  });

  useEffect(() => {
    loadInvitations();
  }, []);

  const loadInvitations = async () => {
    const data = await getAdvisorInvitations();
    setInvitations(data);
  };

  const onSubmit = async (data: InviteFormData) => {
    setIsLoading(true);
    
    try {
      const result = await sendAdvisorInvite(data);
      
      if (result.success) {
        toast.success('Invite sent successfully', {
          description: result.message,
          duration: 3000
        });
        form.reset();
        loadInvitations(); // Refresh invitation list
      } else {
        toast.error('Failed to send invite', {
          description: result.message
        });
      }
    } catch (error) {
      console.error('Invite error:', error);
      toast.error('Failed to send invite', {
        description: 'Please try again later'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'activated': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'expired': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <UserPlus className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Invite Family</h1>
            <p className="text-muted-foreground">
              Send a platform invitation to a family member or prospect
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Family Invitation
            </CardTitle>
            <CardDescription>
              Enter the email address of the family member you'd like to invite to the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="John"
                            disabled={isLoading}
                          />
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
                        <FormLabel>Last Name (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Doe"
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="family@example.com"
                          disabled={isLoading}
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="clientSegment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client Segment</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select segment" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="general">General</SelectItem>
                            <SelectItem value="high_net_worth">High Net Worth</SelectItem>
                            <SelectItem value="ultra_high_net_worth">Ultra High Net Worth</SelectItem>
                            <SelectItem value="institutional">Institutional</SelectItem>
                          </SelectContent>
                        </Select>
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
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="advisor_paid">
                              <div className="flex items-center gap-2">
                                <DollarSign className="h-4 w-4" />
                                Advisor Paid
                              </div>
                            </SelectItem>
                            <SelectItem value="client_paid">Client Paid</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="personalNote"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Personal Note (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Add a personal message to include in the invitation..."
                          disabled={isLoading}
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex gap-3">
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="flex items-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    {isLoading ? 'Sending...' : 'Send Invite'}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => form.reset()}
                    disabled={isLoading}
                  >
                    Clear
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Recent Invitations */}
        {invitations.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Invitations
              </CardTitle>
              <CardDescription>
                Track the status of your recent family invitations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {invitations.map((invitation) => (
                  <div key={invitation.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(invitation.status)}
                      <div>
                        <p className="font-medium">{invitation.email}</p>
                        <p className="text-sm text-muted-foreground">
                          {invitation.client_segment && `${invitation.client_segment} • `}
                          {new Date(invitation.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={invitation.status === 'activated' ? 'default' : 'secondary'}>
                        {invitation.status}
                      </Badge>
                      {invitation.payment_responsibility && (
                        <Badge variant="outline">
                          {invitation.payment_responsibility === 'advisor_paid' ? 'Advisor Paid' : 'Client Paid'}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mt-8 p-4 bg-muted/50 rounded-lg">
          <h3 className="font-semibold mb-2">What happens next?</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• The family member will receive an invitation email</li>
            <li>• They can create their account and complete onboarding</li>
            <li>• You'll be notified when they join the platform</li>
            <li>• You can track invitation status in your dashboard</li>
          </ul>
        </div>
      </div>
    </div>
  );
}