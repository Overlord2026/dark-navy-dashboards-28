import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, User, Users, MapPin } from 'lucide-react';
import { OnboardingStepData } from '@/types/onboarding';

interface ClientInfoStepProps {
  data: OnboardingStepData;
  onComplete: (stepData: Partial<OnboardingStepData>) => void;
  onNext: () => void;
  onPrevious: () => void;
  isLoading?: boolean;
}

interface HouseholdMember {
  firstName: string;
  lastName: string;
  relationship: string;
  dateOfBirth?: string;
  ssn?: string;
}

export const ClientInfoStep: React.FC<ClientInfoStepProps> = ({
  data,
  onComplete,
  onNext,
  onPrevious,
  isLoading
}) => {
  const [primaryClient, setPrimaryClient] = useState({
    firstName: data.clientInfo?.primaryClient?.firstName || '',
    lastName: data.clientInfo?.primaryClient?.lastName || '',
    email: data.clientInfo?.primaryClient?.email || '',
    phone: data.clientInfo?.primaryClient?.phone || '',
    dateOfBirth: data.clientInfo?.primaryClient?.dateOfBirth || '',
    ssn: data.clientInfo?.primaryClient?.ssn || '',
    citizenship: data.clientInfo?.primaryClient?.citizenship || 'US',
    maritalStatus: data.clientInfo?.primaryClient?.maritalStatus || ''
  });

  const [householdMembers, setHouseholdMembers] = useState<HouseholdMember[]>(
    data.clientInfo?.householdMembers || []
  );

  const [address, setAddress] = useState({
    street: data.clientInfo?.address?.street || '',
    city: data.clientInfo?.address?.city || '',
    state: data.clientInfo?.address?.state || '',
    zipCode: data.clientInfo?.address?.zipCode || '',
    country: data.clientInfo?.address?.country || 'US'
  });

  const [activeTab, setActiveTab] = useState('primary');

  const addHouseholdMember = () => {
    setHouseholdMembers([
      ...householdMembers,
      {
        firstName: '',
        lastName: '',
        relationship: '',
        dateOfBirth: '',
        ssn: ''
      }
    ]);
  };

  const updateHouseholdMember = (index: number, field: keyof HouseholdMember, value: string) => {
    const updated = [...householdMembers];
    updated[index] = { ...updated[index], [field]: value };
    setHouseholdMembers(updated);
  };

  const removeHouseholdMember = (index: number) => {
    setHouseholdMembers(householdMembers.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const required = ['firstName', 'lastName', 'email', 'phone'];
    return required.every(field => primaryClient[field as keyof typeof primaryClient]);
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    const clientInfoData = {
      clientInfo: {
        primaryClient,
        householdMembers,
        address
      }
    };

    onComplete(clientInfoData);
  };

  const US_STATES = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  const RELATIONSHIPS = [
    'Spouse', 'Child', 'Parent', 'Sibling', 'Grandparent', 
    'Grandchild', 'Uncle/Aunt', 'Nephew/Niece', 'Cousin', 'Other'
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">
            Personal Information
          </h2>
          <p className="text-muted-foreground">
            Tell us about yourself and your household members.
          </p>
        </div>
        <Badge variant="outline" className="flex items-center gap-1">
          <User className="h-3 w-3" />
          {householdMembers.length + 1} Member{householdMembers.length !== 0 ? 's' : ''}
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="primary" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Primary Client
          </TabsTrigger>
          <TabsTrigger value="household" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Household ({householdMembers.length})
          </TabsTrigger>
          <TabsTrigger value="address" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Address
          </TabsTrigger>
        </TabsList>

        <TabsContent value="primary" className="space-y-6">
          <Card className="premium-card">
            <CardHeader>
              <CardTitle>Primary Client Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={primaryClient.firstName}
                    onChange={(e) => setPrimaryClient({ ...primaryClient, firstName: e.target.value })}
                    placeholder="John"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={primaryClient.lastName}
                    onChange={(e) => setPrimaryClient({ ...primaryClient, lastName: e.target.value })}
                    placeholder="Smith"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={primaryClient.email}
                    onChange={(e) => setPrimaryClient({ ...primaryClient, email: e.target.value })}
                    placeholder="john.smith@email.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={primaryClient.phone}
                    onChange={(e) => setPrimaryClient({ ...primaryClient, phone: e.target.value })}
                    placeholder="(555) 123-4567"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={primaryClient.dateOfBirth}
                    onChange={(e) => setPrimaryClient({ ...primaryClient, dateOfBirth: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maritalStatus">Marital Status</Label>
                  <Select
                    value={primaryClient.maritalStatus}
                    onValueChange={(value) => setPrimaryClient({ ...primaryClient, maritalStatus: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="married">Married</SelectItem>
                      <SelectItem value="divorced">Divorced</SelectItem>
                      <SelectItem value="widowed">Widowed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ssn">Social Security Number</Label>
                  <Input
                    id="ssn"
                    type="password"
                    value={primaryClient.ssn}
                    onChange={(e) => setPrimaryClient({ ...primaryClient, ssn: e.target.value })}
                    placeholder="###-##-####"
                  />
                  <p className="text-xs text-muted-foreground">
                    Encrypted and secure. Required for account opening.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="citizenship">Citizenship</Label>
                  <Select
                    value={primaryClient.citizenship}
                    onValueChange={(value) => setPrimaryClient({ ...primaryClient, citizenship: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="US">United States</SelectItem>
                      <SelectItem value="CA">Canada</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="household" className="space-y-6">
          <Card className="premium-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Household Members</CardTitle>
              <Button onClick={addHouseholdMember} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {householdMembers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No household members added yet.</p>
                  <p className="text-sm">Click "Add Member" to include family members.</p>
                </div>
              ) : (
                householdMembers.map((member, index) => (
                  <Card key={index} className="relative">
                    <CardHeader className="flex flex-row items-center justify-between pb-4">
                      <h4 className="font-semibold">Member {index + 1}</h4>
                      <Button
                        onClick={() => removeHouseholdMember(index)}
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>First Name</Label>
                          <Input
                            value={member.firstName}
                            onChange={(e) => updateHouseholdMember(index, 'firstName', e.target.value)}
                            placeholder="Jane"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Last Name</Label>
                          <Input
                            value={member.lastName}
                            onChange={(e) => updateHouseholdMember(index, 'lastName', e.target.value)}
                            placeholder="Smith"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Relationship</Label>
                          <Select
                            value={member.relationship}
                            onValueChange={(value) => updateHouseholdMember(index, 'relationship', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              {RELATIONSHIPS.map(rel => (
                                <SelectItem key={rel} value={rel.toLowerCase()}>
                                  {rel}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Date of Birth</Label>
                          <Input
                            type="date"
                            value={member.dateOfBirth}
                            onChange={(e) => updateHouseholdMember(index, 'dateOfBirth', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>SSN (if applicable)</Label>
                          <Input
                            type="password"
                            value={member.ssn}
                            onChange={(e) => updateHouseholdMember(index, 'ssn', e.target.value)}
                            placeholder="###-##-####"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="address" className="space-y-6">
          <Card className="premium-card">
            <CardHeader>
              <CardTitle>Primary Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="street">Street Address</Label>
                <Input
                  id="street"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  placeholder="123 Main Street, Apt 4B"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    placeholder="New York"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Select
                    value={address.state}
                    onValueChange={(value) => setAddress({ ...address, state: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {US_STATES.map(state => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    value={address.zipCode}
                    onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                    placeholder="10001"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select
                    value={address.country}
                    onValueChange={(value) => setAddress({ ...address, country: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="US">United States</SelectItem>
                      <SelectItem value="CA">Canada</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button onClick={onPrevious} variant="outline">
          Previous
        </Button>
        <Button 
          onClick={handleSave}
          disabled={!validateForm() || isLoading}
          className="btn-primary-gold"
        >
          {isLoading ? 'Saving...' : 'Save & Continue'}
        </Button>
      </div>
    </div>
  );
};