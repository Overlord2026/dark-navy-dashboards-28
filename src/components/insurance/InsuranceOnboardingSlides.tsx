import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  Users, 
  FileText, 
  DollarSign, 
  BarChart3, 
  Crown,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Star,
  Upload,
  Calendar,
  Award
} from 'lucide-react';

export const InsuranceOnboardingSlides: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const slides = [
    {
      id: 1,
      title: "Welcome, Founding Insurance Partner",
      icon: <Crown className="h-8 w-8 text-gold" />,
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <Badge className="bg-gold/10 text-gold border-gold/20 mb-4">
              VIP Founding Partner
            </Badge>
            <p className="text-lg text-muted-foreground">
              Set up your public marketplace profile and display your specialties
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
              <Shield className="h-6 w-6 text-blue-600 mb-2" />
              <h4 className="font-semibold mb-1">Specialties</h4>
              <p className="text-sm text-muted-foreground">Annuities, LTC, Life Insurance</p>
            </div>
            <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
              <Award className="h-6 w-6 text-green-600 mb-2" />
              <h4 className="font-semibold mb-1">VIP Badge</h4>
              <p className="text-sm text-muted-foreground">Early adopter recognition</p>
            </div>
          </div>

          <div className="flex gap-2 justify-center">
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Upload Agency Logo
            </Button>
            <Button size="sm">
              <CheckCircle className="h-4 w-4 mr-2" />
              Complete Profile
            </Button>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Build Your Downline",
      icon: <Users className="h-8 w-8 text-blue-600" />,
      content: (
        <div className="space-y-6">
          <p className="text-muted-foreground">
            Bulk import your agent roster and automate onboarding invites
          </p>
          
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 p-6 rounded-lg">
            <h4 className="font-semibold mb-4 flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Agent Management Tools
            </h4>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded">
                <span className="text-sm">CSV Bulk Import</span>
                <Badge variant="outline">Ready</Badge>
              </div>
              <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded">
                <span className="text-sm">Automated Invites</span>
                <Badge variant="outline">Ready</Badge>
              </div>
              <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded">
                <span className="text-sm">Client Seat Allocation</span>
                <Badge variant="outline">Ready</Badge>
              </div>
            </div>
          </div>

          <div className="flex gap-2 justify-center">
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Import Agent List
            </Button>
            <Button size="sm">
              <Users className="h-4 w-4 mr-2" />
              Send Invites
            </Button>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Compliance & CE Management",
      icon: <FileText className="h-8 w-8 text-green-600" />,
      content: (
        <div className="space-y-6">
          <p className="text-muted-foreground">
            License renewal alerts by state and automated CE tracking for your entire team
          </p>
          
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">License Tracking</h4>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">Multi-state renewal alerts</p>
              <Progress value={85} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">Next renewal: CA (45 days)</p>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">CE Credits</h4>
                <Badge className="bg-blue-100 text-blue-800">On Track</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">Continuing education tracker</p>
              <Progress value={65} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">12/20 hours completed</p>
            </div>
          </div>

          <div className="flex gap-2 justify-center">
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Set Reminders
            </Button>
            <Button size="sm">
              <FileText className="h-4 w-4 mr-2" />
              Upload Docs
            </Button>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "Client & Case Management",
      icon: <Shield className="h-8 w-8 text-purple-600" />,
      content: (
        <div className="space-y-6">
          <p className="text-muted-foreground">
            Secure client file uploads, application workflows, and integrated communication
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-purple-50 dark:bg-purple-950/20 p-4 rounded-lg text-center">
              <FileText className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h4 className="font-semibold mb-1">Document Vault</h4>
              <p className="text-sm text-muted-foreground">Secure file storage</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg text-center">
              <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-semibold mb-1">Appointments</h4>
              <p className="text-sm text-muted-foreground">Integrated calendar</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950/20 p-4 rounded-lg">
            <h4 className="font-semibold mb-3">Application Workflow</h4>
            <div className="flex items-center justify-between text-sm">
              <span>Lead</span>
              <ArrowRight className="h-4 w-4" />
              <span>Application</span>
              <ArrowRight className="h-4 w-4" />
              <span>Underwriting</span>
              <ArrowRight className="h-4 w-4" />
              <span>Issued</span>
            </div>
          </div>

          <div className="flex gap-2 justify-center">
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              View Cases
            </Button>
            <Button size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Meeting
            </Button>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: "Referral Marketplace & Credits",
      icon: <DollarSign className="h-8 w-8 text-gold" />,
      content: (
        <div className="space-y-6">
          <p className="text-muted-foreground">
            Invite clients, agents, or sub-agencies and earn credits for every successful referral
          </p>
          
          <div className="bg-gradient-to-r from-gold/10 to-yellow-50 dark:from-gold/5 dark:to-yellow-950/20 p-6 rounded-lg">
            <h4 className="font-semibold mb-4 flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-gold" />
              Referral Rewards
            </h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-gold">$50</div>
                <div className="text-sm text-muted-foreground">Per Agent Referral</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gold">$25</div>
                <div className="text-sm text-muted-foreground">Per Client Referral</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gold">$100</div>
                <div className="text-sm text-muted-foreground">Per Sub-Agency</div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold">VIP Insurance Wall</h4>
              <Star className="h-5 w-5 text-gold" />
            </div>
            <p className="text-sm text-muted-foreground">Featured placement for top performers</p>
          </div>

          <div className="flex gap-2 justify-center">
            <Button variant="outline" size="sm">
              <Users className="h-4 w-4 mr-2" />
              Send Invites
            </Button>
            <Button size="sm">
              <DollarSign className="h-4 w-4 mr-2" />
              View Rewards
            </Button>
          </div>
        </div>
      )
    },
    {
      id: 6,
      title: "Advanced Tools & Analytics",
      icon: <BarChart3 className="h-8 w-8 text-emerald-600" />,
      content: (
        <div className="space-y-6">
          <p className="text-muted-foreground">
            View commissions, performance analytics, and track your pipeline with SWAG Score™
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-emerald-50 dark:bg-emerald-950/20 p-4 rounded-lg">
              <BarChart3 className="h-6 w-6 text-emerald-600 mb-2" />
              <h4 className="font-semibold mb-1">Performance</h4>
              <div className="text-2xl font-bold text-emerald-600">95%</div>
              <p className="text-sm text-muted-foreground">SWAG Score™</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600 mb-2" />
              <h4 className="font-semibold mb-1">Commissions</h4>
              <div className="text-2xl font-bold text-blue-600">$24.5K</div>
              <p className="text-sm text-muted-foreground">This month</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-gray-50 to-emerald-50 dark:from-gray-900 dark:to-emerald-950/20 p-4 rounded-lg">
            <h4 className="font-semibold mb-3">Pipeline Tracker</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Active Leads</span>
                <Badge variant="outline">23</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>In Underwriting</span>
                <Badge variant="outline">8</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Closed This Month</span>
                <Badge className="bg-green-100 text-green-800">12</Badge>
              </div>
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
    },
    {
      id: 7,
      title: "Getting Started",
      icon: <CheckCircle className="h-8 w-8 text-green-600" />,
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">You're All Set!</h3>
            <p className="text-muted-foreground">
              Your VIP Insurance marketplace profile is ready to launch
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            <Button className="w-full" size="lg">
              <Shield className="h-5 w-5 mr-2" />
              Publish My Agency
            </Button>
            <Button variant="outline" className="w-full" size="lg">
              <Users className="h-5 w-5 mr-2" />
              Invite Agents/Clients
            </Button>
            <Button variant="outline" className="w-full" size="lg">
              <Upload className="h-5 w-5 mr-2" />
              Upload Compliance Docs
            </Button>
          </div>

          <div className="bg-gold/10 border border-gold/20 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Crown className="h-5 w-5 text-gold mr-2" />
              <h4 className="font-semibold">VIP Founding Partner Benefits</h4>
            </div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Priority marketplace placement</li>
              <li>• Exclusive founding member badge</li>
              <li>• Enhanced referral rewards</li>
              <li>• Early access to new features</li>
            </ul>
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
          <Shield className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold">Insurance VIP Onboarding</h1>
        </div>
        <p className="text-muted-foreground">
          Welcome to your founding partner journey in the Insurance Marketplace
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