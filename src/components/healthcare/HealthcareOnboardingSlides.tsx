import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Shield, 
  Users, 
  Award, 
  Stethoscope, 
  TrendingUp, 
  ArrowLeft, 
  ArrowRight,
  Download,
  ExternalLink,
  MessageSquare,
  Calendar,
  FileText
} from 'lucide-react';

export const HealthcareOnboardingSlides: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: "Welcome, Founding Healthcare Partner",
      subtitle: "Join an Elite Wellness Community",
      icon: <Heart className="h-12 w-12 text-primary" />,
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <Badge variant="default" className="mb-4 px-6 py-2 text-lg">
              🎖️ VIP Founding Partner
            </Badge>
            <p className="text-lg text-muted-foreground">
              Set up your expert profile and join a handpicked cohort of healthcare innovators
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Award className="h-8 w-8 text-primary" />
                  <div>
                    <h4 className="font-semibold">Exclusive Recognition</h4>
                    <p className="text-sm text-muted-foreground">Early adopter status with VIP badge</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Users className="h-8 w-8 text-primary" />
                  <div>
                    <h4 className="font-semibold">Elite Network</h4>
                    <p className="text-sm text-muted-foreground">Connect with top healthcare professionals</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Showcase Your Healthcare Expertise",
      subtitle: "Professional Profile & Credentials",
      icon: <Stethoscope className="h-12 w-12 text-primary" />,
      content: (
        <div className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <FileText className="h-8 w-8 text-primary mx-auto mb-2" />
                <h4 className="font-semibold">Upload Credentials</h4>
                <p className="text-sm text-muted-foreground">Board certifications, licenses, specialties</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
                <h4 className="font-semibold">Set Consultation Rates</h4>
                <p className="text-sm text-muted-foreground">Hourly rates, package pricing</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Award className="h-8 w-8 text-primary mx-auto mb-2" />
                <h4 className="font-semibold">Highlight Specialties</h4>
                <p className="text-sm text-muted-foreground">Longevity, precision medicine, wellness</p>
              </CardContent>
            </Card>
          </div>
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Specialty Areas Include:</h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Longevity Medicine</Badge>
              <Badge variant="outline">Precision Medicine</Badge>
              <Badge variant="outline">Wellness Coaching</Badge>
              <Badge variant="outline">Functional Medicine</Badge>
              <Badge variant="outline">Preventive Care</Badge>
              <Badge variant="outline">Anti-Aging</Badge>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Connect & Consult with Elite Families",
      subtitle: "Secure Client Management Platform",
      icon: <Users className="h-12 w-12 text-primary" />,
      content: (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Client Referral Hub</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Receive warm referrals from family offices
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Direct portal access for high-net-worth families
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Vetted client base seeking premium healthcare
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Consultation Tools</h4>
              <div className="space-y-3">
                <Card className="p-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span className="text-sm">Appointment Management</span>
                  </div>
                </Card>
                <Card className="p-3">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    <span className="text-sm">Secure Messaging</span>
                  </div>
                </Card>
                <Card className="p-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <span className="text-sm">Report Upload & Sharing</span>
                  </div>
                </Card>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">Collaborative Care Network</h4>
            <p className="text-blue-800 text-sm">
              Work alongside financial advisors, attorneys, and family office teams for comprehensive family health strategies.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "Earn Rewards & Grow Your Practice",
      subtitle: "Professional Network & Recognition",
      icon: <TrendingUp className="h-12 w-12 text-primary" />,
      content: (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg">Referral Rewards</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Healthcare Professional</span>
                  <Badge>+50 Credits</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Medical Clinic/Practice</span>
                  <Badge>+100 Credits</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Specialty Center</span>
                  <Badge>+200 Credits</Badge>
                </div>
              </CardContent>
            </Card>
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg">VIP Recognition</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  <span>Featured on VIP Wellness Wall</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <span>Healthcare Leaderboard Ranking</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <span>Family Office Health Guides</span>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-lg">
            <h4 className="font-semibold mb-2">Performance Tracking</h4>
            <p className="text-muted-foreground mb-4">Monitor your engagement and success on the platform</p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">24</div>
                <div className="text-sm text-muted-foreground">Consultations</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">89%</div>
                <div className="text-sm text-muted-foreground">Satisfaction</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">12</div>
                <div className="text-sm text-muted-foreground">Referrals</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: "HIPAA Compliance & Security",
      subtitle: "Professional Healthcare Standards",
      icon: <Shield className="h-12 w-12 text-primary" />,
      content: (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-800">Security Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  <span className="text-green-800">End-to-end encryption</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  <span className="text-green-800">HIPAA-compliant infrastructure</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  <span className="text-green-800">Secure audit trails</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  <span className="text-green-800">SOC 2 Type II certified</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Workflow Support</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <h5 className="font-medium">Linda AI Assistant</h5>
                  <p className="text-sm text-muted-foreground">
                    Workflow guidance and platform navigation support
                  </p>
                  <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
                    <p className="text-yellow-800 text-xs">
                      <strong>Important:</strong> Linda provides technical support only - never medical advice
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Dashboard Features</h4>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <FileText className="h-8 w-8 text-primary mx-auto mb-2" />
                <h5 className="font-medium">Consultation Notes</h5>
                <p className="text-sm text-muted-foreground">Secure note-taking and storage</p>
              </div>
              <div className="text-center">
                <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
                <h5 className="font-medium">Appointment Reminders</h5>
                <p className="text-sm text-muted-foreground">Automated scheduling alerts</p>
              </div>
              <div className="text-center">
                <MessageSquare className="h-8 w-8 text-primary mx-auto mb-2" />
                <h5 className="font-medium">Secure Messaging</h5>
                <p className="text-sm text-muted-foreground">Encrypted client communication</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 6,
      title: "Ready to Transform Healthcare",
      subtitle: "Start Your VIP Healthcare Journey",
      icon: <Heart className="h-12 w-12 text-primary" />,
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Welcome to the Future of Family Healthcare</h3>
            <p className="text-lg text-muted-foreground mb-6">
              Join an exclusive network of healthcare professionals serving elite families
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <Button size="lg" className="h-16 flex flex-col items-center gap-2">
              <Users className="h-6 w-6" />
              <span>Publish My Profile</span>
            </Button>
            <Button size="lg" variant="outline" className="h-16 flex flex-col items-center gap-2">
              <Heart className="h-6 w-6" />
              <span>Invite Clients</span>
            </Button>
            <Button size="lg" variant="outline" className="h-16 flex flex-col items-center gap-2">
              <TrendingUp className="h-6 w-6" />
              <span>Join Longevity Network</span>
            </Button>
          </div>
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-lg text-center">
            <h4 className="font-semibold mb-2">Questions or Need Support?</h4>
            <p className="text-muted-foreground mb-4">
              Our healthcare team is here to help you succeed on the platform
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="outline" size="sm">
                <MessageSquare className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Training Materials
              </Button>
            </div>
          </div>
        </div>
      )
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const currentSlideData = slides[currentSlide];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Heart className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Healthcare Partner Onboarding</h1>
            <p className="text-muted-foreground">
              VIP launch training for healthcare professionals
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Slides
          </Button>
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            Training Manual
          </Button>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="flex justify-center gap-2 mb-6">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? 'bg-primary' : 'bg-muted'
            }`}
          />
        ))}
      </div>

      {/* Main slide content */}
      <Card className="min-h-[600px]">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            {currentSlideData.icon}
          </div>
          <CardTitle className="text-2xl">{currentSlideData.title}</CardTitle>
          <CardDescription className="text-lg">
            {currentSlideData.subtitle}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {currentSlideData.content}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={prevSlide}
          disabled={currentSlide === 0}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">
          {currentSlide + 1} of {slides.length}
        </span>
        <Button
          variant="outline"
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
        >
          Next
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>

      {/* Healthcare-specific FAQ */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold">Is my healthcare data secure?</h4>
            <p className="text-sm text-muted-foreground">
              Yes, all information is HIPAA-compliant with end-to-end encryption and secure audit trails.
            </p>
          </div>
          <div>
            <h4 className="font-semibold">Can I refer other healthcare professionals?</h4>
            <p className="text-sm text-muted-foreground">
              Absolutely! Earn platform credits and unlock premium features for each successful referral.
            </p>
          </div>
          <div>
            <h4 className="font-semibold">What support is available?</h4>
            <p className="text-sm text-muted-foreground">
              Linda AI assists with workflow and navigation, but never provides medical or legal advice.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};