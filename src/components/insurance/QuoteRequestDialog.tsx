import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Phone, 
  Mail, 
  Video, 
  Users, 
  Lock,
  CheckCircle,
  Info
} from 'lucide-react';
import { FiduciaryProductType } from '@/types/fiduciary-insurance';

interface QuoteRequestDialogProps {
  productType: FiduciaryProductType;
  open: boolean;
  onClose: () => void;
  onSubmit: (requestData: any) => void;
}

export function QuoteRequestDialog({ 
  productType, 
  open, 
  onClose, 
  onSubmit 
}: QuoteRequestDialogProps) {
  const [requestType, setRequestType] = useState<'quote' | 'consultation'>('consultation');
  const [formData, setFormData] = useState({
    personalInfo: {
      age: '',
      state: '',
      zipCode: '',
      income: '',
      healthStatus: ''
    },
    contactPreference: 'phone',
    shareWithFamily: false,
    existingAdvisor: '',
    additionalInfo: ''
  });

  const productLabels = {
    ltc: 'Long-Term Care Insurance',
    medicare: 'Medicare Supplement',
    iul: 'Indexed Universal Life'
  };

  const states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
    'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
    'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
    'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
    'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
    'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
    'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
    'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
    'West Virginia', 'Wisconsin', 'Wyoming'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const requestData = {
      userId: 'current-user', // Will be replaced with actual user ID
      productType,
      requestType,
      personalInfo: formData.personalInfo,
      preferredContact: formData.contactPreference,
      existingAdvisor: formData.existingAdvisor,
      shareWithFamily: formData.shareWithFamily,
      productSpecific: {
        additionalInfo: formData.additionalInfo
      }
    };

    onSubmit(requestData);
  };

  const updatePersonalInfo = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-green-600" />
            <span>Request Fiduciary Consultation</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Fiduciary Promise */}
          <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20">
            <Shield className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <strong>Fiduciary Promise:</strong> No commissions, no sales quotas. 
                  We work only for you.
                </div>
                <Badge variant="outline" className="bg-white text-green-700 border-green-300">
                  <Lock className="h-3 w-3 mr-1" />
                  Privacy Protected
                </Badge>
              </div>
            </AlertDescription>
          </Alert>

          {/* Request Type */}
          <Card>
            <CardHeader>
              <CardTitle>What are you looking for?</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={requestType} onValueChange={(value) => setRequestType(value as 'quote' | 'consultation')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="consultation">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4" />
                      <span>Unbiased Consultation</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="quote">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4" />
                      <span>Product Quote</span>
                    </div>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="consultation" className="mt-4">
                  <div className="text-sm text-muted-foreground">
                    Speak with a fiduciary advisor who will help you understand if {productLabels[productType]} 
                    is right for your situation, including alternatives you may not have considered.
                  </div>
                </TabsContent>

                <TabsContent value="quote" className="mt-4">
                  <div className="text-sm text-muted-foreground">
                    Get specific pricing and product recommendations for {productLabels[productType]} 
                    from licensed, fiduciary advisors in your state.
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age *</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.personalInfo.age}
                    onChange={(e) => updatePersonalInfo('age', e.target.value)}
                    placeholder="65"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Select value={formData.personalInfo.state} onValueChange={(value) => updatePersonalInfo('state', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your state..." />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP Code *</Label>
                  <Input
                    id="zipCode"
                    value={formData.personalInfo.zipCode}
                    onChange={(e) => updatePersonalInfo('zipCode', e.target.value)}
                    placeholder="12345"
                    maxLength={5}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="income">Household Income (Optional)</Label>
                  <Select value={formData.personalInfo.income} onValueChange={(value) => updatePersonalInfo('income', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select range..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under-50k">Under $50,000</SelectItem>
                      <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                      <SelectItem value="100k-200k">$100,000 - $200,000</SelectItem>
                      <SelectItem value="200k-500k">$200,000 - $500,000</SelectItem>
                      <SelectItem value="over-500k">Over $500,000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {productType === 'ltc' && (
                <div className="space-y-2">
                  <Label htmlFor="healthStatus">General Health Status</Label>
                  <Select value={formData.personalInfo.healthStatus} onValueChange={(value) => updatePersonalInfo('healthStatus', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                      <SelectItem value="poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>How would you like to be contacted?</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={formData.contactPreference} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, contactPreference: value }))}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="phone" id="phone" />
                  <Label htmlFor="phone" className="flex items-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <span>Phone call</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="email" id="email" />
                  <Label htmlFor="email" className="flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>Email</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="video" id="video" />
                  <Label htmlFor="video" className="flex items-center space-x-2">
                    <Video className="h-4 w-4" />
                    <span>Video call</span>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Additional Options */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="shareWithFamily" 
                  checked={formData.shareWithFamily}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, shareWithFamily: !!checked }))}
                />
                <Label htmlFor="shareWithFamily" className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Share this inquiry with my family/existing advisor</span>
                </Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="existingAdvisor">Do you have an existing advisor? (Optional)</Label>
                <Input
                  id="existingAdvisor"
                  value={formData.existingAdvisor}
                  onChange={(e) => setFormData(prev => ({ ...prev, existingAdvisor: e.target.value }))}
                  placeholder="Advisor name or firm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="additionalInfo">Additional Information (Optional)</Label>
                <Textarea
                  id="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={(e) => setFormData(prev => ({ ...prev, additionalInfo: e.target.value }))}
                  placeholder="Any specific questions or concerns you'd like to discuss..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy Notice */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Privacy Promise:</strong> Your information is never sold or shared with marketing companies. 
              We'll only connect you with vetted, fiduciary advisors who can help with your specific needs.
            </AlertDescription>
          </Alert>

          {/* Submit Buttons */}
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Submit Request
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}