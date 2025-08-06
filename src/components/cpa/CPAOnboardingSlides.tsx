import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Crown, Calculator, FileText, Users, TrendingUp, Shield, ArrowRight, Download, CheckCircle } from 'lucide-react';

interface SlideData {
  id: number;
  title: string;
  content: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const CPAOnboardingSlides: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [completedSlides, setCompletedSlides] = useState<Set<number>>(new Set());

  const slides: SlideData[] = [
    {
      id: 1,
      title: "Welcome, VIP Founding Accountant",
      content: (
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Calculator className="h-12 w-12 text-blue-600" />
            <Badge variant="outline" className="text-lg px-4 py-2 border-gold text-gold">
              Founding CPA Member
            </Badge>
          </div>
          <h2 className="text-3xl font-bold mb-4">Welcome, [CPA Name]!</h2>
          <p className="text-xl text-muted-foreground mb-6">
            Claim your public profile and badge. You're among the first to shape the CPA community here.
          </p>
          <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg border border-blue-200">
            <h3 className="font-semibold mb-3">Your VIP Founding Benefits:</h3>
            <div className="space-y-2 text-left">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Branded CPA Dashboard with tax planning tools</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>CPE tracking with automated deadline alerts</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>VIP directory listing for HNW families</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Referral credits and rewards system</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Your Accounting Practice Suite",
      content: (
        <div className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Client Management</h3>
              <p className="text-sm text-muted-foreground">
                Manage clients, automate tax reminders, run compliance checks
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Document Vault</h3>
              <p className="text-sm text-muted-foreground">
                Upload, store, and securely share tax docs and workpapers
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calculator className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">CPE Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Track CPE credits with automated deadline alerts
              </p>
            </div>
          </div>
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Tax Practice Features:</h4>
            <ul className="space-y-1 text-sm">
              <li>• Automated tax deadline reminders and calendars</li>
              <li>• Secure client document sharing and e-signatures</li>
              <li>• CPE tracking with state-specific requirements</li>
              <li>• Workflow automation for tax preparation</li>
              <li>• Compliance reporting and audit trails</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Collaborate & Refer",
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold mb-4">Build Your Professional Network</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="font-medium">Client Invitations</h4>
                  <p className="text-sm text-muted-foreground">
                    Invite clients and business partners directly from your dashboard
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="font-medium">Professional Network</h4>
                  <p className="text-sm text-muted-foreground">
                    Connect with attorneys, advisors, and other CPAs
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Crown className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="font-medium">VIP Directory</h4>
                  <p className="text-sm text-muted-foreground">
                    Join our cross-disciplinary VIP directory
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gold/10 rounded-lg">
                <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                  <FileText className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="font-medium">Referral System</h4>
                  <p className="text-sm text-muted-foreground">
                    Streamlined referrals with automatic credit tracking
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "Grow Your Impact",
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <TrendingUp className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Expand Your Practice</h3>
            <p className="text-muted-foreground">
              Leverage our platform to grow your client base and expertise
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold mb-2">VIP CPA Wall</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Appear on the "VIP CPA Wall" for families and firms seeking expertise
              </p>
              <Badge variant="outline" className="text-blue-600 border-blue-600">
                Founding Member Spotlight
              </Badge>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold mb-2">Educational Leadership</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Host or join webinars and CPE workshops
              </p>
              <Badge variant="outline" className="text-green-600 border-green-600">
                Thought Leadership
              </Badge>
            </div>
          </div>

          <div className="bg-gold/10 p-4 rounded-lg border border-gold/20">
            <h4 className="font-semibold mb-2">Credit Earning Opportunities</h4>
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div>
                <div className="font-bold text-lg text-blue-600">75</div>
                <div className="text-muted-foreground">Credits per client</div>
              </div>
              <div>
                <div className="font-bold text-lg text-green-600">35</div>
                <div className="text-muted-foreground">Credits per CPA referral</div>
              </div>
              <div>
                <div className="font-bold text-lg text-gold">2x</div>
                <div className="text-muted-foreground">Founder multiplier</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: "Rewards & Recognition",
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <Crown className="h-16 w-16 text-gold mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Founding Member Benefits</h3>
            <p className="text-muted-foreground">
              Get recognized and rewarded for building the community
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-gold/10 to-gold/20 p-4 rounded-lg border border-gold/20">
              <div className="text-center">
                <Crown className="h-8 w-8 text-gold mx-auto mb-2" />
                <div className="font-semibold">Founding Recognition</div>
                <div className="text-sm text-muted-foreground">
                  Get Founders recognition for inviting new pros and clients
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
              <div className="text-center">
                <Calculator className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="font-semibold">Premium Tools</div>
                <div className="text-sm text-muted-foreground">
                  Unlock premium accounting and tax tools with credits
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
              <div className="text-center">
                <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="font-semibold">CPA Leaderboard</div>
                <div className="text-sm text-muted-foreground">
                  Compete for spots on the CPA Leaderboard
                </div>
              </div>
            </div>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium mb-3">Reward Tiers:</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">150 Credits</span>
                <Badge variant="outline">Premium Tax Tools</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">300 Credits</span>
                <Badge variant="outline">CPE Course Library</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">500 Credits</span>
                <Badge variant="outline">Annual Conference Pass</Badge>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 6,
      title: "Compliance & Support",
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <Shield className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Security & Compliance</h3>
            <p className="text-muted-foreground">
              Professional-grade security with comprehensive audit trails
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  Audit & Compliance
                </h4>
                <p className="text-sm text-muted-foreground">
                  All actions logged for security/compliance with tamper-evident trails
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-600" />
                  Regulatory Updates
                </h4>
                <p className="text-sm text-muted-foreground">
                  Automated alerts for new IRS/state rules and deadlines
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Users className="h-4 w-4 text-purple-600" />
                  24/7 Support
                </h4>
                <p className="text-sm text-muted-foreground">
                  Linda AI for workflow questions—never tax advice
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Calculator className="h-4 w-4 text-gold" />
                  CPE Compliance
                </h4>
                <p className="text-sm text-muted-foreground">
                  Automated CPE tracking with state-specific requirements
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-lg border border-red-200">
            <div className="text-center">
              <h4 className="font-semibold mb-2 text-red-800">Important: AI Assistance Boundaries</h4>
              <p className="text-sm text-red-700 mb-4">
                Linda AI provides workflow and platform guidance only. She does not provide tax advice, 
                interpretations, or professional accounting services.
              </p>
              <Badge variant="outline" className="bg-white text-red-700 border-red-300">
                Tech Support Only • No Tax Advice
              </Badge>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 7,
      title: "Ready to Begin",
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <ArrowRight className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Launch Your CPA Portal</h3>
            <p className="text-muted-foreground">
              Take these next steps to activate your practice dashboard
            </p>
          </div>

          <div className="grid gap-4">
            <Button size="lg" className="flex items-center justify-between p-6 h-auto">
              <div className="text-left">
                <div className="font-semibold">Invite Clients</div>
                <div className="text-sm opacity-80">Send magic links to your client base</div>
              </div>
              <ArrowRight className="h-5 w-5" />
            </Button>
            
            <Button size="lg" variant="outline" className="flex items-center justify-between p-6 h-auto">
              <div className="text-left">
                <div className="font-semibold">Import Docs</div>
                <div className="text-sm opacity-80">Upload tax returns and client documents</div>
              </div>
              <ArrowRight className="h-5 w-5" />
            </Button>
            
            <Button size="lg" variant="outline" className="flex items-center justify-between p-6 h-auto">
              <div className="text-left">
                <div className="font-semibold">Publish Profile</div>
                <div className="text-sm opacity-80">Complete your VIP CPA Wall listing</div>
              </div>
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg text-center">
            <h4 className="font-semibold mb-2">Need Help Getting Started?</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Access our CPA training materials and workflow guides
            </p>
            <div className="flex justify-center gap-2">
              <Button variant="outline" size="sm">
                Training Videos
              </Button>
              <Button variant="outline" size="sm">
                Chat with Linda
              </Button>
            </div>
          </div>

          <div className="text-center">
            <Badge variant="outline" className="text-lg px-6 py-2">
              🎉 Welcome to the CPA Founding Family!
            </Badge>
          </div>
        </div>
      ),
      action: {
        label: "Complete CPA Onboarding",
        onClick: () => {
          setCompletedSlides(new Set([...completedSlides, currentSlide]));
        }
      }
    }
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCompletedSlides(new Set([...completedSlides, currentSlide]));
      setCurrentSlide(currentSlide + 1);
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

  const currentSlideData = slides[currentSlide];
  const progress = ((currentSlide + 1) / slides.length) * 100;

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="min-h-[600px]">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-blue-600" />
                CPA Onboarding
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Slide {currentSlide + 1} of {slides.length}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                className="flex items-center gap-2"
              >
                <Download className="h-3 w-3" />
                Export to Canva
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex items-center gap-2"
              >
                <Download className="h-3 w-3" />
                Export to Figma
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <div className="flex gap-1">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2 flex-1 rounded ${
                    index === currentSlide
                      ? 'bg-primary'
                      : index <= currentSlide || completedSlides.has(index)
                      ? 'bg-green-500'
                      : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          <div className="min-h-[400px]">
            <h2 className="text-2xl font-bold mb-6 text-center">
              {currentSlideData.title}
            </h2>
            {currentSlideData.content}
          </div>
        </CardContent>

        <div className="flex items-center justify-between p-6 border-t">
          <Button
            variant="outline"
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full ${
                  index === currentSlide
                    ? 'bg-primary'
                    : 'bg-muted-foreground/30'
                }`}
              />
            ))}
          </div>

          {currentSlideData.action ? (
            <Button
              onClick={currentSlideData.action.onClick}
              className="flex items-center gap-2"
            >
              {currentSlideData.action.label}
              <CheckCircle className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={nextSlide}
              disabled={currentSlide === slides.length - 1}
              className="flex items-center gap-2"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};