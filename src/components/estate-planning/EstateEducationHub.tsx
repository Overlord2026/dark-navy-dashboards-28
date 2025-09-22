import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  BookOpen, 
  Play, 
  Download, 
  ExternalLink, 
  CheckCircle, 
  Clock, 
  Users,
  Shield,
  FileText,
  Calculator,
  HelpCircle,
  Calendar,
  Phone,
  Mail,
  Heart
} from 'lucide-react';
import { SurvivingSpouseModule } from '@/components/shared/SurvivingSpouseModule';
import { toast } from 'sonner';

interface ReadinessChecklistItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

export function EstateEducationHub() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSurvivingSpouseModule, setShowSurvivingSpouseModule] = useState(false);
  const [readinessItems, setReadinessItems] = useState<ReadinessChecklistItem[]>([
    {
      id: '1',
      title: 'Identify all assets and liabilities',
      description: 'Create a comprehensive list of all your assets, accounts, and debts',
      completed: false,
      priority: 'high'
    },
    {
      id: '2',
      title: 'Choose beneficiaries for each asset',
      description: 'Decide who should inherit each of your assets',
      completed: false,
      priority: 'high'
    },
    {
      id: '3',
      title: 'Select an executor',
      description: 'Choose someone trustworthy to carry out your wishes',
      completed: false,
      priority: 'high'
    },
    {
      id: '4',
      title: 'Organize important documents',
      description: 'Gather birth certificates, marriage certificates, property deeds, etc.',
      completed: false,
      priority: 'medium'
    },
    {
      id: '5',
      title: 'Consider tax implications',
      description: 'Understand potential estate tax consequences',
      completed: false,
      priority: 'medium'
    },
    {
      id: '6',
      title: 'Plan for incapacity',
      description: 'Create healthcare directives and power of attorney documents',
      completed: false,
      priority: 'high'
    }
  ]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate email submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Thank you! We\'ll send you our comprehensive estate planning guide.');
      setEmail('');
    } catch (error) {
      toast.error('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConsultationRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate consultation booking
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Consultation request received! We\'ll contact you within 24 hours.');
      setPhone('');
      setEmail('');
    } catch (error) {
      toast.error('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleReadinessItem = (id: string) => {
    setReadinessItems(items =>
      items.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const completedItems = readinessItems.filter(item => item.completed).length;
  const readinessScore = Math.round((completedItems / readinessItems.length) * 100);

  return (
    <div className="space-y-8">
      {/* Hero Section with Lead Capture */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10">
        <CardContent className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-3xl font-bold mb-4">
                Secure Your Family's Future
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                Comprehensive estate planning education and professional guidance to protect what matters most.
              </p>
              <div className="space-y-4">
                <form onSubmit={handleEmailSubmit} className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1"
                  />
                  <Button type="submit" disabled={isSubmitting}>
                    <Download className="h-4 w-4 mr-2" />
                    Get Free Guide
                  </Button>
                </form>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="lg" className="w-full lg:w-auto">
                      <Calendar className="h-4 w-4 mr-2" />
                      Book Free Consultation
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Book Your Free Consultation</DialogTitle>
                      <DialogDescription>
                        Schedule a complimentary 30-minute consultation with our estate planning experts.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleConsultationRequest} className="space-y-4">
                      <div>
                        <Label htmlFor="consultation-email">Email</Label>
                        <Input
                          id="consultation-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="consultation-phone">Phone</Label>
                        <Input
                          id="consultation-phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                        />
                      </div>
                      <Button type="submit" disabled={isSubmitting} className="w-full">
                        <Phone className="h-4 w-4 mr-2" />
                        Request Consultation
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="bg-white/80 rounded-lg p-6 shadow-lg">
                <h3 className="font-semibold mb-4">What You'll Learn:</h3>
                <ul className="space-y-2">
                  {[
                    'Essential estate planning documents',
                    'Tax-efficient wealth transfer strategies',
                    'How to protect your family\'s financial future',
                    'Common estate planning mistakes to avoid'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estate Planning Readiness Scorecard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Estate Planning Readiness Scorecard
          </CardTitle>
          <CardDescription>
            Assess your preparedness and identify key action items
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Readiness Score</span>
              <span className="text-2xl font-bold text-primary">{readinessScore}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-3">
              <div 
                className="bg-primary h-3 rounded-full transition-all duration-300"
                style={{ width: `${readinessScore}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {completedItems} of {readinessItems.length} items completed
            </p>
          </div>

          <div className="space-y-3">
            {readinessItems.map((item) => (
              <div 
                key={item.id}
                className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer"
                onClick={() => toggleReadinessItem(item.id)}
              >
                <div className={`mt-0.5 ${item.completed ? 'text-green-600' : 'text-muted-foreground'}`}>
                  <CheckCircle className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className={`text-sm font-medium ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                      {item.title}
                    </h4>
                    <Badge 
                      variant={item.priority === 'high' ? 'destructive' : item.priority === 'medium' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {item.priority}
                    </Badge>
                  </div>
                  <p className={`text-xs ${item.completed ? 'line-through text-muted-foreground' : 'text-muted-foreground'}`}>
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Educational Content Tabs */}
      <Tabs defaultValue="guides" className="w-full">
        <TabsList className="w-full grid grid-cols-5">
          <TabsTrigger value="guides">Guides</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
          <TabsTrigger value="surviving-spouse">Surviving Spouse</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
        </TabsList>

        <TabsContent value="guides" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: 'Estate Planning 101',
                description: 'Complete beginner\'s guide to estate planning basics',
                readTime: '10 min read',
                icon: BookOpen
              },
              {
                title: 'Wills vs. Trusts',
                description: 'Understanding the differences and when to use each',
                readTime: '8 min read',
                icon: FileText
              },
              {
                title: 'Tax-Efficient Strategies',
                description: 'Minimize estate taxes and maximize inheritance',
                readTime: '12 min read',
                icon: Calculator
              },
              {
                title: 'Digital Asset Protection',
                description: 'Securing your online accounts and digital property',
                readTime: '6 min read',
                icon: Shield
              },
              {
                title: 'Family Business Succession',
                description: 'Transitioning business ownership to the next generation',
                readTime: '15 min read',
                icon: Users
              },
              {
                title: 'Healthcare Directives',
                description: 'Planning for medical decisions and end-of-life care',
                readTime: '9 min read',
                icon: HelpCircle
              }
            ].map((guide, i) => (
              <Card key={i} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <guide.icon className="h-5 w-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-medium text-sm mb-1">{guide.title}</h3>
                      <p className="text-xs text-muted-foreground mb-2">{guide.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{guide.readTime}</span>
                        <ExternalLink className="h-3 w-3 text-primary" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="videos" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: 'Estate Planning Fundamentals',
                duration: '12:34',
                thumbnail: '/placeholder-video.jpg'
              },
              {
                title: 'Creating Your First Will',
                duration: '8:45',
                thumbnail: '/placeholder-video.jpg'
              },
              {
                title: 'Understanding Trusts',
                duration: '15:22',
                thumbnail: '/placeholder-video.jpg'
              },
              {
                title: 'Power of Attorney Explained',
                duration: '9:11',
                thumbnail: '/placeholder-video.jpg'
              }
            ].map((video, i) => (
              <Card key={i} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-12 bg-muted rounded flex items-center justify-center">
                      <Play className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-sm mb-1">{video.title}</h3>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{video.duration}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="faqs" className="space-y-4">
          <div className="space-y-3">
            {[
              {
                question: 'Do I need a will if I have a trust?',
                answer: 'Yes, even with a trust, you typically need a "pour-over" will to handle any assets not transferred to the trust and to name guardians for minor children.'
              },
              {
                question: 'How often should I update my estate plan?',
                answer: 'Review your estate plan every 3-5 years or after major life events like marriage, divorce, births, deaths, or significant changes in assets.'
              },
              {
                question: 'What happens if I die without a will?',
                answer: 'Your assets will be distributed according to your state\'s intestacy laws, which may not align with your wishes and could result in higher costs and delays.'
              },
              {
                question: 'Are estate taxes something I need to worry about?',
                answer: 'For 2025, federal estate tax only applies to estates over $14.06 million. However, some states have lower thresholds, so consult with a professional.'
              }
            ].map((faq, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <h3 className="font-medium text-sm mb-2">{faq.question}</h3>
                  <p className="text-xs text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="surviving-spouse">
          <SurvivingSpouseModule />
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>What We Provide</CardTitle>
              <CardDescription>
                Comprehensive estate planning services tailored to your needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    category: 'Essential Documents',
                    services: [
                      'Last Will & Testament',
                      'Revocable Living Trust',
                      'Power of Attorney',
                      'Healthcare Directives',
                      'HIPAA Authorization'
                    ]
                  },
                  {
                    category: 'Advanced Planning',
                    services: [
                      'Irrevocable Trust Strategies',
                      'Estate Tax Minimization',
                      'Business Succession Planning',
                      'Charitable Giving Strategies',
                      'Generation-Skipping Trusts'
                    ]
                  },
                  {
                    category: 'Ongoing Support',
                    services: [
                      'Annual Plan Reviews',
                      'Document Updates',
                      'Asset Funding Assistance',
                      'Estate Administration',
                      'Family Education Sessions'
                    ]
                  },
                  {
                    category: 'Specialized Services',
                    services: [
                      'Special Needs Planning',
                      'International Estate Planning',
                      'Digital Asset Management',
                      'Pet Trust Creation',
                      'Family Governance'
                    ]
                  }
                ].map((category, i) => (
                  <div key={i}>
                    <h3 className="font-semibold mb-3">{category.category}</h3>
                    <ul className="space-y-2">
                      {category.services.map((service, j) => (
                        <li key={j} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">{service}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Final CTA */}
      <Card className="text-center">
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold mb-4">Ready to Protect Your Legacy?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Don't leave your family's future to chance. Start your estate planning journey today with our expert guidance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Consultation
            </Button>
            <Button variant="outline" size="lg">
              <Mail className="h-4 w-4 mr-2" />
              Contact Us
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}