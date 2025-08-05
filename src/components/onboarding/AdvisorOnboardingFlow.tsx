import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Upload, 
  Shield, 
  Users, 
  Mail,
  Camera,
  Award,
  Building2,
  Eye,
  CreditCard,
  UserPlus,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

interface AdvisorOnboardingData {
  profile_completed: boolean;
  credentials_added: boolean;
  book_setup_completed: boolean;
  clients_invited: boolean;
}

interface AdvisorProfile {
  photo_url?: string;
  firm_name?: string;
  firm_logo?: string;
  bio?: string;
  specialties?: string[];
  certifications?: string[];
  years_experience?: number;
  license_states?: string[];
  fiduciary_compliant?: boolean;
}

export const AdvisorOnboardingFlow = () => {
  const { userProfile } = useUser();
  const [showWelcome, setShowWelcome] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [onboardingData, setOnboardingData] = useState<AdvisorOnboardingData>({
    profile_completed: false,
    credentials_added: false,
    book_setup_completed: false,
    clients_invited: false
  });
  const [advisorProfile, setAdvisorProfile] = useState<AdvisorProfile>({});

  useEffect(() => {
    checkOnboardingStatus();
  }, [userProfile]);

  const checkOnboardingStatus = async () => {
    if (!userProfile?.id) return;

    const { data: advisorData } = await supabase
      .from('advisor_profiles')
      .select('*')
      .eq('user_id', userProfile.id)
      .single();

    if (!advisorData?.onboarding_completed) {
      setShowWelcome(true);
    }

    if (advisorData) {
      setAdvisorProfile(advisorData);
      setOnboardingData({
        profile_completed: !!(advisorData.photo_url && advisorData.bio),
        credentials_added: !!(advisorData.certifications?.length),
        book_setup_completed: !!(advisorData.firm_name),
        clients_invited: false // Will check seats/invitations
      });
    }
  };

  const updateOnboardingProgress = async (stepKey: keyof AdvisorOnboardingData) => {
    const newData = { ...onboardingData, [stepKey]: true };
    setOnboardingData(newData);

    const allCompleted = Object.values(newData).every(Boolean);

    if (allCompleted) {
      await supabase
        .from('advisor_profiles')
        .update({ onboarding_completed: true })
        .eq('user_id', userProfile?.id);

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      toast.success("🎉 Your advisor profile is ready! Start inviting clients.");
    }
  };

  const onboardingSteps = [
    {
      id: 'profile',
      title: 'Complete Your Profile',
      description: 'Upload photo, add bio, and professional details',
      icon: <User className="w-6 h-6" />,
      completed: onboardingData.profile_completed,
      component: <ProfileSetupStep 
        profile={advisorProfile} 
        onUpdate={setAdvisorProfile}
        onComplete={() => updateOnboardingProgress('profile_completed')} 
      />
    },
    {
      id: 'credentials',
      title: 'Add Credentials',
      description: 'Certifications, licenses, and specialties',
      icon: <Award className="w-6 h-6" />,
      completed: onboardingData.credentials_added,
      component: <CredentialsStep 
        profile={advisorProfile}
        onUpdate={setAdvisorProfile}
        onComplete={() => updateOnboardingProgress('credentials_added')} 
      />
    },
    {
      id: 'book',
      title: 'Book Setup',
      description: 'Configure your practice settings',
      icon: <Building2 className="w-6 h-6" />,
      completed: onboardingData.book_setup_completed,
      component: <BookSetupStep 
        profile={advisorProfile}
        onUpdate={setAdvisorProfile}
        onComplete={() => updateOnboardingProgress('book_setup_completed')} 
      />
    },
    {
      id: 'clients',
      title: 'Invite Clients',
      description: 'Buy seats and invite your first clients',
      icon: <UserPlus className="w-6 h-6" />,
      completed: onboardingData.clients_invited,
      component: <ClientInviteStep onComplete={() => updateOnboardingProgress('clients_invited')} />
    }
  ];

  const completedSteps = onboardingSteps.filter(step => step.completed).length;
  const progressPercentage = (completedSteps / onboardingSteps.length) * 100;

  return (
    <>
      {/* Welcome Modal */}
      <Dialog open={showWelcome} onOpenChange={setShowWelcome}>
        <DialogContent className="max-w-2xl">
          <DialogHeader className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <DialogTitle className="text-2xl font-bold">
                Welcome, {userProfile?.displayName || 'Advisor'}!
              </DialogTitle>
              <p className="text-lg text-muted-foreground">
                Your expert profile is the key to serving families better. Let's set you up.
              </p>
            </motion.div>
          </DialogHeader>
          
          <div className="space-y-4 mt-6">
            <div className="text-center text-muted-foreground">
              "Grow your practice, retain relationships, and serve clients at a higher standard. 
              No hard sell—just value, trust, and results."
            </div>
            
            <div className="flex justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white px-8 py-3"
                onClick={() => setShowWelcome(false)}
              >
                Let's Get Started
                <Sparkles className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Progress Bar */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Advisor Setup Progress</h3>
              <div className="flex items-center space-x-2">
                <Badge variant={progressPercentage === 100 ? "default" : "secondary"}>
                  {completedSteps} / {onboardingSteps.length}
                </Badge>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowPreview(true)}
                  className="text-xs"
                >
                  <Eye className="w-3 h-3 mr-1" />
                  Preview Profile
                </Button>
              </div>
            </div>
            
            <Progress value={progressPercentage} className="h-3" />
            
            <div className="grid grid-cols-4 gap-2 text-xs text-center">
              {onboardingSteps.map((step, index) => (
                <div key={step.id} className={`${step.completed ? 'text-green-600' : 'text-muted-foreground'}`}>
                  {step.completed ? <CheckCircle className="w-4 h-4 mx-auto" /> : step.icon}
                  <div className="mt-1">{step.title}</div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Onboarding Steps */}
      <div className="space-y-6">
        {onboardingSteps.map((step, index) => (
          <Card 
            key={step.id}
            className={`transition-all duration-300 ${
              step.completed ? 'border-green-500 bg-green-50' : ''
            } ${currentStep === index ? 'ring-2 ring-primary' : ''}`}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    step.completed ? 'bg-green-500 text-white' : 'bg-muted'
                  }`}>
                    {step.completed ? <CheckCircle className="w-6 h-6" /> : step.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
                {step.completed && (
                  <Badge className="bg-green-500">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Complete
                  </Badge>
                )}
              </div>
            </CardHeader>
            
            {(currentStep === index || step.completed) && (
              <CardContent>
                <AnimatePresence>
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {step.component}
                  </motion.div>
                </AnimatePresence>
              </CardContent>
            )}
            
            {!step.completed && currentStep !== index && (
              <CardContent className="pt-0">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentStep(index)}
                  className="w-full"
                >
                  Start This Step
                </Button>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Profile Preview Modal */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>How Families See Your Profile</DialogTitle>
          </DialogHeader>
          <ProfilePreview profile={advisorProfile} />
        </DialogContent>
      </Dialog>
    </>
  );
};

// Step Components
const ProfileSetupStep = ({ profile, onUpdate, onComplete }: any) => {
  const [localProfile, setLocalProfile] = useState(profile);

  const handleSave = async () => {
    // Save to database
    await supabase
      .from('advisor_profiles')
      .upsert(localProfile);
    
    onUpdate(localProfile);
    onComplete();
    toast.success('Profile updated successfully!');
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="text-center">
            <Avatar className="w-24 h-24 mx-auto mb-4">
              <AvatarImage src={localProfile.photo_url} />
              <AvatarFallback>
                <Camera className="w-8 h-8" />
              </AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Upload Photo
            </Button>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="bio">Professional Bio</Label>
            <Textarea
              id="bio"
              value={localProfile.bio || ''}
              onChange={(e) => setLocalProfile({...localProfile, bio: e.target.value})}
              placeholder="Tell families about your experience and approach..."
              rows={4}
            />
          </div>
          
          <div>
            <Label htmlFor="experience">Years of Experience</Label>
            <Input
              id="experience"
              type="number"
              value={localProfile.years_experience || ''}
              onChange={(e) => setLocalProfile({...localProfile, years_experience: parseInt(e.target.value)})}
            />
          </div>
        </div>
      </div>
      
      <Button onClick={handleSave} className="w-full">
        Save Profile
      </Button>
    </div>
  );
};

const CredentialsStep = ({ profile, onUpdate, onComplete }: any) => (
  <div className="space-y-4">
    <p className="text-sm text-muted-foreground">
      Add your certifications and licenses to build trust with families
    </p>
    <div className="grid md:grid-cols-2 gap-4">
      <div>
        <Label>Certifications</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {['CFP®', 'CFA', 'ChFC', 'CLU'].map(cert => (
            <Badge key={cert} variant="outline" className="cursor-pointer">
              {cert}
            </Badge>
          ))}
        </div>
      </div>
      <div>
        <Label>Specialties</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {['Retirement Planning', 'Estate Planning', 'Tax Strategy', 'Investment Management'].map(spec => (
            <Badge key={spec} variant="outline" className="cursor-pointer">
              {spec}
            </Badge>
          ))}
        </div>
      </div>
    </div>
    <Button onClick={onComplete} className="w-full">
      Complete Credentials
    </Button>
  </div>
);

const BookSetupStep = ({ profile, onUpdate, onComplete }: any) => (
  <div className="space-y-4">
    <div className="grid md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="firm">Firm Name</Label>
        <Input id="firm" placeholder="Your firm or practice name" />
      </div>
      <div>
        <Label htmlFor="states">Licensed States</Label>
        <Input id="states" placeholder="e.g., NY, CA, FL" />
      </div>
    </div>
    
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-center space-x-2 mb-2">
        <Shield className="w-5 h-5 text-blue-600" />
        <span className="font-medium text-blue-900">Fiduciary Commitment</span>
      </div>
      <p className="text-sm text-blue-700">
        Confirm your commitment to fiduciary principles: no commissions, transparent fees, client-first approach.
      </p>
      <Button size="sm" className="mt-2" onClick={onComplete}>
        I Commit to Fiduciary Standards
      </Button>
    </div>
  </div>
);

const ClientInviteStep = ({ onComplete }: any) => (
  <div className="space-y-6">
    <div className="text-center p-6 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg">
      <CreditCard className="w-12 h-12 text-primary mx-auto mb-4" />
      <h4 className="text-lg font-semibold mb-2">Ready to Invite Clients?</h4>
      <p className="text-muted-foreground mb-4">
        Seats let you invite your clients to premium access. You can buy in bulk or as you go.
      </p>
      <div className="grid md:grid-cols-2 gap-4">
        <Button className="h-16">
          <div className="text-center">
            <div className="font-medium">Buy Seat Package</div>
            <div className="text-xs opacity-80">Volume discounts available</div>
          </div>
        </Button>
        <Button variant="outline" className="h-16" onClick={onComplete}>
          <div className="text-center">
            <div className="font-medium">Skip for Now</div>
            <div className="text-xs opacity-80">Set up later</div>
          </div>
        </Button>
      </div>
    </div>
  </div>
);

const ProfilePreview = ({ profile }: any) => (
  <div className="space-y-4">
    <div className="text-center">
      <Avatar className="w-20 h-20 mx-auto mb-3">
        <AvatarImage src={profile.photo_url} />
        <AvatarFallback>
          <User className="w-8 h-8" />
        </AvatarFallback>
      </Avatar>
      <h3 className="font-semibold">{profile.name || 'Your Name'}</h3>
      <p className="text-sm text-muted-foreground">{profile.firm_name || 'Your Firm'}</p>
      {profile.fiduciary_compliant && (
        <Badge className="mt-2">
          <Shield className="w-3 h-3 mr-1" />
          Fiduciary Partner
        </Badge>
      )}
    </div>
    
    <div>
      <h4 className="font-medium mb-2">About</h4>
      <p className="text-sm text-muted-foreground">
        {profile.bio || 'Your professional bio will appear here...'}
      </p>
    </div>
    
    {profile.certifications?.length > 0 && (
      <div>
        <h4 className="font-medium mb-2">Certifications</h4>
        <div className="flex flex-wrap gap-1">
          {profile.certifications.map((cert: string) => (
            <Badge key={cert} variant="outline" className="text-xs">
              {cert}
            </Badge>
          ))}
        </div>
      </div>
    )}
  </div>
);