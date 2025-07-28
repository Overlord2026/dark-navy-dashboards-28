import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Goal, GoalTemplate } from '@/types/goal';

export type { Goal };



export const useGoals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchGoals = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_goals')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setGoals(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load goals. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const createGoal = useCallback(async (goalData: Partial<Goal>) => {
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
      toast({
        title: "Error",
        description: "Failed to create goal. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  }, [toast]);

  const updateGoal = useCallback(async (id: string, updates: Partial<Goal>) => {
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
      toast({
        title: "Error",
        description: "Failed to update goal. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  }, [toast]);

  const deleteGoal = useCallback(async (id: string) => {
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
      toast({
        title: "Error",
        description: "Failed to delete goal. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  }, [toast]);

  const markGoalComplete = useCallback(async (id: string) => {
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
      toast({
        title: "Error",
        description: "Failed to mark goal as complete. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  }, [goals, toast]);

  const updateGoalProgress = useCallback(async (id: string, newAmount: number) => {
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
      toast({
        title: "Error",
        description: "Failed to update progress. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  }, [toast]);

  useEffect(() => {
    fetchGoals();
  }, []);

  // Memoized calculations for performance
  const activeGoals = useMemo(() => goals.filter(g => g.status === 'active'), [goals]);
  const completedGoals = useMemo(() => goals.filter(g => g.status === 'completed'), [goals]);
  const topAspirations = useMemo(() => goals.filter(g => g.priority === 'top_aspiration'), [goals]);

  const totalSaved = useMemo(() => goals.reduce((sum, goal) => sum + goal.current_amount, 0), [goals]);
  const totalTarget = useMemo(() => goals.reduce((sum, goal) => sum + goal.target_amount, 0), [goals]);
  
  const averageProgress = useMemo(() => {
    if (goals.length === 0) return 0;
    return goals.reduce((sum, goal) => {
      const progress = goal.target_amount > 0 ? (goal.current_amount / goal.target_amount) * 100 : 0;
      return sum + Math.min(progress, 100);
    }, 0) / goals.length;
  }, [goals]);

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

  const fetchTemplates = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('goal_category_templates')
        .select('*')
        .order('display_name');

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load goal templates. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchTemplates();
  }, []);

  return {
    templates,
    loading,
    fetchTemplates
  };
};