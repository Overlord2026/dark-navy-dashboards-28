import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Building, 
  Upload, 
  Users, 
  Shield, 
  Globe, 
  Calendar,
  Star,
  Trophy,
  CheckCircle,
  ArrowRight,
  Crown
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import CelebrationEffects from '@/components/effects/CelebrationEffects';

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  completed: boolean;
}

export default function PropertyManagerOnboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showCelebration, setShowCelebration] = useState(false);
  const { toast } = useToast();

  const steps: OnboardingStep[] = [
    {
      id: 1,
      title: "Welcome & Value Statement",
      description: "Learn about your VIP Founding Partner benefits",
      icon: Crown,
      completed: currentStep > 1
    },
    {
      id: 2,
      title: "Profile Setup",
      description: "Create your professional profile",
      icon: Building,
      completed: currentStep > 2
    },
    {
      id: 3,
      title: "Portfolio Import",
      description: "Add your properties and portfolio",
      icon: Upload,
      completed: currentStep > 3
    },
    {
      id: 4,
      title: "Connect to Families",
      description: "Link existing clients and invite new ones",
      icon: Users,
      completed: currentStep > 4
    },
    {
      id: 5,
      title: "Compliance & Automation",
      description: "Complete KYC and setup automation",
      icon: Shield,
      completed: currentStep > 5
    },
    {
      id: 6,
      title: "Activate Marketplace",
      description: "Go live with your public profile",
      icon: Globe,
      completed: currentStep > 6
    },
    {
      id: 7,
      title: "Next Steps",
      description: "Connect calendar and enable messaging",
      icon: Calendar,
      completed: currentStep > 7
    }
  ];

  const progress = ((currentStep - 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      toast({
        title: "Step Completed!",
        description: `${steps[currentStep - 1].title} has been saved.`,
      });
    } else {
      setShowCelebration(true);
      toast({
        title: "Congratulations!",
        description: "Your VIP profile is now live in the marketplace!",
      });
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
                <Crown className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Welcome to the Family Office Marketplace™!</h2>
              <p className="text-muted-foreground mb-4">
                You've been invited as a <strong>Founding Property Management Partner</strong>—a select group recognized for serving high-net-worth families.
              </p>
              <Badge className="bg-gradient-to-r from-primary to-primary/80 text-white mb-4">
                <Trophy className="w-4 h-4 mr-2" />
                VIP Founding Partner
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border">
                <Star className="w-8 h-8 text-primary mb-2" />
                <h3 className="font-semibold">Premium Placement</h3>
                <p className="text-sm text-muted-foreground">Featured listing in our directory</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 rounded-lg border">
                <Users className="w-8 h-8 text-emerald-600 mb-2" />
                <h3 className="font-semibold">Direct Access</h3>
                <p className="text-sm text-muted-foreground">Connect with 500+ HNW families</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-orange-500/10 to-orange-500/5 rounded-lg border">
                <Building className="w-8 h-8 text-orange-600 mb-2" />
                <h3 className="font-semibold">Practice Tools</h3>
                <p className="text-sm text-muted-foreground">Complete management suite</p>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Profile Setup</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firmName">Firm Name</Label>
                <Input id="firmName" placeholder="Enter your firm name" />
              </div>
              <div>
                <Label htmlFor="contactName">Contact Name</Label>
                <Input id="contactName" placeholder="Your full name" />
              </div>
              <div>
                <Label htmlFor="licenseNumber">License Number</Label>
                <Input id="licenseNumber" placeholder="Professional license #" />
              </div>
              <div>
                <Label htmlFor="states">States of Operation</Label>
                <Input id="states" placeholder="CA, NY, FL" />
              </div>
            </div>
            <div>
              <Label htmlFor="bio">Professional Bio</Label>
              <Textarea id="bio" placeholder="Tell families about your expertise..." rows={4} />
            </div>
            <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Upload firm logo and certifications</p>
              <Button variant="outline" className="mt-2">Choose Files</Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Portfolio Import</h2>
            <p className="text-muted-foreground">Add your existing properties to get started quickly.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-6 border-2 border-dashed border-primary/30 hover:border-primary/50 cursor-pointer transition-colors">
                <div className="text-center">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <h3 className="font-semibold mb-2">Import via CSV</h3>
                  <p className="text-sm text-muted-foreground mb-4">Bulk upload all properties at once</p>
                  <Button>Upload CSV</Button>
                </div>
              </Card>
              
              <Card className="p-6 border-2 border-dashed border-muted hover:border-muted-foreground cursor-pointer transition-colors">
                <div className="text-center">
                  <Building className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold mb-2">Add Manually</h3>
                  <p className="text-sm text-muted-foreground mb-4">Enter properties one by one</p>
                  <Button variant="outline">Add Property</Button>
                </div>
              </Card>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                💡 <strong>Need help?</strong> Our concierge team is available 24/7 to assist with portfolio import.
              </p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Connect to Families/Clients</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="clientSearch">Link Existing Client</Label>
                <Input id="clientSearch" placeholder="Search by email or invite new client" />
              </div>
              
              <div className="space-y-3">
                <h3 className="font-semibold">Team Roles</h3>
                <div className="space-y-2">
                  {[
                    { role: "Admin", email: "admin@yourfirm.com" },
                    { role: "Agent", email: "agent@yourfirm.com" },
                    { role: "Maintenance", email: "maintenance@yourfirm.com" }
                  ].map((member, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{member.role}</p>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                      </div>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  ))}
                </div>
              </div>
              
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <Users className="w-4 h-4 mr-2" />
                Bulk Invite Families to Platform
              </Button>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Compliance & Automation</h2>
            <div className="space-y-4">
              <div className="space-y-3">
                <h3 className="font-semibold">Compliance Checklist</h3>
                {[
                  "Professional License Upload",
                  "Insurance Certificate",
                  "KYC Documentation",
                  "Background Check Consent"
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Checkbox id={`compliance-${index}`} />
                    <label htmlFor={`compliance-${index}`} className="text-sm">{item}</label>
                  </div>
                ))}
              </div>
              
              <div className="space-y-3">
                <h3 className="font-semibold">Automation Settings</h3>
                {[
                  "Rent due reminders",
                  "Lease renewal notifications",
                  "Inspection schedules",
                  "Maintenance alerts"
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Checkbox id={`automation-${index}`} defaultChecked />
                    <label htmlFor={`automation-${index}`} className="text-sm">{item}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Activate Marketplace Listing</h2>
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-6 rounded-lg border">
              <h3 className="font-semibold mb-4">Your Public Profile Preview</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Badge className="bg-gradient-to-r from-primary to-primary/80 text-white">
                    <Crown className="w-3 h-3 mr-1" />
                    VIP Founding Partner
                  </Badge>
                </div>
                
                <div>
                  <Label htmlFor="serviceAreas">Service Areas</Label>
                  <Input id="serviceAreas" placeholder="Los Angeles, Orange County, San Diego" />
                </div>
                
                <div>
                  <Label htmlFor="specialties">Specialties</Label>
                  <Input id="specialties" placeholder="Luxury homes, Commercial properties, Estate management" />
                </div>
                
                <div>
                  <Label htmlFor="languages">Languages Spoken</Label>
                  <Input id="languages" placeholder="English, Spanish, Mandarin" />
                </div>
              </div>
            </div>
            
            <Button className="w-full bg-green-600 hover:bg-green-700">
              <Globe className="w-4 h-4 mr-2" />
              Go Live in Marketplace
            </Button>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Next Steps</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4">
                <Calendar className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-semibold mb-2">Connect Calendar</h3>
                <p className="text-sm text-muted-foreground mb-3">Enable direct booking from families</p>
                <Button className="w-full">Link Google/Outlook</Button>
              </Card>
              
              <Card className="p-4">
                <Users className="w-8 h-8 text-emerald-600 mb-3" />
                <h3 className="font-semibold mb-2">Enable Messaging</h3>
                <p className="text-sm text-muted-foreground mb-3">Secure chat with clients & advisors</p>
                <Button className="w-full" variant="outline">Setup Messaging</Button>
              </Card>
            </div>
            
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-lg border border-primary/20">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                Refer a Peer — Get Rewards!
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Help us build the premier marketplace by inviting qualified property managers.
                <strong className="text-foreground"> Get a free seat upgrade for each successful referral!</strong>
              </p>
              <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                <Users className="w-4 h-4 mr-2" />
                Invite Colleagues Now
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Property Manager Onboarding</h1>
            <Badge variant="outline">
              Step {currentStep} of {steps.length}
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Navigation */}
        <div className="grid grid-cols-3 md:grid-cols-7 gap-2 mb-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.id}
                className={`p-3 rounded-lg text-center transition-all ${
                  step.id === currentStep
                    ? 'bg-primary text-white'
                    : step.completed
                    ? 'bg-green-100 text-green-700 dark:bg-green-950/20 dark:text-green-400'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                <Icon className="w-5 h-5 mx-auto mb-1" />
                <p className="text-xs font-medium hidden md:block">{step.title}</p>
              </div>
            );
          })}
        </div>

        {/* Main Content */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          
          <Button onClick={handleNext}>
            {currentStep === steps.length ? 'Complete Onboarding' : 'Next Step'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Celebration Effects */}
        {showCelebration && (
          <CelebrationEffects userName="Property Manager" />
        )}
      </div>
    </div>
  );
}