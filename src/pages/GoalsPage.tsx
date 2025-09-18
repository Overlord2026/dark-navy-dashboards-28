import React, { useState, useEffect } from "react";
import { Plus, Target, TrendingUp, Star, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Goal {
  id: string;
  name: string;
  category: string;
  target_amount: number;
  current_amount: number;
  target_date: string | null;
  priority: string;
  status: string;
  description: string;
  aspirational_description: string;
  image_url: string | null;
  created_at: string;
}

const GoalsPage = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const { data, error } = await supabase
        .from('user_goals')
        .select('*')
        .eq('status', 'active')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setGoals(data || []);
    } catch (error) {
      console.error('Error fetching goals:', error);
      toast({
        title: "Error",
        description: "Failed to load goals. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = (current: number, target: number) => {
    if (target === 0) return 0;
    return Math.min((current / target) * 100, 100);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'top_aspiration': return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white';
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'medium': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'low': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Goals & Aspirations</h1>
            <p className="text-lg text-muted-foreground mt-2">
              Experience Return is the new investment return. Dream bigger, plan smarter.
            </p>
          </div>
          <Button 
            onClick={() => navigate('/goals/create')}
            className="w-fit bg-primary hover:bg-primary/90 text-primary-foreground border-2 border-accent"
            size="lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create New Goal
          </Button>
        </div>

        {/* Empty State */}
        {goals.length === 0 && (
          <div className="text-center py-16">
            <div className="mx-auto max-w-md">
              <Target className="mx-auto h-12 w-12 text-accent mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Ready to dream bigger?
              </h3>
              <p className="text-muted-foreground mb-6">
                Our Boutique Family Office™ platform lets you set, track, and celebrate the same kinds of aspirational goals that ultra-high-net-worth families have used for generations.
              </p>
              <Button 
                onClick={() => navigate('/goals/create')}
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground border-2 border-accent"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Goal
              </Button>
            </div>
          </div>
        )}

        {/* Goals Grid */}
        {goals.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map((goal) => {
              const progress = calculateProgress(goal.current_amount, goal.target_amount);
              
              return (
                <Card 
                  key={goal.id} 
                  className="group hover:shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden bg-card border-2 border-accent/20 hover:border-accent"
                  onClick={() => navigate(`/goals/${goal.id}`)}
                >
                {goal.priority === 'top_aspiration' && (
                  <div className="absolute top-3 right-3 z-10">
                    <Badge className={getPriorityColor(goal.priority)}>
                      <Star className="w-3 h-3 mr-1" />
                      Top Aspiration
                    </Badge>
                  </div>
                )}
                
                {goal.image_url && (
                  <div className="h-32 bg-gradient-to-r from-primary/20 to-secondary/20 relative">
                    <img 
                      src={goal.image_url} 
                      alt={goal.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {goal.name}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {getCategoryDisplayName(goal.category)}
                      </CardDescription>
                    </div>
                    {goal.priority !== 'top_aspiration' && (
                      <Badge variant="secondary" className={getPriorityColor(goal.priority)}>
                        {goal.priority}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {goal.aspirational_description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {goal.aspirational_description}
                    </p>
                  )}
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {formatCurrency(goal.current_amount)}
                      </span>
                      <span className="font-medium">
                        {formatCurrency(goal.target_amount)}
                      </span>
                    </div>
                  </div>
                  
                  {goal.target_date && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <TrendingUp className="w-4 h-4" />
                      Target: {new Date(goal.target_date).toLocaleDateString()}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
          </div>
        )}

        {/* Quick Stats */}
        {goals.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-card border-2 border-accent/20 hover:border-accent transition-colors">
              <CardContent className="p-4 text-center">
                <Target className="w-8 h-8 mx-auto mb-2 text-accent" />
                <div className="text-2xl font-bold text-foreground">{goals.length}</div>
                <div className="text-sm text-muted-foreground">Active Goals</div>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-2 border-accent/20 hover:border-accent transition-colors">
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 text-accent" />
                <div className="text-2xl font-bold text-foreground">
                  {formatCurrency(goals.reduce((sum, g) => sum + g.current_amount, 0))}
                </div>
                <div className="text-sm text-muted-foreground">Total Saved</div>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-2 border-accent/20 hover:border-accent transition-colors">
              <CardContent className="p-4 text-center">
                <Star className="w-8 h-8 mx-auto mb-2 text-accent" />
                <div className="text-2xl font-bold text-foreground">
                  {goals.filter(g => g.priority === 'top_aspiration').length}
                </div>
                <div className="text-sm text-muted-foreground">Top Aspirations</div>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-2 border-accent/20 hover:border-accent transition-colors">
              <CardContent className="p-4 text-center">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-accent" />
                <div className="text-2xl font-bold text-foreground">
                  {Math.round(goals.reduce((sum, g) => sum + calculateProgress(g.current_amount, g.target_amount), 0) / goals.length)}%
                </div>
                <div className="text-sm text-muted-foreground">Avg Progress</div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalsPage;