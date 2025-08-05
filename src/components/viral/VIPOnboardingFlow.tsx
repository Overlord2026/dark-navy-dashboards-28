import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Crown, 
  Star, 
  Award, 
  Sparkles, 
  Calendar,
  CheckCircle2,
  ArrowRight,
  Gift,
  Users,
  Trophy,
  Gem
} from 'lucide-react';
import { PersonaType } from '@/types/personas';
import { VIPBadge, VIPStatusCard, getVIPStatus } from '@/components/badges/VIPBadgeSystem';
import { Celebration } from '@/components/ConfettiAnimation';
import { useAdvancedEventTracking } from '@/hooks/useAdvancedEventTracking';
import { toast } from 'sonner';

interface VIPOnboardingFlowProps {
  isOpen: boolean;
  onClose: () => void;
  persona: PersonaType;
  userProfile?: any;
  isReservedVIP?: boolean;
}

const VIP_WELCOME_COPY = {
  vip_reserved: {
    title: "Welcome, {{name}}! Your Reserved Profile Awaits.",
    subtitle: "You're one of the first 25 industry leaders invited to shape the future of family wealth management. Your premium profile is ready—just click to activate.",
    benefits: [
      "Exclusive founding member access",
      "Priority onboarding and support", 
      "Direct influence on platform development",
      "Elite professional network access"
    ]
  },
  organization: {
    title: "Welcome, Industry Leader!",
    subtitle: "Early-adopter status, drive innovation, and build strategic partnerships. Your VIP organization profile includes premium features and industry recognition.",
    benefits: [
      "Early-adopter innovation status",
      "Strategic partnership opportunities",
      "Industry thought leadership platform",
      "Executive relationship management"
    ]
  },
  founding_member: {
    title: "Welcome, Founding Member!",
    subtitle: "You're among the first 25 professionals to join our elite network. Enjoy lifetime access to premium features and direct influence on platform development.",
    benefits: [
      "Lifetime premium access",
      "Founding member recognition",
      "Executive advisory participation",
      "Priority customer success"
    ]
  }
};

