// Mock calendar events data for the Advisor Platform
// This will be replaced with real API calls/data stores later

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  type: 'meeting' | 'call' | 'follow-up' | 'presentation' | 'deadline';
  prospect?: string;
  location?: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
}

// Mock events data
export const getMockCalendarEvents = (): CalendarEvent[] => {
  const today = new Date();
  const thisWeek = new Date(today);
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  
  return [
    {
      id: 'event-1',
      title: 'Initial Consultation - Sarah Johnson',
      description: 'Estate planning discussion with Johnson Family Trust',
      start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 14, 0),
      end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 15, 0),
      type: 'meeting',
      prospect: 'Sarah Johnson',
      location: 'Conference Room A',
      status: 'scheduled'
    },
    {
      id: 'event-2',
      title: 'Follow-up Call - Michael Chen',
      description: 'Retirement planning follow-up discussion',
      start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 10, 30),
      end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 11, 30),
      type: 'call',
      prospect: 'Michael Chen',
      status: 'scheduled'
    },
    {
      id: 'event-3',
      title: 'Investment Strategy Presentation',
      description: 'Quarterly portfolio review with Davis Family',
      start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3, 16, 0),
      end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3, 17, 30),
      type: 'presentation',
      prospect: 'Davis Family Office',
      location: 'Client Office',
      status: 'scheduled'
    },
    {
      id: 'event-4',
      title: 'Prospect Qualification Call',
      description: 'Initial screening call with new lead',
      start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 4, 9, 0),
      end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 4, 9, 30),
      type: 'call',
      status: 'scheduled'
    },
    {
      id: 'event-5',
      title: 'Client Onboarding - Amanda Rodriguez',
      description: 'Complete onboarding process for new client',
      start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5, 13, 0),
      end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5, 14, 30),
      type: 'meeting',
      prospect: 'Amanda Rodriguez',
      location: 'Conference Room B',
      status: 'scheduled'
    },
    {
      id: 'event-6',
      title: 'Tax Planning Review',
      description: 'Annual tax strategy review with high-net-worth client',
      start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 8, 11, 0),
      end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 8, 12, 30),
      type: 'meeting',
      status: 'scheduled'
    },
    {
      id: 'event-7',
      title: 'Follow-up: Risk Assessment',
      description: 'Review completed risk assessment questionnaire',
      start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 10, 15, 0),
      end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 10, 15, 30),
      type: 'follow-up',
      status: 'scheduled'
    },
    {
      id: 'event-8',
      title: 'Proposal Deadline - Tech Startup',
      description: 'Submit investment proposal for tech executive client',
      start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 12, 17, 0),
      end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 12, 17, 0),
      type: 'deadline',
      status: 'scheduled'
    },
    // Past events
    {
      id: 'event-9',
      title: 'Wealth Planning Session - Completed',
      description: 'Comprehensive wealth planning with Thompson Real Estate',
      start: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2, 14, 0),
      end: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2, 16, 0),
      type: 'meeting',
      prospect: 'Robert Thompson',
      location: 'Conference Room A',
      status: 'completed'
    },
    {
      id: 'event-10',
      title: 'Market Update Call',
      description: 'Weekly market update with key clients',
      start: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 16, 0),
      end: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 16, 30),
      type: 'call',
      status: 'completed'
    }
  ];
};

// Helper function to get event type styling
export const getEventTypeStyle = (type: CalendarEvent['type']) => {
  switch (type) {
    case 'meeting':
      return 'bg-blue-500 border-blue-600 text-white';
    case 'call':
      return 'bg-green-500 border-green-600 text-white';
    case 'follow-up':
      return 'bg-yellow-500 border-yellow-600 text-white';
    case 'presentation':
      return 'bg-purple-500 border-purple-600 text-white';
    case 'deadline':
      return 'bg-red-500 border-red-600 text-white';
    default:
      return 'bg-gray-500 border-gray-600 text-white';
  }
};

// Helper function to get event status styling
export const getEventStatusStyle = (status: CalendarEvent['status']) => {
  switch (status) {
    case 'completed':
      return 'opacity-60 line-through';
    case 'cancelled':
      return 'opacity-40 line-through bg-gray-400';
    case 'rescheduled':
      return 'bg-orange-500 border-orange-600';
    default:
      return '';
  }
};

// Calendar view types
export type CalendarView = 'month' | 'week' | 'day';

// Helper function to format event time
export const formatEventTime = (start: Date, end: Date): string => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };
  
  if (start.toDateString() === end.toDateString()) {
    return `${formatTime(start)} - ${formatTime(end)}`;
  } else {
    return `${start.toLocaleDateString()} ${formatTime(start)} - ${end.toLocaleDateString()} ${formatTime(end)}`;
  }
};