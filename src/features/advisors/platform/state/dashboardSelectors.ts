// Mock selectors for Advisor Dashboard data
// These will be replaced with real API calls/data stores later

export interface DashboardKPIs {
  totalProspects: number;
  activeProspects: number;
  meetingsScheduled: number;
  conversions: number;
  conversionRate: number;
}

export interface RecentActivity {
  id: string;
  type: 'prospect' | 'meeting' | 'questionnaire' | 'recording' | 'conversion';
  title: string;
  description: string;
  timestamp: string;
  status: 'pending' | 'completed' | 'in-progress' | 'new';
}

// Mock KPI data - replace with real selectors later
export const getDashboardKPIs = (): DashboardKPIs => {
  return {
    totalProspects: 247,
    activeProspects: 89,
    meetingsScheduled: 23,
    conversions: 12,
    conversionRate: 18.5
  };
};

// Mock recent activity data - replace with real selectors later
export const getRecentActivity = (): RecentActivity[] => {
  return [
    {
      id: 'activity-1',
      type: 'conversion',
      title: 'New Client Conversion',
      description: 'Sarah Johnson completed onboarding - Estate Planning package',
      timestamp: '2 hours ago',
      status: 'completed'
    },
    {
      id: 'activity-2', 
      type: 'meeting',
      title: 'Meeting Scheduled',
      description: 'Discovery call with Michael Chen for retirement planning',
      timestamp: '4 hours ago',
      status: 'pending'
    },
    {
      id: 'activity-3',
      type: 'questionnaire',
      title: 'Risk Assessment Completed',
      description: 'Davis Family submitted risk tolerance questionnaire',
      timestamp: '6 hours ago',
      status: 'completed'
    },
    {
      id: 'activity-4',
      type: 'prospect',
      title: 'High-Value Prospect Added',
      description: 'Tech executive referred by existing client - $2M AUM potential',
      timestamp: '1 day ago',
      status: 'new'
    },
    {
      id: 'activity-5',
      type: 'recording',
      title: 'Call Recording Processed',
      description: 'Client consultation with Thompson Trust analyzed and tagged',
      timestamp: '2 days ago',
      status: 'completed'
    }
  ];
};

// Helper function to get activity status styling
export const getActivityStatusStyle = (status: RecentActivity['status']) => {
  switch (status) {
    case 'completed':
      return 'bg-green-500/10 text-green-700 border-green-200';
    case 'pending':
      return 'bg-yellow-500/10 text-yellow-700 border-yellow-200';
    case 'in-progress':
      return 'bg-blue-500/10 text-blue-700 border-blue-200';
    case 'new':
      return 'bg-purple-500/10 text-purple-700 border-purple-200';
    default:
      return 'bg-muted text-muted-foreground border-border';
  }
};

// Helper function to get activity type icon color
export const getActivityTypeColor = (type: RecentActivity['type']) => {
  switch (type) {
    case 'conversion':
      return 'text-green-600';
    case 'meeting':
      return 'text-blue-600';
    case 'questionnaire':
      return 'text-purple-600';
    case 'recording':
      return 'text-orange-600';
    case 'prospect':
      return 'text-primary';
    default:
      return 'text-muted-foreground';
  }
};