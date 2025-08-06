import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Download, 
  Eye, 
  Users, 
  Shield, 
  TrendingUp, 
  Briefcase,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Phone,
  Calendar,
  FileText,
  Link,
  Smartphone
} from 'lucide-react';

interface SlideProps {
  title: string;
  subtitle?: string;
  content: React.ReactNode;
  stepNumber?: number;
  totalSteps?: number;
}

const SlideTemplate: React.FC<SlideProps> = ({ title, subtitle, content, stepNumber, totalSteps }) => (
  <div className="w-full h-[600px] bg-gradient-to-br from-background to-muted/30 border-2 border-primary/20 rounded-xl p-8 flex flex-col">
    {/* Header */}
    <div className="text-center mb-8">
      <div className="flex items-center justify-center gap-2 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
          <Briefcase className="h-6 w-6 text-white" />
        </div>
        <div className="text-2xl font-bold text-primary">Boutique Family Office</div>
      </div>
      {stepNumber && totalSteps && (
        <div className="mb-4">
          <Progress value={(stepNumber / totalSteps) * 100} className="h-2 max-w-md mx-auto" />
          <p className="text-sm text-muted-foreground mt-2">Step {stepNumber} of {totalSteps}</p>
        </div>
      )}
      <h1 className="text-4xl font-bold mb-2">{title}</h1>
      {subtitle && <p className="text-xl text-muted-foreground">{subtitle}</p>}
    </div>
    
    {/* Content */}
    <div className="flex-1 flex items-center justify-center">
      {content}
    </div>
    
    {/* Footer Navigation */}
    {stepNumber && (
      <div className="flex justify-between items-center mt-8">
        <Button variant="outline" size="lg" disabled={stepNumber === 1}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        <div className="flex gap-2">
          {Array.from({ length: totalSteps || 5 }, (_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full ${
                i + 1 <= stepNumber ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>
        <Button size="lg" disabled={stepNumber === totalSteps}>
          Continue
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    )}
  </div>
);

const WelcomeSlide = () => (
  <SlideTemplate
    title="Welcome to Your Family Office"
    subtitle="Comprehensive wealth management designed for your family's future"
    content={
      <div className="text-center space-y-8 max-w-4xl">
        <div className="grid grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">Privacy First</h3>
            <p className="text-sm text-muted-foreground">Bank-level security with complete data control</p>
          </div>
          <div className="space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">Family-Centered</h3>
            <p className="text-sm text-muted-foreground">Designed for multi-generational wealth</p>
          </div>
          <div className="space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">Smart Growth</h3>
            <p className="text-sm text-muted-foreground">AI-powered insights and opportunities</p>
          </div>
        </div>
        
        <div className="bg-primary/5 rounded-lg p-6 border border-primary/20">
          <h4 className="text-lg font-semibold mb-3">What's in it for you?</h4>
          <div className="grid grid-cols-2 gap-4 text-left">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Instant access to premium marketplace</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Educational resources & insights</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Connect with vetted professionals</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">No pressure, explore at your pace</span>
            </div>
          </div>
        </div>
      </div>
    }
  />
);

const SecureAccountSlide = () => (
  <SlideTemplate
    title="Create Your Secure Account"
    subtitle="Only basic information needed to get started"
    stepNumber={1}
    totalSteps={5}
    content={
      <div className="space-y-8 max-w-2xl">
        <div className="bg-primary/5 rounded-lg p-6 border border-primary/20">
          <h4 className="text-lg font-semibold mb-4">Quick & Simple Setup</h4>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold">1</span>
              </div>
              <span>Full Name</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold">2</span>
              </div>
              <span>Email Address</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold">3</span>
              </div>
              <span>Mobile Number</span>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <Badge variant="secondary" className="mb-2">Privacy Protected</Badge>
          <p className="text-sm text-muted-foreground">
            No sensitive data required until you choose to open an account or request formal advice
          </p>
        </div>
      </div>
    }
  />
);

const FamilyGoalsSlide = () => (
  <SlideTemplate
    title="Set Up Your Family & Goals"
    subtitle="Optional: Personalize your experience (can skip for now)"
    stepNumber={2}
    totalSteps={5}
    content={
      <div className="space-y-8 max-w-2xl">
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-muted/50 rounded-lg p-6">
            <h4 className="font-semibold mb-3">Family Members</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="text-sm">Invite spouse/partner</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="text-sm">Add children</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="text-sm">Include dependents</span>
              </div>
            </div>
          </div>
          
          <div className="bg-muted/50 rounded-lg p-6">
            <h4 className="font-semibold mb-3">Goals & Interests</h4>
            <div className="space-y-2">
              <Badge variant="outline" className="mr-2">Retirement Planning</Badge>
              <Badge variant="outline" className="mr-2">Education Funding</Badge>
              <Badge variant="outline" className="mr-2">Estate Planning</Badge>
              <Badge variant="outline" className="mr-2">Tax Optimization</Badge>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <Button variant="outline" size="lg" className="mr-4">
            Skip for Now
          </Button>
          <Button size="lg">
            Set Up Family Profile
          </Button>
        </div>
      </div>
    }
  />
);

const AccountLinkingSlide = () => (
  <SlideTemplate
    title="Add or Link Your Accounts"
    subtitle="Optional: Connect via Plaid, add manually, or skip"
    stepNumber={3}
    totalSteps={5}
    content={
      <div className="space-y-8 max-w-3xl">
        <div className="grid grid-cols-3 gap-6">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="text-center pb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Link className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-lg">Plaid Connect</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Securely link bank and investment accounts
              </p>
              <Button className="w-full">Connect Accounts</Button>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="text-center pb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-lg">Manual Entry</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Enter account details yourself
              </p>
              <Button variant="outline" className="w-full">Add Manually</Button>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="text-center pb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                <ArrowRight className="h-6 w-6 text-orange-600" />
              </div>
              <CardTitle className="text-lg">Skip for Now</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Explore the platform first
              </p>
              <Button variant="ghost" className="w-full">Continue</Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm text-amber-800 text-center">
            <strong>Your Choice:</strong> You can add accounts anytime to unlock personalized insights and recommendations
          </p>
        </div>
      </div>
    }
  />
);

const ExploreSlide = () => (
  <SlideTemplate
    title="Explore Your Dashboard"
    subtitle="Immediate access to marketplace, education, and resources"
    stepNumber={4}
    totalSteps={5}
    content={
      <div className="space-y-8 max-w-4xl">
        <div className="grid grid-cols-3 gap-6">
          <Card>
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>Dashboard</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground">
                Personalized insights and wealth overview
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto">
                <Users className="h-6 w-6 text-indigo-600" />
              </div>
              <CardTitle>Marketplace</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground">
                Connect with vetted professionals
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Education</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground">
                Learn with expert-curated content
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="bg-primary/5 rounded-lg p-6 border border-primary/20">
          <h4 className="text-lg font-semibold mb-3 text-center">🚀 Ready to Explore!</h4>
          <p className="text-center text-muted-foreground">
            You now have full access to all basic features. Upgrade anytime for exclusive opportunities.
          </p>
        </div>
      </div>
    }
  />
);

const UpgradeSlide = () => (
  <SlideTemplate
    title="Unlock Premium Features"
    subtitle="Book a welcome call or upgrade when you're ready"
    stepNumber={5}
    totalSteps={5}
    content={
      <div className="space-y-8 max-w-3xl">
        <div className="grid grid-cols-2 gap-8">
          <Card className="border-2 border-primary/20">
            <CardHeader className="text-center">
              <Badge className="mb-2">Current Access</Badge>
              <CardTitle>Basic Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">Marketplace access</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">Educational resources</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">Basic insights</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">Professional connections</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50">
            <CardHeader className="text-center">
              <Badge variant="secondary" className="mb-2 bg-amber-100 text-amber-800">Premium</Badge>
              <CardTitle>Exclusive Access</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-amber-600" />
                <span className="text-sm">Private market opportunities</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-amber-600" />
                <span className="text-sm">Advanced analytics</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-amber-600" />
                <span className="text-sm">Priority advisor matching</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-amber-600" />
                <span className="text-sm">White-glove service</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex gap-4 justify-center">
          <Button variant="outline" size="lg" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Book Welcome Call
          </Button>
          <Button size="lg" className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
            <Phone className="h-4 w-4" />
            Request Premium Access
          </Button>
        </div>
        
        <p className="text-center text-sm text-muted-foreground">
          No pressure - you can upgrade anytime or continue exploring with your current access
        </p>
      </div>
    }
  />
);

export const OnboardingSlideExport: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    { name: 'Welcome', component: <WelcomeSlide /> },
    { name: 'Secure Account', component: <SecureAccountSlide /> },
    { name: 'Family & Goals', component: <FamilyGoalsSlide /> },
    { name: 'Account Linking', component: <AccountLinkingSlide /> },
    { name: 'Explore Dashboard', component: <ExploreSlide /> },
    { name: 'Upgrade Options', component: <UpgradeSlide /> }
  ];

  const exportSlide = (format: 'figma' | 'canva') => {
    // In a real implementation, this would generate exportable formats
    const slideData = {
      format,
      slide: slides[currentSlide].name,
      accessibility: {
        largeFonts: true,
        highContrast: true,
        mobileOptimized: true
      },
      elements: {
        progressBar: true,
        navigation: true,
        branding: 'BFO Gold Tree Logo'
      }
    };
    
    console.log('Exporting slide:', slideData);
    alert(`Slide "${slides[currentSlide].name}" prepared for ${format.toUpperCase()} export`);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Onboarding Slide Export</CardTitle>
          <p className="text-sm text-muted-foreground">
            Export slides for Canva and Figma with accessibility features and mobile-friendly layouts
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            {slides.map((slide, index) => (
              <Button
                key={slide.name}
                variant={currentSlide === index ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentSlide(index)}
              >
                {slide.name}
              </Button>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Button onClick={() => exportSlide('figma')} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export for Figma
            </Button>
            <Button onClick={() => exportSlide('canva')} variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export for Canva
            </Button>
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Preview Mobile
            </Button>
          </div>
          
          <div className="flex gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Large fonts
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              High contrast
            </div>
            <div className="flex items-center gap-1">
              <Smartphone className="h-3 w-3" />
              Mobile-friendly
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Slide Preview */}
      <div className="border rounded-lg p-4 bg-muted/30">
        {slides[currentSlide].component}
      </div>
    </div>
  );
};