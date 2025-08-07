import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  FileText, 
  Users, 
  MapPin, 
  Shield, 
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Lightbulb,
  Download,
  Globe,
  CreditCard
} from 'lucide-react';

interface FormData {
  // Step 1 - Entity Type & Jurisdiction
  entityType: string;
  jurisdiction: string;
  entityName: string;
  businessPurpose: string;
  
  // Step 2 - Registered Agent & Address
  registeredAgentType: 'self' | 'service' | 'attorney';
  registeredAgentName?: string;
  registeredAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  
  // Step 3 - Management Structure
  managementStructure: 'member_managed' | 'manager_managed' | 'board_managed';
  members: Array<{
    name: string;
    email: string;
    ownership: number;
    role: string;
  }>;
  
  // Step 4 - Additional Options
  einApplication: boolean;
  operatingAgreement: boolean;
  bankingResolution: boolean;
  expeditedFiling: boolean;
}

export const EntityFormationWizard: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    entityType: '',
    jurisdiction: '',
    entityName: '',
    businessPurpose: '',
    registeredAgentType: 'self',
    registeredAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US'
    },
    managementStructure: 'member_managed',
    members: [{ name: '', email: '', ownership: 100, role: 'Managing Member' }],
    einApplication: true,
    operatingAgreement: true,
    bankingResolution: true,
    expeditedFiling: false
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const entityTypes = [
    { value: 'LLC', label: 'Limited Liability Company (LLC)', description: 'Flexible structure, pass-through taxation' },
    { value: 'C-Corp', label: 'C-Corporation', description: 'Double taxation, suitable for investors' },
    { value: 'S-Corp', label: 'S-Corporation', description: 'Pass-through taxation, restrictions apply' },
    { value: 'Partnership', label: 'Partnership', description: 'Two or more owners, pass-through taxation' },
    { value: 'Trust', label: 'Trust', description: 'Asset protection and estate planning' },
    { value: 'Foundation', label: 'Private Foundation', description: 'Charitable and family purposes' }
  ];

  const popularJurisdictions = [
    { value: 'DE', label: 'Delaware', benefits: 'Business-friendly courts, established law' },
    { value: 'NV', label: 'Nevada', benefits: 'No state income tax, privacy protection' },
    { value: 'WY', label: 'Wyoming', benefits: 'Strong asset protection, low fees' },
    { value: 'TX', label: 'Texas', benefits: 'No state income tax, business-friendly' },
    { value: 'FL', label: 'Florida', benefits: 'No state income tax, homestead protection' }
  ];

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const addMember = () => {
    updateFormData({
      members: [...formData.members, { name: '', email: '', ownership: 0, role: 'Member' }]
    });
  };

  const updateMember = (index: number, field: string, value: any) => {
    const updatedMembers = [...formData.members];
    updatedMembers[index] = { ...updatedMembers[index], [field]: value };
    updateFormData({ members: updatedMembers });
  };

  const getTotalOwnership = () => {
    return formData.members.reduce((sum, member) => sum + (member.ownership || 0), 0);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Entity Type & Jurisdiction</h3>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium">Select Entity Type</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                    {entityTypes.map(type => (
                      <Card 
                        key={type.value}
                        className={`cursor-pointer border-2 transition-all ${
                          formData.entityType === type.value 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => updateFormData({ entityType: type.value })}
                      >
                        <CardContent className="pt-4">
                          <div className="flex items-start gap-3">
                            <Building2 className="h-5 w-5 text-primary mt-1" />
                            <div className="flex-1">
                              <h4 className="font-medium">{type.label}</h4>
                              <p className="text-sm text-muted-foreground">{type.description}</p>
                            </div>
                            {formData.entityType === type.value && (
                              <CheckCircle className="h-5 w-5 text-primary" />
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="entity-name">Entity Name</Label>
                    <Input 
                      id="entity-name"
                      placeholder="Enter entity name"
                      value={formData.entityName}
                      onChange={(e) => updateFormData({ entityName: e.target.value })}
                    />
                    <p className="text-sm text-muted-foreground">
                      Will automatically add {formData.entityType} suffix
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Jurisdiction</Label>
                    <Select value={formData.jurisdiction} onValueChange={(value) => updateFormData({ jurisdiction: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state/country" />
                      </SelectTrigger>
                      <SelectContent>
                        <div className="p-2">
                          <p className="text-sm font-medium text-muted-foreground mb-2">Popular Choices</p>
                        </div>
                        {popularJurisdictions.map(state => (
                          <SelectItem key={state.value} value={state.value}>
                            <div className="flex items-center justify-between w-full">
                              <span>{state.label}</span>
                              <Badge variant="outline" className="text-xs ml-2">
                                {state.benefits.split(',')[0]}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="business-purpose">Business Purpose</Label>
                  <Textarea 
                    id="business-purpose"
                    placeholder="Describe the entity's business purpose..."
                    value={formData.businessPurpose}
                    onChange={(e) => updateFormData({ businessPurpose: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {formData.jurisdiction && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-medium text-blue-900">
                      {popularJurisdictions.find(j => j.value === formData.jurisdiction)?.label} Benefits
                    </h4>
                    <p className="text-sm text-blue-700">
                      {popularJurisdictions.find(j => j.value === formData.jurisdiction)?.benefits}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Registered Agent & Address</h3>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium">Registered Agent</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                    {[
                      { value: 'self', label: 'Self', description: 'Act as your own agent' },
                      { value: 'service', label: 'Service Company', description: 'Professional service' },
                      { value: 'attorney', label: 'Attorney', description: 'Legal professional' }
                    ].map(option => (
                      <Card 
                        key={option.value}
                        className={`cursor-pointer border-2 transition-all ${
                          formData.registeredAgentType === option.value 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => updateFormData({ registeredAgentType: option.value as any })}
                      >
                        <CardContent className="pt-4 text-center">
                          <div className="flex flex-col items-center gap-2">
                            <Users className="h-6 w-6 text-primary" />
                            <h4 className="font-medium">{option.label}</h4>
                            <p className="text-sm text-muted-foreground">{option.description}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="street">Street Address</Label>
                    <Input 
                      id="street"
                      placeholder="123 Main Street"
                      value={formData.registeredAddress.street}
                      onChange={(e) => updateFormData({ 
                        registeredAddress: { ...formData.registeredAddress, street: e.target.value }
                      })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input 
                      id="city"
                      placeholder="City"
                      value={formData.registeredAddress.city}
                      onChange={(e) => updateFormData({ 
                        registeredAddress: { ...formData.registeredAddress, city: e.target.value }
                      })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input 
                      id="state"
                      placeholder="State"
                      value={formData.registeredAddress.state}
                      onChange={(e) => updateFormData({ 
                        registeredAddress: { ...formData.registeredAddress, state: e.target.value }
                      })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="zip">ZIP Code</Label>
                    <Input 
                      id="zip"
                      placeholder="12345"
                      value={formData.registeredAddress.zipCode}
                      onChange={(e) => updateFormData({ 
                        registeredAddress: { ...formData.registeredAddress, zipCode: e.target.value }
                      })}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Management Structure & Ownership</h3>
              
              <div className="space-y-6">
                <div>
                  <Label className="text-base font-medium">Management Structure</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                    {[
                      { value: 'member_managed', label: 'Member Managed', description: 'All members can manage' },
                      { value: 'manager_managed', label: 'Manager Managed', description: 'Designated managers only' },
                      { value: 'board_managed', label: 'Board Managed', description: 'Board of directors' }
                    ].map(option => (
                      <Card 
                        key={option.value}
                        className={`cursor-pointer border-2 transition-all ${
                          formData.managementStructure === option.value 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => updateFormData({ managementStructure: option.value as any })}
                      >
                        <CardContent className="pt-4 text-center">
                          <div className="flex flex-col items-center gap-2">
                            <Shield className="h-6 w-6 text-primary" />
                            <h4 className="font-medium">{option.label}</h4>
                            <p className="text-sm text-muted-foreground">{option.description}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-base font-medium">Members & Ownership</Label>
                    <Button variant="outline" size="sm" onClick={addMember}>
                      <Users className="h-4 w-4 mr-2" />
                      Add Member
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {formData.members.map((member, index) => (
                      <Card key={index}>
                        <CardContent className="pt-4">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="space-y-2">
                              <Label>Name</Label>
                              <Input 
                                placeholder="Full name"
                                value={member.name}
                                onChange={(e) => updateMember(index, 'name', e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Email</Label>
                              <Input 
                                type="email"
                                placeholder="email@example.com"
                                value={member.email}
                                onChange={(e) => updateMember(index, 'email', e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Ownership %</Label>
                              <Input 
                                type="number"
                                min="0"
                                max="100"
                                placeholder="0"
                                value={member.ownership}
                                onChange={(e) => updateMember(index, 'ownership', parseFloat(e.target.value) || 0)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Role</Label>
                              <Select 
                                value={member.role} 
                                onValueChange={(value) => updateMember(index, 'role', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Managing Member">Managing Member</SelectItem>
                                  <SelectItem value="Member">Member</SelectItem>
                                  <SelectItem value="Manager">Manager</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="flex justify-between items-center mt-4 p-4 bg-muted rounded-lg">
                    <span className="font-medium">Total Ownership:</span>
                    <Badge variant={getTotalOwnership() === 100 ? "default" : "destructive"}>
                      {getTotalOwnership()}%
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Additional Services & Review</h3>
              
              <div className="space-y-6">
                <div>
                  <Label className="text-base font-medium mb-4 block">Optional Services</Label>
                  <div className="space-y-4">
                    {[
                      {
                        key: 'einApplication',
                        label: 'EIN Application',
                        description: 'Federal tax ID number application',
                        price: '$89',
                        recommended: true
                      },
                      {
                        key: 'operatingAgreement',
                        label: 'Operating Agreement',
                        description: 'Custom operating agreement draft',
                        price: '$299',
                        recommended: true
                      },
                      {
                        key: 'bankingResolution',
                        label: 'Banking Resolution',
                        description: 'Corporate resolution for banking',
                        price: '$49',
                        recommended: false
                      },
                      {
                        key: 'expeditedFiling',
                        label: 'Expedited Filing',
                        description: '24-48 hour processing',
                        price: '$199',
                        recommended: false
                      }
                    ].map(service => (
                      <div key={service.key} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Checkbox 
                            checked={formData[service.key as keyof FormData] as boolean}
                            onCheckedChange={(checked) => updateFormData({ [service.key]: checked })}
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{service.label}</h4>
                              {service.recommended && (
                                <Badge variant="secondary" className="text-xs">Recommended</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{service.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{service.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Card className="bg-primary/5 border-primary">
                  <CardContent className="pt-6">
                    <h4 className="font-semibold mb-4">Formation Summary</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Entity Type</p>
                        <p className="font-medium">{formData.entityType}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Jurisdiction</p>
                        <p className="font-medium">{formData.jurisdiction}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Entity Name</p>
                        <p className="font-medium">{formData.entityName} {formData.entityType}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Members</p>
                        <p className="font-medium">{formData.members.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Entity Formation Wizard</h2>
          <Badge variant="outline">Step {currentStep} of {totalSteps}</Badge>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

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

      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : onClose()}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          {currentStep > 1 ? 'Previous' : 'Cancel'}
        </Button>
        
        <Button
          onClick={() => {
            if (currentStep < totalSteps) {
              setCurrentStep(currentStep + 1);
            } else {
              // Complete formation
              onClose();
            }
          }}
          disabled={
            (currentStep === 1 && (!formData.entityType || !formData.entityName || !formData.jurisdiction)) ||
            (currentStep === 3 && getTotalOwnership() !== 100)
          }
        >
          {currentStep < totalSteps ? (
            <>
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </>
          ) : (
            <>
              Create Entity
              <CheckCircle className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};