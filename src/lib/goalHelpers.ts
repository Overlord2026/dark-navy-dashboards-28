import { Goal, GoalProgress } from '@/types/goal';

export const calculateGoalProgress = (goal: Goal): GoalProgress => {
  // Handle both new and legacy goal structures
  const targetAmount = goal.targetAmount || (goal as any).target_amount || 0;
  const currentAmount = goal.savedAmount || (goal as any).current_amount || 0;
  
  const percentage = targetAmount > 0 
    ? Math.min((currentAmount / targetAmount) * 100, 100)
    : 0;

  const amount_remaining = Math.max(targetAmount - currentAmount, 0);

  let days_remaining = 0;
  let projected_completion: string | null = null;

  const targetDate = goal.targetDate || (goal as any).target_date;
  if (targetDate) {
    const targetDateObj = new Date(targetDate);
    const today = new Date();
    const diffTime = targetDateObj.getTime() - today.getTime();
    days_remaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Calculate projected completion based on current savings rate
    const monthlyContribution = goal.monthlyPlan?.pre || (goal as any).monthly_contribution || 0;
    if (monthlyContribution > 0 && amount_remaining > 0) {
      const monthsToComplete = amount_remaining / monthlyContribution;
      const projectedDate = new Date();
      projectedDate.setMonth(projectedDate.getMonth() + monthsToComplete);
      projected_completion = projectedDate.toISOString().split('T')[0];
    }
  }

  // Calculate monthly target to reach goal on time
  const monthly_target = days_remaining > 0 
    ? (amount_remaining / (days_remaining / 30.44)) // Average days per month
    : 0;

  // Determine if goal is on track
  const monthlyContribution = goal.monthlyPlan?.pre || (goal as any).monthly_contribution || 0;
  const on_track = days_remaining > 0 
    ? (monthlyContribution >= monthly_target * 0.9) // 90% threshold
    : percentage >= 100;

  return {
    percentage,
    amount_remaining,
    days_remaining,
    monthly_target,
    on_track,
    projected_completion
  };
};

export const getGoalStatusColor = (status: string): string => {
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

export const getGoalPriorityColor = (priority: string): string => {
  switch (priority) {
    case 'top_aspiration':
      return 'text-yellow-500';
    case 'high':
      return 'text-red-500';
    case 'medium':
      return 'text-orange-500';
    case 'low':
      return 'text-gray-500';
    default:
      return 'text-gray-500';
  }
};

export const formatGoalCategory = (category: string): string => {
  return category
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const getGoalCategoryIcon = (goal: Goal): string => {
  // Handle bucket list goals
  if (goal.kind === 'bucket') {
    return '✨'; // Default bucket list icon
  }
  
  // Handle financial goals by title/category inference
  const title = goal.title.toLowerCase();
  if (title.includes('retirement')) return '🏖️';
  if (title.includes('emergency')) return '🛡️';
  if (title.includes('travel')) return '✈️';
  if (title.includes('education')) return '🎓';
  if (title.includes('home') || title.includes('house')) return '🏠';
  if (title.includes('car') || title.includes('vehicle')) return '🚗';
  if (title.includes('wedding')) return '💒';
  if (title.includes('charity') || title.includes('giving')) return '🎁';
  if (title.includes('health')) return '❤️';
  if (title.includes('debt')) return '💳';
  
  return goal.kind === 'financial' ? '💰' : '🎯';
};

export const calculateTotalGoalStats = (goals: Goal[]) => {
  const total_goals = goals.length;
  const active_goals = goals.filter(g => (g.status || 'active') === 'active').length;
  const completed_goals = goals.filter(g => (g.status || 'active') === 'completed').length;
  
  const total_saved = goals.reduce((sum, goal) => {
    const saved = goal.savedAmount || (goal as any).current_amount || 0;
    return sum + saved;
  }, 0);
  
  const total_target = goals.reduce((sum, goal) => {
    const target = goal.targetAmount || (goal as any).target_amount || 0;
    return sum + target;
  }, 0);
  
  const average_progress = goals.length > 0 
    ? goals.reduce((sum, goal) => {
        const target = goal.targetAmount || (goal as any).target_amount || 0;
        const current = goal.savedAmount || (goal as any).current_amount || 0;
        const progress = target > 0 ? (current / target) * 100 : 0;
        return sum + Math.min(progress, 100);
      }, 0) / goals.length
    : 0;

  const on_track_count = goals.filter(g => {
    const progress = calculateGoalProgress(g);
    return progress.on_track;
  }).length;

  const at_risk_count = goals.filter(g => (g.status || 'active') === 'at_risk').length;

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

export const suggestNextMilestone = (goal: Goal, currentMilestones: any[] = []): any => {
  const progress = calculateGoalProgress(goal);
  const targetAmount = goal.targetAmount || (goal as any).target_amount || 0;
  const currentAmount = goal.savedAmount || (goal as any).current_amount || 0;
  const goalName = goal.title || (goal as any).name || 'goal';
  
  if (goal.kind === 'bucket') {
    const metricTarget = goal.metricTarget || 1;
    const metricProgress = goal.metricProgress || 0;
    const nextMetric = Math.min(metricProgress + 1, metricTarget);
    
    return {
      title: `Complete milestone ${nextMetric} of ${metricTarget}`,
      target_amount: 0,
      description: `Work towards achieving milestone ${nextMetric} for ${goalName}`
    };
  }
  
  const nextAmount = Math.min(
    currentAmount + (targetAmount * 0.25), // 25% increments
    targetAmount
  );

  return {
    title: `Reach ${((nextAmount / targetAmount) * 100).toFixed(0)}% of ${goalName}`,
    target_amount: nextAmount,
    description: `Save ${((nextAmount - currentAmount) / 1000).toFixed(0)}K towards your ${goalName} goal`
  };
};