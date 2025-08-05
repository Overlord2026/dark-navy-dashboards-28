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
  TrendingUp, 
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
  BookOpen,
  Calendar,
  Globe,
  CreditCard,
  Video,
  Presentation,
  Star,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';

interface ConsultantOnboardingData {
  profile_completed: boolean;
  credentials_added: boolean;
  program_library_setup: boolean;
  partners_invited: boolean;
}

interface ConsultantProfile {
  firm_name?: string;
  bio?: string;
  coaching_focus?: string[];
  certifications?: string[];
  published_work?: string[];
  hourly_rate?: number;
  group_sessions?: boolean;
  one_on_one?: boolean;
  years_experience?: number;
}

export const ConsultantOnboardingFlow = () => {
  const { userProfile } = useUser();
  const [showWelcome, setShowWelcome] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [onboardingData, setOnboardingData] = useState<ConsultantOnboardingData>({
    profile_completed: false,
    credentials_added: false,
    program_library_setup: false,
    partners_invited: false
  });
  const [consultantProfile, setConsultantProfile] = useState<ConsultantProfile>({});

  useEffect(() => {
    checkOnboardingStatus();
  }, [userProfile]);

  const checkOnboardingStatus = async () => {
    if (!userProfile?.id) return;

    // Check if consultant profile exists
    const { data: consultantData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userProfile.id)
      .single();

    // Show welcome if minimal profile data
    if (!consultantData?.bio || consultantData.role !== 'consultant') {
      setShowWelcome(true);
    }

    if (consultantData) {
      setConsultantProfile({
        bio: consultantData.bio,
        firm_name: consultantData.display_name || '',
        coaching_focus: [],
        certifications: [],
        published_work: [],
        years_experience: 0
      });
      
      setOnboardingData({
        profile_completed: !!(consultantData.bio),
        credentials_added: false,
        program_library_setup: false,
        partners_invited: false
      });
    }
  };

  const updateOnboardingProgress = async (stepKey: keyof ConsultantOnboardingData) => {
    const newData = { ...onboardingData, [stepKey]: true };
    setOnboardingData(newData);

    const allCompleted = Object.values(newData).every(Boolean);

    if (allCompleted) {
      await supabase
        .from('profiles')
        .update({ bio: consultantProfile.bio })
        .eq('id', userProfile?.id);

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      toast({
        title: "🎉 Your consultant profile is ready!",
        description: "Start building your impact in the BFO ecosystem."
      });
    }
  };

  const onboardingSteps = [
    {
      id: 'profile',
      title: 'Profile & Expertise',
      description: 'Define your coaching focus and set availability',
      icon: <TrendingUp className="w-6 h-6" />,
      completed: onboardingData.profile_completed,
      component: <ProfileSetupStep 
        profile={consultantProfile} 
        onUpdate={setConsultantProfile}
        onComplete={() => updateOnboardingProgress('profile_completed')} 
      />
    },
    {
      id: 'credentials',
      title: 'Credentials & Published Work',
      description: 'Add certifications and showcase expertise',
      icon: <Award className="w-6 h-6" />,
      completed: onboardingData.credentials_added,
      component: <CredentialsStep 
        profile={consultantProfile}
        onUpdate={setConsultantProfile}
        onComplete={() => updateOnboardingProgress('credentials_added')} 
      />
    },
    {
      id: 'library',
      title: 'Program Library',
      description: 'Upload content and define offerings',
      icon: <BookOpen className="w-6 h-6" />,
      completed: onboardingData.program_library_setup,
      component: <ProgramLibraryStep 
        profile={consultantProfile}
        onUpdate={setConsultantProfile}
        onComplete={() => updateOnboardingProgress('program_library_setup')} 
      />
    },
    {
      id: 'partners',
      title: 'Invite Partners',
      description: 'Connect with advisors and firms',
      icon: <UserPlus className="w-6 h-6" />,
      completed: onboardingData.partners_invited,
      component: <PartnersInviteStep onComplete={() => updateOnboardingProgress('partners_invited')} />
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
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <DialogTitle className="text-2xl font-bold">
                Welcome, {userProfile?.displayName || 'Coach'}!
              </DialogTitle>
              <p className="text-lg text-muted-foreground">
                Become an impact multiplier: support advisors and families through the BFO Marketplace.
              </p>
            </motion.div>
          </DialogHeader>
          
          <div className="space-y-4 mt-6">
            <div className="text-center text-muted-foreground">
              "Expand your reach, drive results—partner with BFO's advisor and family ecosystem, 
              all while owning your brand."
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
              <h3 className="text-lg font-semibold">Consultant Setup Progress</h3>
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
            <DialogTitle>How Advisors See Your Profile</DialogTitle>
          </DialogHeader>
          <ProfilePreview profile={consultantProfile} />
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
    toast({
      title: "Consultant profile updated successfully!",
      description: "Your expertise and availability have been saved."
    });
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
              Upload Photo
            </Button>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="firm">Practice/Firm Name</Label>
            <Input
              id="firm"
              value={localProfile.firm_name || ''}
              onChange={(e) => setLocalProfile({...localProfile, firm_name: e.target.value})}
              placeholder="Your consulting practice name"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="experience">Years Experience</Label>
              <Input
                id="experience"
                type="number"
                value={localProfile.years_experience || ''}
                onChange={(e) => setLocalProfile({...localProfile, years_experience: parseInt(e.target.value)})}
              />
            </div>
            <div>
              <Label htmlFor="rate">Hourly Rate ($)</Label>
              <Input
                id="rate"
                type="number"
                value={localProfile.hourly_rate || ''}
                onChange={(e) => setLocalProfile({...localProfile, hourly_rate: parseInt(e.target.value)})}
              />
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <Label htmlFor="bio">Coaching Philosophy & Approach</Label>
        <Textarea
          id="bio"
          value={localProfile.bio || ''}
          onChange={(e) => setLocalProfile({...localProfile, bio: e.target.value})}
          placeholder="Describe your coaching methodology and how you help advisors and firms grow..."
          rows={4}
        />
      </div>

      <div>
        <Label>Coaching Focus Areas</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {['Practice Management', 'Sales & Marketing', 'Succession Planning', 'Business Owner Coaching', 'Team Development'].map(focus => (
            <Badge key={focus} variant="outline" className="cursor-pointer">
              {focus}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 border rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Users className="w-5 h-5 text-primary" />
            <span className="font-medium">Group Sessions</span>
          </div>
          <p className="text-sm text-muted-foreground mb-3">Workshops, masterclasses, group coaching</p>
          <Button size="sm" variant="outline" className="w-full">Configure Availability</Button>
        </div>
        
        <div className="p-4 border rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <UserPlus className="w-5 h-5 text-primary" />
            <span className="font-medium">1:1 Coaching</span>
          </div>
          <p className="text-sm text-muted-foreground mb-3">Individual advisor and firm coaching</p>
          <Button size="sm" variant="outline" className="w-full">Set Schedule</Button>
        </div>
      </div>
      
      <Button onClick={handleSave} className="w-full">
        Save Profile & Expertise
      </Button>
    </div>
  );
};

const CredentialsStep = ({ profile, onUpdate, onComplete }: any) => (
  <div className="space-y-6">
    <p className="text-sm text-muted-foreground">
      Showcase your credentials and published work to build credibility with advisors
    </p>
    
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <Label>Certifications & Credentials</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {['CFP®', 'CPA', 'ChFC', 'CLU', 'CIMA', 'PMP', 'ICF Certified Coach'].map(cert => (
            <Badge key={cert} variant="outline" className="cursor-pointer">
              {cert}
            </Badge>
          ))}
        </div>
        <Button variant="outline" size="sm" className="mt-3">
          <Upload className="w-4 h-4 mr-2" />
          Upload Certificates
        </Button>
      </div>
      
      <div>
        <Label>Industry Recognition</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {['Author', 'Speaker', 'Podcast Host', 'Industry Award Winner'].map(recognition => (
            <Badge key={recognition} variant="outline" className="cursor-pointer">
              {recognition}
            </Badge>
          ))}
        </div>
      </div>
    </div>
    
    <div>
      <Label>Published Work & Speaking</Label>
      <div className="space-y-3 mt-2">
        <Input placeholder="Book, article, or research publication" />
        <Input placeholder="Conference or event speaking engagement" />
        <Input placeholder="Podcast appearances or hosting" />
        <Button variant="outline" size="sm">
          <Upload className="w-4 h-4 mr-2" />
          Add Links & Media
        </Button>
      </div>
    </div>
    
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-center space-x-2 mb-2">
        <Star className="w-5 h-5 text-blue-600" />
        <span className="font-medium text-blue-900">BFO Certified Consultant</span>
      </div>
      <p className="text-sm text-blue-700 mb-3">
        Complete our certification program to earn the BFO Certified badge and priority placement.
      </p>
      <Button size="sm" variant="outline">Learn About Certification</Button>
    </div>
    
    <Button onClick={onComplete} className="w-full">
      Complete Credentials Setup
    </Button>
  </div>
);

const ProgramLibraryStep = ({ profile, onUpdate, onComplete }: any) => (
  <div className="space-y-6">
    <div className="text-center p-6 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg">
      <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
      <h4 className="text-lg font-semibold mb-2">Build Your Program Library</h4>
      <p className="text-muted-foreground mb-4">
        Upload content that advisors can discover and book through the marketplace.
      </p>
    </div>

    <div className="grid md:grid-cols-2 gap-6">
      <Card className="p-4">
        <div className="flex items-center space-x-3 mb-3">
          <Presentation className="w-6 h-6 text-primary" />
          <div>
            <h4 className="font-medium">Presentations & Workshops</h4>
            <p className="text-xs text-muted-foreground">Group training content</p>
          </div>
        </div>
        <Button size="sm" className="w-full">
          <Upload className="w-4 h-4 mr-2" />
          Upload Materials
        </Button>
      </Card>
      
      <Card className="p-4">
        <div className="flex items-center space-x-3 mb-3">
          <Video className="w-6 h-6 text-primary" />
          <div>
            <h4 className="font-medium">Video Content</h4>
            <p className="text-xs text-muted-foreground">Recorded sessions & demos</p>
          </div>
        </div>
        <Button size="sm" variant="outline" className="w-full">
          <Upload className="w-4 h-4 mr-2" />
          Add Videos
        </Button>
      </Card>
    </div>

    <div className="space-y-4">
      <div>
        <Label>Program Tags (for discoverability)</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {['New Advisors', 'Practice Management', 'Sales Training', 'Leadership', 'Technology', 'Client Experience'].map(tag => (
            <Badge key={tag} variant="outline" className="cursor-pointer">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-lg font-medium mb-2">Drag & drop program materials</p>
        <p className="text-sm text-muted-foreground mb-4">
          PDFs, PowerPoints, videos, guides, templates
        </p>
        <Button>Choose Files</Button>
      </div>
    </div>
    
    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
      <div className="flex items-center space-x-2 mb-2">
        <Shield className="w-5 h-5 text-green-600" />
        <span className="font-medium text-green-900">White-Label Options</span>
      </div>
      <p className="text-sm text-green-700 mb-3">
        Customize programs with your branding while maintaining BFO partnership benefits.
      </p>
      <Button size="sm" className="mt-2" onClick={onComplete}>
        Enable Program Library
      </Button>
    </div>
  </div>
);

const PartnersInviteStep = ({ onComplete }: any) => {
  const [inviteForm, setInviteForm] = useState({ name: '', email: '', firm: '', note: '' });

  return (
    <div className="space-y-6">
      <div className="text-center p-6 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg">
        <Users className="w-12 h-12 text-primary mx-auto mb-4" />
        <h4 className="text-lg font-semibold mb-2">Invite Your Network</h4>
        <p className="text-muted-foreground mb-4">
          Connect with advisors and firms to start building your coaching relationships.
        </p>
        
        {/* Seat Purchase Options */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 border rounded-lg text-left">
            <h5 className="font-medium mb-2">Starter</h5>
            <div className="text-2xl font-bold text-primary mb-1">$49/mo</div>
            <p className="text-xs text-muted-foreground mb-3">5 advisor connections</p>
            <Button size="sm" className="w-full">Start Here</Button>
          </div>
          
          <div className="p-4 border-2 border-primary rounded-lg text-left relative">
            <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2">Popular</Badge>
            <h5 className="font-medium mb-2">Professional</h5>
            <div className="text-2xl font-bold text-primary mb-1">$149/mo</div>
            <p className="text-xs text-muted-foreground mb-3">20 connections + analytics</p>
            <Button size="sm" className="w-full">Choose Plan</Button>
          </div>
          
          <div className="p-4 border rounded-lg text-left">
            <h5 className="font-medium mb-2">Enterprise</h5>
            <div className="text-2xl font-bold text-primary mb-1">Custom</div>
            <p className="text-xs text-muted-foreground mb-3">Unlimited + white-label</p>
            <Button size="sm" variant="outline" className="w-full">Contact Sales</Button>
          </div>
        </div>

        {/* Partner Invitation Form */}
        <div className="p-4 bg-white border rounded-lg text-left mb-4">
          <h5 className="font-medium mb-3">Invite an Advisor or Firm</h5>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <Input 
              placeholder="Contact Name"
              value={inviteForm.name}
              onChange={(e) => setInviteForm({...inviteForm, name: e.target.value})}
            />
            <Input 
              placeholder="Email Address"
              type="email"
              value={inviteForm.email}
              onChange={(e) => setInviteForm({...inviteForm, email: e.target.value})}
            />
          </div>
          <Input 
            placeholder="Firm Name (optional)"
            value={inviteForm.firm}
            onChange={(e) => setInviteForm({...inviteForm, firm: e.target.value})}
            className="mb-3"
          />
          <Textarea 
            placeholder="Personal note about how you can help their practice..."
            rows={2}
            value={inviteForm.note}
            onChange={(e) => setInviteForm({...inviteForm, note: e.target.value})}
            className="mb-3"
          />
          <Button className="w-full">
            <Mail className="w-4 h-4 mr-2" />
            Send Invitation
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="p-4 border rounded-lg text-left">
            <h5 className="font-medium mb-2">Marketplace Roundtables</h5>
            <p className="text-sm text-muted-foreground mb-3">
              Join monthly discussions with other consultants
            </p>
            <Button variant="outline" className="w-full">
              <Calendar className="w-4 h-4 mr-2" />
              View Schedule
            </Button>
          </div>
          
          <div className="p-4 border rounded-lg text-left">
            <h5 className="font-medium mb-2">Offer a Program</h5>
            <p className="text-sm text-muted-foreground mb-3">
              List your services in the marketplace
            </p>
            <Button variant="outline" className="w-full">
              <Globe className="w-4 h-4 mr-2" />
              Create Listing
            </Button>
          </div>
        </div>
        
        <Button variant="outline" onClick={onComplete} className="w-full">
          Skip for Now - Set Up Later
        </Button>
      </div>
    </div>
  );
};

const ProfilePreview = ({ profile }: any) => (
  <div className="space-y-4">
    <div className="text-center">
      <div className="w-20 h-20 mx-auto mb-3 bg-muted rounded-full flex items-center justify-center">
        <TrendingUp className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="font-semibold">{profile.firm_name || 'Your Practice Name'}</h3>
      <p className="text-sm text-muted-foreground">Business Coach • Consultant</p>
      <div className="flex justify-center space-x-2 mt-2">
        <Badge className="mt-2">
          <Shield className="w-3 h-3 mr-1" />
          BFO Certified Consultant
        </Badge>
        <Badge variant="outline">
          ${profile.hourly_rate || 200}/hr
        </Badge>
      </div>
    </div>
    
    <div>
      <h4 className="font-medium mb-2">Coaching Approach</h4>
      <p className="text-sm text-muted-foreground">
        {profile.bio || 'Your coaching methodology and approach will appear here...'}
      </p>
    </div>
    
    {profile.coaching_focus?.length > 0 && (
      <div>
        <h4 className="font-medium mb-2">Focus Areas</h4>
        <div className="flex flex-wrap gap-1">
          {profile.coaching_focus.map((focus: string) => (
            <Badge key={focus} variant="outline" className="text-xs">
              {focus}
            </Badge>
          ))}
        </div>
      </div>
    )}
  </div>
);