import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Goal, GoalTemplate } from '@/types/goal';

export type { Goal };



export const useGoals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_goals')
        .select('*')
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

  const createGoal = async (goalData: Partial<Goal>) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_goals')
        .insert([{
          ...goalData,
          user_id: user.user.id,
          status: 'active'
        }])
        .select()
        .single();

      if (error) throw error;

      setGoals(prev => [...prev, data]);
      toast({
        title: "Success!",
        description: "Your goal has been created successfully.",
      });

      return data;
    } catch (error) {
      console.error('Error creating goal:', error);
      toast({
        title: "Error",
        description: "Failed to create goal. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateGoal = async (id: string, updates: Partial<Goal>) => {
    try {
      const { data, error } = await supabase
        .from('user_goals')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setGoals(prev => prev.map(goal => goal.id === id ? data : goal));
      toast({
        title: "Updated!",
        description: "Your goal has been updated successfully.",
      });

      return data;
    } catch (error) {
      console.error('Error updating goal:', error);
      toast({
        title: "Error",
        description: "Failed to update goal. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteGoal = async (id: string) => {
    try {
      const { error } = await supabase
        .from('user_goals')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setGoals(prev => prev.filter(goal => goal.id !== id));
      toast({
        title: "Deleted!",
        description: "Your goal has been deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting goal:', error);
      toast({
        title: "Error",
        description: "Failed to delete goal. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const markGoalComplete = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('user_goals')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          current_amount: goals.find(g => g.id === id)?.target_amount || 0
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setGoals(prev => prev.map(goal => goal.id === id ? data : goal));
      toast({
        title: "Congratulations! 🎉",
        description: "You've achieved your goal! Time to celebrate!",
      });

      return data;
    } catch (error) {
      console.error('Error marking goal complete:', error);
      toast({
        title: "Error",
        description: "Failed to mark goal as complete. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateGoalProgress = async (id: string, newAmount: number) => {
    try {
      const { data, error } = await supabase
        .from('user_goals')
        .update({ current_amount: newAmount })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setGoals(prev => prev.map(goal => goal.id === id ? data : goal));
      return data;
    } catch (error) {
      console.error('Error updating goal progress:', error);
      toast({
        title: "Error",
        description: "Failed to update progress. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const activeGoals = goals.filter(g => g.status === 'active');
  const completedGoals = goals.filter(g => g.status === 'completed');
  const topAspirations = goals.filter(g => g.priority === 'top_aspiration');

  const totalSaved = goals.reduce((sum, goal) => sum + goal.current_amount, 0);
  const totalTarget = goals.reduce((sum, goal) => sum + goal.target_amount, 0);
  const averageProgress = goals.length > 0 
    ? goals.reduce((sum, goal) => {
        const progress = goal.target_amount > 0 ? (goal.current_amount / goal.target_amount) * 100 : 0;
        return sum + Math.min(progress, 100);
      }, 0) / goals.length
    : 0;

  return {
    goals,
    activeGoals,
    completedGoals,
    topAspirations,
    loading,
    totalSaved,
    totalTarget,
    averageProgress,
    fetchGoals,
    createGoal,
    updateGoal,
    deleteGoal,
    markGoalComplete,
    updateGoalProgress
  };
};

export const useGoalTemplates = () => {
  const [templates, setTemplates] = useState<GoalTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('goal_category_templates')
        .select('*')
        .order('display_name');

      if (error) throw error;
      setTemplates(data || []);
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

  useEffect(() => {
    fetchTemplates();
  }, []);

  return {
    templates,
    loading,
    fetchTemplates
  };
};