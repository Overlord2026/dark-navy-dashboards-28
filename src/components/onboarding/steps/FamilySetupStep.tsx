import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  UserPlus, 
  Mail, 
  Trash2,
  CheckCircle,
  Heart
} from 'lucide-react';
import { motion } from 'framer-motion';

interface FamilySetupStepProps {
  data: any;
  onComplete: (data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
  currentStep: number;
  totalSteps: number;
}

interface FamilyMember {
  id: string;
  name: string;
  email: string;
  relationship: string;
  invited?: boolean;
}

const relationshipOptions = [
  'Spouse/Partner',
  'Child',
  'Parent',
  'Sibling',
  'Grandparent',
  'Grandchild',
  'Other Family',
  'Trusted Advisor'
];

export const FamilySetupStep: React.FC<FamilySetupStepProps> = ({
  data,
  onComplete,
  onNext,
  onPrevious,
  currentStep,
  totalSteps
}) => {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(
    data?.family?.members || []
  );
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    relationship: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddMember = () => {
    if (newMember.name && newMember.email && newMember.relationship) {
      const member: FamilyMember = {
        id: Date.now().toString(),
        ...newMember,
        invited: false
      };
      setFamilyMembers([...familyMembers, member]);
      setNewMember({ name: '', email: '', relationship: '' });
      setShowAddForm(false);
    }
  };

  const handleRemoveMember = (id: string) => {
    setFamilyMembers(familyMembers.filter(member => member.id !== id));
  };

  const handleSendInvites = async () => {
    // In a real app, this would send invitations
    const updatedMembers = familyMembers.map(member => ({
      ...member,
      invited: true
    }));
    setFamilyMembers(updatedMembers);
  };

  const handleContinue = () => {
    const familyData = {
      family: {
        members: familyMembers
      }
    };
    onComplete(familyData);
    onNext();
  };

  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto p-6"
    >
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Step {currentStep} of {totalSteps}</span>
          <span className="text-sm text-muted-foreground">{Math.round(progressPercentage)}% Complete</span>
        </div>
        <Progress value={progressPercentage} className="w-full" />
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <Users className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h2 className="text-3xl font-bold mb-4">Add Your Family</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Invite family members to collaborate on financial planning. This is completely optional and can be done later.
        </p>
      </div>

      {/* Family Members List */}
      {familyMembers.length > 0 && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              Your Family Members ({familyMembers.length})
            </h3>
            <div className="space-y-3">
              {familyMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                      </div>
                      <Badge variant="outline">{member.relationship}</Badge>
                      {member.invited && (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Invited
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveMember(member.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            {familyMembers.some(m => !m.invited) && (
              <div className="mt-4 pt-4 border-t">
                <Button onClick={handleSendInvites} className="w-full">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Invitations
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Add Family Member */}
      <Card className="mb-8">
        <CardContent className="p-6">
          {!showAddForm ? (
            <div className="text-center py-8">
              <UserPlus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Add Family Members</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Invite family members to view and collaborate on your family office portal
              </p>
              <Button onClick={() => setShowAddForm(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Family Member
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="font-semibold">Add Family Member</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={newMember.name}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newMember.email}
                    onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                    placeholder="Enter email address"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="relationship">Relationship</Label>
                <select
                  id="relationship"
                  value={newMember.relationship}
                  onChange={(e) => setNewMember({ ...newMember, relationship: e.target.value })}
                  className="w-full p-2 border border-input rounded-md bg-background"
                >
                  <option value="">Select relationship</option>
                  {relationshipOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddMember}>Add Member</Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Benefits Card */}
      <Card className="mb-8 bg-primary/5 border-primary/20">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-3">Family Collaboration Benefits</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Share financial goals and progress with family members</li>
            <li>• Collaborative estate and tax planning</li>
            <li>• Secure document sharing within the family</li>
            <li>• Multi-generational wealth planning</li>
            <li>• Role-based access controls for privacy</li>
          </ul>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleContinue}>
            Skip for Now
          </Button>
          <Button onClick={handleContinue}>
            Continue
          </Button>
        </div>
      </div>
    </motion.div>
  );
};