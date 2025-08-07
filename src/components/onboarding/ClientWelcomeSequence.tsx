import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  TrendingUp, 
  Vault, 
  Building2, 
  Heart, 
  GraduationCap, 
  Users, 
  FileText, 
  Calculator, 
  Crown,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Star,
  Calendar,
  DollarSign,
  Home,
  Briefcase,
  CreditCard,
  UserPlus,
  Globe,
  PiggyBank
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';

interface FeatureCard {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  premium: boolean;
  path: string;
  tagline?: string;
}

const features: FeatureCard[] = [
  {
    id: 'net-worth',
    title: 'Net Worth & Accounts',
    description: 'Connect bank, investment, and retirement accounts securely via Plaid, or add manually.',
    icon: TrendingUp,
    premium: false,
    path: '/accounts',
    tagline: 'Track balances, see trends, and manage everything from one dashboard.'
  },
  {
    id: 'properties',
    title: 'Property & Asset Management', 
    description: 'Add your homes, rentals, vacation properties, collectibles, and vehicles.',
    icon: Home,
    premium: false,
    path: '/properties',
    tagline: 'Link to LLCs or trusts for asset protection.'
  },
  {
    id: 'bill-pay',
    title: 'Bill Pay & Budgets',
    description: 'Organize bills, set budgets, and never miss a due date.',
    icon: CreditCard,
    premium: false,
    path: '/bill-pay',
    tagline: 'Basic and premium bill payment options with auto-pay and reminders.'
  },
  {
    id: 'vault',
    title: 'Secure Family Vault',
    description: 'Bank-level encrypted storage for all vital documents.',
    icon: Vault,
    premium: false,
    path: '/vault',
    tagline: 'Legacy messaging, video uploads, and customizable "Leave a Legacy" options.'
  },
  {
    id: 'retirement',
    title: 'Retirement Roadmap & Planning',
    description: 'Personalized projections, retirement goal tracking, and scenario analysis.',
    icon: Calendar,
    premium: false,
    path: '/retirement',
    tagline: 'Run "what if" models, including Social Security and Roth conversions.'
  },
  {
    id: 'tax-planning',
    title: 'Advanced Tax Planning',
    description: 'Multi-year tax forecasts, Roth conversion analyzers, and charitable giving tools.',
    icon: Calculator,
    premium: true,
    path: '/tax-planning',
    tagline: 'Get proactive with strategies used by the ultra-wealthy.'
  },
  {
    id: 'estate-planning',
    title: 'Estate & Legacy Planning',
    description: 'Guided will/trust setup, family legacy boxes, and entity management.',
    icon: FileText,
    premium: false,
    path: '/estate-planning',
    tagline: 'Centralize documents for easy collaboration with advisors and heirs.'
  },
  {
    id: 'business-entities',
    title: 'Business & Entity Management',
    description: 'Track LLCs, trusts, partnerships, and business filings—auto-reminders and compliance checks.',
    icon: Building2,
    premium: true,
    path: '/business-entities',
    tagline: 'Visual "family business tree" to see relationships and asset flows.'
  },
  {
    id: 'insurance',
    title: 'Insurance & Risk Solutions',
    description: 'Easily organize your insurance policies and review for savings or gaps.',
    icon: Shield,
    premium: false,
    path: '/insurance',
    tagline: 'Access experts for quotes, reviews, and claims help—no cold sales calls.'
  },
  {
    id: 'healthcare',
    title: 'Healthcare & Wellness',
    description: 'Track medical records, appointments, and proactive health plans.',
    icon: Heart,
    premium: false,
    path: '/healthcare',
    tagline: 'Access a growing marketplace of vetted wellness and longevity experts.'
  },
  {
    id: 'education',
    title: 'Education & Learning Center',
    description: 'Binge guides, videos, and on-demand courses on everything from saving to succession.',
    icon: GraduationCap,
    premium: false,
    path: '/education',
    tagline: 'Premium content includes "what the top 1% know."'
  },
  {
    id: 'marketplace',
    title: 'Marketplace & Professional Network',
    description: 'Find trusted fiduciary advisors, attorneys, accountants, insurance pros, health consultants, and more.',
    icon: Globe,
    premium: false,
    path: '/marketplace',
    tagline: 'Get matched instantly, or browse the VIP marketplace wall for inspiration.'
  },
  {
    id: 'family-collaboration',
    title: 'Family Collaboration',
    description: 'Invite family members, set permissions, and build your multi-generational plan together.',
    icon: Users,
    premium: false,
    path: '/family',
    tagline: 'Share milestones, goals, and vault access as you choose.'
  }
];

