import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  FileText, 
  Phone, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  UserCheck,
  Building2,
  CreditCard
} from 'lucide-react';
import { OnboardingStepData } from '@/types/onboarding';

interface UpgradeToClientStepProps {
  data: OnboardingStepData;
  onComplete: (stepData: Partial<OnboardingStepData>) => void;
  onNext: () => void;
  onPrevious: () => void;
  isLoading?: boolean;
}

export const UpgradeToClientStep: React.FC<UpgradeToClientStepProps> = ({
  data,
  onComplete,
  onNext,
  onPrevious,
  isLoading
}) => {
  const [upgradeChoice, setUpgradeChoice] = useState<'upgrade' | 'defer' | 'assistance' | null>(null);
  const [kycData, setKycData] = useState({
    ssn: data.clientUpgrade?.kycData?.ssn || '',
    employmentStatus: data.clientUpgrade?.kycData?.employmentStatus || '',
    annualIncome: data.clientUpgrade?.kycData?.annualIncome || '',
    netWorth: data.clientUpgrade?.kycData?.netWorth || '',
    sourceOfWealth: data.clientUpgrade?.kycData?.sourceOfWealth || '',
    investmentExperience: data.clientUpgrade?.kycData?.investmentExperience || '',
    riskTolerance: data.clientUpgrade?.kycData?.riskTolerance || '',
    consentGiven: data.clientUpgrade?.kycData?.consentGiven || false
  });

  const handleContinueWithoutUpgrade = () => {
    const upgradeData = {
      clientUpgrade: {
        choice: 'defer' as const,
        timestamp: new Date().toISOString()
      }
    };
    onComplete(upgradeData);
  };

  const handleRequestAssistance = () => {
    const upgradeData = {
      clientUpgrade: {
        choice: 'assistance' as const,
        timestamp: new Date().toISOString()
      }
    };
    onComplete(upgradeData);
  };

  const handleUpgrade = () => {
    if (!validateKYC()) return;
    
    const upgradeData = {
      clientUpgrade: {
        choice: 'upgrade' as const,
        kycData,
        timestamp: new Date().toISOString()
      }
    };
    onComplete(upgradeData);
  };

  const validateKYC = () => {
    return kycData.ssn && 
           kycData.employmentStatus && 
           kycData.annualIncome && 
           kycData.consentGiven;
  };

  const EMPLOYMENT_OPTIONS = [
    'Employed Full-time',
    'Employed Part-time', 
    'Self-employed',
    'Retired',
    'Unemployed',
    'Student'
  ];

  const INCOME_RANGES = [
    'Under $50,000',
    '$50,000 - $100,000',
    '$100,000 - $250,000',
    '$250,000 - $500,000',
    '$500,000 - $1,000,000',
    '$1,000,000+'
  ];

  const NET_WORTH_RANGES = [
    'Under $100,000',
    '$100,000 - $500,000',
    '$500,000 - $1,000,000',
    '$1,000,000 - $5,000,000',
    '$5,000,000 - $10,000,000',
    '$10,000,000+'
  ];

  const INVESTMENT_EXPERIENCE = [
    'No experience',
    'Limited (1-3 years)',
    'Moderate (3-10 years)',
    'Extensive (10+ years)',
    'Professional'
  ];

  const RISK_TOLERANCE = [
    'Conservative',
    'Moderate Conservative',
    'Moderate',
    'Moderate Aggressive',
    'Aggressive'
  ];

  if (!upgradeChoice) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-display font-bold text-foreground mb-2">
            Ready to Become a Full Client?
          </h2>
          <p className="text-muted-foreground">
            Unlock managed services, account opening, and premium features by completing our secure verification process.
          </p>
        </div>

        <div className="grid gap-6">
          {/* Upgrade Option */}
          <Card 
            className="premium-card cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => setUpgradeChoice('upgrade')}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <UserCheck className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Complete Verification</CardTitle>
                    <p className="text-muted-foreground text-sm">
                      Provide required information for account opening
                    </p>
                  </div>
                </div>
                <Badge variant="secondary">Recommended</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span>Account Opening</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span>Asset Management</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span>Premium Features</span>
                </div>
              </div>
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  <strong>Privacy Protected:</strong> Your information is encrypted and used only for regulatory compliance. 
                  We follow strict financial privacy standards and never share your data.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Continue Without Upgrade */}
          <Card 
            className="premium-card cursor-pointer hover:border-accent/50 transition-colors"
            onClick={() => setUpgradeChoice('defer')}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                  <Clock className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <CardTitle>Continue with Basic Access</CardTitle>
                  <p className="text-muted-foreground text-sm">
                    Explore the platform with limited features
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                You can upgrade anytime from your dashboard to unlock full client services.
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Portfolio viewing and tracking</li>
                <li>• Basic planning tools</li>
                <li>• Educational resources</li>
                <li>• Limited advisor access</li>
              </ul>
            </CardContent>
          </Card>

          {/* Request Assistance */}
          <Card 
            className="premium-card cursor-pointer hover:border-secondary/50 transition-colors"
            onClick={() => setUpgradeChoice('assistance')}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                  <Phone className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <CardTitle>Request a Call</CardTitle>
                  <p className="text-muted-foreground text-sm">
                    Speak with an advisor about your options
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Schedule a complimentary consultation to discuss your needs and learn more about our services 
                before providing any sensitive information.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (upgradeChoice === 'upgrade') {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-display font-bold text-foreground mb-2">
            Client Verification (KYC)
          </h2>
          <p className="text-muted-foreground">
            Complete this secure form to enable account opening and managed services.
          </p>
        </div>

        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <strong>Your Privacy is Protected:</strong> This information is encrypted with bank-level security 
            and used only for regulatory compliance (Know Your Customer requirements). We never sell or share your personal data.
          </AlertDescription>
        </Alert>

        <Card className="premium-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Required Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ssn" className="flex items-center gap-2">
                  Social Security Number *
                  <AlertCircle className="h-3 w-3 text-muted-foreground" />
                </Label>
                <Input
                  id="ssn"
                  type="password"
                  value={kycData.ssn}
                  onChange={(e) => setKycData({ ...kycData, ssn: e.target.value })}
                  placeholder="###-##-####"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Required by federal law for account opening
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="employment">Employment Status *</Label>
                <Select
                  value={kycData.employmentStatus}
                  onValueChange={(value) => setKycData({ ...kycData, employmentStatus: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {EMPLOYMENT_OPTIONS.map(option => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="income">Annual Income *</Label>
                <Select
                  value={kycData.annualIncome}
                  onValueChange={(value) => setKycData({ ...kycData, annualIncome: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    {INCOME_RANGES.map(range => (
                      <SelectItem key={range} value={range}>
                        {range}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="netWorth">Estimated Net Worth</Label>
                <Select
                  value={kycData.netWorth}
                  onValueChange={(value) => setKycData({ ...kycData, netWorth: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    {NET_WORTH_RANGES.map(range => (
                      <SelectItem key={range} value={range}>
                        {range}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="experience">Investment Experience</Label>
                <Select
                  value={kycData.investmentExperience}
                  onValueChange={(value) => setKycData({ ...kycData, investmentExperience: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {INVESTMENT_EXPERIENCE.map(level => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="risk">Risk Tolerance</Label>
                <Select
                  value={kycData.riskTolerance}
                  onValueChange={(value) => setKycData({ ...kycData, riskTolerance: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {RISK_TOLERANCE.map(level => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="source">Source of Wealth (Optional)</Label>
              <Input
                id="source"
                value={kycData.sourceOfWealth}
                onChange={(e) => setKycData({ ...kycData, sourceOfWealth: e.target.value })}
                placeholder="e.g., Employment, Business ownership, Inheritance"
              />
            </div>

            <div className="flex items-center space-x-2 pt-4">
              <Checkbox
                id="consent"
                checked={kycData.consentGiven}
                onCheckedChange={(checked) => setKycData({ ...kycData, consentGiven: !!checked })}
              />
              <Label htmlFor="consent" className="text-sm">
                I consent to the collection and processing of this information for account opening and regulatory compliance purposes. *
              </Label>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setUpgradeChoice(null)}>
            Back to Options
          </Button>
          <Button 
            onClick={handleUpgrade}
            disabled={!validateKYC()}
            className="btn-primary-gold"
          >
            Complete Verification
          </Button>
        </div>
      </div>
    );
  }

  if (upgradeChoice === 'defer') {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-display font-bold text-foreground mb-2">
            Welcome to the Platform!
          </h2>
          <p className="text-muted-foreground">
            You can explore our features with basic access. Upgrade anytime to unlock full services.
          </p>
        </div>

        <Card className="premium-card">
          <CardHeader>
            <CardTitle>Your Basic Access Includes:</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Portfolio tracking and insights
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Financial planning tools
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Educational resources
                </li>
              </ul>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Market research and analysis
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Basic advisor consultations
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Account aggregation
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Upgrade Reminder:</strong> To open managed accounts, transfer assets, or access premium advisory services, 
            you'll need to complete the verification process from your dashboard.
          </AlertDescription>
        </Alert>

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setUpgradeChoice(null)}>
            Back to Options
          </Button>
          <Button onClick={handleContinueWithoutUpgrade} className="btn-primary-gold">
            Continue to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (upgradeChoice === 'assistance') {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <Phone className="h-16 w-16 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-display font-bold text-foreground mb-2">
            Request Submitted
          </h2>
          <p className="text-muted-foreground">
            An advisor will contact you within 1 business day to discuss your needs.
          </p>
        </div>

        <Card className="premium-card">
          <CardHeader>
            <CardTitle>What to Expect:</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-semibold text-primary">1</span>
              </div>
              <div>
                <h4 className="font-medium">Initial Consultation</h4>
                <p className="text-sm text-muted-foreground">
                  Discuss your financial goals and learn about our services
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-semibold text-primary">2</span>
              </div>
              <div>
                <h4 className="font-medium">Personalized Recommendations</h4>
                <p className="text-sm text-muted-foreground">
                  Get advice tailored to your specific situation
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-semibold text-primary">3</span>
              </div>
              <div>
                <h4 className="font-medium">Next Steps</h4>
                <p className="text-sm text-muted-foreground">
                  Decide if and when you'd like to move forward
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setUpgradeChoice(null)}>
            Back to Options
          </Button>
          <Button onClick={handleRequestAssistance} className="btn-primary-gold">
            Continue to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return null;
};