export const VIPOnboardingFlow: React.FC<VIPOnboardingFlowProps> = ({
  isOpen,
  onClose,
  persona,
  userProfile,
  isReservedVIP = false
}) => {
  const { trackOnboardingEvent, trackOnboardingComplete } = useAdvancedEventTracking();
  const [currentStep, setCurrentStep] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [profileData, setProfileData] = useState({
    company: '',
    title: '',
    bio: '',
    specialties: '',
    phone: '',
    website: ''
  });
  const [schedulingPreferences, setSchedulingPreferences] = useState({
    preferredTime: '',
    timezone: '',
    specialRequests: ''
  });

  const vipStatus = getVIPStatus(persona, userProfile);
  const welcomeType = isReservedVIP ? 'vip_reserved' : 
                    vipStatus?.tier === 'founding_member' ? 'founding_member' : 
                    persona === 'organization' ? 'organization' : 'vip_reserved';
  
  const welcomeContent = VIP_WELCOME_COPY[welcomeType];

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
      
      trackOnboardingEvent({
        step: 'vip_welcome_shown',
        persona,
        channel: 'direct',
        source: 'vip_onboarding'
      });
    }
  }, [isOpen]);

  const handleNext = async () => {
    await trackOnboardingEvent({
      step: `vip_step_${currentStep + 1}`,
      persona,
      channel: 'direct',
      source: 'vip_onboarding'
    });
    
    setCurrentStep(prev => Math.min(prev + 1, 2));
  };

  const handleComplete = async () => {
    const completedSteps = ['welcome', 'profile_setup', 'scheduling'];
    const timeSpent = 180; // 3 minutes average for VIP onboarding
    
    await trackOnboardingComplete(
      persona,
      timeSpent,
      completedSteps,
      'vip_onboarding'
    );

    toast.success("VIP onboarding complete! Welcome to the elite network.");
    onClose();
  };

  const handleClaimProfile = async () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
    
    await trackOnboardingEvent({
      step: 'vip_profile_claimed',
      persona,
      channel: 'direct',
      source: 'reserved_vip'
    });
    
    handleNext();
  };

  const steps = [
    {
      title: "VIP Welcome",
      content: (
        <div className="space-y-6 text-center">
          {showConfetti && <Celebration trigger={showConfetti} />}
          
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-gold via-yellow-500 to-amber-400 flex items-center justify-center shadow-xl"
          >
            <Crown className="h-10 w-10 text-white" />
          </motion.div>

          <div className="space-y-3">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gold to-yellow-600 bg-clip-text text-transparent">
              {welcomeContent.title.replace('{{name}}', userProfile?.full_name || 'VIP Member')}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {welcomeContent.subtitle}
            </p>
          </div>

          {/* VIP Benefits */}
          <Card className="border-gold/20 bg-gradient-to-br from-gold/5 to-primary/5">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-gold" />
                Your VIP Benefits
              </h3>
              <ul className="space-y-2 text-sm">
                {welcomeContent.benefits.map((benefit, index) => (
                  <motion.li 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    {benefit}
                  </motion.li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* VIP Status Display */}
          {vipStatus && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <VIPStatusCard 
                persona={persona}
                vipStatus={vipStatus}
                compact={false}
              />
            </motion.div>
          )}

          <Button 
            onClick={handleClaimProfile}
            size="lg"
            className="w-full bg-gradient-to-r from-gold to-yellow-600 hover:from-yellow-600 hover:to-gold text-navy font-semibold"
          >
            <Crown className="mr-2 h-5 w-5" />
            {isReservedVIP ? "Claim My Reserved Profile" : "Activate VIP Access"}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      )
    },
    {
      title: "Profile Setup",
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">Complete Your VIP Profile</h3>
            <p className="text-muted-foreground">
              Help us showcase your expertise to our elite network.
            </p>
          </div>

          <div className="grid gap-4">
            <div>
              <label className="text-sm font-medium">Company/Organization</label>
              <Input 
                placeholder="Your company name"
                value={profileData.company}
                onChange={(e) => setProfileData(prev => ({ ...prev, company: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Title/Position</label>
              <Input 
                placeholder="Your professional title"
                value={profileData.title}
                onChange={(e) => setProfileData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Professional Bio</label>
              <Textarea 
                placeholder="Tell our network about your expertise and experience..."
                value={profileData.bio}
                onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                className="min-h-[100px]"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Specialties/Expertise</label>
              <Input 
                placeholder="e.g., Estate Planning, Tax Strategy, Wealth Management"
                value={profileData.specialties}
                onChange={(e) => setProfileData(prev => ({ ...prev, specialties: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Phone (Optional)</label>
                <Input 
                  placeholder="+1 (555) 123-4567"
                  value={profileData.phone}
                  onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Website (Optional)</label>
                <Input 
                  placeholder="yourcompany.com"
                  value={profileData.website}
                  onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <Button onClick={handleNext} size="lg" className="w-full">
            Continue to VIP Onboarding
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )
    },
    {
      title: "Priority Support",
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">Schedule Your VIP Onboarding</h3>
            <p className="text-muted-foreground">
              Get white-glove onboarding with our team to maximize your platform experience.
            </p>
          </div>

          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="h-5 w-5 text-primary" />
                <h4 className="font-medium">VIP Onboarding Session</h4>
              </div>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• 30-minute personalized session</li>
                <li>• Platform walkthrough and best practices</li>
                <li>• Custom setup for your specific needs</li>
                <li>• Direct line to your success manager</li>
              </ul>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            <div>
              <label className="text-sm font-medium">Preferred Time</label>
              <Input 
                placeholder="e.g., Weekday mornings, Tuesday afternoons"
                value={schedulingPreferences.preferredTime}
                onChange={(e) => setSchedulingPreferences(prev => ({ ...prev, preferredTime: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Timezone</label>
              <Input 
                placeholder="e.g., EST, PST, CST"
                value={schedulingPreferences.timezone}
                onChange={(e) => setSchedulingPreferences(prev => ({ ...prev, timezone: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Special Requests (Optional)</label>
              <Textarea 
                placeholder="Any specific topics you'd like to focus on during onboarding..."
                value={schedulingPreferences.specialRequests}
                onChange={(e) => setSchedulingPreferences(prev => ({ ...prev, specialRequests: e.target.value }))}
                className="min-h-[80px]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={handleComplete}>
              Skip For Now
            </Button>
            <Button onClick={handleComplete} className="bg-gradient-to-r from-primary to-secondary">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Session
            </Button>
          </div>
        </div>
      )
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="flex items-center gap-2">
                  <VIPBadge type="founding_member" size="sm" animated={false} />
                  VIP Onboarding
                </DialogTitle>
                <div className="text-sm text-muted-foreground">
                  {currentStep + 1} of {steps.length}
                </div>
              </div>
            </DialogHeader>

            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="py-4"
            >
              {steps[currentStep].content}
            </motion.div>

            {/* Progress Indicators */}
            <div className="flex justify-center gap-2 pt-4 border-t">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index <= currentStep ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};