import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Mail, Send, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EmailTestData {
  to: string;
  advisorName: string;
  emailDay: number;
  personalizedData?: {
    currentAUM?: string;
    firmName?: string;
    leadSource?: string;
  };
}

export default function AdvisorEmailTester() {
  const [formData, setFormData] = useState<EmailTestData>({
    to: '',
    advisorName: '',
    emailDay: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [lastSentEmail, setLastSentEmail] = useState<any>(null);
  const { toast } = useToast();

  const emailSequenceInfo = [
    { day: 0, subject: "Here's how to close more clients without more hours", type: "Introduction" },
    { day: 1, subject: "See how Jane grew her book 2x in 6 months", type: "Case Study" },
    { day: 3, subject: "What's your ROI potential?", type: "ROI Calculator" },
    { day: 5, subject: "Your compliance shield + client growth engine", type: "Compliance Focus" },
    { day: 7, subject: "Last chance to claim your annual discount", type: "Urgency/Discount" }
  ];

  const handleSendEmail = async () => {
    if (!formData.to || !formData.advisorName) {
      toast({
        title: "Missing Information",
        description: "Please provide both email address and advisor name",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/v1/send-advisor-emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        setLastSentEmail(result);
        toast({
          title: "Email Sent Successfully!",
          description: `Day ${formData.emailDay} email sent to ${formData.to}`,
          variant: "default"
        });
      } else {
        throw new Error(result.error || 'Failed to send email');
      }
    } catch (error: any) {
      console.error('Email sending failed:', error);
      toast({
        title: "Email Failed",
        description: error.message || "Unable to send email. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendSequence = async () => {
    if (!formData.to || !formData.advisorName) {
      toast({
        title: "Missing Information",
        description: "Please provide both email address and advisor name",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Send all emails in sequence with a small delay
      for (const email of emailSequenceInfo) {
        const emailData = { ...formData, emailDay: email.day };
        
        const response = await fetch('/api/v1/send-advisor-emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(emailData)
        });

        const result = await response.json();
        
        if (!result.success) {
          throw new Error(`Failed to send Day ${email.day} email: ${result.error}`);
        }

        // Small delay between emails
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      toast({
        title: "Full Sequence Sent!",
        description: `All 5 emails sent successfully to ${formData.to}`,
        variant: "default"
      });
    } catch (error: any) {
      console.error('Sequence sending failed:', error);
      toast({
        title: "Sequence Failed",
        description: error.message || "Unable to send email sequence. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-textPrimary">
          Advisor Email Sequence Tester
        </h1>
        <p className="text-xl text-textSecondary">
          Test and preview the automated advisor email sequence
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Email Form */}
        <Card className="bg-cardBg/50 border-border">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-gold" />
              <span>Send Test Email</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="advisor@example.com"
                value={formData.to}
                onChange={(e) => setFormData({ ...formData, to: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="advisorName">Advisor Name</Label>
              <Input
                id="advisorName"
                placeholder="John Smith"
                value={formData.advisorName}
                onChange={(e) => setFormData({ ...formData, advisorName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emailDay">Email Day</Label>
              <Select value={formData.emailDay.toString()} onValueChange={(value) => setFormData({ ...formData, emailDay: parseInt(value) })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {emailSequenceInfo.map((email) => (
                    <SelectItem key={email.day} value={email.day.toString()}>
                      Day {email.day} - {email.type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3 pt-4">
              <Button 
                onClick={handleSendEmail} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Single Email
                  </>
                )}
              </Button>

              <Button 
                onClick={handleSendSequence} 
                disabled={isLoading}
                variant="outline"
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Sending Sequence...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    Send Full Sequence (5 emails)
                  </>
                )}
              </Button>
            </div>

            {lastSentEmail && (
              <div className="bg-success/20 rounded-lg p-4 border border-success/30">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span className="font-semibold text-success">Email Sent Successfully!</span>
                </div>
                <p className="text-sm text-textSecondary">
                  Email ID: {lastSentEmail.emailId}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Email Sequence Overview */}
        <Card className="bg-cardBg/50 border-border">
          <CardHeader>
            <CardTitle>Email Sequence Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {emailSequenceInfo.map((email, index) => (
              <div key={email.day} className="flex items-start space-x-4 p-4 bg-surface/30 rounded-lg">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gold text-navy font-bold text-sm">
                  {email.day}
                </div>
                <div className="flex-1 min-w-0">
                  <Badge variant="outline" className="mb-2 text-xs">
                    {email.type}
                  </Badge>
                  <h4 className="font-semibold text-sm text-textPrimary mb-1">
                    {email.subject}
                  </h4>
                  <p className="text-xs text-textSecondary">
                    Day {email.day} of automated sequence
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Setup Instructions */}
      <Card className="bg-yellow-950/20 border-yellow-500/30">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-yellow-400">
            <AlertCircle className="h-5 w-5" />
            <span>Setup Required</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-semibold">To enable email sending, you need to:</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-textSecondary">
              <li>Sign up for a Resend account at <a href="https://resend.com" target="_blank" rel="noopener noreferrer" className="text-aqua hover:underline">https://resend.com</a></li>
              <li>Validate your email domain at <a href="https://resend.com/domains" target="_blank" rel="noopener noreferrer" className="text-aqua hover:underline">https://resend.com/domains</a></li>
              <li>Create an API key at <a href="https://resend.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-aqua hover:underline">https://resend.com/api-keys</a></li>
              <li>Add your <code className="bg-surface/50 px-2 py-1 rounded">RESEND_API_KEY</code> to Supabase environment variables</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}