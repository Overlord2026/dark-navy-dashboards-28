import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Target, Plus, X, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

interface FamilyGoalsStepProps {
  data: any;
  onComplete: (data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
  currentStep: number;
  totalSteps: number;
}

export const FamilyGoalsStep: React.FC<FamilyGoalsStepProps> = ({
  data,
  onComplete,
  onNext,
  onPrevious,
  currentStep,
  totalSteps
}) => {
  // Load saved data from localStorage if available
  const loadSavedData = () => {
    const saved = localStorage.getItem('onboarding-family-goals');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  };

  const savedData = loadSavedData();
  
  const [familyMembers, setFamilyMembers] = React.useState<string[]>(
    savedData?.clientInfo?.householdMembers?.map((m: any) => `${m.firstName} ${m.lastName}`) ||
    data?.clientInfo?.householdMembers?.map((m: any) => `${m.firstName} ${m.lastName}`) || []
  );
  const [newMember, setNewMember] = React.useState('');
  const [selectedGoals, setSelectedGoals] = React.useState<string[]>(
    savedData?.goals?.selected || data?.goals?.selected || []
  );
  const [customGoal, setCustomGoal] = React.useState('');

  const suggestedGoals = [
    'Retirement Planning',
    'Education Funding',
    'Estate Planning',
    'Tax Optimization',
    'Wealth Preservation',
    'Charitable Giving',
    'Real Estate Investment',
    'Emergency Fund'
  ];

  const addFamilyMember = () => {
    if (newMember.trim()) {
      const newFamilyMembers = [...familyMembers, newMember.trim()];
      setFamilyMembers(newFamilyMembers);
      setNewMember('');
      
      // Auto-save to localStorage
      const currentData = {
        clientInfo: {
          ...data?.clientInfo,
          householdMembers: newFamilyMembers.map(name => {
            const [firstName, ...lastNameParts] = name.split(' ');
            return {
              firstName,
              lastName: lastNameParts.join(' ') || '',
              relationship: 'Family Member'
            };
          })
        },
        goals: {
          selected: selectedGoals
        }
      };
      localStorage.setItem('onboarding-family-goals', JSON.stringify(currentData));
    }
  };

  const removeFamilyMember = (index: number) => {
    setFamilyMembers(familyMembers.filter((_, i) => i !== index));
  };

  const toggleGoal = (goal: string) => {
    const newSelectedGoals = selectedGoals.includes(goal) 
      ? selectedGoals.filter(g => g !== goal)
      : [...selectedGoals, goal];
      
    setSelectedGoals(newSelectedGoals);
    
    // Auto-save to localStorage
    const currentData = {
      clientInfo: {
        ...data?.clientInfo,
        householdMembers: familyMembers.map(name => {
          const [firstName, ...lastNameParts] = name.split(' ');
          return {
            firstName,
            lastName: lastNameParts.join(' ') || '',
            relationship: 'Family Member'
          };
        })
      },
      goals: {
        selected: newSelectedGoals
      }
    };
    localStorage.setItem('onboarding-family-goals', JSON.stringify(currentData));
  };

  const addCustomGoal = () => {
    if (customGoal.trim() && !selectedGoals.includes(customGoal.trim())) {
      setSelectedGoals([...selectedGoals, customGoal.trim()]);
      setCustomGoal('');
    }
  };

  const handleSubmit = () => {
    const formData = {
      clientInfo: {
        ...data?.clientInfo,
        householdMembers: familyMembers.map(name => {
          const [firstName, ...lastNameParts] = name.split(' ');
          return {
            firstName,
            lastName: lastNameParts.join(' ') || '',
            relationship: 'Family Member'
          };
        })
      },
      goals: {
        selected: selectedGoals
      }
    };
    
    // Save data locally before completing
    localStorage.setItem('onboarding-family-goals', JSON.stringify(formData));
    onComplete(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Progress Indicator */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <span>Step {currentStep} of {totalSteps}</span>
        <div className="flex-1 bg-muted h-1 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Header */}
      <div className="text-center space-y-3">
        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
          <Heart className="w-6 h-6 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Set Up Your Family & Goals (Optional)</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Add family members and define your financial goals. This helps us personalize your experience.
        </p>
      </div>

      {/* Family Section */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Invite Family Members</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                value={newMember}
                onChange={(e) => setNewMember(e.target.value)}
                placeholder="Enter family member name"
                onKeyPress={(e) => e.key === 'Enter' && addFamilyMember()}
              />
              <Button type="button" onClick={addFamilyMember} variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            {familyMembers.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {familyMembers.map((member, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {member}
                    <X 
                      className="w-3 h-3 cursor-pointer hover:text-destructive" 
                      onClick={() => removeFamilyMember(index)}
                    />
                  </Badge>
                ))}
              </div>
            )}
            
            <p className="text-xs text-muted-foreground">
              Family members can be invited to view relevant information and collaborate on goals.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Goals Section */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Your Financial Goals</h3>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {suggestedGoals.map((goal) => (
                <Badge
                  key={goal}
                  variant={selectedGoals.includes(goal) ? "default" : "outline"}
                  className="cursor-pointer justify-center p-2 text-center"
                  onClick={() => toggleGoal(goal)}
                >
                  {goal}
                </Badge>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Input
                value={customGoal}
                onChange={(e) => setCustomGoal(e.target.value)}
                placeholder="Add a custom goal"
                onKeyPress={(e) => e.key === 'Enter' && addCustomGoal()}
              />
              <Button type="button" onClick={addCustomGoal} variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground">
              Select goals that matter to you. We'll use these to recommend relevant experts and resources.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Benefits */}
      <Card className="bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200">
        <CardContent className="p-4">
          <h4 className="font-medium text-foreground mb-2">Why set up family & goals?</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Get personalized expert recommendations</li>
            <li>• Collaborate with family on shared goals</li>
            <li>• Track progress together</li>
            <li>• All completely optional and private</li>
          </ul>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onComplete({})}
            className="flex items-center gap-2"
          >
            Skip This Step
          </Button>
          
          <Button
            onClick={handleSubmit}
            className="flex items-center gap-2"
          >
            Continue
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};