import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  GraduationCap, 
  Home, 
  Shield, 
  Heart, 
  DollarSign,
  Building,
  TrendingUp,
  CheckCircle,
  Plus
} from 'lucide-react';
import { motion } from 'framer-motion';
// import { GoalDetailsModal } from '../GoalDetailsModal';

interface GoalSettingStepProps {
  data: any;
  onComplete: (data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
  currentStep: number;
  totalSteps: number;
}

const goalTypes = [
  {
    id: 'retirement',
    name: 'Retirement Planning',
    icon: Target,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    description: 'Plan for a comfortable retirement'
  },
  {
    id: 'education',
    name: 'Education Funding',
    icon: GraduationCap,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    description: 'Save for education expenses'
  },
  {
    id: 'real-estate',
    name: 'Real Estate',
    icon: Home,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    description: 'Property investment goals'
  },
  {
    id: 'estate',
    name: 'Estate Planning',
    icon: Shield,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    description: 'Legacy and estate planning'
  },
  {
    id: 'health',
    name: 'Health & Wellness',
    icon: Heart,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    description: 'Healthcare and wellness goals'
  },
  {
    id: 'wealth',
    name: 'Wealth Building',
    icon: TrendingUp,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    description: 'General wealth accumulation'
  },
  {
    id: 'tax',
    name: 'Tax Optimization',
    icon: DollarSign,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    description: 'Tax planning and optimization'
  },
  {
    id: 'charity',
    name: 'Charitable Giving',
    icon: Heart,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    description: 'Philanthropic objectives'
  },
  {
    id: 'business',
    name: 'Business Goals',
    icon: Building,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    description: 'Business and investment goals'
  }
];

export const GoalSettingStep: React.FC<GoalSettingStepProps> = ({
  data,
  onComplete,
  onNext,
  onPrevious,
  currentStep,
  totalSteps
}) => {
  const [selectedGoals, setSelectedGoals] = useState<string[]>(data?.goals?.selected || []);
  const [goalDetails, setGoalDetails] = useState(data?.goals?.details || {});
  const [showModal, setShowModal] = useState(false);
  const [currentGoal, setCurrentGoal] = useState<string | null>(null);

  const handleGoalToggle = (goalId: string) => {
    if (selectedGoals.includes(goalId)) {
      setSelectedGoals(prev => prev.filter(id => id !== goalId));
      // Remove details when deselecting goal
      const newDetails = { ...goalDetails };
      delete newDetails[goalId];
      setGoalDetails(newDetails);
    } else {
      setSelectedGoals(prev => [...prev, goalId]);
      // Open modal to add details
      setCurrentGoal(goalId);
      setShowModal(true);
    }
  };

  const handleGoalDetails = (goalId: string, details: any) => {
    setGoalDetails(prev => ({
      ...prev,
      [goalId]: details
    }));
    setShowModal(false);
    setCurrentGoal(null);
  };

  const handleContinue = () => {
    const goalData = {
      goals: {
        selected: selectedGoals,
        details: goalDetails
      }
    };
    onComplete(goalData);
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
        <h2 className="text-3xl font-bold mb-4">Set Your Financial Goals</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Select the goals that matter most to you. You can add details now or skip and set them up later.
        </p>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {goalTypes.map((goal) => {
          const isSelected = selectedGoals.includes(goal.id);
          const hasDetails = goalDetails[goal.id];

          return (
            <Card 
              key={goal.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-md ${
                isSelected ? 'ring-2 ring-primary border-primary' : 'hover:border-primary/50'
              }`}
              onClick={() => handleGoalToggle(goal.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${goal.bgColor}`}>
                    <goal.icon className={`h-5 w-5 ${goal.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{goal.name}</h3>
                    <p className="text-sm text-muted-foreground">{goal.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {hasDetails && (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    )}
                    {isSelected && !hasDetails && (
                      <Plus className="h-4 w-4 text-primary" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Selected Goals Summary */}
      {selectedGoals.length > 0 && (
        <Card className="mb-8 bg-primary/5 border-primary/20">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Your Selected Goals ({selectedGoals.length})</h3>
            <div className="flex flex-wrap gap-2">
              {selectedGoals.map(goalId => {
                const goal = goalTypes.find(g => g.id === goalId);
                const hasDetails = goalDetails[goalId];
                return goal ? (
                  <Badge 
                    key={goalId} 
                    variant="secondary" 
                    className="flex items-center gap-1 cursor-pointer hover:bg-primary/20"
                    onClick={() => {
                      setCurrentGoal(goalId);
                      setShowModal(true);
                    }}
                  >
                    <goal.icon className="h-3 w-3" />
                    {goal.name}
                    {hasDetails && <CheckCircle className="h-3 w-3 text-green-600" />}
                  </Badge>
                ) : null;
              })}
            </div>
          </CardContent>
        </Card>
      )}

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

      {/* Simple Goal Details Form */}
      {showModal && currentGoal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                {goalTypes.find(g => g.id === currentGoal)?.name} Details
              </h3>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Goal details can be added later in your dashboard. For now, we'll save this as a priority goal.
                </p>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleGoalDetails(currentGoal, { priority: 'high', addedAt: new Date().toISOString() })}
                    className="flex-1"
                  >
                    Save Goal
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowModal(false);
                      setCurrentGoal(null);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </motion.div>
  );
};