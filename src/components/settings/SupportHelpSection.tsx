import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  HelpCircle, 
  MessageSquare, 
  Phone, 
  Mail, 
  Book, 
  Video,
  FileText,
  Clock,
  CheckCircle,
  ExternalLink,
  Search,
  Link,
  Users,
  Shield,
  CreditCard
} from "lucide-react";

export function SupportHelpSection() {
  const supportChannels = [
    {
      name: 'Live Chat',
      icon: MessageSquare,
      description: 'Get instant help from our support team',
      availability: 'Mon-Fri, 9 AM - 6 PM EST',
      responseTime: 'Typically < 5 minutes',
      available: true
    },
    {
      name: 'Phone Support',
      icon: Phone,
      description: 'Speak directly with a support specialist',
      availability: 'Mon-Fri, 9 AM - 6 PM EST',
      responseTime: 'Immediate',
      available: true
    },
    {
      name: 'Email Support',
      icon: Mail,
      description: 'Send detailed questions via email',
      availability: '24/7',
      responseTime: 'Within 24 hours',
      available: true
    },
    {
      name: 'Video Call',
      icon: Video,
      description: 'Schedule a screen-sharing session',
      availability: 'By appointment',
      responseTime: 'Next business day',
      available: false
    }
  ];

  const recentTickets = [
    {
      id: 'TICK-2024-001',
      subject: 'Account sync issue with Chase bank',
      status: 'resolved',
      created: '2024-01-15',
      updated: '2024-01-16'
    },
    {
      id: 'TICK-2024-002',
      subject: 'Question about HSA contribution limits',
      status: 'in_progress',
      created: '2024-01-18',
      updated: '2024-01-19'
    },
    {
      id: 'TICK-2024-003',
      subject: 'Request for new integration',
      status: 'pending',
      created: '2024-01-20',
      updated: '2024-01-20'
    }
  ];

  const quickLinks = [
    {
      title: 'Getting Started Guide',
      description: 'Complete setup walkthrough for new users',
      icon: Book,
      category: 'Setup'
    },
    {
      title: 'Account Integration Help',
      description: 'Connect your bank and investment accounts',
      icon: Link,
      category: 'Integrations'
    },
    {
      title: 'Professional Team Setup',
      description: 'Add advisors and set permissions',
      icon: Users,
      category: 'Team Management'
    },
    {
      title: 'Security Best Practices',
      description: 'Keep your account and data secure',
      icon: Shield,
      category: 'Security'
    },
    {
      title: 'Billing & Subscriptions',
      description: 'Manage your plan and payments',
      icon: CreditCard,
      category: 'Billing'
    },
    {
      title: 'API Documentation',
      description: 'Developer resources and guides',
      icon: FileText,
      category: 'Developer'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Contact Support */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Contact Support
          </CardTitle>
          <CardDescription>
            Choose the best way to get help from our team
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {supportChannels.map((channel) => (
              <div 
                key={channel.name} 
                className={`p-4 border rounded-lg ${channel.available ? '' : 'opacity-50'}`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <channel.icon className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">{channel.name}</span>
                  <Badge variant={channel.available ? 'default' : 'secondary'}>
                    {channel.available ? 'Available' : 'Unavailable'}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground mb-3">
                  {channel.description}
                </p>
                
                <div className="space-y-1 text-xs text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {channel.availability}
                  </div>
                  <div>Response time: {channel.responseTime}</div>
                </div>
                
                <Button 
                  variant={channel.available ? "default" : "outline"} 
                  size="sm" 
                  className="w-full"
                  disabled={!channel.available}
                >
                  {channel.name === 'Live Chat' && 'Start Chat'}
                  {channel.name === 'Phone Support' && 'Call Now'}
                  {channel.name === 'Email Support' && 'Send Email'}
                  {channel.name === 'Video Call' && 'Schedule Call'}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Submit a Ticket */}
      <Card>
        <CardHeader>
          <CardTitle>Submit a Support Ticket</CardTitle>
          <CardDescription>
            Describe your issue in detail for personalized help
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="account">Account Issues</SelectItem>
                  <SelectItem value="billing">Billing & Payments</SelectItem>
                  <SelectItem value="integrations">Account Integrations</SelectItem>
                  <SelectItem value="security">Security Concerns</SelectItem>
                  <SelectItem value="feature">Feature Request</SelectItem>
                  <SelectItem value="bug">Bug Report</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" placeholder="Brief description of your issue" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              placeholder="Please provide as much detail as possible about your issue, including steps to reproduce if applicable."
              rows={5}
            />
          </div>
          
          <Button className="w-full">Submit Ticket</Button>
        </CardContent>
      </Card>

      {/* Your Support Tickets */}
      <Card>
        <CardHeader>
          <CardTitle>Your Support Tickets</CardTitle>
          <CardDescription>
            Track the status of your recent support requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentTickets.map((ticket) => (
              <div key={ticket.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{ticket.id}</span>
                    <Badge variant={
                      ticket.status === 'resolved' ? 'default' : 
                      ticket.status === 'in_progress' ? 'secondary' : 
                      'outline'
                    }>
                      {ticket.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {ticket.subject}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                    <span>Created: {ticket.created}</span>
                    <span>Updated: {ticket.updated}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm">View</Button>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <Button variant="outline" size="sm">View All Tickets</Button>
          </div>
        </CardContent>
      </Card>

      {/* Help Center */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Book className="h-5 w-5" />
                Help Center
              </CardTitle>
              <CardDescription>
                Find answers to common questions and learn how to use the platform
              </CardDescription>
            </div>
            <Button variant="outline">
              <ExternalLink className="h-4 w-4 mr-2" />
              Visit Help Center
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search help articles..."
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {quickLinks.map((link) => (
              <div key={link.title} className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                <div className="flex items-center gap-2 mb-1">
                  <link.icon className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-sm">{link.title}</span>
                  <Badge variant="outline" className="text-xs">{link.category}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {link.description}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Professional Team Contact */}
      <Card>
        <CardHeader>
          <CardTitle>Your Professional Team</CardTitle>
          <CardDescription>
            Direct contact information for your assigned professionals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Tony Gomes</span>
                  <Badge variant="outline">Financial Advisor</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Wealth Management Partners • tony@wealthpartners.com
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <MessageSquare className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Phone className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Sarah Chen</span>
                  <Badge variant="outline">CPA</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Chen & Associates • sarah@chenassociates.com
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <MessageSquare className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Phone className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}