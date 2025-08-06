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
  Shield, 
  Building2,
  Users, 
  Mail,
  Upload,
  Award,
  FileText,
  Calendar,
  Globe,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Sparkles,
  UserPlus,
  Car,
  Home,
  Heart,
  TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';

interface InsuranceOnboardingData {
  profile_completed: boolean;
  roster_added: boolean;
  compliance_setup: boolean;
  producers_invited: boolean;
}

interface InsuranceProfile {
  organization_name?: string;
  organization_type?: string;
  bio?: string;
  states_served?: string[];
  carriers?: string[];
  licenses?: string[];
  agent_count?: number;
  years_experience?: number;
  website?: string;
  phone?: string;
  email?: string;
  logo_url?: string;
  eo_insurance?: boolean;
  eo_carrier?: string;
  eo_policy_number?: string;
  eo_expiry?: string;
}

export const InsuranceOnboardingFlow = () => {
  const { userProfile } = useUser();
  const [currentStep, setCurrentStep] = useState(1);
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [onboardingData, setOnboardingData] = useState<InsuranceOnboardingData>({
    profile_completed: false,
    roster_added: false,
    compliance_setup: false,
    producers_invited: false
  });
  const [profile, setProfile] = useState<InsuranceProfile>({});
  const [agents, setAgents] = useState<Array<{name: string, email: string, role: string, licenses: string[]}>>([]);
  const [seatPackage, setSeatPackage] = useState({ type: 'starter', count: 5 });
  const [invitations, setInvitations] = useState<Array<{name: string, email: string, note: string}>>([]);

  const steps = [
    { id: 1, title: "Organization Profile", icon: Building2, completed: onboardingData.profile_completed },
    { id: 2, title: "Agent Roster", icon: Users, completed: onboardingData.roster_added },
    { id: 3, title: "Compliance Setup", icon: Shield, completed: onboardingData.compliance_setup },
    { id: 4, title: "Invite Producers", icon: UserPlus, completed: onboardingData.producers_invited }
  ];

  const getProgress = () => {
    const completedSteps = Object.values(onboardingData).filter(Boolean).length;
    return (completedSteps / 4) * 100;
  };

  const handleStepComplete = async (stepKey: keyof InsuranceOnboardingData) => {
    setOnboardingData(prev => ({ ...prev, [stepKey]: true }));
    
    if (stepKey === 'producers_invited') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      toast({ title: "🎉 Onboarding Complete!", description: "Welcome to the BFO Insurance ecosystem!" });
    }
  };

  const WelcomeModal = () => (
    <Dialog open={showWelcomeModal} onOpenChange={setShowWelcomeModal}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            Welcome, {userProfile?.displayName || 'Insurance Professional'}!
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-lg text-muted-foreground">
            Elevate your practice—BFO streamlines licensing, compliance, and client management.
          </p>
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 rounded-lg border border-primary/20">
            <h4 className="font-semibold text-primary mb-2">What you'll accomplish:</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                Set up your organization profile and branding
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                Add your agent roster and manage seats
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                Configure compliance and licensing tracking
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                Invite producers to join your network
              </li>
            </ul>
          </div>
          <Button onClick={() => setShowWelcomeModal(false)} className="w-full" size="lg">
            Get Started
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  const OrganizationProfileStep = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Organization Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="org-name">Organization Name *</Label>
            <Input 
              id="org-name"
              value={profile.organization_name || ''} 
              onChange={(e) => setProfile(prev => ({ ...prev, organization_name: e.target.value }))}
              placeholder="ABC Insurance Agency"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="org-type">Organization Type</Label>
            <select 
              className="w-full p-2 border rounded-md"
              value={profile.organization_type || ''}
              onChange={(e) => setProfile(prev => ({ ...prev, organization_type: e.target.value }))}
            >
              <option value="">Select type</option>
              <option value="imo">IMO</option>
              <option value="fmo">FMO</option>
              <option value="agency">Insurance Agency</option>
              <option value="brokerage">Brokerage</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Organization Description</Label>
          <Textarea 
            id="bio"
            value={profile.bio || ''} 
            onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
            placeholder="Describe your organization's focus and specialties..."
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>States Served</Label>
            <Input 
              value={profile.states_served?.join(', ') || ''} 
              onChange={(e) => setProfile(prev => ({ ...prev, states_served: e.target.value.split(', ').filter(Boolean) }))}
              placeholder="CA, TX, NY, FL"
            />
          </div>
          <div className="space-y-2">
            <Label>Primary Carriers</Label>
            <Input 
              value={profile.carriers?.join(', ') || ''} 
              onChange={(e) => setProfile(prev => ({ ...prev, carriers: e.target.value.split(', ').filter(Boolean) }))}
              placeholder="Prudential, MetLife, Lincoln"
            />
          </div>
        </div>

        <div className="space-y-4 p-4 bg-secondary/20 rounded-lg">
          <h4 className="font-semibold flex items-center gap-2">
            <Shield className="h-4 w-4" />
            E&O Insurance
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>E&O Carrier</Label>
              <Input 
                value={profile.eo_carrier || ''} 
                onChange={(e) => setProfile(prev => ({ ...prev, eo_carrier: e.target.value }))}
                placeholder="Insurance carrier"
              />
            </div>
            <div className="space-y-2">
              <Label>Policy Number</Label>
              <Input 
                value={profile.eo_policy_number || ''} 
                onChange={(e) => setProfile(prev => ({ ...prev, eo_policy_number: e.target.value }))}
                placeholder="Policy #"
              />
            </div>
            <div className="space-y-2">
              <Label>Expiry Date</Label>
              <Input 
                type="date"
                value={profile.eo_expiry || ''} 
                onChange={(e) => setProfile(prev => ({ ...prev, eo_expiry: e.target.value }))}
              />
            </div>
          </div>
        </div>

        <Button 
          onClick={() => {
            handleStepComplete('profile_completed');
            setCurrentStep(2);
          }}
          className="w-full"
          disabled={!profile.organization_name}
        >
          Complete Profile Setup
        </Button>
      </CardContent>
    </Card>
  );

  const AgentRosterStep = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Agent Roster & Seat Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Seat Package Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { type: 'starter', name: 'Starter Package', seats: 5, price: 125, features: ['Basic compliance', 'Document vault', 'Email support'] },
            { type: 'professional', name: 'Professional Package', seats: 15, price: 300, features: ['Advanced analytics', 'Client portal', 'Phone support', 'Training access'] },
            { type: 'enterprise', name: 'Enterprise Package', seats: 50, price: 750, features: ['Custom branding', 'API access', 'Dedicated support', 'Advanced integrations'] }
          ].map((pkg) => (
            <Card 
              key={pkg.type} 
              className={`cursor-pointer transition-all ${seatPackage.type === pkg.type ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-secondary/20'}`}
              onClick={() => setSeatPackage({ type: pkg.type, count: pkg.seats })}
            >
              <CardContent className="p-4">
                <h4 className="font-semibold">{pkg.name}</h4>
                <div className="text-2xl font-bold text-primary my-2">${pkg.price}/mo</div>
                <div className="text-sm text-muted-foreground mb-3">{pkg.seats} agent seats</div>
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

        {/* Add Agents */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Agent Roster</h4>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setAgents([...agents, { name: '', email: '', role: 'agent', licenses: [] }])}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add Agent
            </Button>
          </div>
          
          {agents.map((agent, index) => (
            <Card key={index} className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input 
                  placeholder="Agent name"
                  value={agent.name}
                  onChange={(e) => {
                    const newAgents = [...agents];
                    newAgents[index].name = e.target.value;
                    setAgents(newAgents);
                  }}
                />
                <Input 
                  type="email"
                  placeholder="agent@email.com"
                  value={agent.email}
                  onChange={(e) => {
                    const newAgents = [...agents];
                    newAgents[index].email = e.target.value;
                    setAgents(newAgents);
                  }}
                />
                <select 
                  className="p-2 border rounded-md"
                  value={agent.role}
                  onChange={(e) => {
                    const newAgents = [...agents];
                    newAgents[index].role = e.target.value;
                    setAgents(newAgents);
                  }}
                >
                  <option value="agent">Agent</option>
                  <option value="producer">Producer</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
                <Input 
                  placeholder="Licenses (comma separated)"
                  value={agent.licenses.join(', ')}
                  onChange={(e) => {
                    const newAgents = [...agents];
                    newAgents[index].licenses = e.target.value.split(', ').filter(Boolean);
                    setAgents(newAgents);
                  }}
                />
              </div>
            </Card>
          ))}
        </div>

        <Button 
          onClick={() => {
            handleStepComplete('roster_added');
            setCurrentStep(3);
          }}
          className="w-full"
        >
          Configure Agent Roster
        </Button>
      </CardContent>
    </Card>
  );

  const ComplianceSetupStep = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Compliance & Licensing Setup
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-4 bg-secondary/20">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              CE Tracking
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                Automated state CE requirements
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                Renewal deadline reminders
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                Bulk agent license management
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                Compliance dashboard
              </li>
            </ul>
          </Card>

          <Card className="p-4 bg-secondary/20">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Upload className="h-4 w-4" />
              License Management
            </h4>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Upload className="h-4 w-4 mr-2" />
                Bulk Upload Agent Licenses
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Import Compliance History
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Set Renewal Reminders
              </Button>
            </div>
          </Card>
        </div>

        <div className="space-y-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
          <h4 className="font-semibold text-primary">State Compliance Configuration</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Primary Compliance State</Label>
              <select className="w-full p-2 border rounded-md">
                <option value="">Select state</option>
                <option value="CA">California</option>
                <option value="TX">Texas</option>
                <option value="NY">New York</option>
                <option value="FL">Florida</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Notification Preferences</Label>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Email reminders</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">SMS alerts</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <Button 
          onClick={() => {
            handleStepComplete('compliance_setup');
            setCurrentStep(4);
          }}
          className="w-full"
        >
          Configure Compliance
        </Button>
      </CardContent>
    </Card>
  );

  const ProducerInvitationStep = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Invite Producers
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 rounded-lg border border-primary/20">
          <h4 className="font-semibold text-primary mb-2">Expand Your Network</h4>
          <p className="text-sm text-muted-foreground">
            Invite independent producers and agents to join your network. They'll get access to training, compliance tools, and client management features.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Producer Invitations</h4>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setInvitations([...invitations, { name: '', email: '', note: '' }])}
            >
              <Mail className="h-4 w-4 mr-2" />
              Add Invitation
            </Button>
          </div>
          
          {invitations.map((invitation, index) => (
            <Card key={index} className="p-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input 
                    placeholder="Producer name"
                    value={invitation.name}
                    onChange={(e) => {
                      const newInvitations = [...invitations];
                      newInvitations[index].name = e.target.value;
                      setInvitations(newInvitations);
                    }}
                  />
                  <Input 
                    type="email"
                    placeholder="producer@email.com"
                    value={invitation.email}
                    onChange={(e) => {
                      const newInvitations = [...invitations];
                      newInvitations[index].email = e.target.value;
                      setInvitations(newInvitations);
                    }}
                  />
                </div>
                <Textarea 
                  placeholder="Add a personal note explaining the benefits of joining your network..."
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
          <h4 className="font-semibold">What Producers Get</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                Compliance tracking & alerts
              </li>
              <li className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Document vault & e-signatures
              </li>
              <li className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Client management tools
              </li>
            </ul>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Award className="h-4 w-4 text-primary" />
                Training & certification
              </li>
              <li className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Lead management system
              </li>
              <li className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary" />
                BFO marketplace access
              </li>
            </ul>
          </div>
        </div>

        <Button 
          onClick={() => {
            handleStepComplete('producers_invited');
            toast({ title: "Invitations Sent!", description: "Your producers will receive their invitations shortly." });
          }}
          className="w-full"
        >
          Send Producer Invitations
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
            Insurance & IMO/FMO Onboarding
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Grow, comply, and serve families at scale—welcome to the modern insurance experience, powered by BFO.
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
            {currentStep === 1 && <OrganizationProfileStep />}
            {currentStep === 2 && <AgentRosterStep />}
            {currentStep === 3 && <ComplianceSetupStep />}
            {currentStep === 4 && <ProducerInvitationStep />}
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