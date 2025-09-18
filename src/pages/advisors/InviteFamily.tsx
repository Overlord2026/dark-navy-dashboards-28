import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { sendInvite } from '@/state/invite.mock';
import { Mail, Send, UserPlus } from 'lucide-react';

const inviteSchema = z.object({
  email: z.string().email('Please enter a valid email address').min(1, 'Email is required')
});

type InviteFormData = z.infer<typeof inviteSchema>;

export default function InviteFamily() {
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<InviteFormData>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: ''
    }
  });

  const onSubmit = async (data: InviteFormData) => {
    setIsLoading(true);
    
    try {
      const result = await sendInvite(data.email);
      
      if (result.ok) {
        toast.success('Invite queued', {
          description: `Family invitation sent to ${data.email}`,
          duration: 3000
        });
        form.reset();
      } else {
        toast.error('Failed to send invite', {
          description: result.error || 'Unknown error occurred'
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
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
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