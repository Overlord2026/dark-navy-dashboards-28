import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Upload, UserPlus, CreditCard, MessageSquare } from 'lucide-react';

interface SportsAgentAthleteSetupStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

export const SportsAgentAthleteSetupStep: React.FC<SportsAgentAthleteSetupStepProps> = ({ 
  onNext, 
  onPrevious 
}) => {
  const [athleteData, setAthleteData] = useState({
    name: '',
    sport: '',
    position: '',
    team: '',
    email: '',
    phone: ''
  });

  const [setupOptions, setSetupOptions] = useState({
    addAthlete: false,
    uploadContract: false,
    linkFinancials: false,
    inviteAthlete: false
  });

  const sports = [
    'Football (NFL)', 'Basketball (NBA)', 'Baseball (MLB)', 'Hockey (NHL)', 
    'Soccer (MLS)', 'Tennis', 'Golf', 'Track & Field', 'Swimming', 
    'Gymnastics', 'Boxing', 'MMA', 'College Football', 'College Basketball', 'Other'
  ];

  const handleAthleteChange = (field: string, value: string) => {
    setAthleteData(prev => ({ ...prev, [field]: value }));
  };

  const handleOptionToggle = (option: keyof typeof setupOptions) => {
    setSetupOptions(prev => ({ ...prev, [option]: !prev[option] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          Athlete Management Setup
        </h2>
        <p className="text-xl text-muted-foreground">
          Add your first athlete and set up essential management tools
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Add Athlete */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <UserPlus className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>Add Your First Athlete</CardTitle>
                <CardDescription>
                  Start building your athlete portfolio
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="athleteName">Athlete Name</Label>
              <Input
                id="athleteName"
                value={athleteData.name}
                onChange={(e) => handleAthleteChange('name', e.target.value)}
                placeholder="Enter athlete's full name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sport">Sport</Label>
                <Select onValueChange={(value) => handleAthleteChange('sport', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sport" />
                  </SelectTrigger>
                  <SelectContent>
                    {sports.map((sport) => (
                      <SelectItem key={sport} value={sport}>
                        {sport}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  value={athleteData.position}
                  onChange={(e) => handleAthleteChange('position', e.target.value)}
                  placeholder="Position/Role"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="team">Current Team/Organization</Label>
              <Input
                id="team"
                value={athleteData.team}
                onChange={(e) => handleAthleteChange('team', e.target.value)}
                placeholder="Team, college, or organization"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="athleteEmail">Email</Label>
                <Input
                  id="athleteEmail"
                  type="email"
                  value={athleteData.email}
                  onChange={(e) => handleAthleteChange('email', e.target.value)}
                  placeholder="athlete@email.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="athletePhone">Phone</Label>
                <Input
                  id="athletePhone"
                  type="tel"
                  value={athleteData.phone}
                  onChange={(e) => handleAthleteChange('phone', e.target.value)}
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Setup Options */}
        <Card>
          <CardHeader>
            <CardTitle>Optional Setup Tasks</CardTitle>
            <CardDescription>
              Choose what you'd like to set up now (you can do these later)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div 
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                setupOptions.uploadContract ? 'border-primary bg-primary/5' : 'border-muted-foreground/20'
              }`}
              onClick={() => handleOptionToggle('uploadContract')}
            >
              <div className="flex items-center gap-3">
                <Upload className="h-5 w-5 text-primary" />
                <div>
                  <h4 className="font-medium">Upload First Contract or NIL Deal</h4>
                  <p className="text-sm text-muted-foreground">
                    Securely store athlete agreements
                  </p>
                </div>
              </div>
            </div>

            <div 
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                setupOptions.linkFinancials ? 'border-primary bg-primary/5' : 'border-muted-foreground/20'
              }`}
              onClick={() => handleOptionToggle('linkFinancials')}
            >
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-primary" />
                <div>
                  <h4 className="font-medium">Link Financial Accounts (Plaid)</h4>
                  <p className="text-sm text-muted-foreground">
                    Connect bank accounts for financial tracking
                  </p>
                </div>
              </div>
            </div>

            <div 
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                setupOptions.inviteAthlete ? 'border-primary bg-primary/5' : 'border-muted-foreground/20'
              }`}
              onClick={() => handleOptionToggle('inviteAthlete')}
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="h-5 w-5 text-primary" />
                <div>
                  <h4 className="font-medium">Invite Athlete to Their Portal</h4>
                  <p className="text-sm text-muted-foreground">
                    Give athletes access to their own dashboard
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-medium mb-2">Pro Tip</h4>
              <p className="text-sm text-muted-foreground">
                Don't worry about setting everything up now. You can add more athletes, 
                upload contracts, and configure settings anytime from your dashboard.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between mt-8">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onPrevious}
        >
          Back
        </Button>
        <Button 
          onClick={handleSubmit}
          className="px-8"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};