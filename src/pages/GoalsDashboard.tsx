import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Target, 
  Plus, 
  Search, 
  Filter,
  TrendingUp,
  Calendar,
  DollarSign,
  Users,
  Gift,
  Heart,
  Plane,
  GraduationCap,
  Home,
  Shield,
  CheckCircle,
  AlertTriangle,
  Clock,
  Star
} from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import { useGoals } from '@/hooks/useGoals';
import { Goal, GoalCategory, GoalStatus } from '@/types/goal';
import { calculateGoalProgress } from '@/lib/goalHelpers';

const GoalsDashboard = () => {
  const navigate = useNavigate();
  const { goals, loading, totalSaved, totalTarget, averageProgress, activeGoals, completedGoals } = useGoals();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<GoalCategory | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<GoalStatus | 'all'>('all');

  const getGoalIcon = (category: GoalCategory) => {
    const iconMap = {
      'retirement': Target,
      'healthcare_healthspan': Heart,
      'travel_bucket_list': Plane,
      'family_experience': Users,
      'charitable_giving': Gift,
      'education': GraduationCap,
      'real_estate': Home,
      'emergency_fund': Shield,
      'other': Target
    };
    const IconComponent = iconMap[category] || Target;
    return <IconComponent className="h-5 w-5" />;
  };

  const getStatusColor = (status: GoalStatus) => {
    switch (status) {
      case 'completed':
      case 'achieved':
        return 'bg-emerald-500';
      case 'on_track':
        return 'bg-blue-500';
      case 'at_risk':
        return 'bg-amber-500';
      case 'paused':
        return 'bg-gray-500';
      default:
        return 'bg-slate-500';
    }
  };

  const getStatusText = (status: GoalStatus) => {
    switch (status) {
      case 'completed':
      case 'achieved':
        return 'Achieved';
      case 'on_track':
        return 'On Track';
      case 'at_risk':
        return 'At Risk';
      case 'paused':
        return 'Paused';
      default:
        return 'Active';
    }
  };

  const filteredGoals = goals.filter(goal => {
    const matchesSearch = goal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         goal.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || goal.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || goal.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const topAspirations = goals.filter(g => g.priority === 'top_aspiration');
  const recentlyCompleted = completedGoals.slice(0, 3);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Goals & Aspirations</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Your journey to meaningful wealth and life experiences
          </p>
        </div>
        <Button 
          onClick={() => navigate('/goals/create')} 
          className="flex items-center space-x-2"
          size="lg"
        >
          <Plus className="h-4 w-4" />
          <span>Create New Goal</span>
        </Button>
      </div>

      {/* Family Office Messaging */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-lg">
        <div className="flex items-center space-x-3 mb-3">
          <Star className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">
            Boutique Family Office Experience
          </h2>
        </div>
        <p className="text-muted-foreground mb-4">
          Experience Return is the new investment return. Track and celebrate the same aspirational goals 
          that ultra-high-net-worth families have used for generations—made accessible to you.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary">{goals.length}</div>
            <div className="text-sm text-muted-foreground">Total Goals</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">{formatCurrency(totalSaved)}</div>
            <div className="text-sm text-muted-foreground">Total Saved</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">{averageProgress.toFixed(1)}%</div>
            <div className="text-sm text-muted-foreground">Avg Progress</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">{completedGoals.length}</div>
            <div className="text-sm text-muted-foreground">Achieved</div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeGoals.length}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(totalTarget - totalSaved)} remaining
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On Track</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {goals.filter(g => g.status === 'on_track').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Goals progressing well
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">At Risk</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {goals.filter(g => g.status === 'at_risk').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Need attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search goals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as GoalCategory | 'all')}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="retirement">Retirement</SelectItem>
            <SelectItem value="travel_bucket_list">Travel</SelectItem>
            <SelectItem value="family_experience">Family</SelectItem>
            <SelectItem value="charitable_giving">Charitable</SelectItem>
            <SelectItem value="education">Education</SelectItem>
            <SelectItem value="real_estate">Real Estate</SelectItem>
            <SelectItem value="emergency_fund">Emergency</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as GoalStatus | 'all')}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="on_track">On Track</SelectItem>
            <SelectItem value="at_risk">At Risk</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Goals Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Goals</TabsTrigger>
          <TabsTrigger value="aspirations">Top Aspirations</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Achieved</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <GoalsGrid goals={filteredGoals} navigate={navigate} getGoalIcon={getGoalIcon} getStatusColor={getStatusColor} getStatusText={getStatusText} />
        </TabsContent>

        <TabsContent value="aspirations" className="space-y-4">
          {topAspirations.length > 0 ? (
            <GoalsGrid goals={topAspirations} navigate={navigate} getGoalIcon={getGoalIcon} getStatusColor={getStatusColor} getStatusText={getStatusText} />
          ) : (
            <EmptyState 
              title="No Top Aspirations Set"
              description="Create your most important life goals and mark them as top aspirations."
              action={
                <Button onClick={() => navigate('/goals/create')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Aspiration
                </Button>
              }
            />
          )}
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <GoalsGrid goals={activeGoals} navigate={navigate} getGoalIcon={getGoalIcon} getStatusColor={getStatusColor} getStatusText={getStatusText} />
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedGoals.length > 0 ? (
            <GoalsGrid goals={completedGoals} navigate={navigate} getGoalIcon={getGoalIcon} getStatusColor={getStatusColor} getStatusText={getStatusText} />
          ) : (
            <EmptyState 
              title="No Goals Achieved Yet"
              description="Complete your first goal to start building your success story."
              action={
                <Button onClick={() => navigate('/goals')}>
                  <Target className="h-4 w-4 mr-2" />
                  View Active Goals
                </Button>
              }
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Goals Grid Component
const GoalsGrid = ({ goals, navigate, getGoalIcon, getStatusColor, getStatusText }: any) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {goals.map((goal: Goal) => {
        const progress = calculateGoalProgress(goal);
        
        return (
          <Card 
            key={goal.id} 
            className="group hover:shadow-lg transition-all duration-300 cursor-pointer"
            onClick={() => navigate(`/goals/${goal.id}`)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    {getGoalIcon(goal.category)}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {goal.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{goal.description}</p>
                  </div>
                </div>
                <Badge className={`${getStatusColor(goal.status)} text-white`}>
                  {getStatusText(goal.status)}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Progress</span>
                  <span className="text-muted-foreground">{progress.percentage.toFixed(1)}%</span>
                </div>
                <Progress value={progress.percentage} className="h-2" />
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{formatCurrency(goal.current_amount)}</span>
                  <span className="text-muted-foreground">{formatCurrency(goal.target_amount)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>
                    {progress.days_remaining > 0 
                      ? `${progress.days_remaining} days left`
                      : 'Overdue'
                    }
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <DollarSign className="h-3 w-3" />
                  <span>{formatCurrency(progress.amount_remaining)} left</span>
                </div>
              </div>

              {goal.priority === 'top_aspiration' && (
                <div className="flex items-center space-x-1">
                  <Star className="h-3 w-3 text-yellow-500" />
                  <span className="text-xs text-yellow-600 font-medium">Top Aspiration</span>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

// Empty State Component
const EmptyState = ({ title, description, action }: any) => (
  <div className="text-center py-12">
    <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground mb-6 max-w-md mx-auto">{description}</p>
    {action}
  </div>
);

export default GoalsDashboard;