export const ClientWelcomeSequence = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const navigate = useNavigate();

  const totalSteps = 5;
  const progressPercentage = (currentStep / totalSteps) * 100;

  const handleFeatureSelect = (featureId: string) => {
    setSelectedFeatures(prev => 
      prev.includes(featureId) 
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    );
  };

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBeginSetup = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    setCurrentStep(2);
  };

  const handleCreateAccount = () => {
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 }
    });
    // Navigate to account creation or dashboard
    navigate('/client-dashboard');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-8"
          >
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-primary via-primary-glow to-accent p-12 rounded-3xl text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
              <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <Sparkles className="h-12 w-12 text-white" />
                  <h1 className="text-4xl md:text-6xl font-bold">Welcome to Your Family Office Portal</h1>
                </div>
                <p className="text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed">
                  Your secure, private launchpad for everything wealth, health, and family legacy—built for you.
                </p>
                <p className="text-xl text-white/80 max-w-3xl mx-auto">
                  No matter where you are on your journey, you now have access to the same world-class tools as the ultra-wealthy.
                </p>
                <Button 
                  size="lg" 
                  onClick={handleBeginSetup}
                  className="bg-white text-primary hover:bg-white/90 text-xl px-12 py-6 mt-8"
                >
                  Begin Setting Up My Family Office
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
            {/* Why Families Love Section */}
            <div className="text-center space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                Why Families Love Our Platform
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="text-center space-y-4">
                    <TrendingUp className="h-12 w-12 mx-auto text-primary" />
                    <h3 className="text-xl font-semibold">All Your Wealth in One Place</h3>
                    <p className="text-muted-foreground">
                      See every account, property, and investment at a glance—total control, total clarity.
                    </p>
                  </div>
                </Card>
                
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="text-center space-y-4">
                    <Vault className="h-12 w-12 mx-auto text-primary" />
                    <h3 className="text-xl font-semibold">Your Secure Digital Vault</h3>
                    <p className="text-muted-foreground">
                      Safeguard wills, trusts, insurance, tax docs—share with loved ones and advisors as you choose.
                    </p>
                  </div>
                </Card>
                
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="text-center space-y-4">
                    <Calendar className="h-12 w-12 mx-auto text-primary" />
                    <h3 className="text-xl font-semibold">Retirement Roadmap & Goal Setting</h3>
                    <p className="text-muted-foreground">
                      Plan your future, run "what if" scenarios, and stay on track for life's biggest moments.
                    </p>
                  </div>
                </Card>
                
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="text-center space-y-4">
                    <GraduationCap className="h-12 w-12 mx-auto text-primary" />
                    <h3 className="text-xl font-semibold">Education & Empowerment</h3>
                    <p className="text-muted-foreground">
                      Access the best guides, videos, and advice to level up your financial knowledge.
                    </p>
                  </div>
                </Card>
                
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="text-center space-y-4">
                    <Globe className="h-12 w-12 mx-auto text-primary" />
                    <h3 className="text-xl font-semibold">Professional Network & Marketplace</h3>
                    <p className="text-muted-foreground">
                      Instantly connect with trusted advisors, accountants, attorneys, health pros—no cold calls, just connections.
                    </p>
                  </div>
                </Card>
                
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="text-center space-y-4">
                    <Crown className="h-12 w-12 mx-auto text-primary" />
                    <h3 className="text-xl font-semibold">Aspirational Tools for All</h3>
                    <p className="text-muted-foreground">
                      Whether you're building wealth or managing a family enterprise, these tools scale with your needs.
                    </p>
                  </div>
                </Card>
              </div>
            </div>
            
            <div className="text-center">
              <Button size="lg" onClick={handleNextStep} className="text-lg px-8 py-4">
                Explore the Platform Features
                <ArrowRight className="ml-3 h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold text-foreground">Choose Your Features</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Each card is clickable for a deeper view, demo, or quick-start. Select the features you're most interested in.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature) => {
                const Icon = feature.icon;
                const isSelected = selectedFeatures.includes(feature.id);
                
                return (
                  <motion.div
                    key={feature.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card 
                      className={`cursor-pointer transition-all duration-200 h-full ${
                        isSelected 
                          ? 'ring-2 ring-primary border-primary bg-primary/5' 
                          : 'hover:shadow-lg border-border'
                      } ${feature.premium ? 'border-accent/50' : ''}`}
                      onClick={() => handleFeatureSelect(feature.id)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${feature.premium ? 'bg-accent/10' : 'bg-primary/10'}`}>
                              <Icon className={`h-6 w-6 ${feature.premium ? 'text-accent' : 'text-primary'}`} />
                            </div>
                            <div>
                              <CardTitle className="text-lg flex items-center gap-2">
                                {feature.title}
                                {feature.premium && (
                                  <Badge variant="secondary" className="bg-accent/20 text-accent border-accent/30">
                                    Premium
                                  </Badge>
                                )}
                              </CardTitle>
                            </div>
                          </div>
                          {isSelected && <CheckCircle className="h-5 w-5 text-primary" />}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <CardDescription className="text-sm">
                          {feature.description}
                        </CardDescription>
                        {feature.tagline && (
                          <p className="text-xs text-muted-foreground italic">
                            {feature.tagline}
                          </p>
                        )}
                        <Button 
                          variant={isSelected ? "default" : "ghost"} 
                          size="sm" 
                          className="w-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(feature.path);
                          }}
                        >
                          {isSelected ? 'View Selected' : 'Explore'}
                          <ArrowRight className="ml-2 h-3 w-3" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            <div className="text-center">
              <Button size="lg" onClick={handleNextStep} className="text-lg px-8 py-4">
                Continue with Selected Features ({selectedFeatures.length})
                <ArrowRight className="ml-3 h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Premium Aspirational Teaser */}
            <div className="bg-gradient-to-r from-accent via-accent-glow to-primary p-12 rounded-3xl text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
              <div className="relative z-10 text-center space-y-6">
                <Crown className="h-16 w-16 mx-auto text-white" />
                <h2 className="text-4xl font-bold">Unlock Premium for the Full Experience</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                  <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
                    <h3 className="text-xl font-semibold mb-4">Premium Features Include:</h3>
                    <ul className="space-y-2 text-left">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-white" />
                        <span>Retirement Analyzer & Advanced Planning</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-white" />
                        <span>AI Filing & Compliance Helper</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-white" />
                        <span>Unlimited business/entity management</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-white" />
                        <span>Concierge support and AI Copilot</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-white" />
                        <span>Exclusive guides, videos, and professional tools</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
                    <h3 className="text-xl font-semibold mb-4">What the Ultra-Wealthy Use:</h3>
                    <ul className="space-y-2 text-left">
                      <li className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-white" />
                        <span>Multi-generational tax strategies</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-white" />
                        <span>Advanced entity structuring</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-white" />
                        <span>Philanthropic planning tools</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-white" />
                        <span>Succession planning frameworks</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-white" />
                        <span>Risk management strategies</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="flex gap-4 justify-center">
                  <Button 
                    size="lg" 
                    className="bg-white text-accent hover:bg-white/90 text-lg px-8 py-4"
                  >
                    See Premium Features & Pricing
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="border-white text-white hover:bg-white/10 text-lg px-8 py-4"
                    onClick={handleNextStep}
                  >
                    Continue with Basic
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Easy Start Profile */}
            <div className="max-w-2xl mx-auto">
              <Card className="p-8">
                <CardHeader className="text-center">
                  <CardTitle className="text-3xl font-bold">Get Started in Seconds</CardTitle>
                  <CardDescription className="text-lg">
                    Just your name and email (SMS optional for updates). Build your profile at your own pace—add details only when ready.
                  </CardDescription>
                  <p className="text-sm text-muted-foreground">
                    No sensitive info required until you choose to engage with a professional or subscribe.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">First Name *</label>
                      <input
                        type="text"
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Enter your first name"
                        value={profileData.firstName}
                        onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Last Name *</label>
                      <input
                        type="text"
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Enter your last name"
                        value={profileData.lastName}
                        onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email Address *</label>
                    <input
                      type="email"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Enter your email address"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone Number (Optional)</label>
                    <input
                      type="tel"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Enter your phone number"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    />
                    <p className="text-xs text-muted-foreground">For SMS updates and important notifications only</p>
                  </div>
                  
                  <div className="flex gap-4">
                    <Button 
                      size="lg" 
                      className="flex-1 text-lg py-4"
                      onClick={handleCreateAccount}
                      disabled={!profileData.firstName || !profileData.lastName || !profileData.email}
                    >
                      Create My Free Account
                      <UserPlus className="ml-3 h-5 w-5" />
                    </Button>
                  </div>
                  
                  <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-4">
                      <Button variant="outline" size="sm">
                        <Users className="h-4 w-4 mr-2" />
                        Invite My Family
                      </Button>
                      <span className="text-sm text-muted-foreground">for viral growth</span>
                    </div>
                    
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Shield className="h-4 w-4 text-primary" />
                      <span>You own your data. Privacy and control always.</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Progress Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Family Office Setup Progress
            </h3>
            <span className="text-sm text-muted-foreground">
              Step {currentStep} of {totalSteps}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {renderStep()}
      </div>
    </div>
  );
};