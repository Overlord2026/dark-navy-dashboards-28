// Mock prospects data for the Advisor Platform
// This will be replaced with real API calls/data stores later

export interface Prospect {
  id: string;
  name: string;
  email: string;
  status: 'hot' | 'warm' | 'cold' | 'qualified' | 'converted';
  source: 'referral' | 'website' | 'linkedin' | 'cold-outreach' | 'event' | 'advertising';
  hnwScore: number; // High Net Worth Score (1-100)
  nextMeeting?: string; // ISO date string or null
  phone?: string;
  company?: string;
  notes?: string;
  createdAt: string;
  lastContact: string;
  estimatedAUM: number;
}

// Mock prospects data
export const getMockProspects = (): Prospect[] => {
  return [
    {
      id: 'prospect-1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@johnsontrust.com',
      status: 'hot',
      source: 'referral',
      hnwScore: 92,
      nextMeeting: '2024-01-15T14:00:00Z',
      phone: '+1 (555) 123-4567',
      company: 'Johnson Family Trust',
      notes: 'Estate planning focus, referred by existing client',
      createdAt: '2024-01-01T10:00:00Z',
      lastContact: '2024-01-10T15:30:00Z',
      estimatedAUM: 1250000
    },
    {
      id: 'prospect-2',
      name: 'Michael Chen',
      email: 'mchen@techcorp.com',
      status: 'warm',
      source: 'linkedin',
      hnwScore: 88,
      nextMeeting: '2024-01-18T10:30:00Z',
      phone: '+1 (555) 234-5678',
      company: 'TechCorp',
      notes: 'Tech executive, retirement planning interest',
      createdAt: '2024-01-02T09:15:00Z',
      lastContact: '2024-01-08T11:45:00Z',
      estimatedAUM: 2500000
    },
    {
      id: 'prospect-3',
      name: 'Davis Family Office',
      email: 'contact@davisfamily.com',
      status: 'qualified',
      source: 'event',
      hnwScore: 95,
      nextMeeting: '2024-01-20T16:00:00Z',
      phone: '+1 (555) 345-6789',
      company: 'Davis Family Office',
      notes: 'Multi-generational wealth management, met at conference',
      createdAt: '2024-01-03T14:20:00Z',
      lastContact: '2024-01-09T13:15:00Z',
      estimatedAUM: 5000000
    },
    {
      id: 'prospect-4',
      name: 'Jennifer Liu',
      email: 'jliu@startupfunds.com',
      status: 'cold',
      source: 'website',
      hnwScore: 76,
      phone: '+1 (555) 456-7890',
      company: 'StartupFunds LLC',
      notes: 'Downloaded retirement calculator, no response to follow-up',
      createdAt: '2024-01-04T11:30:00Z',
      lastContact: '2024-01-05T16:20:00Z',
      estimatedAUM: 850000
    },
    {
      id: 'prospect-5',
      name: 'Robert Thompson',
      email: 'rthompson@realestate.com',
      status: 'warm',
      source: 'cold-outreach',
      hnwScore: 82,
      nextMeeting: '2024-01-22T09:00:00Z',
      phone: '+1 (555) 567-8901',
      company: 'Thompson Real Estate',
      notes: 'Real estate investor, interested in tax strategies',
      createdAt: '2024-01-05T08:45:00Z',
      lastContact: '2024-01-07T14:10:00Z',
      estimatedAUM: 1800000
    },
    {
      id: 'prospect-6',
      name: 'Amanda Rodriguez',
      email: 'arodriguez@medgroup.com',
      status: 'converted',
      source: 'referral',
      hnwScore: 89,
      phone: '+1 (555) 678-9012',
      company: 'MedGroup Partners',
      notes: 'Recently converted client, signed last week',
      createdAt: '2024-01-06T12:15:00Z',
      lastContact: '2024-01-11T10:00:00Z',
      estimatedAUM: 2200000
    },
    {
      id: 'prospect-7',
      name: 'David Kim',
      email: 'dkim@techstartup.io',
      status: 'hot',
      source: 'advertising',
      hnwScore: 91,
      nextMeeting: '2024-01-16T15:30:00Z',
      phone: '+1 (555) 789-0123',
      company: 'TechStartup.io',
      notes: 'Recently sold company, looking for wealth management',
      createdAt: '2024-01-07T16:40:00Z',
      lastContact: '2024-01-10T09:30:00Z',
      estimatedAUM: 3500000
    },
    {
      id: 'prospect-8',
      name: 'Lisa Anderson',
      email: 'landerson@lawfirm.com',
      status: 'qualified',
      source: 'linkedin',
      hnwScore: 85,
      nextMeeting: '2024-01-25T11:00:00Z',
      phone: '+1 (555) 890-1234',
      company: 'Anderson & Associates',
      notes: 'Senior partner, interested in estate planning',
      createdAt: '2024-01-08T13:25:00Z',
      lastContact: '2024-01-09T17:45:00Z',
      estimatedAUM: 1900000
    },
    {
      id: 'prospect-9',
      name: 'Mark Wilson',
      email: 'mwilson@manufacturetech.com',
      status: 'cold',
      source: 'website',
      hnwScore: 73,
      phone: '+1 (555) 901-2345',
      company: 'ManufactureTech Inc',
      notes: 'Downloaded tax guide, limited engagement',
      createdAt: '2024-01-09T10:10:00Z',
      lastContact: '2024-01-09T10:15:00Z',
      estimatedAUM: 1100000
    },
    {
      id: 'prospect-10',
      name: 'Dr. Patricia Brown',
      email: 'pbrown@medicalpractice.com',
      status: 'warm',
      source: 'event',
      hnwScore: 87,
      nextMeeting: '2024-01-19T14:30:00Z',
      phone: '+1 (555) 012-3456',
      company: 'Brown Medical Practice',
      notes: 'Attended financial planning seminar, follow-up scheduled',
      createdAt: '2024-01-10T15:50:00Z',
      lastContact: '2024-01-11T12:20:00Z',
      estimatedAUM: 2100000
    }
  ];
};

// Helper functions for status and source styling
export const getStatusStyle = (status: Prospect['status']) => {
  switch (status) {
    case 'hot':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'warm':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'cold':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'qualified':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'converted':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getSourceStyle = (source: Prospect['source']) => {
  switch (source) {
    case 'referral':
      return 'bg-emerald-100 text-emerald-800';
    case 'website':
      return 'bg-blue-100 text-blue-800';
    case 'linkedin':
      return 'bg-blue-100 text-blue-800';
    case 'cold-outreach':
      return 'bg-gray-100 text-gray-800';
    case 'event':
      return 'bg-purple-100 text-purple-800';
    case 'advertising':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Filter options
export const statusOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: 'hot', label: 'Hot' },
  { value: 'warm', label: 'Warm' },
  { value: 'cold', label: 'Cold' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'converted', label: 'Converted' }
];

export const sourceOptions = [
  { value: 'all', label: 'All Sources' },
  { value: 'referral', label: 'Referral' },
  { value: 'website', label: 'Website' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'cold-outreach', label: 'Cold Outreach' },
  { value: 'event', label: 'Event' },
  { value: 'advertising', label: 'Advertising' }
];

// Utility function to format currency
export const formatCurrency = (amount: number): string => {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  } else if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`;
  }
  return `$${amount.toLocaleString()}`;
};

// Utility function to format date
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};