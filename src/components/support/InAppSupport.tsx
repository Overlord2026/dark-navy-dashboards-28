import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  HelpCircle, 
  MessageSquare, 
  Phone, 
  Video, 
  Search,
  BookOpen,
  PlayCircle,
  FileText,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Zap,
  Star,
  Send,
  Lightbulb,
  Settings,
  Shield
} from 'lucide-react';
import { toast } from 'sonner';

interface SupportTicket {
  id: string;
  subject: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  created_at: string;
  last_update: string;
  category: string;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful_count: number;
}

export function InAppSupport() {
  const [activeTab, setActiveTab] = useState('help');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [showLiveChatModal, setShowLiveChatModal] = useState(false);

  const supportTickets: SupportTicket[] = [
    {
      id: '1',
      subject: 'Lead source integration not syncing',
      status: 'in_progress',
      priority: 'high',
      created_at: '2024-01-15T10:30:00Z',
      last_update: '2024-01-15T14:20:00Z',
      category: 'Technical'
    },
    {
      id: '2',
      subject: 'How to customize pipeline stages?',
      status: 'resolved',
      priority: 'medium',
      created_at: '2024-01-14T09:15:00Z',
      last_update: '2024-01-14T16:45:00Z',
      category: 'Training'
    }
  ];

  const faqItems: FAQItem[] = [
    {
      id: '1',
      question: 'How do I sync my lead sources?',
      answer: 'Go to Lead Sources > Configure Sources. Click on the source you want to sync and follow the setup wizard. Make sure your API credentials are correctly entered.',
      category: 'Lead Management',
      helpful_count: 23
    },
    {
      id: '2',
      question: 'Can I customize my pipeline stages?',
      answer: 'Yes! Click on "Customize Stages" in your pipeline view. You can rename stages, add custom stages, and reorder them. Note that some system stages cannot be modified.',
      category: 'Pipeline',
      helpful_count: 18
    },
    {
      id: '3',
      question: 'How does the AI Tax Scan work?',
      answer: 'Upload tax documents in PDF format. Our AI analyzes them for opportunities, compliance issues, and planning strategies. Results are available within minutes.',
      category: 'AI Features',
      helpful_count: 31
    },
    {
      id: '4',
      question: 'What\'s included in Premium vs Basic?',
      answer: 'Premium includes advanced lead scoring, campaign automation, AI features, priority support, and advanced analytics. Basic includes core CRM and pipeline management.',
      category: 'Billing',
      helpful_count: 45
    }
  ];

  const trainingResources = [
    {
      title: 'Getting Started with Lead Management',
      type: 'video',
      duration: '8 min',
      category: 'Onboarding'
    },
    {
      title: 'Advanced Pipeline Customization',
      type: 'guide',
      duration: '15 min',
      category: 'Advanced'
    },
    {
      title: 'AI Features Overview',
      type: 'video',
      duration: '12 min',
      category: 'AI Features'
    },
    {
      title: 'Mobile App Best Practices',
      type: 'guide',
      duration: '6 min',
      category: 'Mobile'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'closed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredFAQs = faqItems.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(faqItems.map(faq => faq.category))];

  const handleSubmitTicket = () => {
    toast.success('Support ticket submitted successfully');
    setShowNewTicketModal(false);
  };

  const handleStartLiveChat = () => {
    toast.success('Connecting to support agent...');
    setShowLiveChatModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Help & Support</h2>
          <p className="text-muted-foreground">
            Get help with your practice management tools
          </p>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={showLiveChatModal} onOpenChange={setShowLiveChatModal}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Live Chat
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Live Chat Support</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Connect with our support team for immediate assistance
                </p>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium">Support agents online</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Average response time: 2 minutes
                  </p>
                </div>
                <Button onClick={handleStartLiveChat} className="w-full">
                  Start Chat Session
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={showNewTicketModal} onOpenChange={setShowNewTicketModal}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <HelpCircle className="h-4 w-4" />
                Submit Ticket
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Submit Support Ticket</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Category</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technical">Technical Issue</SelectItem>
                        <SelectItem value="billing">Billing Question</SelectItem>
                        <SelectItem value="training">Training Request</SelectItem>
                        <SelectItem value="feature">Feature Request</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Priority</label>
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
                <div>
                  <label className="text-sm font-medium">Subject</label>
                  <Input placeholder="Brief description of your issue" />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea 
                    placeholder="Please provide detailed information about your issue or question"
                    rows={4}
                  />
                </div>
                <Button onClick={handleSubmitTicket} className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Submit Ticket
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="help">Help Center</TabsTrigger>
          <TabsTrigger value="tickets">My Tickets</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>

        <TabsContent value="help" className="space-y-6">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search help articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Zap className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Quick Setup</h3>
                    <p className="text-sm text-muted-foreground">Get started in 5 minutes</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Settings className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Configuration</h3>
                    <p className="text-sm text-muted-foreground">Customize your setup</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Shield className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Security</h3>
                    <p className="text-sm text-muted-foreground">Best practices guide</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Frequently Asked Questions</h3>
            {filteredFAQs.map(faq => (
              <Card key={faq.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <h4 className="font-semibold">{faq.question}</h4>
                      <Badge variant="outline">{faq.category}</Badge>
                    </div>
                    <p className="text-muted-foreground">{faq.answer}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="gap-1">
                          <Star className="h-3 w-3" />
                          Helpful ({faq.helpful_count})
                        </Button>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Lightbulb className="h-3 w-3 mr-1" />
                        More details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tickets" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">My Support Tickets</h3>
            <Button onClick={() => setShowNewTicketModal(true)} className="gap-2">
              <HelpCircle className="h-4 w-4" />
              New Ticket
            </Button>
          </div>

          <div className="space-y-4">
            {supportTickets.map(ticket => (
              <Card key={ticket.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold">{ticket.subject}</h4>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(ticket.status)}>
                          {ticket.status.replace('_', ' ')}
                        </Badge>
                        <Badge className={getPriorityColor(ticket.priority)}>
                          {ticket.priority}
                        </Badge>
                        <Badge variant="outline">{ticket.category}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Created: {new Date(ticket.created_at).toLocaleDateString()}
                        </span>
                        <span>
                          Updated: {new Date(ticket.last_update).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Button variant="outline">View Details</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="training" className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Training Resources</h3>
            <div className="grid gap-4">
              {trainingResources.map((resource, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          {resource.type === 'video' ? (
                            <PlayCircle className="h-6 w-6 text-primary" />
                          ) : (
                            <FileText className="h-6 w-6 text-primary" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold">{resource.title}</h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Badge variant="outline">{resource.category}</Badge>
                            <span>{resource.duration}</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline">
                        {resource.type === 'video' ? 'Watch' : 'Read'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Live Chat Support
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Get instant help from our support team
                </p>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Available 24/7</span>
                </div>
                <Button onClick={() => setShowLiveChatModal(true)} className="w-full">
                  Start Live Chat
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Phone Support
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Speak directly with our support team
                </p>
                <div className="space-y-2 text-sm">
                  <p><strong>US/Canada:</strong> +1 (800) 555-0123</p>
                  <p><strong>International:</strong> +1 (555) 123-4567</p>
                </div>
                <Button variant="outline" className="w-full">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Now
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  Screen Share Support
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Let us help you directly on your screen
                </p>
                <p className="text-sm text-muted-foreground">
                  Perfect for setup assistance and troubleshooting
                </p>
                <Button variant="outline" className="w-full">
                  <Video className="h-4 w-4 mr-2" />
                  Schedule Session
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Community Forum
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Connect with other users and experts
                </p>
                <p className="text-sm text-muted-foreground">
                  Share tips, ask questions, and learn from the community
                </p>
                <Button variant="outline" className="w-full">
                  <Users className="h-4 w-4 mr-2" />
                  Visit Forum
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}