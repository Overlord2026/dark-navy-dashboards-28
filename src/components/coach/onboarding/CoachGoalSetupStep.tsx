import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Target,
  Calendar,
  BarChart3,
  ArrowRight
} from 'lucide-react';

interface CoachGoalSetupStepProps {
  onNext: () => void;
}

export const CoachGoalSetupStep: React.FC<CoachGoalSetupStepProps> = ({ onNext }) => {
  const [goalData, setGoalData] = useState({
    title: '',
    description: '',
    targetValue: '',
    currentValue: '',
    deadline: '',
    kpiType: '',
    trackingFrequency: 'weekly'
  });

  const handleInputChange = (field: string, value: string) => {
    setGoalData(prev => ({ ...prev, [field]: value }));
  };

  const kpiTypes = [
    { value: 'revenue', label: 'Revenue Growth' },
    { value: 'customers', label: 'Customer Acquisition' },
    { value: 'retention', label: 'Customer Retention' },
    { value: 'productivity', label: 'Team Productivity' },
    { value: 'satisfaction', label: 'Customer Satisfaction' },
    { value: 'conversion', label: 'Conversion Rate' },
    { value: 'custom', label: 'Custom KPI' }
  ];

  const isFormValid = goalData.title && goalData.targetValue && goalData.deadline && goalData.kpiType;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Set Up Your First Goal/KPI Tracker</h1>
        <p className="text-lg text-muted-foreground">
          Create a measurable goal to start tracking client progress
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="h-5 w-5 mr-2" />
            Goal & KPI Setup
          </CardTitle>
          <CardDescription>
            Define what success looks like for your clients
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Goal Title</Label>
            <Input
              id="title"
              value={goalData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="e.g., Increase Monthly Revenue by 25%"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={goalData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Detailed description of the goal and how it will be achieved"
              rows={3}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currentValue">Current Value</Label>
              <Input
                id="currentValue"
                value={goalData.currentValue}
                onChange={(e) => handleInputChange('currentValue', e.target.value)}
                placeholder="e.g., $50,000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetValue">Target Value</Label>
              <Input
                id="targetValue"
                value={goalData.targetValue}
                onChange={(e) => handleInputChange('targetValue', e.target.value)}
                placeholder="e.g., $62,500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline">Deadline</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="deadline"
                type="date"
                value={goalData.deadline}
                onChange={(e) => handleInputChange('deadline', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="kpiType">KPI Type</Label>
            <Select value={goalData.kpiType} onValueChange={(value) => handleInputChange('kpiType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select KPI type" />
              </SelectTrigger>
              <SelectContent>
                {kpiTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="trackingFrequency">Tracking Frequency</Label>
            <Select value={goalData.trackingFrequency} onValueChange={(value) => handleInputChange('trackingFrequency', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-6 mt-6">
        <div className="flex items-center mb-3">
          <BarChart3 className="h-5 w-5 text-primary mr-2" />
          <h3 className="text-lg font-semibold">Automatic Progress Tracking</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Once set up, you can update progress regularly and generate automated reports to share with your clients. 
          Premium users get AI insights and trend predictions.
        </p>
      </div>

      <div className="mt-8 text-center">
        <Button 
          onClick={onNext}
          size="lg"
          disabled={!isFormValid}
          className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
        >
          Continue to Payment
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};