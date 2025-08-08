import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Building, User } from 'lucide-react';

export const MedicareAccountSetupStep = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    agencyName: '',
    agentType: 'independent'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // Here you would typically save the form data and create the account
    console.log('Account setup data:', formData);
    // Redirect to dashboard
    window.location.href = '/medicare-dashboard';
  };

  const isFormValid = formData.name && formData.email && formData.phone;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="bg-gradient-to-r from-blue-100 to-emerald-100 p-3 rounded-full">
            <CheckCircle2 className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <h2 className="text-3xl font-bold mb-4">Let's Set Up Your Account</h2>
        <p className="text-lg text-muted-foreground">
          Just a few details to get your Medicare compliance hub ready
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Account Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Info */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(555) 123-4567"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="agency">Agency Name (Optional)</Label>
              <Input
                id="agency"
                placeholder="Your agency name"
                value={formData.agencyName}
                onChange={(e) => handleInputChange('agencyName', e.target.value)}
              />
            </div>
          </div>

          {/* Agent Type Selection */}
          <div className="space-y-4">
            <Label className="text-base font-medium">I am:</Label>
            <RadioGroup
              value={formData.agentType}
              onValueChange={(value) => handleInputChange('agentType', value)}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div>
                <RadioGroupItem value="independent" id="independent" className="peer sr-only" />
                <Label
                  htmlFor="independent"
                  className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer peer-checked:border-primary peer-checked:bg-primary/5"
                >
                  <User className="h-5 w-5" />
                  <div>
                    <div className="font-medium">Independent Agent</div>
                    <div className="text-sm text-muted-foreground">I work independently</div>
                  </div>
                </Label>
              </div>
              <div>
                <RadioGroupItem value="agency" id="agency" className="peer sr-only" />
                <Label
                  htmlFor="agency"
                  className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer peer-checked:border-primary peer-checked:bg-primary/5"
                >
                  <Building className="h-5 w-5" />
                  <div>
                    <div className="font-medium">Part of an Agency</div>
                    <div className="text-sm text-muted-foreground">I work with a team/agency</div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Setup Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-emerald-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">What happens next:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Your secure vault will be created with Medicare compliance folders</li>
              <li>• Call recording integration will be configured</li>
              <li>• You'll get access to your compliance dashboard</li>
              <li>• Basic templates and tools will be ready to use</li>
            </ul>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <Button
              onClick={handleSubmit}
              disabled={!isFormValid}
              size="lg"
              className="w-full md:w-auto px-8"
            >
              Create My Account & Access Dashboard
            </Button>
          </div>

          {!isFormValid && (
            <p className="text-sm text-muted-foreground text-center">
              Please fill in all required fields (marked with *)
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};