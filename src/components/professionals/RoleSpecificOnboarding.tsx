import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Upload, 
  Check, 
  Star, 
  Award, 
  Shield, 
  Users, 
  Camera,
  Lightbulb,
  TrendingUp,
  MessageCircle,
  FileText,
  CreditCard,
  Gift,
  Plus,
  Building2
} from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

interface RoleConfig {
  welcome: string;
  steps: OnboardingStep[];
  marketplaceTips: string[];
}

const ROLE_CONFIGS: Record<string, RoleConfig> = {
  advisor: {
    welcome: "Welcome, Financial Advisor! Ready to serve families with integrity? Set up your profile—your expertise is needed!",
    steps: [
      { id: 'profile', title: 'Professional Profile', description: 'Complete your advisor credentials and story', completed: false },
      { id: 'certifications', title: 'Certifications', description: 'Add your licenses and professional certifications', completed: false },
      { id: 'testimonials', title: 'Client Stories', description: 'Share testimonials and success stories', completed: false },
      { id: 'media', title: 'Photo & Logo', description: 'Upload professional headshot and firm logo', completed: false },
      { id: 'seats', title: 'Client Seats', description: 'Purchase seats for your clients or team', completed: false },
      { id: 'review', title: 'Review & Publish', description: 'Final review before going live', completed: false }
    ],
    marketplaceTips: [
      "Complete profiles get 3x more client inquiries",
      "Professional photos increase trust by 85%",
      "Client testimonials are your best marketing tool",
      "Active engagement leads to referrals"
    ]
  },
  attorney: {
    welcome: "Welcome, Attorney! Ready to serve families with integrity? Set up your profile—your expertise is needed!",
    steps: [
      { id: 'profile', title: 'Legal Profile', description: 'Complete your legal practice details', completed: false },
      { id: 'certifications', title: 'Bar Admissions', description: 'Add your state bar admissions and specializations', completed: false },
      { id: 'testimonials', title: 'Case Studies', description: 'Share anonymized client success stories', completed: false },
      { id: 'media', title: 'Photo & Firm Brand', description: 'Upload professional photo and firm branding', completed: false },
      { id: 'seats', title: 'Team Access', description: 'Add seats for associates or support staff', completed: false },
      { id: 'review', title: 'Review & Publish', description: 'Compliance review and publish profile', completed: false }
    ],
    marketplaceTips: [
      "Specialized expertise commands premium rates",
      "Clear communication builds lasting relationships",
      "Referral networks expand through marketplace presence",
      "Thought leadership attracts ideal clients"
    ]
  },
  accountant: {
    welcome: "Welcome, CPA! Ready to serve families with integrity? Set up your profile—your expertise is needed!",
    steps: [
      { id: 'profile', title: 'CPA Profile', description: 'Complete your accounting practice information', completed: false },
      { id: 'certifications', title: 'CPA License', description: 'Add your CPA license and tax certifications', completed: false },
      { id: 'testimonials', title: 'Client Results', description: 'Share tax savings and planning success stories', completed: false },
      { id: 'media', title: 'Professional Image', description: 'Upload headshot and practice branding', completed: false },
      { id: 'seats', title: 'Staff Access', description: 'Purchase seats for tax preparers and staff', completed: false },
      { id: 'review', title: 'Review & Launch', description: 'Final review and marketplace launch', completed: false }
    ],
    marketplaceTips: [
      "Year-round planning beats seasonal rushes",
      "Proactive communication prevents problems",
      "Tax strategy stories showcase value",
      "Family-focused service builds loyalty"
    ]
  },
  consultant: {
    welcome: "Welcome, Consultant! Ready to serve families with integrity? Set up your profile—your expertise is needed!",
    steps: [
      { id: 'profile', title: 'Consultant Profile', description: 'Define your consulting specialty and approach', completed: false },
      { id: 'certifications', title: 'Credentials', description: 'Add certifications and professional designations', completed: false },
      { id: 'testimonials', title: 'Success Stories', description: 'Share transformation and results stories', completed: false },
      { id: 'media', title: 'Brand Assets', description: 'Upload professional photo and brand materials', completed: false },
      { id: 'seats', title: 'Team Collaboration', description: 'Add seats for team members or partners', completed: false },
      { id: 'review', title: 'Final Review', description: 'Complete profile review and go live', completed: false }
    ],
    marketplaceTips: [
      "Unique methodologies differentiate your practice",
      "Results-focused messaging attracts clients",
      "Collaborative approach builds trust",
      "Continuous learning maintains expertise"
    ]
  }
};

