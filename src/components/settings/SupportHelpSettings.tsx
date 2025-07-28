import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  HelpCircle, 
  MessageSquare, 
  Phone,
  Mail,
  ExternalLink,
  Calendar,
  BookOpen,
  Video,
  FileText,
  ChevronDown,
  ChevronRight,
  Star,
  Clock,
  CheckCircle,
  Send,
  Loader2,
  Crown,
  HeadphonesIcon
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useSubscriptionAccess } from '@/hooks/useSubscriptionAccess';
import { useEventTracking } from '@/hooks/useEventTracking';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SupportTicket {
  id: string;
  subject: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  created_at: string;
  last_updated: string;
  category: string;
}

interface FAQItem {
  question: string;
  answer: string;
  category: string;
  helpful_count: number;
}

export const SupportHelpSettings: React.FC = () => {
  const { user } = useAuth();
  const { subscriptionPlan, checkFeatureAccess } = useSubscriptionAccess();
  const { trackFeatureUsed } = useEventTracking();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [showFAQ, setShowFAQ] = useState(true);
  
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: 'general',
    priority: 'medium',
    description: '',
    attachments: [] as File[]
  });

  const isPremium = checkFeatureAccess('premium_analytics_access');
  const hasPrioritySupport = isPremium || user?.user_metadata?.role === 'advisor';

  useEffect(() => {
    loadSupportData();
  }, []);

  const loadSupportData = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Mock support tickets data for demo
      setSupportTickets([
        {
          id: '1',
          subject: 'Billing Question',
          status: 'resolved',
          priority: 'medium',
          created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
          last_updated: new Date(Date.now() - 86400000).toISOString(),
          category: 'billing'
        }
      ]);
    } catch (error) {
      console.error('Error loading support data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitTicket = async () => {
    if (!user || !ticketForm.subject || !ticketForm.description) return;

    setIsSubmitting(true);
    try {
      const ticketData = {
        user_id: user.id,
        subject: ticketForm.subject,
        category: ticketForm.category,
        priority: ticketForm.priority,
        description: ticketForm.description,
        status: 'open',
        created_at: new Date().toISOString()
      };

      // Mock ticket creation - in real app would save to database
      const data = {
        ...ticketData,
        id: Date.now().toString(),
        status: 'open' as const,
        last_updated: new Date().toISOString()
      };

      trackFeatureUsed('support_ticket_created', {
        category: ticketForm.category,
        priority: ticketForm.priority,
        has_priority_support: hasPrioritySupport
      });

      setSupportTickets(prev => [data, ...prev]);
      setTicketForm({
        subject: '',
        category: 'general',
        priority: 'medium',
        description: '',
        attachments: []
      });
      setShowTicketForm(false);

      toast({
        title: "Support Ticket Created",
        description: hasPrioritySupport 
          ? "Your ticket has been submitted with priority support. Expect a response within 2 hours."
          : "Your ticket has been submitted. We'll respond within 24 hours.",
      });
    } catch (error) {
      console.error('Error creating support ticket:', error);
      toast({
        title: "Error",
        description: "Failed to create support ticket",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleScheduleCall = () => {
    trackFeatureUsed('support_call_scheduled', { 
      user_tier: subscriptionPlan?.tier,
      has_priority_support: hasPrioritySupport 
    });
    
    const calendarUrl = hasPrioritySupport 
      ? 'https://calendly.com/bfocfo-priority-support'
      : 'https://calendly.com/bfocfo-support';
    
    window.open(calendarUrl, '_blank');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const faqData: FAQItem[] = [
    {
      question: "How do I upgrade my subscription?",
      answer: "You can upgrade your subscription by going to Settings > Subscription and selecting your desired plan. Changes take effect immediately.",
      category: "billing",
      helpful_count: 24
    },
    {
      question: "How do I invite family members?",
      answer: "Navigate to Family > Invite Members and enter their email addresses. They'll receive an invitation link to join your family workspace.",
      category: "family",
      helpful_count: 18
    },
    {
      question: "What happens to my data if I cancel?",
      answer: "Your data remains accessible for 30 days after cancellation. You can export it during this period or reactivate your account.",
      category: "account",
      helpful_count: 15
    },
    {
      question: "How do I enable two-factor authentication?",
      answer: "Go to Settings > Security and toggle on '2FA'. You'll need an authenticator app like Google Authenticator or Authy.",
      category: "security",
      helpful_count: 31
    }
  ];

  const resourceLinks = [
    {
      title: "Getting Started Guide",
      description: "Complete walkthrough of all features",
      icon: BookOpen,
      url: "/help/getting-started",
      type: "guide"
    },
    {
      title: "Video Tutorials",
      description: "Step-by-step video instructions",
      icon: Video,
      url: "/help/videos",
      type: "video"
    },
    {
      title: "API Documentation",
      description: "For developers and integrations",
      icon: FileText,
      url: "/help/api",
      type: "documentation"
    },
    {
      title: "Webinar Schedule",
      description: "Live training sessions",
      icon: Calendar,
      url: "/help/webinars",
      type: "webinar"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Contact Support */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HeadphonesIcon className="h-5 w-5" />
            Contact Support
            {hasPrioritySupport && (
              <Badge className="bg-amber-100 text-amber-800">
                <Crown className="h-3 w-3 mr-1" />
                Priority
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Support Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col gap-2"
              onClick={() => setShowTicketForm(true)}
            >
              <MessageSquare className="h-5 w-5" />
              <div className="text-center">
                <div className="font-medium">Create Ticket</div>
                <div className="text-xs text-muted-foreground">
                  {hasPrioritySupport ? '2 hour response' : '24 hour response'}
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col gap-2"
              onClick={handleScheduleCall}
            >
              <Phone className="h-5 w-5" />
              <div className="text-center">
                <div className="font-medium">Schedule Call</div>
                <div className="text-xs text-muted-foreground">
                  {hasPrioritySupport ? 'Priority booking' : 'Standard booking'}
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col gap-2"
              onClick={() => window.open('mailto:support@bfocfo.com', '_blank')}
            >
              <Mail className="h-5 w-5" />
              <div className="text-center">
                <div className="font-medium">Email Us</div>
                <div className="text-xs text-muted-foreground">
                  support@bfocfo.com
                </div>
              </div>
            </Button>
          </div>

          {hasPrioritySupport && (
            <Alert>
              <Crown className="h-4 w-4" />
              <AlertDescription>
                As a {isPremium ? 'Premium' : 'Professional'} user, you have priority support with faster response times and dedicated assistance.
              </AlertDescription>
            </Alert>
          )}

          {/* Ticket Form */}
          {showTicketForm && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Create Support Ticket</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={ticketForm.subject}
                      onChange={(e) => setTicketForm(prev => ({ ...prev, subject: e.target.value }))}
                      placeholder="Brief description of your issue"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={ticketForm.category}
                      onChange={(e) => setTicketForm(prev => ({ ...prev, category: e.target.value }))}
                    >
                      <option value="general">General Question</option>
                      <option value="billing">Billing & Payments</option>
                      <option value="technical">Technical Issue</option>
                      <option value="feature">Feature Request</option>
                      <option value="bug">Bug Report</option>
                      <option value="account">Account Management</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <select
                    id="priority"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={ticketForm.priority}
                    onChange={(e) => setTicketForm(prev => ({ ...prev, priority: e.target.value }))}
                  >
                    <option value="low">Low - General inquiry</option>
                    <option value="medium">Medium - Standard issue</option>
                    <option value="high">High - Important issue</option>
                    {hasPrioritySupport && (
                      <option value="urgent">Urgent - Critical issue</option>
                    )}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={ticketForm.description}
                    onChange={(e) => setTicketForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Please provide as much detail as possible about your issue..."
                    rows={4}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowTicketForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmitTicket}
                    disabled={isSubmitting || !ticketForm.subject || !ticketForm.description}
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Send className="h-4 w-4 mr-2" />
                    )}
                    Submit Ticket
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Support Tickets History */}
      {supportTickets.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Support Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {supportTickets.map((ticket) => (
                <div key={ticket.id} className="p-3 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="font-medium">{ticket.subject}</div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge className={getStatusColor(ticket.status)}>
                          {ticket.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                        <Badge className={getPriorityColor(ticket.priority)}>
                          {ticket.priority.toUpperCase()}
                        </Badge>
                        <span>•</span>
                        <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Collapsible open={showFAQ} onOpenChange={setShowFAQ}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-0">
                  <span className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5" />
                    Frequently Asked Questions
                  </span>
                  {showFAQ ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
            </Collapsible>
          </CardTitle>
        </CardHeader>
        <Collapsible open={showFAQ} onOpenChange={setShowFAQ}>
          <CollapsibleContent>
            <CardContent>
              <div className="space-y-4">
                {faqData.map((faq, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="font-medium mb-2">{faq.question}</div>
                    <p className="text-sm text-muted-foreground mb-3">{faq.answer}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">
                        {faq.category}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Star className="h-3 w-3" />
                        {faq.helpful_count} found helpful
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Resources & Documentation */}
      <Card>
        <CardHeader>
          <CardTitle>Resources & Documentation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resourceLinks.map((resource, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-4 justify-start"
                onClick={() => {
                  trackFeatureUsed('help_resource_accessed', { resource: resource.title });
                  window.open(resource.url, '_blank');
                }}
              >
                <resource.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                <div className="text-left">
                  <div className="font-medium">{resource.title}</div>
                  <div className="text-xs text-muted-foreground">{resource.description}</div>
                </div>
                <ExternalLink className="h-4 w-4 ml-auto flex-shrink-0" />
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>support@bfocfo.com</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>1-800-BFO-CFOS (1-800-236-2367)</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>Support Hours: Monday-Friday, 8 AM - 8 PM EST</span>
            </div>
            {hasPrioritySupport && (
              <div className="flex items-center gap-3 text-amber-700">
                <Crown className="h-4 w-4" />
                <span>Priority Support: Available 24/7 for urgent issues</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};