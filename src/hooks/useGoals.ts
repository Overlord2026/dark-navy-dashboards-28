// Simple hooks file to get build working
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { goalsApi, goalKeys } from '@/api/goalsApi';
import { toast } from 'sonner';

export const useGoals = () => {
  return useQuery({
    queryKey: goalKeys.lists(),
    queryFn: goalsApi.listGoals,
  });
};

export const useCreateGoal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: goalsApi.createGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: goalKeys.lists() });
      toast.success('Goal created!');
    },
  });
};

export const useUpdateGoal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: goalsApi.updateGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: goalKeys.lists() });
      toast.success('Goal updated!');
    },
  });
};

export const useDeleteGoal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: goalsApi.deleteGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: goalKeys.lists() });
      toast.success('Goal deleted!');
    },
  });
};

export const useAccounts = () => {
  return useQuery({
    queryKey: goalKeys.accounts,
    queryFn: goalsApi.getAccounts,
  });
};

export const usePersonaDefaults = (persona: 'aspiring' | 'retiree') => {
  return useQuery({
    queryKey: goalKeys.personaDefaults(persona),
    queryFn: () => goalsApi.getPersonaDefaults(persona),
  });
};

export const useAssignAccounts = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: goalsApi.assignAccounts,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: goalKeys.lists() });
      toast.success('Accounts assigned!');
    },
  });
};

export const useSetContributionPlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: goalsApi.setContributionPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: goalKeys.lists() });
      toast.success('Contribution plan updated!');
    },
  });
};

export const useReorderGoals = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: goalsApi.reorderGoals,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: goalKeys.lists() });
      toast.success('Goals reordered!');
    },
  });
};

export const useTopGoals = (persona?: 'aspiring' | 'retiree', limit = 3) => {
  const { data: goals = [] } = useGoals();
  const filteredGoals = persona ? goals.filter(goal => goal.persona === persona) : goals;
  return filteredGoals.sort((a, b) => a.priority - b.priority).slice(0, limit);
};

export const useGoalStats = () => {
  const { data: goals = [] } = useGoals();
  return {
    total: goals.length,
    totalSaved: goals.reduce((sum, goal) => sum + (goal.progress?.current || 0), 0),
    totalTarget: goals.reduce((sum, goal) => sum + (goal.targetAmount || 0), 0),
    averageProgress: goals.length > 0 ? goals.reduce((sum, goal) => sum + (goal.progress?.pct || 0), 0) / goals.length : 0,
    onTrack: goals.filter(goal => (goal.progress?.pct || 0) >= 80).length
  };
};

export const useGoal = (goalId: string) => {
  const { data: goals } = useGoals();
  return {
    data: goals?.find(g => g.id === goalId),
    isLoading: false,
    error: null
  };
};