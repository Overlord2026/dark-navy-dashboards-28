import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowLeft, Upload, Target, Calendar, DollarSign, Users, FileText, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface GoalTemplate {
  id: string;
  category: string;
  display_name: string;
  description: string;
  aspirational_prompt: string;
  suggested_amounts: number[];
}

interface GoalFormData {
  name: string;
  category: string;
  description: string;
  aspirational_description: string;
  target_amount: number;
  current_amount: number;
  target_date: string;
  monthly_contribution: number;
  funding_frequency: string;
  priority: string;
  why_important: string;
  experience_story: string;
}

const GoalFormPage = () => {
  const { category } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const template = location.state?.template as GoalTemplate;
  
  const [formData, setFormData] = useState<GoalFormData>({
    name: '',
    category: category || 'other',
    description: '',
    aspirational_description: '',
    target_amount: 0,
    current_amount: 0,
    target_date: '',
    monthly_contribution: 0,
    funding_frequency: 'monthly',
    priority: 'medium',
    why_important: '',
    experience_story: ''
  });
  
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: keyof GoalFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('user_goals')
        .insert([{
          ...formData,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          status: 'active'
        } as any])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your goal has been created successfully.",
      });

      navigate(`/goals/${data.id}`);
    } catch (error) {
      console.error('Error creating goal:', error);
      toast({
        title: "Error",
        description: "Failed to create goal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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

  const calculateMonthsToGoal = () => {
    if (formData.monthly_contribution === 0 || formData.target_amount === 0) return 0;
    const remaining = formData.target_amount - formData.current_amount;
    return Math.ceil(remaining / formData.monthly_contribution);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/goals/create')}
            className="p-2 text-accent hover:text-foreground hover:bg-accent/10"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Create {template?.display_name || 'New Goal'}
            </h1>
            <p className="text-lg text-muted-foreground mt-2">
              {template?.aspirational_prompt || "Define your aspiration and create a plan to achieve it."}
            </p>
          </div>
        </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Basic Information */}
            <Card className="bg-card border-2 border-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Target className="w-5 h-5 text-accent" />
                  Goal Details
                </CardTitle>
                <CardDescription>
                  Give your goal a name and describe what it means to you.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Goal Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g., 'Dream European Family Trip' or 'Retirement by 60'"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="aspirational_description">What's your vision? *</Label>
                  <Textarea
                    id="aspirational_description"
                    value={formData.aspirational_description}
                    onChange={(e) => handleInputChange('aspirational_description', e.target.value)}
                    placeholder={template?.aspirational_prompt || "Describe your dream and why it matters to you..."}
                    rows={3}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="why_important">Why is this important to you?</Label>
                  <Textarea
                    id="why_important"
                    value={formData.why_important}
                    onChange={(e) => handleInputChange('why_important', e.target.value)}
                    placeholder="What will achieving this goal mean for you and your family?"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Financial Details */}
            <Card className="bg-card border-2 border-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <DollarSign className="w-5 h-5 text-accent" />
                  Financial Planning
                </CardTitle>
                <CardDescription>
                  Set your target amount and funding strategy.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {template?.suggested_amounts && template.suggested_amounts.length > 0 && (
                  <div className="space-y-2">
                    <Label>Common Target Amounts</Label>
                    <div className="flex flex-wrap gap-2">
                      {template.suggested_amounts.map((amount, index) => (
                        <Button
                          key={index}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleInputChange('target_amount', amount)}
                          className="text-xs"
                        >
                          {formatCurrency(amount)}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="target_amount">Target Amount *</Label>
                    <Input
                      id="target_amount"
                      type="number"
                      value={formData.target_amount}
                      onChange={(e) => handleInputChange('target_amount', Number(e.target.value))}
                      placeholder="0"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="current_amount">Current Amount</Label>
                    <Input
                      id="current_amount"
                      type="number"
                      value={formData.current_amount}
                      onChange={(e) => handleInputChange('current_amount', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="monthly_contribution">Monthly Contribution</Label>
                    <Input
                      id="monthly_contribution"
                      type="number"
                      value={formData.monthly_contribution}
                      onChange={(e) => handleInputChange('monthly_contribution', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="target_date">Target Date</Label>
                    <Input
                      id="target_date"
                      type="date"
                      value={formData.target_date}
                      onChange={(e) => handleInputChange('target_date', e.target.value)}
                    />
                  </div>
                </div>

                {formData.monthly_contribution > 0 && formData.target_amount > 0 && (
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      At {formatCurrency(formData.monthly_contribution)}/month, you'll reach your goal in approximately{' '}
                      <span className="font-semibold text-foreground">
                        {calculateMonthsToGoal()} months
                      </span>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Experience & Legacy */}
            <Card className="bg-card border-2 border-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Heart className="w-5 h-5 text-accent" />
                  Experience Return & Legacy
                </CardTitle>
                <CardDescription>
                  Capture the story and impact of achieving this goal.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="experience_story">Experience Return Story</Label>
                  <Textarea
                    id="experience_story"
                    value={formData.experience_story}
                    onChange={(e) => handleInputChange('experience_story', e.target.value)}
                    placeholder="What memories, experiences, or impact will this create? How will you celebrate when you achieve it?"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Priority */}
            <Card className="bg-card border-2 border-accent/20">
              <CardHeader>
                <CardTitle className="text-foreground">Priority Level</CardTitle>
                <CardDescription>
                  How important is this goal to you?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={formData.priority}
                  onValueChange={(value) => handleInputChange('priority', value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="top_aspiration" id="top_aspiration" />
                    <Label htmlFor="top_aspiration" className="flex items-center gap-2">
                      ⭐ Top Aspiration
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="high" id="high" />
                    <Label htmlFor="high">🔴 High Priority</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medium" id="medium" />
                    <Label htmlFor="medium">🔵 Medium Priority</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="low" id="low" />
                    <Label htmlFor="low">⚪ Low Priority</Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Goal Preview */}
            {formData.name && (
              <Card className="bg-card border-2 border-accent/20">
                <CardHeader>
                  <CardTitle className="text-foreground">Goal Preview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-foreground">{formData.name}</h4>
                    <p className="text-sm text-muted-foreground">{template?.display_name}</p>
                  </div>
                  
                  {formData.target_amount > 0 && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Target:</span>
                        <span className="font-medium">{formatCurrency(formData.target_amount)}</span>
                      </div>
                      {formData.current_amount > 0 && (
                        <div className="flex justify-between text-sm">
                          <span>Current:</span>
                          <span>{formatCurrency(formData.current_amount)}</span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {formData.priority && (
                    <Badge 
                      variant={formData.priority === 'top_aspiration' ? 'default' : 'secondary'}
                      className="w-fit"
                    >
                      {formData.priority === 'top_aspiration' ? '⭐ Top Aspiration' : 
                       formData.priority === 'high' ? '🔴 High Priority' :
                       formData.priority === 'medium' ? '🔵 Medium Priority' : '⚪ Low Priority'}
                    </Badge>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Submit Button */}
            <Card className="bg-card border-2 border-accent/20">
              <CardContent className="p-4">
                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground border-2 border-accent"
                  size="lg"
                  disabled={loading || !formData.name || !formData.aspirational_description || formData.target_amount <= 0}
                >
                  {loading ? 'Creating Goal...' : 'Create Goal'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
      </div>
    </div>
  );
};

export default GoalFormPage;