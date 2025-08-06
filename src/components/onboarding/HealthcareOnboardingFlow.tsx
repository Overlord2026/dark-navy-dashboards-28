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
  Stethoscope, 
  Heart,
  Users, 
  Mail,
  Upload,
  Award,
  FileText,
  Calendar,
  Globe,
  CreditCard,
  Shield,
  CheckCircle,
  Sparkles,
  UserPlus,
  Brain,
  Activity,
  Clipboard,
  VideoIcon,
  Phone,
  MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';

interface HealthcareOnboardingData {
  profile_completed: boolean;
  credentials_added: boolean;
  availability_setup: boolean;
  patients_invited: boolean;
}

interface HealthcareProfile {
  title?: string;
  name?: string;
  specialties?: string[];
  credentials?: string[];
  licenses?: string[];
  bio?: string;
  years_experience?: number;
  practice_type?: string;
  consultation_types?: string[];
  telehealth_enabled?: boolean;
  in_person_enabled?: boolean;
  group_sessions_enabled?: boolean;
  hourly_rate?: number;
  website?: string;
  phone?: string;
  email?: string;
  address?: string;
}

export const HealthcareOnboardingFlow = () => {
  const { userProfile } = useUser();
  const [currentStep, setCurrentStep] = useState(1);
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [onboardingData, setOnboardingData] = useState<HealthcareOnboardingData>({
    profile_completed: false,
    credentials_added: false,
    availability_setup: false,
    patients_invited: false
  });
  const [profile, setProfile] = useState<HealthcareProfile>({});
  const [seatPackage, setSeatPackage] = useState({ type: 'professional', count: 10 });
  const [invitations, setInvitations] = useState<Array<{name: string, email: string, note: string, relationship: string}>>([]);

  const steps = [
    { id: 1, title: "Professional Profile", icon: Stethoscope, completed: onboardingData.profile_completed },
    { id: 2, title: "Credentials", icon: Award, completed: onboardingData.credentials_added },
    { id: 3, title: "Availability", icon: Calendar, completed: onboardingData.availability_setup },
    { id: 4, title: "Invite Patients/Families", icon: UserPlus, completed: onboardingData.patients_invited }
  ];

  const getProgress = () => {
    const completedSteps = Object.values(onboardingData).filter(Boolean).length;
    return (completedSteps / 4) * 100;
  };

  const handleStepComplete = async (stepKey: keyof HealthcareOnboardingData) => {
    setOnboardingData(prev => ({ ...prev, [stepKey]: true }));
    
    if (stepKey === 'patients_invited') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      toast({ title: "🎉 Onboarding Complete!", description: "Welcome to the Family Office Health Network!" });
    }
  };

  const WelcomeModal = () => (
    <Dialog open={showWelcomeModal} onOpenChange={setShowWelcomeModal}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            Welcome, {userProfile?.displayName || 'Healthcare Professional'}!
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-lg text-muted-foreground">
            Join the Family Office Health Network—collaborate with leading families and professionals.
          </p>
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 rounded-lg border border-primary/20">
            <h4 className="font-semibold text-primary mb-2">What you'll accomplish:</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                Set up your professional healthcare profile
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                Upload credentials and certifications
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                Configure availability and consultation types
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                Invite patients and families to your network
              </li>
            </ul>
          </div>
          <div className="bg-secondary/20 p-4 rounded-lg">
            <p className="text-sm font-medium text-primary mb-1">Our Mission:</p>
            <p className="text-sm text-muted-foreground italic">
              "Empower families to live healthier, longer—your expertise meets our holistic platform."
            </p>
          </div>
          <Button onClick={() => setShowWelcomeModal(false)} className="w-full" size="lg">
            Begin Setup
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  const ProfessionalProfileStep = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Stethoscope className="h-5 w-5" />
          Professional Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Professional Title</Label>
            <select 
              className="w-full p-2 border rounded-md"
              value={profile.title || ''}
              onChange={(e) => setProfile(prev => ({ ...prev, title: e.target.value }))}
            >
              <option value="">Select title</option>
              <option value="Dr.">Dr. (MD/DO)</option>
              <option value="Dr.">Dr. (PhD)</option>
              <option value="NP">Nurse Practitioner</option>
              <option value="PA">Physician Assistant</option>
              <option value="RN">Registered Nurse</option>
              <option value="LCSW">Licensed Clinical Social Worker</option>
              <option value="LPC">Licensed Professional Counselor</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input 
              id="name"
              value={profile.name || ''} 
              onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Dr. Sarah Johnson"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Medical Specialties</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {[
              'Geriatrics', 'Longevity Medicine', 'Internal Medicine', 'Family Medicine',
              'Cardiology', 'Endocrinology', 'Neurology', 'Psychiatry', 'Mental Health',
              'Nutrition', 'Functional Medicine', 'Preventive Medicine', 'Pain Management'
            ].map((specialty) => (
              <label key={specialty} className="flex items-center gap-2">
                <input 
                  type="checkbox"
                  checked={profile.specialties?.includes(specialty) || false}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setProfile(prev => ({ 
                        ...prev, 
                        specialties: [...(prev.specialties || []), specialty] 
                      }));
                    } else {
                      setProfile(prev => ({ 
                        ...prev, 
                        specialties: prev.specialties?.filter(s => s !== specialty) || []
                      }));
                    }
                  }}
                  className="rounded" 
                />
                <span className="text-sm">{specialty}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Professional Bio</Label>
          <Textarea 
            id="bio"
            value={profile.bio || ''} 
            onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
            placeholder="Describe your approach to healthcare, experience, and how you serve families..."
            rows={4}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Years of Experience</Label>
            <Input 
              type="number"
              value={profile.years_experience || ''} 
              onChange={(e) => setProfile(prev => ({ ...prev, years_experience: parseInt(e.target.value) }))}
              placeholder="10"
            />
          </div>
          <div className="space-y-2">
            <Label>Practice Type</Label>
            <select 
              className="w-full p-2 border rounded-md"
              value={profile.practice_type || ''}
              onChange={(e) => setProfile(prev => ({ ...prev, practice_type: e.target.value }))}
            >
              <option value="">Select type</option>
              <option value="private_practice">Private Practice</option>
              <option value="hospital_system">Hospital System</option>
              <option value="concierge">Concierge Medicine</option>
              <option value="telehealth">Telehealth Only</option>
              <option value="consultant">Healthcare Consultant</option>
              <option value="medical_director">Medical Director</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input 
              type="tel"
              value={profile.phone || ''} 
              onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="(555) 123-4567"
            />
          </div>
          <div className="space-y-2">
            <Label>Professional Email</Label>
            <Input 
              type="email"
              value={profile.email || ''} 
              onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
              placeholder="doctor@practice.com"
            />
          </div>
        </div>

        <Button 
          onClick={() => {
            handleStepComplete('profile_completed');
            setCurrentStep(2);
          }}
          className="w-full"
          disabled={!profile.name || !profile.title}
        >
          Complete Profile Setup
        </Button>
      </CardContent>
    </Card>
  );

  const CredentialsStep = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          Credentials & Certifications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4 p-4 bg-secondary/20 rounded-lg">
          <h4 className="font-semibold flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Professional Credentials
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              'MD (Doctor of Medicine)', 'DO (Doctor of Osteopathic Medicine)', 
              'PhD', 'NP (Nurse Practitioner)', 'PA (Physician Assistant)',
              'RN (Registered Nurse)', 'LCSW', 'LPC', 'Board Certified'
            ].map((credential) => (
              <label key={credential} className="flex items-center gap-2">
                <input 
                  type="checkbox"
                  checked={profile.credentials?.includes(credential) || false}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setProfile(prev => ({ 
                        ...prev, 
                        credentials: [...(prev.credentials || []), credential] 
                      }));
                    } else {
                      setProfile(prev => ({ 
                        ...prev, 
                        credentials: prev.credentials?.filter(c => c !== credential) || []
                      }));
                    }
                  }}
                  className="rounded" 
                />
                <span className="text-sm">{credential}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold">Licenses & State Authorizations</h4>
          <div className="space-y-3">
            <Input 
              placeholder="Enter state licenses (e.g., CA Medical License #12345)"
              value={profile.licenses?.join(', ') || ''} 
              onChange={(e) => setProfile(prev => ({ ...prev, licenses: e.target.value.split(', ').filter(Boolean) }))}
            />
            <p className="text-xs text-muted-foreground">
              Enter all state medical licenses, nursing licenses, or professional certifications
            </p>
          </div>
        </div>

        <div className="space-y-4 p-4 border rounded-lg">
          <h4 className="font-semibold">Document Upload</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="h-24 flex-col gap-2">
              <Upload className="h-6 w-6" />
              <span className="text-sm">Upload Diploma</span>
            </Button>
            <Button variant="outline" className="h-24 flex-col gap-2">
              <Upload className="h-6 w-6" />
              <span className="text-sm">Upload Licenses</span>
            </Button>
            <Button variant="outline" className="h-24 flex-col gap-2">
              <Upload className="h-6 w-6" />
              <span className="text-sm">Board Certifications</span>
            </Button>
            <Button variant="outline" className="h-24 flex-col gap-2">
              <Upload className="h-6 w-6" />
              <span className="text-sm">CV/Resume</span>
            </Button>
          </div>
        </div>

        <Button 
          onClick={() => {
            handleStepComplete('credentials_added');
            setCurrentStep(3);
          }}
          className="w-full"
        >
          Save Credentials
        </Button>
      </CardContent>
    </Card>
  );

  const AvailabilityStep = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Availability & Practice Setup
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Consultation Types */}
        <div className="space-y-4">
          <h4 className="font-semibold">Consultation Types Offered</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { type: 'telehealth', label: 'Telehealth', icon: VideoIcon, desc: 'Video consultations' },
              { type: 'in_person', label: 'In-Person', icon: MapPin, desc: 'Office visits' },
              { type: 'phone', label: 'Phone', icon: Phone, desc: 'Phone consultations' }
            ].map((consult) => (
              <Card 
                key={consult.type}
                className={`cursor-pointer transition-all p-4 ${
                  profile.consultation_types?.includes(consult.type) 
                    ? 'ring-2 ring-primary bg-primary/5' 
                    : 'hover:bg-secondary/20'
                }`}
                onClick={() => {
                  const types = profile.consultation_types || [];
                  if (types.includes(consult.type)) {
                    setProfile(prev => ({ 
                      ...prev, 
                      consultation_types: types.filter(t => t !== consult.type) 
                    }));
                  } else {
                    setProfile(prev => ({ 
                      ...prev, 
                      consultation_types: [...types, consult.type] 
                    }));
                  }
                }}
              >
                <div className="flex items-center gap-3">
                  <consult.icon className="h-6 w-6 text-primary" />
                  <div>
                    <h5 className="font-semibold">{consult.label}</h5>
                    <p className="text-xs text-muted-foreground">{consult.desc}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Seat Package Selection */}
        <div className="space-y-4">
          <h4 className="font-semibold">Patient/Family Seat Packages</h4>
          <p className="text-sm text-muted-foreground">
            Choose a package to provide your patients and their families with access to health tracking, 
            secure messaging, and family health coordination tools.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { 
                type: 'starter', 
                name: 'Starter Package', 
                seats: 5, 
                price: 150, 
                features: ['Basic health vault', 'Secure messaging', 'Appointment scheduling', 'Family coordination'] 
              },
              { 
                type: 'professional', 
                name: 'Professional Package', 
                seats: 15, 
                price: 375, 
                features: ['Advanced health analytics', 'Care team access', 'Family health dashboard', 'Telehealth integration', 'HIPAA compliance'] 
              },
              { 
                type: 'enterprise', 
                name: 'Enterprise Package', 
                seats: 50, 
                price: 950, 
                features: ['Custom health programs', 'Multi-provider coordination', 'Advanced reporting', 'API integrations', 'White-label options'] 
              }
            ].map((pkg) => (
              <Card 
                key={pkg.type} 
                className={`cursor-pointer transition-all ${seatPackage.type === pkg.type ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-secondary/20'}`}
                onClick={() => setSeatPackage({ type: pkg.type, count: pkg.seats })}
              >
                <CardContent className="p-4">
                  <h4 className="font-semibold">{pkg.name}</h4>
                  <div className="text-2xl font-bold text-primary my-2">${pkg.price}/mo</div>
                  <div className="text-sm text-muted-foreground mb-3">{pkg.seats} patient/family seats</div>
                  <ul className="text-xs space-y-1">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Rates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Consultation Rate (per hour)</Label>
            <Input 
              type="number"
              value={profile.hourly_rate || ''} 
              onChange={(e) => setProfile(prev => ({ ...prev, hourly_rate: parseInt(e.target.value) }))}
              placeholder="250"
            />
          </div>
          <div className="space-y-2">
            <Label>Practice Address (if applicable)</Label>
            <Input 
              value={profile.address || ''} 
              onChange={(e) => setProfile(prev => ({ ...prev, address: e.target.value }))}
              placeholder="123 Medical Center Dr, City, State"
            />
          </div>
        </div>

        <Button 
          onClick={() => {
            handleStepComplete('availability_setup');
            setCurrentStep(4);
          }}
          className="w-full"
        >
          Configure Availability
        </Button>
      </CardContent>
    </Card>
  );

  const PatientInvitationStep = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Invite Patients & Families
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 rounded-lg border border-primary/20">
          <h4 className="font-semibold text-primary mb-2">Expand Your Care Network</h4>
          <p className="text-sm text-muted-foreground">
            Invite patients and their families to join your health network. They'll get access to 
            secure health records, family coordination tools, and direct communication with your practice.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Patient & Family Invitations</h4>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setInvitations([...invitations, { name: '', email: '', note: '', relationship: 'patient' }])}
            >
              <Mail className="h-4 w-4 mr-2" />
              Add Invitation
            </Button>
          </div>
          
          {invitations.map((invitation, index) => (
            <Card key={index} className="p-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input 
                    placeholder="Patient/family member name"
                    value={invitation.name}
                    onChange={(e) => {
                      const newInvitations = [...invitations];
                      newInvitations[index].name = e.target.value;
                      setInvitations(newInvitations);
                    }}
                  />
                  <Input 
                    type="email"
                    placeholder="email@address.com"
                    value={invitation.email}
                    onChange={(e) => {
                      const newInvitations = [...invitations];
                      newInvitations[index].email = e.target.value;
                      setInvitations(newInvitations);
                    }}
                  />
                  <select 
                    className="p-2 border rounded-md"
                    value={invitation.relationship}
                    onChange={(e) => {
                      const newInvitations = [...invitations];
                      newInvitations[index].relationship = e.target.value;
                      setInvitations(newInvitations);
                    }}
                  >
                    <option value="patient">Patient</option>
                    <option value="spouse">Spouse</option>
                    <option value="child">Child</option>
                    <option value="parent">Parent</option>
                    <option value="caregiver">Caregiver</option>
                    <option value="family_member">Family Member</option>
                  </select>
                </div>
                <Textarea 
                  placeholder="Add a personal note about how the BFO Health Network will benefit them and their family..."
                  value={invitation.note}
                  onChange={(e) => {
                    const newInvitations = [...invitations];
                    newInvitations[index].note = e.target.value;
                    setInvitations(newInvitations);
                  }}
                  rows={2}
                />
              </div>
            </Card>
          ))}
        </div>

        <div className="space-y-4 p-4 bg-secondary/20 rounded-lg">
          <h4 className="font-semibold">What Patients & Families Get</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                Secure health record vault
              </li>
              <li className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-primary" />
                Family health coordination
              </li>
              <li className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                Health tracking & analytics
              </li>
            </ul>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <VideoIcon className="h-4 w-4 text-primary" />
                Telehealth access
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                Secure messaging with providers
              </li>
              <li className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Care team collaboration
              </li>
            </ul>
          </div>
        </div>

        <Button 
          onClick={() => {
            handleStepComplete('patients_invited');
            toast({ title: "Invitations Sent!", description: "Your patients and families will receive their invitations shortly." });
          }}
          className="w-full"
        >
          Send Patient & Family Invitations
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4">
      <WelcomeModal />
      
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Healthcare Professional Onboarding
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Empower families to live healthier, longer—your expertise meets our holistic platform.
          </p>
        </div>

        {/* Progress Bar */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Setup Progress</h3>
              <Badge variant="secondary">{Math.round(getProgress())}% Complete</Badge>
            </div>
            <Progress value={getProgress()} className="h-2" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {steps.map((step) => (
                <div 
                  key={step.id}
                  className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all ${
                    currentStep === step.id ? 'bg-primary/10 text-primary' : 
                    step.completed ? 'bg-green-50 text-green-700' : 'text-muted-foreground'
                  }`}
                  onClick={() => setCurrentStep(step.id)}
                >
                  <step.icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{step.title}</span>
                  {step.completed && <CheckCircle className="h-4 w-4 text-green-600" />}
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep === 1 && <ProfessionalProfileStep />}
            {currentStep === 2 && <CredentialsStep />}
            {currentStep === 3 && <AvailabilityStep />}
            {currentStep === 4 && <PatientInvitationStep />}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          <Button 
            onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
            disabled={currentStep === 4}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};