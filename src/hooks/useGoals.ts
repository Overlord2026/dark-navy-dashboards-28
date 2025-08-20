import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Goal, GoalTemplate, adaptLegacyGoal } from '@/types/goal';
import { calculateGoalProgress, calculateTotalGoalStats } from '@/lib/goalHelpers';

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
      
      // Adapt legacy goals to new structure
      const adaptedGoals = (data || []).map(adaptLegacyGoal);
      setGoals(adaptedGoals);
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

      // Convert new Goal to legacy format for database
      const legacyGoalData = {
        name: goalData.name,
        description: goalData.specific?.description || '',
        target_amount: goalData.measurable.unit === 'usd' ? goalData.measurable.target : 0,
        current_amount: goalData.measurable.unit === 'usd' ? goalData.measurable.current : 0,
        target_date: goalData.timeBound?.deadline || null,
        monthly_contribution: goalData.funding?.prePaycheck?.amount || 0,
        priority: goalData.priority === 1 ? 'top_aspiration' : 
                 goalData.priority <= 3 ? 'high' : 
                 goalData.priority <= 5 ? 'medium' : 'low',
        image_url: goalData.cover,
        user_id: user.user.id,
        status: 'active'
      };

      const { data, error } = await supabase
        .from('user_goals')
        .insert([legacyGoalData])
        .select()
        .single();

      if (error) throw error;

      const adaptedGoal = adaptLegacyGoal(data);
      setGoals(prev => [...prev, adaptedGoal]);
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
      // Convert new Goal updates to legacy format
      const legacyUpdates: any = {};
      
      if (updates.name) legacyUpdates.name = updates.name;
      if (updates.specific?.description) legacyUpdates.description = updates.specific.description;
      if (updates.measurable) {
        if (updates.measurable.unit === 'usd') {
          if (updates.measurable.target !== undefined) legacyUpdates.target_amount = updates.measurable.target;
          if (updates.measurable.current !== undefined) legacyUpdates.current_amount = updates.measurable.current;
        }
      }
      if (updates.timeBound?.deadline) legacyUpdates.target_date = updates.timeBound.deadline;
      if (updates.funding?.prePaycheck?.amount) legacyUpdates.monthly_contribution = updates.funding.prePaycheck.amount;
      if (updates.cover) legacyUpdates.image_url = updates.cover;
      if (updates.status) legacyUpdates.status = updates.status;

      const { data, error } = await supabase
        .from('user_goals')
        .update(legacyUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const adaptedGoal = adaptLegacyGoal(data);
      setGoals(prev => prev.map(goal => goal.id === id ? adaptedGoal : goal));
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
      const goal = goals.find(g => g.id === id);
      if (!goal) throw new Error('Goal not found');

      const { data, error } = await supabase
        .from('user_goals')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          current_amount: goal.measurable.unit === 'usd' ? goal.measurable.target : goal.measurable.current
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const adaptedGoal = adaptLegacyGoal(data);
      setGoals(prev => prev.map(goal => goal.id === id ? adaptedGoal : goal));
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

      const adaptedGoal = adaptLegacyGoal(data);
      setGoals(prev => prev.map(goal => goal.id === id ? adaptedGoal : goal));
      return adaptedGoal;
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
  const activeGoals = useMemo(() => goals.filter(g => (g.status || 'active') === 'active'), [goals]);
  const completedGoals = useMemo(() => goals.filter(g => (g.status || 'active') === 'completed'), [goals]);
  const topAspirations = useMemo(() => goals.filter(g => g.priority === 1), [goals]);

  const totalSaved = useMemo(() => 
    goals.reduce((sum, goal) => 
      sum + (goal.measurable.unit === 'usd' ? goal.measurable.current : 0), 0), [goals]);
  
  const totalTarget = useMemo(() => 
    goals.reduce((sum, goal) => 
      sum + (goal.measurable.unit === 'usd' ? goal.measurable.target : 0), 0), [goals]);
  
  const averageProgress = useMemo(() => {
    if (goals.length === 0) return 0;
    return goals.reduce((sum, goal) => {
      const progress = goal.measurable.target > 0 
        ? (goal.measurable.current / goal.measurable.target) * 100 
        : 0;
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
      setTemplates((data || []) as any);
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