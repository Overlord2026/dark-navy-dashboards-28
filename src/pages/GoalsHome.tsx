import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Target, 
  TrendingUp, 
  Shield, 
  CreditCard, 
  Home, 
  GraduationCap,
  Plane,
  Heart,
  Activity,
  Building,
  PieChart,
  Landmark
} from 'lucide-react';
import { usePersonalizationStore } from '@/features/personalization/store';
import { getGoalTemplates, getBucketListTemplates, hasAdvancedTemplates, getTemplateCount } from '@/features/goals/templates';
import { toast } from 'sonner';

const iconMap = {
  Shield,
  CreditCard,
  Home,
  GraduationCap,
  Plane,
  Heart,
  Activity,
  Building,
  TrendingUp,
  PieChart,
  Landmark,
  Target
};

const colorMap = {
  blue: 'bg-blue-100 text-blue-800 border-blue-200',
  red: 'bg-red-100 text-red-800 border-red-200',
  green: 'bg-green-100 text-green-800 border-green-200',
  purple: 'bg-purple-100 text-purple-800 border-purple-200',
  orange: 'bg-orange-100 text-orange-800 border-orange-200',
  pink: 'bg-pink-100 text-pink-800 border-pink-200',
  teal: 'bg-teal-100 text-teal-800 border-teal-200',
  indigo: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  violet: 'bg-violet-100 text-violet-800 border-violet-200',
  emerald: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  amber: 'bg-amber-100 text-amber-800 border-amber-200'
};

export default function GoalsHome() {
  const { persona, tier } = usePersonalizationStore();
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [goalForm, setGoalForm] = useState({
    title: '',
    description: '',
    targetAmount: '',
    targetDate: '',
    priority: 'medium'
  });

  // Get templates based on current persona and tier
  const goalTemplates = getGoalTemplates(persona, tier);
  const bucketListTemplates = getBucketListTemplates();
  const templateCount = getTemplateCount(persona, tier);

  const handleTemplateSelect = (template: any) => {
    setSelectedTemplate(template);
    setGoalForm({
      title: template.title,
      description: template.description,
      targetAmount: template.targetAmountRange.min.toString(),
      targetDate: '',
      priority: 'medium'
    });
    setShowCreateDialog(true);
  };

  const handleCreateGoal = () => {
    // Mock goal creation
    toast.success('Goal created successfully!', {
      description: `${goalForm.title} has been added to your goals.`
    });
    setShowCreateDialog(false);
    setSelectedTemplate(null);
    setGoalForm({
      title: '',
      description: '',
      targetAmount: '',
      targetDate: '',
      priority: 'medium'
    });
  };

  const renderIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName as keyof typeof iconMap] || Target;
    return <IconComponent className="h-5 w-5" />;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Goals</h1>
          <p className="text-muted-foreground">
            Personalized financial goals for your {persona} journey
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            {templateCount.total} templates available
          </Badge>
          {hasAdvancedTemplates(tier) && (
            <Badge variant="default" className="bg-gradient-to-r from-purple-500 to-blue-500">
              Advanced templates unlocked
            </Badge>
          )}
        </div>
      </div>

      {/* Retiree Bucket List CTA */}
      {persona === 'retiree' && (
        <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50">
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-full">
                <Plane className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Ready for your bucket list?</h3>
                <p className="text-muted-foreground">
                  Start planning those dreams you've been waiting to pursue
                </p>
              </div>
            </div>
            <Button 
              size="lg"
              className="bg-orange-500 hover:bg-orange-600"
              onClick={() => {
                const travelTemplate = bucketListTemplates.find(t => t.id === 'bucket-list-travel');
                if (travelTemplate) handleTemplateSelect(travelTemplate);
              }}
            >
              Add Bucket-List Goal
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Current Goals Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Ready to get started</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Target</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$0</div>
            <p className="text-xs text-muted-foreground">Add goals to see targets</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0%</div>
            <p className="text-xs text-muted-foreground">Start saving to track progress</p>
          </CardContent>
        </Card>
      </div>

      {/* Goal Templates */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add New Goal
              </CardTitle>
              <CardDescription>
                Choose from {templateCount.foundational} foundational templates
                {templateCount.advanced > 0 && ` + ${templateCount.advanced} advanced options`}
              </CardDescription>
            </div>
            <Badge variant="outline">
              {persona} persona
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {goalTemplates.map((template) => {
              const colorClass = colorMap[template.color as keyof typeof colorMap] || colorMap.blue;
              
              return (
                <Card 
                  key={template.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-primary/20"
                  onClick={() => handleTemplateSelect(template)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className={`p-2 rounded-lg ${colorClass}`}>
                        {renderIcon(template.icon)}
                      </div>
                      {template.tier === 'advanced' && (
                        <Badge variant="secondary" className="text-xs">
                          Advanced
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg">{template.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      {template.description}
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium">
                        ${template.targetAmountRange.min.toLocaleString()} - ${template.targetAmountRange.max.toLocaleString()}
                      </span>
                      <span className="text-muted-foreground">
                        {Math.round(template.timeFrameMonths / 12)}y target
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Create Goal Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Goal</DialogTitle>
            <DialogDescription>
              {selectedTemplate ? `Based on: ${selectedTemplate.title}` : 'Create a custom financial goal'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Goal Title</Label>
              <Input
                id="title"
                value={goalForm.title}
                onChange={(e) => setGoalForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter goal title"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={goalForm.description}
                onChange={(e) => setGoalForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your goal"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="amount">Target Amount</Label>
              <Input
                id="amount"
                type="number"
                value={goalForm.targetAmount}
                onChange={(e) => setGoalForm(prev => ({ ...prev, targetAmount: e.target.value }))}
                placeholder="Enter target amount"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="date">Target Date</Label>
              <Input
                id="date"
                type="date"
                value={goalForm.targetDate}
                onChange={(e) => setGoalForm(prev => ({ ...prev, targetDate: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="priority">Priority</Label>
              <Select 
                value={goalForm.priority} 
                onValueChange={(value) => setGoalForm(prev => ({ ...prev, priority: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="low">Low Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateGoal}>
              Create Goal
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Debug Information */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-sm text-muted-foreground">
            Debug: Template System
          </CardTitle>
        </CardHeader>
        <CardContent className="text-xs space-y-2">
          <div>
            <strong>Current Persona:</strong> {persona} | <strong>Tier:</strong> {tier}
          </div>
          <div>
            <strong>Available Templates:</strong> {templateCount.foundational} foundational
            {templateCount.advanced > 0 && ` + ${templateCount.advanced} advanced`}
          </div>
          <div>
            <strong>Template IDs:</strong> {goalTemplates.map(t => t.id).join(', ')}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}