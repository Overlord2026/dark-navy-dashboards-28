import { Goal, GoalProgress, Persona, GoalKind, FundingSplit } from '@/types/goal';

export const calculateGoalProgress = (goal: Goal): GoalProgress => {
  const target = goal.measurable.target;
  const current = goal.measurable.current;
  
  const percentage = target > 0 
    ? Math.min((current / target) * 100, 100)
    : 0;

  const amount_remaining = Math.max(target - current, 0);

  let days_remaining = 0;
  let projected_completion: string | null = null;

  // Handle deadline or window-based time bounds
  if (goal.timeBound?.deadline) {
    const targetDate = new Date(goal.timeBound.deadline);
    const today = new Date();
    const diffTime = targetDate.getTime() - today.getTime();
    days_remaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  } else if (goal.timeBound?.window) {
    // Estimate days based on window (month/year)
    const today = new Date();
    const targetDate = new Date(
      goal.timeBound.window.year || today.getFullYear() + 1,
      goal.timeBound.window.month ? goal.timeBound.window.month - 1 : 11,
      1
    );
    const diffTime = targetDate.getTime() - today.getTime();
    days_remaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // Calculate projected completion based on funding strategy
  if (goal.funding && amount_remaining > 0) {
    const monthlyContribution = calculateMonthlyContribution(goal.funding);
    if (monthlyContribution > 0) {
      const monthsToComplete = amount_remaining / monthlyContribution;
      const projectedDate = new Date();
      projectedDate.setMonth(projectedDate.getMonth() + monthsToComplete);
      projected_completion = projectedDate.toISOString().split('T')[0];
    }
  }

  // Calculate monthly target to reach goal on time
  const monthly_target = days_remaining > 0 && goal.measurable.unit === 'usd'
    ? (amount_remaining / (days_remaining / 30.44)) // Average days per month
    : 0;

  // Determine if goal is on track
  const monthlyContribution = goal.funding ? calculateMonthlyContribution(goal.funding) : 0;
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

export const calculateMonthlyContribution = (funding: FundingSplit): number => {
  let monthlyAmount = 0;
  
  if (funding.prePaycheck) {
    const { amount, cadence } = funding.prePaycheck;
    switch (cadence) {
      case 'weekly':
        monthlyAmount += amount * 4.33; // Average weeks per month
        break;
      case 'biweekly':
        monthlyAmount += amount * 2.17; // Average biweeks per month
        break;
      case 'monthly':
        monthlyAmount += amount;
        break;
    }
  }
  
  if (funding.postPaycheck) {
    monthlyAmount += funding.postPaycheck.amount;
  }
  
  return monthlyAmount;
};

export const getGoalStatusColor = (goal: Goal): string => {
  const status = goal.status || 'active';
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

export const getGoalPriorityColor = (priority: number): string => {
  if (priority === 1) return 'text-red-500'; // Highest priority
  if (priority <= 3) return 'text-orange-500'; // High priority
  if (priority <= 5) return 'text-yellow-500'; // Medium priority
  return 'text-gray-500'; // Lower priority
};

export const getGoalKindIcon = (kind: GoalKind): string => {
  return kind === 'financial' ? '💰' : '✨';
};

export const getGoalCategoryIcon = (goal: Goal): string => {
  // Handle bucket list goals
  if (goal.kind === 'bucket') {
    if (goal.specific?.destination) return '✈️';
    if (goal.specific?.experiences?.length) return '🎯';
    return '✨'; // Default bucket list icon
  }
  
  // Handle financial goals by name inference
  const name = goal.name.toLowerCase();
  if (name.includes('retirement')) return '🏖️';
  if (name.includes('emergency')) return '🛡️';
  if (name.includes('travel')) return '✈️';
  if (name.includes('education')) return '🎓';
  if (name.includes('home') || name.includes('house')) return '🏠';
  if (name.includes('car') || name.includes('vehicle')) return '🚗';
  if (name.includes('wedding')) return '💒';
  if (name.includes('charity') || name.includes('giving')) return '🎁';
  if (name.includes('health')) return '❤️';
  if (name.includes('debt')) return '💳';
  
  return goal.kind === 'financial' ? '💰' : '🎯';
};

export const calculateTotalGoalStats = (goals: Goal[]) => {
  const total_goals = goals.length;
  const active_goals = goals.filter(g => (g.status || 'active') === 'active').length;
  const completed_goals = goals.filter(g => (g.status || 'active') === 'completed').length;
  
  const total_saved = goals.reduce((sum, goal) => {
    return sum + (goal.measurable.unit === 'usd' ? goal.measurable.current : 0);
  }, 0);
  
  const total_target = goals.reduce((sum, goal) => {
    return sum + (goal.measurable.unit === 'usd' ? goal.measurable.target : 0);
  }, 0);
  
  const average_progress = goals.length > 0 
    ? goals.reduce((sum, goal) => {
        const progress = goal.measurable.target > 0 
          ? (goal.measurable.current / goal.measurable.target) * 100 
          : 0;
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
  
  if (goal.kind === 'bucket') {
    const { target, current, unit } = goal.measurable;
    const nextTarget = Math.min(current + 1, target);
    
    return {
      title: `Complete milestone ${nextTarget} of ${target}`,
      target_amount: nextTarget,
      description: `Work towards achieving milestone ${nextTarget} for ${goal.name}`
    };
  }
  
  // Financial goals
  const { target, current } = goal.measurable;
  const nextAmount = Math.min(
    current + (target * 0.25), // 25% increments
    target
  );

  return {
    title: `Reach ${((nextAmount / target) * 100).toFixed(0)}% of ${goal.name}`,
    target_amount: nextAmount,
    description: `Save ${((nextAmount - current) / 1000).toFixed(0)}K towards your ${goal.name} goal`
  };
};

export const formatGoalUnit = (unit: "usd" | "trips" | "items", amount: number): string => {
  switch (unit) {
    case 'usd':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    case 'trips':
      return `${amount} trip${amount !== 1 ? 's' : ''}`;
    case 'items':
      return `${amount} item${amount !== 1 ? 's' : ''}`;
    default:
      return amount.toString();
  }
};

export const getPersonaColor = (persona: Persona): string => {
  return persona === 'aspiring' ? 'text-blue-500' : 'text-emerald-500';
};

export const getPersonaIcon = (persona: Persona): string => {
  return persona === 'aspiring' ? '🚀' : '🌅';
};

// Backward compatibility helpers for legacy goal structure
export const adaptLegacyGoal = (legacyGoal: any): Goal => {
  return {
    id: legacyGoal.id,
    persona: 'aspiring' as Persona,
    kind: 'financial' as GoalKind,
    priority: legacyGoal.priority === 'top_aspiration' ? 1 : 
              legacyGoal.priority === 'high' ? 2 :
              legacyGoal.priority === 'medium' ? 3 : 4,
    name: legacyGoal.name || legacyGoal.title || '',
    cover: legacyGoal.image_url || legacyGoal.imageUrl,
    specific: {
      description: legacyGoal.description || legacyGoal.aspirational_description
    },
    measurable: {
      unit: 'usd',
      target: legacyGoal.target_amount || legacyGoal.targetAmount || 0,
      current: legacyGoal.current_amount || legacyGoal.savedAmount || 0
    },
    relevant: {
      why: legacyGoal.why_important || legacyGoal.experience_story
    },
    timeBound: legacyGoal.target_date || legacyGoal.targetDate ? {
      deadline: legacyGoal.target_date || legacyGoal.targetDate
    } : undefined,
    funding: legacyGoal.monthly_contribution || legacyGoal.monthlyPlan ? {
      prePaycheck: {
        amount: legacyGoal.monthly_contribution || legacyGoal.monthlyPlan?.pre || 0,
        cadence: 'monthly'
      }
    } : undefined,
    createdAt: legacyGoal.created_at || new Date().toISOString(),
    user_id: legacyGoal.user_id,
    tenant_id: legacyGoal.tenant_id,
    status: legacyGoal.status,
    updated_at: legacyGoal.updated_at
  };
};