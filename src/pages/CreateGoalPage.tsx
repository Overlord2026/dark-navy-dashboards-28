import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Target, Heart, Plane, Users, Gift, GraduationCap, Home, Car, Shield, CreditCard, Landmark, Palmtree } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// import { GoalTemplate } from '@/types/goal';

interface GoalTemplate {
  id: string;
  category: string;
  display_name: string;
  description: string;
  icon_name: string;
  aspirational_prompt: string;
  suggested_amounts: number[];
}

const CreateGoalPage = () => {
  const [templates, setTemplates] = useState<GoalTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<GoalTemplate | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchGoalTemplates();
  }, []);

  const fetchGoalTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('goal_category_templates')
        .select('*')
        .order('display_name');

      if (error) throw error;
      setTemplates((data as any) || []);
    } catch (error) {
      console.error('Error fetching goal templates:', error);
      toast({
        title: "Error",
        description: "Failed to load goal templates. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
      'Palmtree': Palmtree,
      'Heart': Heart,
      'Plane': Plane,
      'Users': Users,
      'GraduationCap': GraduationCap,
      'Home': Home,
      'Car': Car,
      'Shield': Shield,
      'CreditCard': CreditCard,
      'Gift': Gift,
      'Landmark': Landmark,
      'Target': Target
    };
    
    return iconMap[iconName] || Target;
  };

  const handleTemplateSelect = (template: GoalTemplate) => {
    // Navigate to goal creation form with selected template
    navigate(`/goals/create/${template.category}`, { 
      state: { template } 
    });
  };

  const getCategoryColor = (category: string) => {
    const colorMap: Record<string, string> = {
      'retirement': 'from-green-400 to-blue-500',
      'healthcare_healthspan': 'from-red-400 to-pink-500',
      'travel_bucket_list': 'from-purple-400 to-indigo-500',
      'family_experience': 'from-orange-400 to-yellow-500',
      'charitable_giving': 'from-pink-400 to-red-500',
      'education': 'from-blue-400 to-cyan-500',
      'real_estate': 'from-green-400 to-teal-500',
      'wedding': 'from-pink-400 to-purple-500',
      'vehicle': 'from-gray-400 to-slate-500',
      'emergency_fund': 'from-blue-400 to-green-500',
      'debt_paydown': 'from-red-400 to-orange-500',
      'lifetime_gifting': 'from-purple-400 to-pink-500',
      'legacy_inheritance': 'from-yellow-400 to-orange-500',
      'life_insurance': 'from-blue-400 to-indigo-500',
      'other': 'from-gray-400 to-gray-600'
    };
    return colorMap[category] || 'from-gray-400 to-gray-600';
  };

  const formatSuggestedAmount = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount.toLocaleString()}`;
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
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/goals')}
            className="p-2 text-accent hover:text-foreground hover:bg-accent/10"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Create New Goal</h1>
            <p className="text-lg text-muted-foreground mt-2">
              What aspirations would your future self thank you for achieving?
            </p>
          </div>
        </div>

        {/* Inspirational Quote */}
        <div className="bg-card border-2 border-accent/20 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-3 text-accent">
            Boutique Family Office Experience
          </h2>
          <p className="text-muted-foreground">
            "Experience Return is the new investment return. What life milestone, legacy, or impact will you create? Choose from the same goal categories that ultra-high-net-worth families use to build meaningful lives."
          </p>
        </div>

        {/* Goal Categories Grid */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-foreground">Choose Your Goal Type</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => {
              const IconComponent = getIconComponent(template.icon_name);
              
              return (
                <Card 
                  key={template.id}
                  className="group hover:shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden bg-card border-2 border-accent/20 hover:border-accent"
                  onClick={() => handleTemplateSelect(template)}
                >
                <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${getCategoryColor(template.category)}`} />
                
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${getCategoryColor(template.category)} flex-shrink-0`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {template.display_name}
                      </CardTitle>
                      <CardDescription className="text-sm mt-1">
                        {template.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="bg-muted/30 p-3 rounded-lg">
                    <p className="text-sm text-muted-foreground italic">
                      "{template.aspirational_prompt}"
                    </p>
                  </div>
                  
                  {template.suggested_amounts.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Common Target Amounts
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {template.suggested_amounts.slice(0, 4).map((amount, index) => (
                          <Badge 
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {formatSuggestedAmount(amount)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
          </div>
        </div>

        {/* Onboarding Encouragement */}
        <div className="bg-card border-2 border-accent/20 p-6 rounded-lg text-center">
          <h3 className="text-lg font-semibold text-accent mb-2">
            Start with Your Top 3 Aspirations
          </h3>
          <p className="text-muted-foreground">
            We recommend starting with at least one "retirement" goal, one "experience" goal (travel or family), and one "giving back" goal. This creates a balanced foundation for your aspirational life planning.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateGoalPage;