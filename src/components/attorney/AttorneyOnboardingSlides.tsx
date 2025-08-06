import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Crown, Scale, FileText, Users, TrendingUp, Shield, ArrowRight, Download, CheckCircle } from 'lucide-react';

interface SlideData {
  id: number;
  title: string;
  content: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const AttorneyOnboardingSlides: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [completedSlides, setCompletedSlides] = useState<Set<number>>(new Set());

  const slides: SlideData[] = [
    {
      id: 1,
      title: "Welcome, Founding Attorney",
      content: (
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Scale className="h-12 w-12 text-purple-600" />
            <Badge variant="outline" className="text-lg px-4 py-2 border-gold text-gold">
              Founding Attorney Member
            </Badge>
          </div>
          <h2 className="text-3xl font-bold mb-4">Welcome, [Attorney Name]!</h2>
          <p className="text-xl text-muted-foreground mb-6">
            Set up your branded attorney profile; join an exclusive early cohort.
          </p>
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border border-purple-200">
            <h3 className="font-semibold mb-3">Your VIP Attorney Benefits:</h3>
            <div className="space-y-2 text-left">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Attorney Dashboard with matter management</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>CLE tracking with state alerts</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>VIP Legal Wall listing for client visibility</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Platform credits for successful referrals</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Legal Practice Suite",
      content: (
        <div className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Case Management</h3>
              <p className="text-sm text-muted-foreground">
                Manage cases/matters, upload legal docs, assign tasks
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Secure Vault</h3>
              <p className="text-sm text-muted-foreground">
                Secure vault for contracts, wills, and estate planning files
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Scale className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">CLE Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Built-in CLE tracking with state alerts
              </p>
            </div>
          </div>
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Legal Practice Features:</h4>
            <ul className="space-y-1 text-sm">
              <li>• Matter management with deadline tracking</li>
              <li>• Secure document vault with encryption</li>
              <li>• Contract templates and automation</li>
              <li>• CLE compliance tracking by jurisdiction</li>
              <li>• Client communication portal</li>
              <li>• Legal billing and time tracking</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Collaborate & Grow",
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold mb-4">Build Your Legal Network</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="font-medium">Legal Referrals</h4>
                  <p className="text-sm text-muted-foreground">
                    Refer or co-counsel with advisors, CPAs, and family clients
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Scale className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="font-medium">Legal Professionals</h4>
                  <p className="text-sm text-muted-foreground">
                    Connect to other legal pros for specialized matters
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-gold/10 rounded-lg">
                <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                  <Crown className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="font-medium">VIP Legal Wall</h4>
                  <p className="text-sm text-muted-foreground">
                    Feature on the "VIP Legal Wall" for client visibility
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="font-medium">Practice Growth</h4>
                  <p className="text-sm text-muted-foreground">
                    Expand practice through strategic partnerships
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
      title: "Referrals & Rewards",
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <TrendingUp className="h-16 w-16 text-purple-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Build Your Legal Network</h3>
            <p className="text-muted-foreground">
              Earn rewards for growing the legal community
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">100</div>
                <div className="text-sm text-muted-foreground">Credits per attorney</div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">50</div>
                <div className="text-sm text-muted-foreground">Credits per client</div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-gold/10 to-gold/20 p-4 rounded-lg border border-gold/20">
              <div className="text-center">
                <div className="text-2xl font-bold text-gold mb-1">2x</div>
                <div className="text-sm text-muted-foreground">Founder multiplier</div>
              </div>
            </div>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium mb-3">Attorney Leaderboard Benefits:</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Invite other attorneys and firms</span>
                <Badge variant="outline">Earn credits for successful referrals</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Rank on Attorney Leaderboard</span>
                <Badge variant="outline">Platform engagement rewards</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Premium legal tools unlocked</span>
                <Badge variant="outline">Enhanced practice features</Badge>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-200">
            <h4 className="font-semibold mb-2">Founding Attorney Recognition</h4>
            <p className="text-sm text-muted-foreground">
              Early adopters receive permanent founding member status and priority placement 
              in attorney directory searches
            </p>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: "Compliance & Security",
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <Shield className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Legal-Grade Security</h3>
            <p className="text-muted-foreground">
              Attorney-client privilege protection with comprehensive compliance
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  Encryption & Audit Trails
                </h4>
                <p className="text-sm text-muted-foreground">
                  All files and communications are encrypted, with complete audit trails
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Scale className="h-4 w-4 text-purple-600" />
                  CLE Compliance
                </h4>
                <p className="text-sm text-muted-foreground">
                  CLE tracker and regulatory update alerts by jurisdiction
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  Professional Support
                </h4>
                <p className="text-sm text-muted-foreground">
                  Access support and feedback (Linda AI for workflow help—never legal advice)
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gold" />
                  Ethics Compliance
                </h4>
                <p className="text-sm text-muted-foreground">
                  Built-in ethics guidelines and professional responsibility alerts
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-lg border border-red-200">
            <div className="text-center">
              <h4 className="font-semibold mb-2 text-red-800">Critical: AI Assistant Boundaries</h4>
              <p className="text-sm text-red-700 mb-4">
                Linda AI provides workflow and platform guidance only. She does not provide legal advice, 
                interpretations, or attorney work product.
              </p>
              <Badge variant="outline" className="bg-white text-red-700 border-red-300">
                Tech Support Only • No Legal Advice
              </Badge>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 6,
      title: "Getting Started",
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <ArrowRight className="h-16 w-16 text-purple-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Launch Your Legal Portal</h3>
            <p className="text-muted-foreground">
              Activate your attorney dashboard and start building your network
            </p>
          </div>

          <div className="grid gap-4">
            <Button size="lg" className="flex items-center justify-between p-6 h-auto">
              <div className="text-left">
                <div className="font-semibold">Publish Profile</div>
                <div className="text-sm opacity-80">Complete your VIP Legal Wall listing</div>
              </div>
              <ArrowRight className="h-5 w-5" />
            </Button>
            
            <Button size="lg" variant="outline" className="flex items-center justify-between p-6 h-auto">
              <div className="text-left">
                <div className="font-semibold">Invite Clients</div>
                <div className="text-sm opacity-80">Send secure invites to your client base</div>
              </div>
              <ArrowRight className="h-5 w-5" />
            </Button>
            
            <Button size="lg" variant="outline" className="flex items-center justify-between p-6 h-auto">
              <div className="text-left">
                <div className="font-semibold">Access CLE Tools</div>
                <div className="text-sm opacity-80">Set up continuing education tracking</div>
              </div>
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg text-center">
            <h4 className="font-semibold mb-2">Attorney Resources</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Access comprehensive training materials and legal tech guidance
            </p>
            <div className="flex justify-center gap-2">
              <Button variant="outline" size="sm">
                Legal Tech Training
              </Button>
              <Button variant="outline" size="sm">
                Workflow Support
              </Button>
            </div>
          </div>

          <div className="text-center">
            <Badge variant="outline" className="text-lg px-6 py-2">
              ⚖️ Welcome to the Legal Founding Family!
            </Badge>
          </div>
        </div>
      ),
      action: {
        label: "Complete Attorney Onboarding",
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
                <Scale className="h-5 w-5 text-purple-600" />
                Attorney Onboarding
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