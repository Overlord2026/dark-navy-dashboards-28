import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Plus, Trash2 } from 'lucide-react';
import { analytics } from '@/lib/analytics';

interface HouseholdMember {
  id: string;
  firstName: string;
  lastName: string;
  relationship: string;
  dateOfBirth: string;
}

interface HouseholdData {
  members: HouseholdMember[];
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

interface HouseholdProps {
  onComplete: (data: HouseholdData) => void;
  persona: string;
  segment: string;
  initialData?: Partial<HouseholdData>;
}

export const Household: React.FC<HouseholdProps> = ({
  onComplete,
  persona,
  segment,
  initialData
}) => {
  const [members, setMembers] = useState<HouseholdMember[]>(
    initialData?.members || []
  );
  
  const [address, setAddress] = useState({
    street: initialData?.address?.street || '',
    city: initialData?.address?.city || '',
    state: initialData?.address?.state || '',
    zipCode: initialData?.address?.zipCode || '',
    country: initialData?.address?.country || 'US'
  });

  const addMember = () => {
    const newMember: HouseholdMember = {
      id: Date.now().toString(),
      firstName: '',
      lastName: '',
      relationship: '',
      dateOfBirth: ''
    };
    setMembers(prev => [...prev, newMember]);
  };

  const updateMember = (id: string, field: keyof Omit<HouseholdMember, 'id'>, value: string) => {
    setMembers(prev => prev.map(member => 
      member.id === id ? { ...member, [field]: value } : member
    ));
  };

  const removeMember = (id: string) => {
    setMembers(prev => prev.filter(member => member.id !== id));
  };

  const updateAddress = (field: keyof typeof address, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data: HouseholdData = {
      members,
      address
    };

    analytics.trackEvent('onboarding.step_completed', {
      step: 'household',
      persona,
      segment,
      household_size: members.length + 1, // +1 for primary person
      has_address: !!(address.street && address.city)
    });

    onComplete(data);
  };

  const handleSkip = () => {
    analytics.trackEvent('onboarding.step_completed', {
      step: 'household',
      persona,
      segment,
      skipped: true
    });
    
    onComplete({
      members: [],
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'US'
      }
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="h-6 w-6 text-primary" />
        </div>
        <CardTitle>Household Information</CardTitle>
        <CardDescription>
          Add family members and your address to complete your profile
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Address Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Address</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="street">Street Address</Label>
                <Input
                  id="street"
                  value={address.street}
                  onChange={(e) => updateAddress('street', e.target.value)}
                  placeholder="123 Main Street"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={address.city}
                    onChange={(e) => updateAddress('city', e.target.value)}
                    placeholder="New York"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={address.state}
                    onChange={(e) => updateAddress('state', e.target.value)}
                    placeholder="NY"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    value={address.zipCode}
                    onChange={(e) => updateAddress('zipCode', e.target.value)}
                    placeholder="10001"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Household Members Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Household Members</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addMember}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Member
              </Button>
            </div>

            {members.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No household members added yet. Click "Add Member" to include family members.
              </p>
            ) : (
              <div className="space-y-4">
                {members.map((member) => (
                  <Card key={member.id} className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`firstName-${member.id}`}>First Name</Label>
                        <Input
                          id={`firstName-${member.id}`}
                          value={member.firstName}
                          onChange={(e) => updateMember(member.id, 'firstName', e.target.value)}
                          placeholder="First name"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`lastName-${member.id}`}>Last Name</Label>
                        <Input
                          id={`lastName-${member.id}`}
                          value={member.lastName}
                          onChange={(e) => updateMember(member.id, 'lastName', e.target.value)}
                          placeholder="Last name"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`relationship-${member.id}`}>Relationship</Label>
                        <Select 
                          value={member.relationship} 
                          onValueChange={(value) => updateMember(member.id, 'relationship', value)}
                        >
                          <SelectTrigger id={`relationship-${member.id}`}>
                            <SelectValue placeholder="Relationship" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="spouse">Spouse</SelectItem>
                            <SelectItem value="child">Child</SelectItem>
                            <SelectItem value="parent">Parent</SelectItem>
                            <SelectItem value="sibling">Sibling</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-end gap-2">
                        <div className="flex-1 space-y-2">
                          <Label htmlFor={`dob-${member.id}`}>Date of Birth</Label>
                          <Input
                            id={`dob-${member.id}`}
                            type="date"
                            value={member.dateOfBirth}
                            onChange={(e) => updateMember(member.id, 'dateOfBirth', e.target.value)}
                          />
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeMember(member.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove member</span>
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              Continue
            </Button>
            <Button type="button" variant="outline" onClick={handleSkip}>
              Skip
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};