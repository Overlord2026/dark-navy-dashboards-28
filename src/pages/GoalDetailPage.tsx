import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit3, Trash2, Plus, TrendingUp, Calendar, Target, CheckCircle2, Star, DollarSign, Users, Heart, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Goal } from "@/types/goal";
import { adaptLegacyGoal } from "@/types/goal";
import { recordGoalRDS, recordGoalUpdateRDS } from "@/lib/rds";

const GoalDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [goal, setGoal] = useState<Goal | null>(null);
  const [loading, setLoading] = useState(true);
  const [progressAmount, setProgressAmount] = useState<number>(0);
  const [experienceUpdate, setExperienceUpdate] = useState("");

  useEffect(() => {
    if (id) {
      fetchGoal();
    }
  }, [id]);

  const fetchGoal = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_goals')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      const adaptedGoal = adaptLegacyGoal(data);
      setGoal(adaptedGoal);
      setProgressAmount(adaptedGoal.measurable.current);
    } catch (error) {
      console.error('Error fetching goal:', error);
      toast({
        title: "Error",
        description: "Failed to load goal details. Please try again.",
        variant: "destructive",
      });
      navigate('/goals');
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async () => {
    if (!goal) return;

    try {
      const { data, error } = await supabase
        .from('user_goals')
        .update({ current_amount: progressAmount })
        .eq('id', goal.id)
        .select()
        .single();

      if (error) throw error;
      const adaptedGoal = adaptLegacyGoal(data);
      setGoal(adaptedGoal);
      
      // Record RDS for goal update
      recordGoalUpdateRDS({
        goalId: goal.id,
        previousAmount: goal.measurable.current,
        newAmount: progressAmount,
        userId: data.user_id
      });
      
      toast({
        title: "Progress Updated!",
        description: "Your goal progress has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating progress:', error);
      toast({
        title: "Error",
        description: "Failed to update progress. Please try again.",
        variant: "destructive",
      });
    }
  };

  const markComplete = async () => {
    if (!goal) return;

    try {
      const { data, error } = await supabase
        .from('user_goals')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          current_amount: goal.measurable.target
        })
        .eq('id', goal.id)
        .select()
        .single();

      if (error) throw error;
      const adaptedGoal = adaptLegacyGoal(data);
      setGoal(adaptedGoal);
      toast({
        title: "Congratulations! 🎉",
        description: "You've achieved your goal! Time to celebrate!",
      });
    } catch (error) {
      console.error('Error marking goal complete:', error);
      toast({
        title: "Error",
        description: "Failed to mark goal as complete. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteGoal = async () => {
    if (!goal) return;

    try {
      const { error } = await supabase
        .from('user_goals')
        .delete()
        .eq('id', goal.id);

      if (error) throw error;

      toast({
        title: "Goal Deleted",
        description: "Your goal has been deleted successfully.",
      });
      navigate('/goals');
    } catch (error) {
      console.error('Error deleting goal:', error);
      toast({
        title: "Error",
        description: "Failed to delete goal. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateExperienceStory = async () => {
    if (!goal) return;

    try {
      const { data, error } = await supabase
        .from('user_goals')
        .update({ experience_story: experienceUpdate })
        .eq('id', goal.id)
        .select()
        .single();

      if (error) throw error;
      const adaptedGoal = adaptLegacyGoal(data);
      setGoal(adaptedGoal);
      setExperienceUpdate("");
      toast({
        title: "Experience Story Updated!",
        description: "Your experience story has been saved.",
      });
    } catch (error) {
      console.error('Error updating experience story:', error);
      toast({
        title: "Error",
        description: "Failed to update experience story. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateProgress = () => {
    if (!goal || goal.measurable.target === 0) return 0;
    return Math.min((goal.measurable.current / goal.measurable.target) * 100, 100);
  };

  const getMonthsRemaining = () => {
    if (!goal?.timeBound?.deadline) return null;
    const today = new Date();
    const targetDate = new Date(goal.timeBound.deadline);
    const diffTime = targetDate.getTime() - today.getTime();
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
    return diffMonths;
  };

  const getRequiredMonthlyContribution = () => {
    if (!goal || !goal.timeBound?.deadline) return 0;
    const remaining = goal.measurable.target - goal.measurable.current;
    const monthsRemaining = getMonthsRemaining();
    if (!monthsRemaining || monthsRemaining <= 0) return 0;
    return remaining / monthsRemaining;
  };

  const getCategoryDisplayName = (category: string) => {
    const categoryMap: Record<string, string> = {
      'retirement': 'Retirement Planning',
      'healthcare_healthspan': 'Healthcare & Healthspan',
      'travel_bucket_list': 'Private Travel & Bucket List',
      'family_experience': 'Family Experiences',
      'charitable_giving': 'Charitable Giving & Philanthropy',
      'education': 'Education & Learning',
      'real_estate': 'Real Estate & Second Homes',
      'wedding': 'Weddings & Celebrations',
      'vehicle': 'Vehicles & Lifestyle',
      'emergency_fund': 'Emergency Fund & Cash Reserve',
      'debt_paydown': 'Debt Management',
      'lifetime_gifting': 'Lifetime Gifting',
      'legacy_inheritance': 'Legacy & Inheritance Planning',
      'life_insurance': 'Life Insurance Planning',
      'other': 'Custom Goal'
    };
    return categoryMap[category] || category;
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1: return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white';
      case 2: return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 3: return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 4: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!goal) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-foreground mb-4">Goal Not Found</h2>
          <p className="text-muted-foreground mb-6">The goal you're looking for doesn't exist or has been deleted.</p>
          <Button onClick={() => navigate('/goals')}>Back to Goals</Button>
        </div>
      </div>
    );
  }

  const progress = calculateProgress();
  const monthsRemaining = getMonthsRemaining();
  const requiredMonthly = getRequiredMonthlyContribution();

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/goals')}
          className="p-2"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-foreground">{goal.name}</h1>
            {goal.priority === 1 && (
              <Badge className={getPriorityColor(goal.priority)}>
                <Star className="w-3 h-3 mr-1" />
                Top Aspiration
              </Badge>
            )}
            {goal.status === 'completed' && (
              <Badge variant="default" className="bg-green-100 text-green-800">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Completed
              </Badge>
            )}
          </div>
          <p className="text-lg text-muted-foreground">
            {goal.kind === 'financial' ? 'Financial Goal' : 'Bucket List Goal'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Edit3 className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your goal and all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={deleteGoal} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Delete Goal
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Goal Image */}
      {goal.cover && (
        <div className="relative h-64 rounded-lg overflow-hidden">
          <img 
            src={goal.cover} 
            alt={goal.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="text-white text-xl font-semibold mb-2">{goal.specific?.description}</h2>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Progress Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Progress Tracking
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-2xl font-bold">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-3" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{formatCurrency(goal.measurable.current)}</span>
                  <span>{formatCurrency(goal.measurable.target)}</span>
                </div>
              </div>

              {goal.status !== 'completed' && (
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label htmlFor="progress-update">Update Progress</Label>
                    <Input
                      id="progress-update"
                      type="number"
                      value={progressAmount}
                      onChange={(e) => setProgressAmount(Number(e.target.value))}
                      placeholder="Current amount"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <Button onClick={updateProgress}>
                      Update
                    </Button>
                    {progress >= 100 && (
                      <Button onClick={markComplete} variant="default" className="bg-green-600 hover:bg-green-700">
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Mark Complete
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Vision & Why */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Your Vision
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {goal.specific?.description && (
                <div>
                  <h4 className="font-medium mb-2">What's Your Dream?</h4>
                  <p className="text-muted-foreground">{goal.specific.description}</p>
                </div>
              )}
              
              {goal.relevant?.why && (
                <div>
                  <h4 className="font-medium mb-2">Why This Matters</h4>
                  <p className="text-muted-foreground">{goal.relevant.why}</p>
                </div>
              )}

              {goal.specific?.experiences && goal.specific.experiences.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Experiences</h4>
                  <ul className="text-muted-foreground list-disc list-inside space-y-1">
                    {goal.specific.experiences.map((exp, index) => (
                      <li key={index}>{exp}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Experience Story */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Experience Return Story
              </CardTitle>
              <CardDescription>
                Document your journey and celebrate milestones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {goal.relevant?.why && (
                <div className="bg-muted/30 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground italic">"{goal.relevant.why}"</p>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="experience-update">Add to Your Story</Label>
                <Textarea
                  id="experience-update"
                  value={experienceUpdate}
                  onChange={(e) => setExperienceUpdate(e.target.value)}
                  placeholder="Share a milestone, reflection, or update about your journey toward this goal..."
                  rows={3}
                />
                <Button 
                  onClick={updateExperienceStory}
                  size="sm"
                  disabled={!experienceUpdate.trim()}
                >
                  Add Update
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          
          {/* Key Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Goal Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Target Amount</span>
                <span className="font-semibold">{formatCurrency(goal.measurable.target)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Current Amount</span>
                <span className="font-semibold">{formatCurrency(goal.measurable.current)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Remaining</span>
                <span className="font-semibold">{formatCurrency(goal.measurable.target - goal.measurable.current)}</span>
              </div>
              
              {goal.timeBound?.deadline && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Target Date</span>
                  <span className="font-semibold">
                    {new Date(goal.timeBound.deadline).toLocaleDateString()}
                  </span>
                </div>
              )}
              
              {monthsRemaining && monthsRemaining > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Months Remaining</span>
                  <span className="font-semibold">{monthsRemaining}</span>
                </div>
              )}
              
              {goal.funding?.prePaycheck?.amount && goal.funding.prePaycheck.amount > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monthly Contribution</span>
                  <span className="font-semibold">{formatCurrency(goal.funding.prePaycheck.amount)}</span>
                </div>
              )}
              
              {requiredMonthly > 0 && (
                <div className="bg-primary/10 p-3 rounded-lg">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Required Monthly</span>
                    <span className="text-sm font-semibold">{formatCurrency(requiredMonthly)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    To reach your goal by the target date
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Priority */}
          <Card>
            <CardHeader>
              <CardTitle>Priority Level</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className={getPriorityColor(goal.priority)}>
                {goal.priority === 1 && <Star className="w-3 h-3 mr-1" />}
                {goal.priority === 1 ? 'Top Aspiration' : 
                 goal.priority === 2 ? 'High Priority' :
                 goal.priority === 3 ? 'Medium Priority' : 'Low Priority'}
              </Badge>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Plus className="w-4 h-4 mr-2" />
                Add Milestone
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="w-4 h-4 mr-2" />
                Share with Family
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="w-4 h-4 mr-2" />
                Set Reminder
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GoalDetailPage;