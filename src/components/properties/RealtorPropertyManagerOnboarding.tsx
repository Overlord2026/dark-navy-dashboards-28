import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  CheckCircle, 
  Home, 
  Users, 
  Calendar, 
  FileText, 
  CreditCard,
  Building,
  Wrench,
  Upload,
  Mail
} from "lucide-react";

interface RealtorPropertyManagerOnboardingProps {
  onComplete: () => void;
  userType: 'realtor' | 'property_manager';
}

export const RealtorPropertyManagerOnboarding: React.FC<RealtorPropertyManagerOnboardingProps> = ({ 
  onComplete, 
  userType 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "Mary",
    email: "",
    license: "",
    agency: "",
    phone: ""
  });

  const isRealtor = userType === 'realtor';
  
  const steps = isRealtor ? [
    {
      title: `Welcome, ${formData.name}! Your Real Estate Practice Dashboard is Ready 🏡`,
      description: "Track your listings, manage clients, and connect with new prospects—all in one premium, secure portal.",
      icon: Home,
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
              <Home className="h-5 w-5 text-primary" />
              <span className="font-medium text-primary">Realtor Practice Suite</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-l-4 border-l-primary">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Core Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Listings Dashboard & Management
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Built-in CRM & Lead Tracker
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Automated Client Communications
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Showings Scheduler (Google/Outlook sync)
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-accent">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Professional Tools</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Document Vault with E-Sign
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Commission Tracker
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Marketing Templates & AI Banners
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Open House & Events Calendar
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      title: "Add Your First Listing",
      description: "Start building your digital presence with professional listing management",
      icon: Home,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label htmlFor="property-address">Property Address</Label>
              <Input id="property-address" placeholder="123 Main Street, Anytown" />
            </div>
            <div className="space-y-3">
              <Label htmlFor="price">Listing Price</Label>
              <Input id="price" placeholder="$450,000" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-3">
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Input id="bedrooms" placeholder="3" />
            </div>
            <div className="space-y-3">
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <Input id="bathrooms" placeholder="2" />
            </div>
            <div className="space-y-3">
              <Label htmlFor="sqft">Square Feet</Label>
              <Input id="sqft" placeholder="1,800" />
            </div>
          </div>

          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Upload listing photos</p>
            <p className="text-sm text-muted-foreground">Support for up to 25 high-quality images</p>
          </div>
        </div>
      )
    },
    {
      title: "Connect Your Tools",
      description: "Sync your calendar and email for seamless client management",
      icon: Calendar,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="text-center p-6">
              <Calendar className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Calendar Integration</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Sync with Google Calendar or Outlook for automatic showing scheduling
              </p>
              <Button variant="outline">Connect Calendar</Button>
            </Card>
            
            <Card className="text-center p-6">
              <Mail className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Email Integration</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Enable automated client notifications and follow-ups
              </p>
              <Button variant="outline">Connect Email</Button>
            </Card>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">What You'll Get:</h4>
            <ul className="space-y-1 text-sm">
              <li>• Automatic showing reminders for clients</li>
              <li>• Follow-up email sequences for leads</li>
              <li>• Calendar sync for open houses and appointments</li>
              <li>• SMS notifications for urgent updates</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "Import Your Contacts",
      description: "Bring your existing client database into your new CRM",
      icon: Users,
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <Users className="h-16 w-16 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Import Your Client Database</h3>
            <p className="text-muted-foreground">
              Upload your existing contacts or add them manually to get started
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-6 text-center hover:bg-muted/50 cursor-pointer border-2 border-dashed">
              <Upload className="h-8 w-8 text-primary mx-auto mb-3" />
              <h4 className="font-semibold mb-2">CSV Upload</h4>
              <p className="text-sm text-muted-foreground">Import from Excel or other CRM systems</p>
            </Card>
            
            <Card className="p-6 text-center hover:bg-muted/50 cursor-pointer">
              <Users className="h-8 w-8 text-primary mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Manual Entry</h4>
              <p className="text-sm text-muted-foreground">Add clients one by one with detailed profiles</p>
            </Card>
          </div>
        </div>
      )
    },
    {
      title: "Ready to Grow Your Business!",
      description: "Your real estate practice dashboard is configured and ready",
      icon: CheckCircle,
      content: (
        <div className="text-center space-y-6">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
          <div>
            <h3 className="text-xl font-semibold mb-2">You're All Set, Mary!</h3>
            <p className="text-muted-foreground mb-6">
              Your professional real estate dashboard is ready. Start managing listings, tracking leads, and growing your business today.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
              <Home className="h-6 w-6 text-primary mb-2" />
              <span className="text-sm font-medium">Manage Listings</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
              <Users className="h-6 w-6 text-primary mb-2" />
              <span className="text-sm font-medium">Track Leads</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
              <Calendar className="h-6 w-6 text-primary mb-2" />
              <span className="text-sm font-medium">Schedule Showings</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
              <FileText className="h-6 w-6 text-primary mb-2" />
              <span className="text-sm font-medium">Close Deals</span>
            </div>
          </div>
        </div>
      )
    }
  ] : [
    {
      title: `Welcome, ${formData.name}! Your Property Management Command Center 🏢`,
      description: "Manage tenants, track maintenance, and generate owner reports—all from one secure dashboard.",
      icon: Building,
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
              <Building className="h-5 w-5 text-primary" />
              <span className="font-medium text-primary">Property Management Suite</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-l-4 border-l-primary">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Core Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Portfolio Overview & Financial Summary
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Tenant Portal & Communications
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Maintenance Request Management
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Lease Management & E-Sign
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-accent">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Advanced Tools</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Owner Reporting & Bank Sync
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Task Automation & Reminders
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Compliance Dashboard
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Vendor Management
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      title: "Add Properties Under Management",
      description: "Set up your portfolio with property details and tenant information",
      icon: Building,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label htmlFor="property-name">Property Name</Label>
              <Input id="property-name" placeholder="Sunset Apartments" />
            </div>
            <div className="space-y-3">
              <Label htmlFor="property-type">Property Type</Label>
              <Input id="property-type" placeholder="Multi-family, Single-family, etc." />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-3">
              <Label htmlFor="units">Total Units</Label>
              <Input id="units" placeholder="8" />
            </div>
            <div className="space-y-3">
              <Label htmlFor="occupied">Occupied Units</Label>
              <Input id="occupied" placeholder="7" />
            </div>
            <div className="space-y-3">
              <Label htmlFor="monthly-rent">Monthly Rent</Label>
              <Input id="monthly-rent" placeholder="$4,800" />
            </div>
          </div>

          <Card className="p-4 bg-muted/50">
            <h4 className="font-semibold mb-2">Quick Setup Options:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button variant="outline" className="justify-start">
                <Upload className="h-4 w-4 mr-2" />
                Import Property List (CSV)
              </Button>
              <Button variant="outline" className="justify-start">
                <Building className="h-4 w-4 mr-2" />
                Add Single Property
              </Button>
            </div>
          </Card>
        </div>
      )
    },
    {
      title: "Set Up Tenant Portal",
      description: "Enable online rent collection and maintenance requests",
      icon: Users,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="text-center p-6">
              <CreditCard className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Online Rent Collection</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Allow tenants to pay rent online with automatic receipts
              </p>
              <Button variant="outline">Setup Payments</Button>
            </Card>
            
            <Card className="text-center p-6">
              <Wrench className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Maintenance Requests</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Enable tenants to submit and track maintenance requests
              </p>
              <Button variant="outline">Enable Portal</Button>
            </Card>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Tenant Portal Features:</h4>
            <ul className="space-y-1 text-sm">
              <li>• Secure online rent payments with ACH/credit card</li>
              <li>• Photo uploads for maintenance requests</li>
              <li>• Document sharing and lease access</li>
              <li>• Notice delivery and acknowledgment</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "Connect Bank Account",
      description: "Automate rent collection and owner disbursements",
      icon: CreditCard,
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <CreditCard className="h-16 w-16 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Bank Account Integration</h3>
            <p className="text-muted-foreground">
              Connect your bank account for automated rent collection and owner reports
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-6 text-center hover:bg-muted/50 cursor-pointer">
              <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Secure Connection</h4>
              <p className="text-sm text-muted-foreground">Bank-level security with read-only access</p>
            </Card>
            
            <Card className="p-6 text-center hover:bg-muted/50 cursor-pointer">
              <FileText className="h-8 w-8 text-blue-500 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Auto Reports</h4>
              <p className="text-sm text-muted-foreground">Generate owner statements automatically</p>
            </Card>
          </div>
          
          <div className="text-center">
            <Button className="gap-2">
              <CreditCard className="h-4 w-4" />
              Connect Bank Account
            </Button>
          </div>
        </div>
      )
    },
    {
      title: "Ready to Manage Like a Pro!",
      description: "Your property management platform is configured and ready",
      icon: CheckCircle,
      content: (
        <div className="text-center space-y-6">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
          <div>
            <h3 className="text-xl font-semibold mb-2">You're All Set, Mary!</h3>
            <p className="text-muted-foreground mb-6">
              Your property management dashboard is ready. Track maintenance, collect rent, and keep owners happy—all in one place.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
              <Building className="h-6 w-6 text-primary mb-2" />
              <span className="text-sm font-medium">Manage Portfolio</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
              <Users className="h-6 w-6 text-primary mb-2" />
              <span className="text-sm font-medium">Tenant Relations</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
              <Wrench className="h-6 w-6 text-primary mb-2" />
              <span className="text-sm font-medium">Track Maintenance</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
              <FileText className="h-6 w-6 text-primary mb-2" />
              <span className="text-sm font-medium">Owner Reports</span>
            </div>
          </div>
        </div>
      )
    }
  ];

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <Progress value={progress} className="mb-4" />
        <p className="text-sm text-muted-foreground text-center">
          Step {currentStep + 1} of {steps.length}
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <currentStepData.icon className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">{currentStepData.title}</CardTitle>
          <CardDescription className="text-lg">{currentStepData.description}</CardDescription>
        </CardHeader>
        <CardContent>
          {currentStepData.content}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handlePrevious}
          disabled={currentStep === 0}
        >
          Previous
        </Button>
        <Button onClick={handleNext}>
          {currentStep === steps.length - 1 ? "Enter Dashboard" : "Continue"}
        </Button>
      </div>
    </div>
  );
};