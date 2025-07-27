import { Goal, GoalProgress } from '@/types/goal';

export const calculateGoalProgress = (goal: Goal): GoalProgress => {
  const percentage = goal.target_amount > 0 
    ? Math.min((goal.current_amount / goal.target_amount) * 100, 100)
    : 0;

  const amount_remaining = Math.max(goal.target_amount - goal.current_amount, 0);

  let days_remaining = 0;
  let projected_completion: string | null = null;

  if (goal.target_date) {
    const targetDate = new Date(goal.target_date);
    const today = new Date();
    const diffTime = targetDate.getTime() - today.getTime();
    days_remaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Calculate projected completion based on current savings rate
    if (goal.monthly_contribution > 0 && amount_remaining > 0) {
      const monthsToComplete = amount_remaining / goal.monthly_contribution;
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
  const on_track = days_remaining > 0 
    ? (goal.monthly_contribution >= monthly_target * 0.9) // 90% threshold
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

export const getGoalCategoryIcon = (category: string): string => {
  const iconMap: Record<string, string> = {
    'retirement': '🏖️',
    'healthcare_healthspan': '❤️',
    'travel_bucket_list': '✈️',
    'family_experience': '👨‍👩‍👧‍👦',
    'charitable_giving': '🎁',
    'education': '🎓',
    'real_estate': '🏠',
    'wedding': '💒',
    'vehicle': '🚗',
    'emergency_fund': '🛡️',
    'debt_paydown': '💳',
    'lifetime_gifting': '💝',
    'legacy_inheritance': '👑',
    'life_insurance': '🔒',
    'other': '🎯'
  };
  
  return iconMap[category] || '🎯';
};

export const calculateTotalGoalStats = (goals: Goal[]) => {
  const total_goals = goals.length;
  const active_goals = goals.filter(g => g.status === 'active').length;
  const completed_goals = goals.filter(g => g.status === 'completed').length;
  const total_saved = goals.reduce((sum, goal) => sum + goal.current_amount, 0);
  const total_target = goals.reduce((sum, goal) => sum + goal.target_amount, 0);
  
  const average_progress = goals.length > 0 
    ? goals.reduce((sum, goal) => {
        const progress = goal.target_amount > 0 ? (goal.current_amount / goal.target_amount) * 100 : 0;
        return sum + Math.min(progress, 100);
      }, 0) / goals.length
    : 0;

  const on_track_count = goals.filter(g => {
    const progress = calculateGoalProgress(g);
    return progress.on_track;
  }).length;

  const at_risk_count = goals.filter(g => g.status === 'at_risk').length;

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
  const nextAmount = Math.min(
    goal.current_amount + (goal.target_amount * 0.25), // 25% increments
    goal.target_amount
  );

  return {
    title: `Reach ${((nextAmount / goal.target_amount) * 100).toFixed(0)}% of ${goal.name}`,
    target_amount: nextAmount,
    description: `Save ${((nextAmount - goal.current_amount) / 1000).toFixed(0)}K towards your ${goal.name} goal`
  };
};