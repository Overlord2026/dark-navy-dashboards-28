import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LendingConciergeModal } from './LendingConciergeModal';
import { LendingEnhancedFeatures } from './LendingEnhancedFeatures';
import { 
  DollarSign, 
  TrendingUp, 
  Clock, 
  Bell, 
  Search, 
  Filter,
  Upload,
  BookOpen,
  Phone,
  Shield,
  CheckCircle,
  ArrowRight,
  Home,
  Building,
  CreditCard,
  Briefcase,
  Landmark
} from 'lucide-react';
import confetti from 'canvas-confetti';
import bannerImage from '@/assets/lending-dashboard-banner.png';

interface WelcomeMessage {
  title: string;
  subtitle: string;
  userType: 'client' | 'advisor' | 'admin';
}

const WELCOME_MESSAGES: Record<string, WelcomeMessage> = {
  client: {
    title: "Welcome to your Lending Marketplace",
    subtitle: "Explore private offers, compare your best options, or talk to our Lending Concierge for white-glove service.",
    userType: 'client'
  },
  advisor: {
    title: "Lending Dashboard",
    subtitle: "Manage client applications, monitor partner lender performance, and deliver premium lending experiences—all from one dashboard.",
    userType: 'advisor'
  },
  admin: {
    title: "Lending Operations Center",
    subtitle: "Oversee lending workflow, track approval rates, manage partners, and review compliance in real time.",
    userType: 'admin'
  }
};

interface LendingStats {
  creditAvailable: number;
  latestOffers: number;
  inProcess: number;
  rateAlerts: number;
}

interface LenderPartner {
  id: string;
  name: string;
  logo: string;
  rating: number;
  bestRate: number;
  offerHighlight: string;
  category: string;
}

interface LoanApplication {
  id: string;
  type: string;
  amount: number;
  status: 'submitted' | 'in_review' | 'offer_received' | 'docs_pending' | 'approved' | 'funded';
  submittedDate: string;
  currentStep: number;
  totalSteps: number;
}