interface RoleSpecificOnboardingProps {
  role: string;
  onComplete?: () => void;
}

export function RoleSpecificOnboarding({ role, onComplete }: RoleSpecificOnboardingProps) {
  const { userProfile } = useUser();
  const [currentStep, setCurrentStep] = useState(0);
  const [showBestPractices, setShowBestPractices] = useState(false);
  const [profileData, setProfileData] = useState({
    bio: '',
    specialties: [],
    experience: '',
    education: '',
    certifications: [],
    testimonials: [],
    photo: null as File | null,
    logo: null as File | null,
    hourlyRate: '',
    minEngagement: '',
    acceptingClients: true
  });
  const [seatPurchaseData, setSeatPurchaseData] = useState({
    quantity: 1,
    tierType: 'basic' as 'basic' | 'premium',
    purpose: 'clients' as 'clients' | 'team' | 'family'
  });

  const config = ROLE_CONFIGS[role] || ROLE_CONFIGS.advisor;
  const progress = ((currentStep + 1) / config.steps.length) * 100;

  const handleStepComplete = () => {
    if (currentStep < config.steps.length - 1) {
      setCurrentStep(currentStep + 1);
      
      // Show confetti for milestones
      if (currentStep === 2 || currentStep === 4) {
        // Trigger confetti animation
        toast.success(`${config.steps[currentStep].title} completed! 🎉`);
      }
    } else {
      toast.success('Profile completed! Welcome to the marketplace! 🎊');
      onComplete?.();
    }
  };

  const handleSeatPurchase = async () => {
    try {
      // Simulate seat purchase - in production this would integrate with payment system
      toast.success(`${seatPurchaseData.quantity} ${seatPurchaseData.tierType} seat(s) purchased successfully!`);
      handleStepComplete();
    } catch (error) {
      console.error('Error purchasing seats:', error);
      toast.error('Failed to purchase seats. Please try again.');
    }
  };

  const renderCurrentStep = () => {
    const step = config.steps[currentStep];
    
    switch (step.id) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="bio">Professional Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell families about your experience, approach, and what makes you unique..."
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                rows={4}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="experience">Years of Experience</Label>
                <Input
                  id="experience"
                  type="number"
                  value={profileData.experience}
                  onChange={(e) => setProfileData({ ...profileData, experience: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="education">Education</Label>
                <Input
                  id="education"
                  placeholder="Degree, School"
                  value={profileData.education}
                  onChange={(e) => setProfileData({ ...profileData, education: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rate">Hourly Rate (optional)</Label>
                <Input
                  id="rate"
                  placeholder="$500"
                  value={profileData.hourlyRate}
                  onChange={(e) => setProfileData({ ...profileData, hourlyRate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="engagement">Minimum Engagement</Label>
                <Input
                  id="engagement"
                  placeholder="$5,000"
                  value={profileData.minEngagement}
                  onChange={(e) => setProfileData({ ...profileData, minEngagement: e.target.value })}
                />
              </div>
            </div>
          </div>
        );

      case 'certifications':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Award className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Professional Credentials</h3>
              <p className="text-muted-foreground">
                Add your professional certifications to build trust with families
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {role === 'advisor' && (
                <>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="cfp" />
                    <label htmlFor="cfp">CFP® - Certified Financial Planner</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="cfa" />
                    <label htmlFor="cfa">CFA - Chartered Financial Analyst</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="chfc" />
                    <label htmlFor="chfc">ChFC - Chartered Financial Consultant</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="ria" />
                    <label htmlFor="ria">RIA - Registered Investment Advisor</label>
                  </div>
                </>
              )}
              
              {role === 'attorney' && (
                <>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="estate" />
                    <label htmlFor="estate">Estate Planning Specialist</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="tax" />
                    <label htmlFor="tax">Tax Law Specialist</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="business" />
                    <label htmlFor="business">Business Law</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="board" />
                    <label htmlFor="board">Board Certified</label>
                  </div>
                </>
              )}
              
              {role === 'accountant' && (
                <>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="cpa" />
                    <label htmlFor="cpa">CPA - Certified Public Accountant</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="pfs" />
                    <label htmlFor="pfs">PFS - Personal Financial Specialist</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="mst" />
                    <label htmlFor="mst">MST - Master of Science in Taxation</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="enrolled" />
                    <label htmlFor="enrolled">Enrolled Agent</label>
                  </div>
                </>
              )}
            </div>
          </div>
        );

      case 'testimonials':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <MessageCircle className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Share Your Success Stories</h3>
              <p className="text-muted-foreground">
                Testimonials help families understand the value you provide
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 border border-border/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                </div>
                <Textarea
                  placeholder="Share a client testimonial (anonymized)..."
                  rows={3}
                />
                <div className="mt-2">
                  <Input placeholder="Client initials (e.g., J.S.)" />
                </div>
              </div>
              
              <div className="p-4 border border-dashed border-border/50 rounded-lg text-center">
                <Plus className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Add another testimonial</p>
              </div>
            </div>
          </div>
        );

      case 'media':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Camera className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Professional Image</h3>
              <p className="text-muted-foreground">
                A professional photo builds trust and recognition
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Label>Professional Headshot</Label>
                <div className="border-2 border-dashed border-border/50 rounded-lg p-6 text-center">
                  <Avatar className="w-24 h-24 mx-auto mb-4">
                    <AvatarImage src={profileData.photo ? URL.createObjectURL(profileData.photo) : ''} />
                    <AvatarFallback>
                      <Camera className="w-8 h-8 text-muted-foreground" />
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" onClick={() => document.getElementById('photo-upload')?.click()}>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Photo
                  </Button>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setProfileData({ ...profileData, photo: file });
                    }}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <Label>Firm Logo (optional)</Label>
                <div className="border-2 border-dashed border-border/50 rounded-lg p-6 text-center">
                  <div className="w-24 h-24 bg-muted rounded-lg mx-auto mb-4 flex items-center justify-center">
                    {profileData.logo ? (
                      <img 
                        src={URL.createObjectURL(profileData.logo)} 
                        alt="Logo" 
                        className="w-full h-full object-contain rounded-lg"
                      />
                    ) : (
                      <Building2 className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>
                  <Button variant="outline" onClick={() => document.getElementById('logo-upload')?.click()}>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Logo
                  </Button>
                  <input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setProfileData({ ...profileData, logo: file });
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'seats':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Users className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Purchase Client Seats</h3>
              <p className="text-muted-foreground">
                Buy seats for your clients or team members to access the platform
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className={`cursor-pointer transition-colors ${
                seatPurchaseData.purpose === 'clients' ? 'border-primary bg-primary/5' : ''
              }`} onClick={() => setSeatPurchaseData({ ...seatPurchaseData, purpose: 'clients' })}>
                <CardContent className="p-4 text-center">
                  <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h4 className="font-semibold">For Clients</h4>
                  <p className="text-sm text-muted-foreground">Give clients access to their own dashboard</p>
                </CardContent>
              </Card>
              
              <Card className={`cursor-pointer transition-colors ${
                seatPurchaseData.purpose === 'team' ? 'border-primary bg-primary/5' : ''
              }`} onClick={() => setSeatPurchaseData({ ...seatPurchaseData, purpose: 'team' })}>
                <CardContent className="p-4 text-center">
                  <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h4 className="font-semibold">For Team</h4>
                  <p className="text-sm text-muted-foreground">Add team members and staff</p>
                </CardContent>
              </Card>
              
              <Card className={`cursor-pointer transition-colors ${
                seatPurchaseData.purpose === 'family' ? 'border-primary bg-primary/5' : ''
              }`} onClick={() => setSeatPurchaseData({ ...seatPurchaseData, purpose: 'family' })}>
                <CardContent className="p-4 text-center">
                  <Gift className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h4 className="font-semibold">For Family</h4>
                  <p className="text-sm text-muted-foreground">Gift access to family members</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Number of Seats</Label>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSeatPurchaseData({ 
                      ...seatPurchaseData, 
                      quantity: Math.max(1, seatPurchaseData.quantity - 1) 
                    })}
                  >
                    -
                  </Button>
                  <span className="w-8 text-center">{seatPurchaseData.quantity}</span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSeatPurchaseData({ 
                      ...seatPurchaseData, 
                      quantity: seatPurchaseData.quantity + 1 
                    })}
                  >
                    +
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Seat Tier</Label>
                <Select 
                  value={seatPurchaseData.tierType} 
                  onValueChange={(value: 'basic' | 'premium') => 
                    setSeatPurchaseData({ ...seatPurchaseData, tierType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic - $19/month</SelectItem>
                    <SelectItem value="premium">Premium - $49/month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span>Total Cost:</span>
                  <span className="font-bold">
                    ${(seatPurchaseData.quantity * (seatPurchaseData.tierType === 'premium' ? 49 : 19)).toLocaleString()}/month
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'review':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Check className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Ready to Go Live!</h3>
              <p className="text-muted-foreground">
                Review your profile and submit for approval
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Profile Completeness</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Bio</span>
                      <Check className="w-4 h-4 text-green-500" />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Certifications</span>
                      <Check className="w-4 h-4 text-green-500" />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Testimonials</span>
                      <Check className="w-4 h-4 text-green-500" />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Professional Photo</span>
                      <Check className="w-4 h-4 text-green-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Next Steps</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p>✅ Profile review (24-48 hours)</p>
                    <p>✅ Compliance verification</p>
                    <p>✅ Marketplace listing approval</p>
                    <p>✅ Welcome to the network!</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-50 to-emerald-50 relative overflow-hidden">
      {/* Gold tree watermark */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-gold-500 to-gold-600 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 py-8 max-w-4xl">
        {/* Welcome Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-navy-900 mb-2">
            {config.welcome}
          </h1>
          <p className="text-navy-600">
            Complete your setup to start connecting with families who need your expertise
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium">Step {currentStep + 1} of {config.steps.length}</span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}% complete</span>
            <Dialog open={showBestPractices} onOpenChange={setShowBestPractices}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Lightbulb className="w-4 h-4" />
                  Best Practices
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Marketplace Best Practices</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {config.marketplaceTips.map((tip, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <TrendingUp className="w-5 h-5 text-primary mt-0.5" />
                      <p className="text-sm">{tip}</p>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <Progress value={progress} className="h-3" />
        </motion.div>

        {/* Step Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="backdrop-blur-sm bg-white/90 border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {config.steps[currentStep].title}
                <Badge variant="outline" className="text-xs">
                  {currentStep + 1}/{config.steps.length}
                </Badge>
              </CardTitle>
              <p className="text-muted-foreground">
                {config.steps[currentStep].description}
              </p>
            </CardHeader>
            <CardContent>
              {renderCurrentStep()}
            </CardContent>
          </Card>
        </motion.div>

        {/* Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-between mt-8"
        >
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
          >
            Previous
          </Button>
          
          <div className="flex gap-2">
            {config.steps[currentStep].id === 'seats' ? (
              <Button onClick={handleSeatPurchase} className="gap-2 min-w-44">
                <CreditCard className="w-4 h-4" />
                Purchase Seats
              </Button>
            ) : (
              <Button onClick={handleStepComplete} className="gap-2 min-w-44">
                {currentStep === config.steps.length - 1 ? (
                  <>
                    <FileText className="w-4 h-4" />
                    Submit for Review
                  </>
                ) : (
                  <>
                    Continue
                    <Check className="w-4 h-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}