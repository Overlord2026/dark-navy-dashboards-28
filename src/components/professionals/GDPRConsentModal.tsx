import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Lock, 
  Eye, 
  Database, 
  CheckCircle,
  FileText,
  Users,
  Settings
} from 'lucide-react';

interface GDPRConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConsent: () => void;
}

export const GDPRConsentModal = ({ isOpen, onClose, onConsent }: GDPRConsentModalProps) => {
  const [consents, setConsents] = useState({
    dataImport: false,
    dataProcessing: false,
    profileCreation: false,
    marketing: false
  });

  const requiredConsents = ['dataImport', 'dataProcessing', 'profileCreation'];
  const allRequiredGiven = requiredConsents.every(key => consents[key as keyof typeof consents]);

  const handleConsentChange = (key: keyof typeof consents) => {
    setConsents(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleProceed = () => {
    if (allRequiredGiven) {
      onConsent();
    }
  };

  const dataTypes = [
    {
      icon: <Users className="w-5 h-5" />,
      title: "Basic Profile Information",
      description: "Name, headline, current position, profile photo"
    },
    {
      icon: <FileText className="w-5 h-5" />,
      title: "Professional Experience", 
      description: "Work history, education, skills, and certifications"
    },
    {
      icon: <Database className="w-5 h-5" />,
      title: "Contact Information",
      description: "Email address and LinkedIn profile URL"
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl">Data Import Consent</DialogTitle>
              <DialogDescription>
                We respect your privacy and comply with GDPR requirements
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Badge */}
          <div className="flex justify-center">
            <Badge variant="secondary" className="px-4 py-2">
              <Lock className="w-4 h-4 mr-2" />
              GDPR Compliant • Enterprise Security
            </Badge>
          </div>

          {/* Data Types */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Data We'll Import from LinkedIn
            </h3>
            <div className="grid gap-3">
              {dataTypes.map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                  <div className="text-primary mt-0.5">{item.icon}</div>
                  <div>
                    <h4 className="font-medium text-sm">{item.title}</h4>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Consent Checkboxes */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Your Consent
            </h3>
            
            <div className="space-y-3">
              {/* Required Consents */}
              <div className="flex items-start space-x-3">
                <Checkbox 
                  id="dataImport"
                  checked={consents.dataImport}
                  onCheckedChange={() => handleConsentChange('dataImport')}
                />
                <div className="space-y-1">
                  <label htmlFor="dataImport" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    LinkedIn Data Import <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-muted-foreground">
                    I consent to importing my LinkedIn profile data to create my professional profile.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox 
                  id="dataProcessing"
                  checked={consents.dataProcessing}
                  onCheckedChange={() => handleConsentChange('dataProcessing')}
                />
                <div className="space-y-1">
                  <label htmlFor="dataProcessing" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Data Processing & Storage <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-muted-foreground">
                    I consent to processing and storing my professional data on this platform.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox 
                  id="profileCreation"
                  checked={consents.profileCreation}
                  onCheckedChange={() => handleConsentChange('profileCreation')}
                />
                <div className="space-y-1">
                  <label htmlFor="profileCreation" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Professional Profile Creation <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-muted-foreground">
                    I consent to creating a searchable professional profile in the marketplace.
                  </p>
                </div>
              </div>

              {/* Optional Consent */}
              <div className="border-t pt-3">
                <div className="flex items-start space-x-3">
                  <Checkbox 
                    id="marketing"
                    checked={consents.marketing}
                    onCheckedChange={() => handleConsentChange('marketing')}
                  />
                  <div className="space-y-1">
                    <label htmlFor="marketing" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Marketing Communications <span className="text-muted-foreground">(Optional)</span>
                    </label>
                    <p className="text-xs text-muted-foreground">
                      I consent to receiving updates about new features and marketplace opportunities.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="bg-blue-50/50 dark:bg-blue-950/20 p-4 rounded-lg space-y-2">
            <h4 className="font-semibold text-sm text-blue-700 dark:text-blue-300">
              Your Rights Under GDPR
            </h4>
            <ul className="text-xs text-blue-600 dark:text-blue-400 space-y-1">
              <li>• Right to access your data at any time</li>
              <li>• Right to correct or update your information</li>
              <li>• Right to delete your data and profile</li>
              <li>• Right to withdraw consent at any time</li>
              <li>• Right to data portability</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleProceed}
              disabled={!allRequiredGiven}
              className="flex-1 bg-primary"
            >
              {allRequiredGiven ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Proceed with Import
                </>
              ) : (
                'Please Accept Required Terms'
              )}
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            By proceeding, you agree to our Terms of Service and Privacy Policy.
            You can manage your data preferences in your account settings.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};