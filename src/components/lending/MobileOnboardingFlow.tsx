import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Camera, FileText, Shield, CheckCircle, Phone, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface MobileOnboardingFlowProps {
  userType: 'client' | 'partner';
  onComplete: (data: any) => void;
}

const MobileOnboardingFlow: React.FC<MobileOnboardingFlowProps> = ({ userType, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    ssn: '',
    dateOfBirth: '',
    
    // Address
    street: '',
    city: '',
    state: '',
    zipCode: '',
    
    // Documents
    idDocument: null as File | null,
    selfiePhoto: null as File | null,
    incomeDocument: null as File | null,
    
    // Partner specific
    businessName: '',
    licenseNumber: '',
    businessType: '',
    
    // Verification
    smsCode: '',
    emailCode: ''
  });
  
  const { toast } = useToast();
  const totalSteps = userType === 'client' ? 6 : 7;
  const progress = (currentStep / totalSteps) * 100;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (field: string, file: File) => {
    setFormData(prev => ({ ...prev, [field]: file }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const sendSMSVerification = async () => {
    try {
      // Send SMS verification code
      toast({
        title: "Verification Code Sent",
        description: "Please check your phone for the verification code"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send verification code",
        variant: "destructive"
      });
    }
  };

  const sendEmailVerification = async () => {
    try {
      // Send email verification code
      toast({
        title: "Verification Code Sent",
        description: "Please check your email for the verification code"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send verification code",
        variant: "destructive"
      });
    }
  };

  const completeOnboarding = async () => {
    try {
      // Submit all data to Supabase
      const { data, error } = await supabase
        .from(userType === 'client' ? 'profiles' : 'partner_applications')
        .insert({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          ...(userType === 'partner' && {
            partner_name: formData.businessName,
            business_type: formData.businessType,
            license_number: formData.licenseNumber
          })
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Onboarding Complete!",
        description: "Welcome to the lending platform"
      });

      onComplete(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete onboarding",
        variant: "destructive"
      });
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold">Personal Information</h3>
              <p className="text-sm text-muted-foreground">Let's start with your basic details</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="John"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Doe"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="john@example.com"
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="(555) 123-4567"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold">Address Information</h3>
              <p className="text-sm text-muted-foreground">Where can we reach you?</p>
            </div>
            
            <div>
              <Label htmlFor="street">Street Address</Label>
              <Input
                id="street"
                value={formData.street}
                onChange={(e) => handleInputChange('street', e.target.value)}
                placeholder="123 Main St"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="San Francisco"
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  placeholder="CA"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                id="zipCode"
                value={formData.zipCode}
                onChange={(e) => handleInputChange('zipCode', e.target.value)}
                placeholder="94102"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <Camera className="w-16 h-16 mx-auto mb-4 text-primary" />
              <h3 className="text-lg font-semibold">Document Scan</h3>
              <p className="text-sm text-muted-foreground">Please take a photo of your ID document</p>
            </div>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) => e.target.files?.[0] && handleFileUpload('idDocument', e.target.files[0])}
                className="hidden"
                id="id-upload"
              />
              <label htmlFor="id-upload" className="cursor-pointer">
                <FileText className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">Tap to capture ID document</p>
              </label>
              {formData.idDocument && (
                <p className="text-sm text-green-600 mt-2">✓ Document captured</p>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <Shield className="w-16 h-16 mx-auto mb-4 text-primary" />
              <h3 className="text-lg font-semibold">Selfie Verification</h3>
              <p className="text-sm text-muted-foreground">Take a selfie to verify your identity</p>
            </div>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                accept="image/*"
                capture="user"
                onChange={(e) => e.target.files?.[0] && handleFileUpload('selfiePhoto', e.target.files[0])}
                className="hidden"
                id="selfie-upload"
              />
              <label htmlFor="selfie-upload" className="cursor-pointer">
                <Camera className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">Tap to take selfie</p>
              </label>
              {formData.selfiePhoto && (
                <p className="text-sm text-green-600 mt-2">✓ Selfie captured</p>
              )}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <Phone className="w-16 h-16 mx-auto mb-4 text-primary" />
              <h3 className="text-lg font-semibold">SMS Verification</h3>
              <p className="text-sm text-muted-foreground">Verify your phone number</p>
            </div>
            
            <div className="text-center">
              <p className="text-sm mb-4">We'll send a code to {formData.phone}</p>
              <Button onClick={sendSMSVerification} variant="outline" className="mb-4">
                Send SMS Code
              </Button>
            </div>
            
            <div>
              <Label htmlFor="smsCode">Enter SMS Code</Label>
              <Input
                id="smsCode"
                value={formData.smsCode}
                onChange={(e) => handleInputChange('smsCode', e.target.value)}
                placeholder="123456"
                maxLength={6}
              />
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <Mail className="w-16 h-16 mx-auto mb-4 text-primary" />
              <h3 className="text-lg font-semibold">Email Verification</h3>
              <p className="text-sm text-muted-foreground">Verify your email address</p>
            </div>
            
            <div className="text-center">
              <p className="text-sm mb-4">We'll send a code to {formData.email}</p>
              <Button onClick={sendEmailVerification} variant="outline" className="mb-4">
                Send Email Code
              </Button>
            </div>
            
            <div>
              <Label htmlFor="emailCode">Enter Email Code</Label>
              <Input
                id="emailCode"
                value={formData.emailCode}
                onChange={(e) => handleInputChange('emailCode', e.target.value)}
                placeholder="123456"
                maxLength={6}
              />
            </div>
          </div>
        );

      case 7:
        if (userType === 'partner') {
          return (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold">Business Information</h3>
                <p className="text-sm text-muted-foreground">Tell us about your business</p>
              </div>
              
              <div>
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  value={formData.businessName}
                  onChange={(e) => handleInputChange('businessName', e.target.value)}
                  placeholder="ABC Lending Group"
                />
              </div>
              
              <div>
                <Label htmlFor="businessType">Business Type</Label>
                <Input
                  id="businessType"
                  value={formData.businessType}
                  onChange={(e) => handleInputChange('businessType', e.target.value)}
                  placeholder="Mortgage Broker"
                />
              </div>
              
              <div>
                <Label htmlFor="licenseNumber">License Number</Label>
                <Input
                  id="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                  placeholder="LIC123456"
                />
              </div>
            </div>
          );
        } else {
          return (
            <div className="text-center space-y-4">
              <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
              <h3 className="text-lg font-semibold">All Set!</h3>
              <p className="text-sm text-muted-foreground">
                Your onboarding is complete. Welcome to the platform!
              </p>
            </div>
          );
        }

      default:
        return (
          <div className="text-center space-y-4">
            <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
            <h3 className="text-lg font-semibold">All Set!</h3>
            <p className="text-sm text-muted-foreground">
              Your onboarding is complete. Welcome to the platform!
            </p>
          </div>
        );
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">
            {userType === 'client' ? 'Client Onboarding' : 'Partner Onboarding'}
          </CardTitle>
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <p className="text-xs text-center text-muted-foreground">
              Step {currentStep} of {totalSteps}
            </p>
          </div>
        </CardHeader>
        
        <CardContent>
          {renderStep()}
          
          <div className="flex justify-between mt-6">
            <Button 
              variant="outline" 
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            
            {currentStep === totalSteps ? (
              <Button onClick={completeOnboarding}>
                Complete Onboarding
              </Button>
            ) : (
              <Button onClick={nextStep}>
                Next
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MobileOnboardingFlow;