import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, 
  Users, 
  FileText, 
  BarChart3, 
  Crown,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Star,
  Upload,
  Calendar,
  Award,
  Microscope,
  Brain,
  Activity,
  Zap,
  Shield,
  Target,
  Building
} from 'lucide-react';

export const HealthcareInnovatorsOnboardingSlides: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const slides = [
    {
      id: 1,
      title: "Welcome, Longevity Pioneer",
      icon: <Crown className="h-8 w-8 text-gold" />,
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <Badge className="bg-gold/10 text-gold border-gold/20 mb-4">
              Founding Innovator
            </Badge>
            <p className="text-lg text-muted-foreground mb-4">
              Transform health for families worldwide through cutting-edge longevity science
            </p>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 p-4 rounded-lg">
              <p className="text-sm font-medium">Personalized Welcome from Tony Gomes</p>
              <p className="text-xs text-muted-foreground mt-1">Co-Founder, Boutique Family Office™</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg text-center">
              <Microscope className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-semibold mb-1">Advanced Testing</h4>
              <p className="text-sm text-muted-foreground">Liquid biopsy, epigenetics</p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-950/20 p-4 rounded-lg text-center">
              <Brain className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h4 className="font-semibold mb-1">AI Imaging</h4>
              <p className="text-sm text-muted-foreground">Cancer screening, diagnostics</p>
            </div>
          </div>

          <div className="flex gap-2 justify-center">
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Upload Research
            </Button>
            <Button size="sm">
              <CheckCircle className="h-4 w-4 mr-2" />
              Activate Profile
            </Button>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Profile Setup",
      icon: <Building className="h-8 w-8 text-blue-600" />,
      content: (
        <div className="space-y-6">
          <p className="text-muted-foreground">
            Add clinic/brand details, upload logo, and showcase your longevity innovations
          </p>
          
          <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20 p-6 rounded-lg">
            <h4 className="font-semibold mb-4 flex items-center">
              <Heart className="h-5 w-5 mr-2" />
              Clinic & Brand Setup
            </h4>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded">
                <span className="text-sm">Clinic Details & Logo</span>
                <Badge variant="outline">Ready</Badge>
              </div>
              <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded">
                <span className="text-sm">Team Member Profiles</span>
                <Badge variant="outline">Ready</Badge>
              </div>
              <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded">
                <span className="text-sm">Featured Credentials</span>
                <Badge variant="outline">Ready</Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
              <Microscope className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <h4 className="font-semibold text-sm">Cancer Screening</h4>
            </div>
            <div className="bg-purple-50 dark:bg-purple-950/20 p-4 rounded-lg">
              <Activity className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <h4 className="font-semibold text-sm">Epigenetic Analysis</h4>
            </div>
            <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
              <Brain className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <h4 className="font-semibold text-sm">Advanced Imaging</h4>
            </div>
          </div>

          <div className="flex gap-2 justify-center">
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Upload Logo
            </Button>
            <Button size="sm">
              <Users className="h-4 w-4 mr-2" />
              Add Team
            </Button>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Service Integration",
      icon: <Zap className="h-8 w-8 text-purple-600" />,
      content: (
        <div className="space-y-6">
          <p className="text-muted-foreground">
            List your diagnostic services and schedule demo events or webinars
          </p>
          
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-purple-50 dark:bg-purple-950/20 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold">Diagnostic Services</h4>
                <Button size="sm" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Add Service
                </Button>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded">
                  <span className="text-sm">Liquid Biopsy</span>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded">
                  <span className="text-sm">Epigenetic Testing</span>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded">
                  <span className="text-sm">AI Cancer Screening</span>
                  <Badge variant="outline">Draft</Badge>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold">Events & Webinars</h4>
                <Button size="sm" variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Event
                </Button>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded">
                  <span className="text-sm">Longevity Science Demo</span>
                  <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded">
                  <span className="text-sm">Family Health AMA</span>
                  <Badge variant="outline">Planning</Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2 justify-center">
            <Button variant="outline" size="sm">
              <Microscope className="h-4 w-4 mr-2" />
              Add Diagnostics
            </Button>
            <Button size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Demo
            </Button>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "Family Connection & Referral System",
      icon: <Users className="h-8 w-8 text-green-600" />,
      content: (
        <div className="space-y-6">
          <p className="text-muted-foreground">
            One-click invitations for high-net-worth families and their advisors
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg text-center">
              <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-semibold mb-1">Family Invitations</h4>
              <p className="text-sm text-muted-foreground">Direct HNW access</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg text-center">
              <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-semibold mb-1">Advisor Network</h4>
              <p className="text-sm text-muted-foreground">Referral ecosystem</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-gold/10 to-yellow-50 dark:from-gold/5 dark:to-yellow-950/20 p-6 rounded-lg">
            <h4 className="font-semibold mb-4 flex items-center">
              <Award className="h-5 w-5 mr-2 text-gold" />
              Referral Dashboard
            </h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-gold">24</div>
                <div className="text-sm text-muted-foreground">Family Referrals</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">$12K</div>
                <div className="text-sm text-muted-foreground">Credits Earned</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">89%</div>
                <div className="text-sm text-muted-foreground">Conversion Rate</div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Analytics Overview</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Active Referrals</span>
                <Badge variant="outline">18</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Completed Consultations</span>
                <Badge className="bg-green-100 text-green-800">12</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Pending Follow-ups</span>
                <Badge className="bg-yellow-100 text-yellow-800">6</Badge>
              </div>
            </div>
          </div>

          <div className="flex gap-2 justify-center">
            <Button variant="outline" size="sm">
              <Users className="h-4 w-4 mr-2" />
              Invite Families
            </Button>
            <Button size="sm">
              <BarChart3 className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: "Marketplace Engagement",
      icon: <Star className="h-8 w-8 text-emerald-600" />,
      content: (
        <div className="space-y-6">
          <p className="text-muted-foreground">
            Participate in Q&A, AMAs, and publish thought leadership content
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-emerald-50 dark:bg-emerald-950/20 p-4 rounded-lg">
              <FileText className="h-6 w-6 text-emerald-600 mb-2" />
              <h4 className="font-semibold mb-1">Thought Leadership</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>• Research Publications</div>
                <div>• Health Guides</div>
                <div>• Family Wellness Tips</div>
              </div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-950/20 p-4 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600 mb-2" />
              <h4 className="font-semibold mb-1">Interactive Events</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>• Q&A Sessions</div>
                <div>• AMAs</div>
                <div>• Podcast Features</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-950/20 dark:to-blue-950/20 p-4 rounded-lg">
            <h4 className="font-semibold mb-3">VIP Marketplace Placement</h4>
            <div className="flex items-center justify-between text-sm">
              <span>Featured Position</span>
              <Badge className="bg-gold/10 text-gold border-gold/20">
                <Crown className="h-3 w-3 mr-1" />
                VIP Founder
              </Badge>
            </div>
            <Progress value={95} className="mt-2 h-2" />
            <p className="text-xs text-muted-foreground mt-1">Top 5% placement in Health Marketplace</p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Button variant="outline" size="sm" className="h-auto py-3 flex-col">
              <FileText className="h-4 w-4 mb-1" />
              <span className="text-xs">Publish Guide</span>
            </Button>
            <Button variant="outline" size="sm" className="h-auto py-3 flex-col">
              <Calendar className="h-4 w-4 mb-1" />
              <span className="text-xs">Host AMA</span>
            </Button>
            <Button variant="outline" size="sm" className="h-auto py-3 flex-col">
              <Zap className="h-4 w-4 mb-1" />
              <span className="text-xs">Start Podcast</span>
            </Button>
          </div>

          <div className="flex gap-2 justify-center">
            <Button variant="outline" size="sm">
              <Star className="h-4 w-4 mr-2" />
              View Placement
            </Button>
            <Button size="sm">
              <FileText className="h-4 w-4 mr-2" />
              Create Content
            </Button>
          </div>
        </div>
      )
    },
    {
      id: 6,
      title: "Reports & Analytics",
      icon: <BarChart3 className="h-8 w-8 text-blue-600" />,
      content: (
        <div className="space-y-6">
          <p className="text-muted-foreground">
            Track referrals, bookings, engagement, and family feedback
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
              <BarChart3 className="h-6 w-6 text-blue-600 mb-2" />
              <h4 className="font-semibold mb-1">Performance</h4>
              <div className="text-2xl font-bold text-blue-600">94%</div>
              <p className="text-sm text-muted-foreground">Family Satisfaction</p>
            </div>
            <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
              <Heart className="h-6 w-6 text-green-600 mb-2" />
              <h4 className="font-semibold mb-1">Impact</h4>
              <div className="text-2xl font-bold text-green-600">156</div>
              <p className="text-sm text-muted-foreground">Lives Enhanced</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950/20 p-4 rounded-lg">
            <h4 className="font-semibold mb-3">Engagement Analytics</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Consultation Bookings</span>
                <Badge variant="outline">42 this month</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Follow-up Appointments</span>
                <Badge variant="outline">28 scheduled</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Family Testimonials</span>
                <Badge className="bg-green-100 text-green-800">18 received</Badge>
              </div>
            </div>
          </div>

          <div className="bg-gold/10 border border-gold/20 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Shield className="h-5 w-5 text-gold mr-2" />
              <h4 className="font-semibold">Data Privacy & Security</h4>
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <div>• HIPAA-grade encryption active</div>
              <div>• Family opt-in protocols enforced</div>
              <div>• Complete audit trails maintained</div>
            </div>
          </div>

          <div className="flex gap-2 justify-center">
            <Button variant="outline" size="sm">
              <BarChart3 className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
            <Button size="sm">
              <FileText className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      )
    }
  ];

  const currentSlideData = slides[currentSlide];
  const progress = ((currentSlide + 1) / slides.length) * 100;

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
      if (!completedSteps.includes(currentSlide)) {
        setCompletedSteps([...completedSteps, currentSlide]);
      }
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Heart className="h-8 w-8 text-emerald-600" />
          <h1 className="text-3xl font-bold">Healthcare Innovators VIP Onboarding</h1>
        </div>
        <p className="text-muted-foreground">
          Welcome to your founding innovator journey in longevity and family health
        </p>
        <div className="mt-4">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">
            Step {currentSlide + 1} of {slides.length}
          </p>
        </div>
      </div>

      <Card className="min-h-[600px]">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              {currentSlideData.icon}
              <h2 className="text-2xl font-bold">{currentSlideData.title}</h2>
            </div>
          </div>
          
          {currentSlideData.content}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          onClick={prevSlide}
          disabled={currentSlide === 0}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        <div className="flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide 
                  ? 'bg-primary' 
                  : completedSteps.includes(index)
                    ? 'bg-green-500'
                    : 'bg-muted'
              }`}
            />
          ))}
        </div>

        <Button 
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
        >
          Next
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};