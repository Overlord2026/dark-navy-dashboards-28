import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Shield, 
  Heart, 
  DollarSign, 
  Calendar,
  Target,
  Plus,
  Lock,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';
import { toast } from 'sonner';

interface Goal {
  id: string;
  title: string;
  category: 'income' | 'health' | 'tax' | 'estate';
  description: string;
  targetValue: number;
  currentValue: number;
  targetDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'on-track' | 'behind' | 'completed' | 'at-risk';
  metrics: {
    label: string;
    value: string;
    trend?: 'up' | 'down' | 'stable';
  }[];
  nextActions: string[];
}

export default function FamilyRoadmapGoals() {
  const [goals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Income Replacement Strategy',
      category: 'income',
      description: 'Achieve 85% income replacement through diversified retirement sources',
      targetValue: 85,
      currentValue: 78,
      targetDate: '2025-01-01',
      priority: 'high',
      status: 'on-track',
      metrics: [
        { label: 'Social Security', value: '42%', trend: 'stable' },
        { label: '401(k) Withdrawal', value: '28%', trend: 'up' },
        { label: 'Pension', value: '8%', trend: 'stable' }
      ],
      nextActions: [
        'Review withdrawal strategy for Q1 2025',
        'Optimize Social Security timing',
        'Consider Roth conversion ladder'
      ]
    },
    {
      id: '2',
      title: 'Required Minimum Distributions',
      category: 'tax',
      description: 'Efficiently manage RMDs to minimize tax impact',
      targetValue: 100,
      currentValue: 92,
      targetDate: '2024-12-31',
      priority: 'high',
      status: 'on-track',
      metrics: [
        { label: '2024 RMD Amount', value: '$18,750' },
        { label: 'Tax Efficiency', value: '92%', trend: 'up' },
        { label: 'Estimated Tax', value: '$3,375' }
      ],
      nextActions: [
        'Take Q4 RMD by December 31st',
        'Plan 2025 distribution timing',
        'Consider QCD for charity'
      ]
    },
    {
      id: '3',
      title: 'Healthcare Cost Planning',
      category: 'health',
      description: 'Comprehensive healthcare coverage and cost management',
      targetValue: 100,
      currentValue: 65,
      targetDate: '2025-03-01',
      priority: 'high',
      status: 'behind',
      metrics: [
        { label: 'Annual Premium', value: '$4,200' },
        { label: 'HSA Balance', value: '$12,500', trend: 'up' },
        { label: 'Coverage Score', value: '85%' }
      ],
      nextActions: [
        'Review Medicare supplement options',
        'Schedule annual wellness visit',
        'Research long-term care insurance'
      ]
    },
    {
      id: '4',
      title: 'Estate Organization',
      category: 'estate',
      description: 'Organize and update all estate planning documents',
      targetValue: 100,
      currentValue: 82,
      targetDate: '2025-06-01',
      priority: 'medium',
      status: 'on-track',
      metrics: [
        { label: 'Documents Updated', value: '8/10' },
        { label: 'Beneficiaries Current', value: '90%', trend: 'up' },
        { label: 'Trust Funding', value: '75%' }
      ],
      nextActions: [
        'Update 401(k) beneficiaries',
        'Review trust funding strategy',
        'Schedule attorney consultation'
      ]
    },
    {
      id: '5',
      title: 'Health Screenings Current',
      category: 'health',
      description: 'Stay current with all recommended preventive care',
      targetValue: 100,
      currentValue: 71,
      targetDate: '2025-12-31',
      priority: 'medium',
      status: 'behind',
      metrics: [
        { label: 'Screenings Complete', value: '5/7' },
        { label: 'Vaccinations', value: '100%', trend: 'stable' },
        { label: 'Next Appointment', value: 'Dec 15' }
      ],
      nextActions: [
        'Schedule colonoscopy',
        'Book annual eye exam',
        'Update emergency contacts'
      ]
    }
  ]);

  const handleRestrictedAction = (action: string) => {
    toast.error(`${action} requires premium plan`, {
      description: 'Upgrade to manage and track your retirement goals'
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'income': return <DollarSign className="h-5 w-5 text-emerald-500" />;
      case 'health': return <Heart className="h-5 w-5 text-pink-500" />;
      case 'tax': return <TrendingUp className="h-5 w-5 text-orange-500" />;
      case 'estate': return <Shield className="h-5 w-5 text-purple-500" />;
      default: return <Target className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'on-track': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'behind': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'at-risk': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'on-track': return <TrendingUp className="h-4 w-4" />;
      case 'behind': return <AlertTriangle className="h-4 w-4" />;
      case 'at-risk': return <AlertTriangle className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Retirement Goals</h2>
          <p className="text-muted-foreground">Track progress on key retirement objectives</p>
        </div>
        <Button 
          variant="default" 
          className="gap-2"
          onClick={() => handleRestrictedAction('Add goal')}
        >
          <Plus className="h-4 w-4" />
          Add Goal
          <Lock className="h-3 w-3" />
        </Button>
      </div>

      <div className="grid gap-6">
        {goals.map((goal) => {
          const progressPercent = Math.round((goal.currentValue / goal.targetValue) * 100);
          
          return (
            <Card key={goal.id} className="p-6">
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      {getCategoryIcon(goal.category)}
                      <h3 className="text-xl font-semibold">{goal.title}</h3>
                      <Badge variant="outline" className={getStatusColor(goal.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(goal.status)}
                          {goal.status.replace('-', ' ')}
                        </div>
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">{goal.description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Target: {new Date(goal.targetDate).toLocaleDateString()}
                      </div>
                      <Badge variant={goal.priority === 'high' ? 'destructive' : goal.priority === 'medium' ? 'default' : 'secondary'}>
                        {goal.priority} priority
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Progress</span>
                    <div className="text-right">
                      <div className="font-semibold">
                        {goal.currentValue}{goal.category === 'income' || goal.category === 'health' ? '%' : ''} / {goal.targetValue}{goal.category === 'income' || goal.category === 'health' ? '%' : ''}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {progressPercent}% complete
                      </div>
                    </div>
                  </div>
                  <Progress 
                    value={progressPercent} 
                    className={`h-3 ${goal.status === 'completed' ? '[&>div]:bg-emerald-500' : goal.status === 'at-risk' ? '[&>div]:bg-red-500' : ''}`}
                  />
                </div>

                {/* Metrics */}
                <div className="grid md:grid-cols-3 gap-4">
                  {goal.metrics.map((metric, index) => (
                    <div key={index} className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{metric.label}</span>
                        {metric.trend && (
                          <div className={`flex items-center gap-1 ${
                            metric.trend === 'up' ? 'text-emerald-600' : 
                            metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                          }`}>
                            <TrendingUp className={`h-3 w-3 ${metric.trend === 'down' ? 'rotate-180' : ''}`} />
                          </div>
                        )}
                      </div>
                      <div className="font-semibold text-lg">{metric.value}</div>
                    </div>
                  ))}
                </div>

                {/* Next Actions */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Next Actions</h4>
                  <div className="space-y-2">
                    {goal.nextActions.map((action, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 bg-muted/30 rounded">
                        <input 
                          type="checkbox" 
                          className="rounded"
                          onChange={() => handleRestrictedAction('Complete action')}
                        />
                        <span className="text-sm">{action}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleRestrictedAction('Update goal')}
                    className="gap-2"
                  >
                    Update Progress
                    <Lock className="h-3 w-3" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleRestrictedAction('Set reminder')}
                    className="gap-2"
                  >
                    Set Reminder
                    <Lock className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Summary */}
      <Card className="p-6 bg-muted/50">
        <h3 className="text-lg font-semibold mb-4">Goals Summary</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600">
              {goals.filter(g => g.status === 'completed').length}
            </div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {goals.filter(g => g.status === 'on-track').length}
            </div>
            <div className="text-sm text-muted-foreground">On Track</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {goals.filter(g => g.status === 'behind').length}
            </div>
            <div className="text-sm text-muted-foreground">Behind</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {goals.filter(g => g.status === 'at-risk').length}
            </div>
            <div className="text-sm text-muted-foreground">At Risk</div>
          </div>
        </div>
      </Card>
    </div>
  );
}