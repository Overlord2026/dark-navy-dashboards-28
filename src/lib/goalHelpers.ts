import { Goal, Persona } from '@/types/goal';

export const calculateGoalProgress = (goal: Goal) => {
  const target = goal.targetAmount || 0;
  const current = goal.progress?.current || 0;
  
  const percentage = target > 0 
    ? Math.min((current / target) * 100, 100)
    : 0;

  const amount_remaining = Math.max(target - current, 0);

  let days_remaining = 0;

  // Handle deadline
  if (goal.targetDate) {
    const targetDate = new Date(goal.targetDate);
    const today = new Date();
    const diffTime = targetDate.getTime() - today.getTime();
    days_remaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // Calculate monthly target to reach goal on time
  const monthly_target = days_remaining > 0 && target > 0
    ? (amount_remaining / (days_remaining / 30.44)) // Average days per month
    : 0;

  // Determine if goal is on track
  const monthlyContribution = goal.monthlyContribution || 0;
  const on_track = days_remaining > 0 
    ? (monthlyContribution >= monthly_target * 0.9) // 90% threshold
    : percentage >= 100;

  return {
    percentage,
    amount_remaining,
    days_remaining,
    monthly_target,
    on_track
  };
};

export const getGoalStatusColor = (progress: number): string => {
  if (progress >= 100) return 'bg-emerald-500';
  if (progress >= 80) return 'bg-blue-500';
  if (progress >= 50) return 'bg-amber-500';
  return 'bg-slate-500';
};

export const getGoalPriorityColor = (priority: number): string => {
  if (priority === 1) return 'text-red-500'; // Highest priority
  if (priority <= 3) return 'text-orange-500'; // High priority
  if (priority <= 5) return 'text-yellow-500'; // Medium priority
  return 'text-gray-500'; // Lower priority
};

export const getGoalTypeIcon = (type: Goal['type']): string => {
  switch (type) {
    case 'bucket_list': return '✨';
    case 'retirement': return '🏖️';
    case 'emergency': return '🛡️';
    case 'education': return '🎓';
    case 'wedding': return '💒';
    case 'savings': return '💰';
    case 'down_payment': return '🏠';
    case 'debt': return '💳';
    default: return '🎯';
  }
};

export const calculateTotalGoalStats = (goals: Goal[]) => {
  const total_goals = goals.length;
  const active_goals = goals.filter(g => (g.progress?.pct || 0) < 100).length;
  const completed_goals = goals.filter(g => (g.progress?.pct || 0) >= 100).length;
  
  const total_saved = goals.reduce((sum, goal) => {
    return sum + (goal.progress?.current || 0);
  }, 0);
  
  const total_target = goals.reduce((sum, goal) => {
    return sum + (goal.targetAmount || 0);
  }, 0);
  
  const average_progress = goals.length > 0 
    ? goals.reduce((sum, goal) => {
        return sum + (goal.progress?.pct || 0);
      }, 0) / goals.length
    : 0;

  const on_track_count = goals.filter(g => {
    const progress = calculateGoalProgress(g);
    return progress.on_track;
  }).length;

  const at_risk_count = goals.filter(g => {
    const progress = g.progress?.pct || 0;
    return progress < 50;
  }).length;

  return {
    total_goals,
    active_goals,
    completed_goals,
    total_saved,
    total_target,
    average_progress,
    on_track_count,
    at_risk_count
  };
};

export const formatGoalUnit = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const getPersonaColor = (persona: Persona): string => {
  return persona === 'aspiring' ? 'text-blue-500' : 'text-emerald-500';
};

export const getPersonaIcon = (persona: Persona): string => {
  return persona === 'aspiring' ? '🚀' : '🌅';
};