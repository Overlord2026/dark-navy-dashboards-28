import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Scale, 
  Upload, 
  Shield, 
  Users, 
  Mail,
  Camera,
  Award,
  Building2,
  Eye,
  UserPlus,
  CheckCircle,
  Sparkles,
  FileText,
  Calendar,
  Video,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

interface AttorneyOnboardingData {
  profile_completed: boolean;
  credentials_added: boolean;
  practice_setup_completed: boolean;
  clients_invited: boolean;
}

interface AttorneyProfile {
  firm_name?: string;
  bio?: string;
  specialties?: string[];
  bar_credentials?: string[];
  licensed_states?: string[];
  cle_tracking_enabled?: boolean;
  years_experience?: number;
}

export const AttorneyOnboardingFlow = () => {
  const { userProfile } = useUser();
  const [showWelcome, setShowWelcome] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [onboardingData, setOnboardingData] = useState<AttorneyOnboardingData>({
    profile_completed: false,
    credentials_added: false,
    practice_setup_completed: false,
    clients_invited: false
  });
  const [attorneyProfile, setAttorneyProfile] = useState<AttorneyProfile>({});

  useEffect(() => {
    checkOnboardingStatus();
  }, [userProfile]);

  const checkOnboardingStatus = async () => {
    if (!userProfile?.id) return;

    // Check if attorney profile exists
    const { data: attorneyData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userProfile.id)
      .single();

    // Show welcome if minimal profile data
    if (!attorneyData?.bio || attorneyData.role !== 'attorney') {
      setShowWelcome(true);
    }

    if (attorneyData) {
      setAttorneyProfile({
        bio: attorneyData.bio,
        firm_name: attorneyData.display_name || '',
        specialties: [],
        bar_credentials: [],
        years_experience: 0
      });
      
      setOnboardingData({
        profile_completed: !!(attorneyData.bio),
        credentials_added: false,
        practice_setup_completed: !!(attorneyData.display_name),
        clients_invited: false
      });
    }
  };

  const updateOnboardingProgress = async (stepKey: keyof AttorneyOnboardingData) => {
    const newData = { ...onboardingData, [stepKey]: true };
    setOnboardingData(newData);

    const allCompleted = Object.values(newData).every(Boolean);

    if (allCompleted) {
      await supabase
        .from('profiles')
        .update({ bio: attorneyProfile.bio })
        .eq('id', userProfile?.id);

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      toast.success("🎉 Your attorney profile is ready! Start inviting clients.");
    }
  };

  const onboardingSteps = [
    {
      id: 'profile',
      title: 'Practice Profile',
      description: 'Add specialty, credentials, and firm branding',
      icon: <Scale className="w-6 h-6" />,
      completed: onboardingData.profile_completed,
      component: <ProfileSetupStep 
        profile={attorneyProfile} 
        onUpdate={setAttorneyProfile}
        onComplete={() => updateOnboardingProgress('profile_completed')} 
      />
    },
    {
      id: 'credentials',
      title: 'Bar Credentials & CLE',
      description: 'Upload bar credentials and CLE certificates',
      icon: <Award className="w-6 h-6" />,
      completed: onboardingData.credentials_added,
      component: <CredentialsStep 
        profile={attorneyProfile}
        onUpdate={setAttorneyProfile}
        onComplete={() => updateOnboardingProgress('credentials_added')} 
      />
    },
    {
      id: 'practice',
      title: 'Document Vault & Compliance',
      description: 'Set up secure workflows and deadlines',
      icon: <FileText className="w-6 h-6" />,
      completed: onboardingData.practice_setup_completed,
      component: <PracticeSetupStep 
        profile={attorneyProfile}
        onUpdate={setAttorneyProfile}
        onComplete={() => updateOnboardingProgress('practice_setup_completed')} 
      />
    },
    {
      id: 'clients',
      title: 'Invite Families/Clients',
      description: 'Assign seats and give secure access',
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
                <Scale className="w-8 h-8 text-white" />
              </div>
              <DialogTitle className="text-2xl font-bold">
                Welcome, {userProfile?.displayName || 'Attorney'}!
              </DialogTitle>
              <p className="text-lg text-muted-foreground">
                BFO empowers your legal expertise with best-in-class estate, business, and compliance tools. Let's personalize your dashboard.
              </p>
            </motion.div>
          </DialogHeader>
          
          <div className="space-y-4 mt-6">
            <div className="text-center text-muted-foreground">
              "Deliver next-gen legal counsel for modern families—secure, collaborative, and trusted. 
              Every feature is built on our Fiduciary Duty Principles™."
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
              <h3 className="text-lg font-semibold">Attorney Setup Progress</h3>
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
          <ProfilePreview profile={attorneyProfile} />
        </DialogContent>
      </Dialog>
    </>
  );
};

// Step Components
const ProfileSetupStep = ({ profile, onUpdate, onComplete }: any) => {
  const [localProfile, setLocalProfile] = useState(profile);

  const handleSave = async () => {
    onUpdate(localProfile);
    onComplete();
    toast.success('Practice profile updated successfully!');
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
              <Camera className="w-8 h-8 text-muted-foreground" />
            </div>
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Upload Logo
            </Button>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="firm">Firm Name</Label>
            <Input
              id="firm"
              value={localProfile.firm_name || ''}
              onChange={(e) => setLocalProfile({...localProfile, firm_name: e.target.value})}
              placeholder="Your law firm or practice name"
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
      
      <div>
        <Label htmlFor="bio">Legal Practice Overview</Label>
        <Textarea
          id="bio"
          value={localProfile.bio || ''}
          onChange={(e) => setLocalProfile({...localProfile, bio: e.target.value})}
          placeholder="Describe your practice areas and approach to serving families..."
          rows={4}
        />
      </div>
      
      <Button onClick={handleSave} className="w-full">
        Save Practice Profile
      </Button>
    </div>
  );
};

const CredentialsStep = ({ profile, onUpdate, onComplete }: any) => (
  <div className="space-y-6">
    <p className="text-sm text-muted-foreground">
      Add your bar credentials and track CLE requirements
    </p>
    
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <Label>Legal Specialties</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {['Estate Planning', 'Business Law', 'Family Law', 'Litigation', 'Tax Law'].map(spec => (
            <Badge key={spec} variant="outline" className="cursor-pointer">
              {spec}
            </Badge>
          ))}
        </div>
      </div>
      
      <div>
        <Label>Licensed States</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {['NY', 'CA', 'FL', 'TX', 'IL'].map(state => (
            <Badge key={state} variant="outline" className="cursor-pointer">
              {state}
            </Badge>
          ))}
        </div>
      </div>
    </div>
    
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          <span className="font-medium text-blue-900">CLE Tracking</span>
        </div>
        <Button size="sm" variant="outline">
          <Upload className="w-4 h-4 mr-2" />
          Upload Certificates
        </Button>
      </div>
      <p className="text-sm text-blue-700 mb-3">
        Automated CLE deadline tracking and compliance reporting for all your licensed states.
      </p>
      <div className="text-xs text-blue-600">
        Next deadline: 30 CLE hours due Dec 31, 2024 (NY)
      </div>
    </div>
    
    <Button onClick={onComplete} className="w-full">
      Complete Credentials Setup
    </Button>
  </div>
);

const PracticeSetupStep = ({ profile, onUpdate, onComplete }: any) => (
  <div className="space-y-6">
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="p-4">
        <div className="flex items-center space-x-3 mb-3">
          <FileText className="w-6 h-6 text-primary" />
          <div>
            <h4 className="font-medium">Document Vault</h4>
            <p className="text-xs text-muted-foreground">Secure storage & e-sign workflows</p>
          </div>
        </div>
        <Button size="sm" className="w-full">Configure Vault</Button>
      </Card>
      
      <Card className="p-4">
        <div className="flex items-center space-x-3 mb-3">
          <Video className="w-6 h-6 text-primary" />
          <div>
            <h4 className="font-medium">Video Consultations</h4>
            <p className="text-xs text-muted-foreground">Secure client meetings</p>
          </div>
        </div>
        <Button size="sm" variant="outline" className="w-full">Link Zoom/Google</Button>
      </Card>
    </div>
    
    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
      <div className="flex items-center space-x-2 mb-2">
        <Calendar className="w-5 h-5 text-amber-600" />
        <span className="font-medium text-amber-900">Deadline Management</span>
      </div>
      <p className="text-sm text-amber-700 mb-3">
        Automated reminders for probate deadlines, trust funding, and compliance filings.
      </p>
      <div className="grid grid-cols-2 gap-2">
        <Button size="sm" variant="outline">Setup Calendar Sync</Button>
        <Button size="sm" variant="outline">Configure Alerts</Button>
      </div>
    </div>
    
    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
      <div className="flex items-center space-x-2 mb-2">
        <Shield className="w-5 h-5 text-green-600" />
        <span className="font-medium text-green-900">Fiduciary Legal Partner</span>
      </div>
      <p className="text-sm text-green-700">
        Confirm your commitment to our Fiduciary Duty Principles™: transparent fees, client-first approach, collaborative practice.
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
      <Users className="w-12 h-12 text-primary mx-auto mb-4" />
      <h4 className="text-lg font-semibold mb-2">Ready to Invite Families?</h4>
      <p className="text-muted-foreground mb-4">
        Give your clients secure access to legal docs, vault storage, and collaborative tools.
      </p>
      
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div className="p-4 border rounded-lg text-left">
          <h5 className="font-medium mb-2">Family/Client Invitation</h5>
          <p className="text-sm text-muted-foreground mb-3">
            Secure access to documents, chat, and collaboration tools
          </p>
          <Button className="w-full">
            <Mail className="w-4 h-4 mr-2" />
            Invite Client
          </Button>
        </div>
        
        <div className="p-4 border rounded-lg text-left">
          <h5 className="font-medium mb-2">Marketplace Referrals</h5>
          <p className="text-sm text-muted-foreground mb-3">
            Connect clients with trusted accountants, advisors, etc.
          </p>
          <Button variant="outline" className="w-full">
            <Globe className="w-4 h-4 mr-2" />
            Explore Partners
          </Button>
        </div>
      </div>
      
      <Button variant="outline" onClick={onComplete} className="w-full">
        Skip for Now - Set Up Later
      </Button>
    </div>
  </div>
);

const ProfilePreview = ({ profile }: any) => (
  <div className="space-y-4">
    <div className="text-center">
      <div className="w-20 h-20 mx-auto mb-3 bg-muted rounded-full flex items-center justify-center">
        <Scale className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="font-semibold">{profile.name || 'Attorney Name'}</h3>
      <p className="text-sm text-muted-foreground">{profile.firm_name || 'Your Law Firm'}</p>
      <Badge className="mt-2">
        <Shield className="w-3 h-3 mr-1" />
        Fiduciary Legal Partner
      </Badge>
    </div>
    
    <div>
      <h4 className="font-medium mb-2">Practice Overview</h4>
      <p className="text-sm text-muted-foreground">
        {profile.bio || 'Your legal practice overview will appear here...'}
      </p>
    </div>
    
    {profile.specialties?.length > 0 && (
      <div>
        <h4 className="font-medium mb-2">Specialties</h4>
        <div className="flex flex-wrap gap-1">
          {profile.specialties.map((spec: string) => (
            <Badge key={spec} variant="outline" className="text-xs">
              {spec}
            </Badge>
          ))}
        </div>
      </div>
    )}
  </div>
);