export function LendingDashboard() {
  // For demo purposes, we'll use 'client' as default. In a real app, this would come from user context
  const [currentUserType] = useState<'client' | 'advisor' | 'admin'>('client');
  const welcomeMessage = WELCOME_MESSAGES[currentUserType];
  
  // Enhanced state for functional requirements
  const [activeComparison, setActiveComparison] = useState<string[]>([]);
  const [uploadedDocs, setUploadedDocs] = useState<File[]>([]);
  const [applicationStep, setApplicationStep] = useState(1);
  const [isPreQualifying, setIsPreQualifying] = useState(false);
  const [showConciergeModal, setShowConciergeModal] = useState(false);
  const [stats] = useState<LendingStats>({
    creditAvailable: 2500000,
    latestOffers: 8,
    inProcess: 2,
    rateAlerts: 3
  });

  const [partners] = useState<LenderPartner[]>([
    {
      id: '1',
      name: 'Private Capital Partners',
      logo: '/placeholder-bank-logo.png',
      rating: 4.9,
      bestRate: 5.25,
      offerHighlight: 'No origination fees',
      category: 'private'
    },
    {
      id: '2',
      name: 'First Republic Bank',
      logo: '/placeholder-bank-logo.png',
      rating: 4.8,
      bestRate: 6.75,
      offerHighlight: 'Same-day pre-approval',
      category: 'traditional'
    },
    {
      id: '3',
      name: 'BFO Preferred Lender',
      logo: '/placeholder-bank-logo.png',
      rating: 5.0,
      bestRate: 4.95,
      offerHighlight: 'Exclusive family office rates',
      category: 'preferred'
    },
    {
      id: '4',
      name: 'Bridge Capital',
      logo: '/placeholder-bank-logo.png',
      rating: 4.7,
      bestRate: 7.25,
      offerHighlight: 'Fast bridge financing',
      category: 'bridge'
    }
  ]);

  const [applications] = useState<LoanApplication[]>([
    {
      id: '1',
      type: 'HELOC',
      amount: 1500000,
      status: 'docs_pending',
      submittedDate: '2024-01-15',
      currentStep: 3,
      totalSteps: 5
    },
    {
      id: '2',
      type: 'Business Credit Line',
      amount: 5000000,
      status: 'in_review',
      submittedDate: '2024-01-10',
      currentStep: 2,
      totalSteps: 5
    }
  ]);

  const [selectedTab, setSelectedTab] = useState('mortgages');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // Functional handlers
  const handlePreQualification = async () => {
    setIsPreQualifying(true);
    // Simulate Plaid integration
    setTimeout(() => {
      setIsPreQualifying(false);
      alert('Pre-qualification complete! Your estimated rate: 5.25% APR');
    }, 2000);
  };

  const handleDocumentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const validFiles = Array.from(files).filter(file => validTypes.includes(file.type));
      setUploadedDocs([...uploadedDocs, ...validFiles]);
      if (validFiles.length > 0) {
        setApplicationStep(prev => Math.min(prev + 1, 5));
      }
    }
  };

  const handleCompareToggle = (partnerId: string) => {
    setActiveComparison(prev => 
      prev.includes(partnerId) 
        ? prev.filter(id => id !== partnerId)
        : [...prev, partnerId].slice(0, 3) // Max 3 comparisons
    );
  };

  const handleApprovalCelebration = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#D4AF37', '#1e3a8a', '#10b981']
    });
  };

  const handleConciergeCall = () => {
    alert('Connecting you to our Lending Concierge...');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
      case 'funded':
        return 'bg-emerald-500';
      case 'offer_received':
        return 'bg-primary';
      case 'in_review':
        return 'bg-amber-500';
      default:
        return 'bg-muted';
    }
  };

  const getStatusSteps = () => {
    return ['Submitted', 'In Review', 'Offer', 'Documents', 'Funded'];
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Premium Banner Header */}
      <div 
        className="relative bg-gradient-to-r from-navy-900 to-navy-800 text-white py-16 overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(30, 58, 138, 0.9), rgba(30, 58, 138, 0.8)), url(${bannerImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <h1 className="text-5xl font-serif font-bold text-white mb-4">
              Your Boutique Lending Marketplace—Premium Credit for Every Family Need
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Compare exclusive offers, get pre-qualified instantly, and access white-glove support from top lending specialists—all inside your Family Office dashboard.
            </p>
            
            {/* Benefits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-8">
              <div className="flex items-center text-white/90 text-sm">
                <CheckCircle className="w-4 h-4 mr-2 text-primary" />
                Access vetted private and institutional lenders
              </div>
              <div className="flex items-center text-white/90 text-sm">
                <CheckCircle className="w-4 h-4 mr-2 text-primary" />
                No-impact credit pre-qualification via Plaid
              </div>
              <div className="flex items-center text-white/90 text-sm">
                <CheckCircle className="w-4 h-4 mr-2 text-primary" />
                Compare mortgages, HELOCs, business & bridge loans
              </div>
              <div className="flex items-center text-white/90 text-sm">
                <CheckCircle className="w-4 h-4 mr-2 text-primary" />
                Transparent terms—no hidden fees or sales pitches
              </div>
              <div className="flex items-center text-white/90 text-sm">
                <CheckCircle className="w-4 h-4 mr-2 text-primary" />
                Secure, encrypted data—your privacy guaranteed
              </div>
              <div className="flex items-center text-white/90 text-sm">
                <CheckCircle className="w-4 h-4 mr-2 text-primary" />
                Dedicated Lending Concierge for expert guidance
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground min-h-[48px] px-8 shadow-lg"
                onClick={handlePreQualification}
              >
                Get My Rate
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 min-h-[48px] px-8"
                onClick={() => setShowConciergeModal(true)}
              >
                <Phone className="w-5 h-5 mr-2" />
                Schedule a Call
              </Button>
              <Button 
                size="lg" 
                variant="ghost"
                className="text-white hover:bg-white/10 min-h-[48px] px-8"
              >
                See Lender Reviews
              </Button>
            </div>
          </div>
          
          {/* Floating confetti particles */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-10 left-10 w-2 h-2 bg-primary rounded-full opacity-30 animate-bounce"></div>
            <div className="absolute top-20 right-20 w-3 h-3 bg-primary rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute bottom-10 left-1/4 w-2 h-2 bg-primary rounded-full opacity-25 animate-bounce" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-20 right-1/3 w-3 h-3 bg-primary rounded-full opacity-15 animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>
        </div>
      </div>
        
        {/* Enhanced Features */}
        <LendingEnhancedFeatures />

        {/* Sticky Concierge Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button 
          size="lg" 
          className="bg-primary hover:bg-primary/90 text-primary-foreground min-h-[56px] px-6 shadow-lg rounded-full"
          onClick={() => setShowConciergeModal(true)}
        >
          <Phone className="w-5 h-5 mr-2" />
          Talk to a Lending Concierge
        </Button>
      </div>

      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-primary/20 hover:border-primary/40 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Credit Available</CardTitle>
              <DollarSign className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">${stats.creditAvailable.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Based on linked accounts</p>
            </CardContent>
          </Card>

          <Card className="border-primary/20 hover:border-primary/40 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Latest Offers</CardTitle>
              <TrendingUp className="h-5 w-5 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.latestOffers}</div>
              <p className="text-xs text-muted-foreground mt-1">New this week</p>
            </CardContent>
          </Card>

          <Card className="border-primary/20 hover:border-primary/40 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">In Process</CardTitle>
              <Clock className="h-5 w-5 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inProcess}</div>
              <p className="text-xs text-muted-foreground mt-1">Applications pending</p>
            </CardContent>
          </Card>

          <Card className="border-primary/20 hover:border-primary/40 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Rate Alerts</CardTitle>
              <Bell className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.rateAlerts}</div>
              <p className="text-xs text-muted-foreground mt-1">Opportunities available</p>
            </CardContent>
          </Card>
        </div>

        {/* Pre-Qualification Widget */}
        <Card className="bg-gradient-to-r from-primary/5 to-emerald-500/5 border-primary/20">
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-serif font-bold">Check Your Pre-Qualified Rate</h3>
              <p className="text-muted-foreground">Soft credit check won't impact your score</p>
              <div className="flex justify-center">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 min-h-[44px] px-8"
                  onClick={handlePreQualification}
                  disabled={isPreQualifying}
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  {isPreQualifying ? 'Processing...' : 'Get Pre-Qualified'}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">Powered by Plaid • Secure • Instant</p>
            </div>
          </CardContent>
        </Card>

        {/* Lending Marketplace */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="text-xl font-serif">Lending Marketplace</span>
              <Badge variant="secondary">8 Partners Available</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {partners.map((partner) => (
                <Card key={partner.id} className="border-muted hover:border-primary/40 transition-colors">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                        <Building className="w-6 h-6 text-muted-foreground" />
                      </div>
                      {partner.category === 'preferred' && (
                        <Badge variant="default" className="bg-primary">Preferred</Badge>
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold">{partner.name}</h4>
                      <p className="text-sm text-muted-foreground">Rating: {partner.rating}/5.0</p>
                    </div>
                    <div className="space-y-2">
                      <div className="text-lg font-bold text-primary">{partner.bestRate}% APR</div>
                      <p className="text-sm text-muted-foreground">{partner.offerHighlight}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button className="flex-1 min-h-[44px]">Apply Now</Button>
                      <Button variant="outline" className="min-h-[44px]">Quote</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Loan Explorer */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-serif">Loan Explorer</CardTitle>
            <div className="flex space-x-4 mt-4">
              <div className="flex-1">
                <Input
                  placeholder="Search loans..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="min-h-[44px]"
                />
              </div>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-48 min-h-[44px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="traditional">Traditional</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="preferred">Preferred</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="mortgages" className="flex items-center">
                  <Home className="w-4 h-4 mr-2" />
                  Mortgages
                </TabsTrigger>
                <TabsTrigger value="heloc">HELOC</TabsTrigger>
                <TabsTrigger value="bridge">Bridge</TabsTrigger>
                <TabsTrigger value="business" className="flex items-center">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Business
                </TabsTrigger>
                <TabsTrigger value="private" className="flex items-center">
                  <Landmark className="w-4 h-4 mr-2" />
                  Private Credit
                </TabsTrigger>
              </TabsList>

              <TabsContent value="mortgages" className="mt-6">
                <div className="space-y-4">
                  {partners.filter(p => p.category !== 'bridge').map((partner) => (
                    <Card key={partner.id} className="border-muted">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                              <Building className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <div>
                              <h4 className="font-semibold">{partner.name}</h4>
                              <p className="text-sm text-muted-foreground">30-year fixed from {partner.bestRate}%</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <div className="text-lg font-bold text-primary">{partner.bestRate}%</div>
                              <div className="text-sm text-muted-foreground">APR</div>
                            </div>
                            <Button className="min-h-[44px]">
                              Apply
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Similar content for other tabs */}
              <TabsContent value="heloc" className="mt-6">
                <div className="text-center py-8">
                  <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">HELOC Products</h3>
                  <p className="text-muted-foreground">Home equity lines of credit from our partner network</p>
                </div>
              </TabsContent>

              <TabsContent value="bridge" className="mt-6">
                <div className="text-center py-8">
                  <Building className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Bridge Financing</h3>
                  <p className="text-muted-foreground">Short-term financing solutions</p>
                </div>
              </TabsContent>

              <TabsContent value="business" className="mt-6">
                <div className="text-center py-8">
                  <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Business Lending</h3>
                  <p className="text-muted-foreground">Commercial loans and credit lines</p>
                </div>
              </TabsContent>

              <TabsContent value="private" className="mt-6">
                <div className="text-center py-8">
                  <Landmark className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Private Credit</h3>
                  <p className="text-muted-foreground">Exclusive family office lending solutions</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Application Status Tracker */}
        {applications.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-serif">Application Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {applications.map((app) => (
                <div key={app.id} className="border rounded-lg p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{app.type}</h4>
                      <p className="text-sm text-muted-foreground">
                        ${app.amount.toLocaleString()} • Submitted {new Date(app.submittedDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={app.status === 'approved' ? 'default' : 'secondary'}>
                      {app.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{app.currentStep} of {app.totalSteps} steps</span>
                    </div>
                    <Progress value={(app.currentStep / app.totalSteps) * 100} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex space-x-4">
                      {getStatusSteps().map((step, index) => (
                        <div key={step} className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${
                            index < app.currentStep ? getStatusColor(app.status) : 'bg-muted'
                          }`} />
                          <span className={`text-xs ${
                            index < app.currentStep ? 'text-foreground' : 'text-muted-foreground'
                          }`}>
                            {step}
                          </span>
                        </div>
                      ))}
                    </div>
                    {app.status === 'docs_pending' && (
                      <Button variant="outline" className="min-h-[44px]">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Documents
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Education & Resources */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-serif">Lending Education</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-muted hover:border-primary/40 transition-colors cursor-pointer">
                <CardContent className="p-6 text-center space-y-4">
                  <BookOpen className="w-8 h-8 text-primary mx-auto" />
                  <h4 className="font-semibold">How to Qualify</h4>
                  <p className="text-sm text-muted-foreground">Understanding lending requirements</p>
                </CardContent>
              </Card>

              <Card className="border-muted hover:border-primary/40 transition-colors cursor-pointer">
                <CardContent className="p-6 text-center space-y-4">
                  <TrendingUp className="w-8 h-8 text-emerald-500 mx-auto" />
                  <h4 className="font-semibold">Rate Strategies</h4>
                  <p className="text-sm text-muted-foreground">Timing your loan applications</p>
                </CardContent>
              </Card>

              <Card className="border-muted hover:border-primary/40 transition-colors cursor-pointer">
                <CardContent className="p-6 text-center space-y-4">
                  <Shield className="w-8 h-8 text-amber-500 mx-auto" />
                  <h4 className="font-semibold">Lending FAQs</h4>
                  <p className="text-sm text-muted-foreground">Common questions answered</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-primary/5 to-emerald-500/5 border-primary/20 cursor-pointer">
                <CardContent className="p-6 text-center space-y-4">
                  <Phone className="w-8 h-8 text-primary mx-auto" />
                  <h4 className="font-semibold text-primary">Talk to Concierge</h4>
                  <p className="text-sm text-muted-foreground">Personalized lending guidance</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Compliance & Disclosure */}
        <Card className="bg-muted/20 border-muted">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <Shield className="w-6 h-6 text-muted-foreground mt-1" />
              <div className="space-y-2">
                <h4 className="font-semibold">Important Disclosure Information</h4>
                <p className="text-sm text-muted-foreground">
                  All lending products are subject to credit approval and may require collateral. 
                  Interest rates shown are estimates and may vary based on creditworthiness and market conditions. 
                  Additional fees and terms may apply.
                </p>
                <Button variant="link" className="p-0 h-auto text-primary">
                  View Full Lending Disclosure →
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gold Tree Watermark */}
      <div className="fixed bottom-4 right-4 opacity-5 pointer-events-none">
        <div className="text-8xl">🌳</div>
      </div>

      {/* Sticky Lending Concierge Button - Desktop */}
      <div className="fixed bottom-6 right-6 z-50 hidden md:block">
        <Button 
          size="lg" 
          className="bg-gradient-to-r from-primary to-primary-glow text-white hover:scale-105 transform transition-all duration-200 shadow-xl hover:shadow-2xl min-h-[56px] px-6 rounded-full"
          onClick={() => setShowConciergeModal(true)}
        >
          <Phone className="w-5 h-5 mr-2" />
          Talk to Lending Concierge
        </Button>
      </div>

      {/* Mobile Sticky CTA */}
      <div className="fixed bottom-4 left-4 right-4 md:hidden z-50">
        <Button 
          size="lg" 
          className="w-full bg-gradient-to-r from-primary to-primary-glow text-white min-h-[44px] shadow-lg"
          onClick={() => setShowConciergeModal(true)}
        >
          <Phone className="w-5 h-5 mr-2" />
          Talk to Lending Concierge
        </Button>
      </div>

      {/* Lending Concierge Modal */}
      <LendingConciergeModal
        isOpen={showConciergeModal}
        onClose={() => setShowConciergeModal(false)}
        clientTier={currentUserType === 'admin' ? 'premium' : 'basic'}
      />
    </div>
  );
}