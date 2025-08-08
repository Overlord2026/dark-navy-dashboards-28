import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EnhancedProfile } from '@/types/swag-retirement';

interface EnhancedProfileFormProps {
  profile: EnhancedProfile;
  onProfileChange: (profile: EnhancedProfile) => void;
  onSave: () => void;
}

export const EnhancedProfileForm: React.FC<EnhancedProfileFormProps> = ({
  profile,
  onProfileChange,
  onSave
}) => {
  const updateClientInfo = (field: string, value: any) => {
    onProfileChange({
      ...profile,
      primaryClient: { ...profile.primaryClient, [field]: value }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enhanced Client Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="client-name">Full Name</Label>
            <Input
              id="client-name"
              value={profile.primaryClient.name}
              onChange={(e) => updateClientInfo('name', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="client-age">Age</Label>
            <Input
              id="client-age"
              type="number"
              value={profile.primaryClient.age}
              onChange={(e) => updateClientInfo('age', parseInt(e.target.value))}
            />
          </div>
        </div>
        <Button onClick={onSave} className="w-full">
          Save Profile
        </Button>
      </CardContent>
    </Card>
  );
};