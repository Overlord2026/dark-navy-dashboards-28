import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { analytics } from '@/lib/analytics';

export interface EmailTrigger {
  id: string;
  name: string;
  trigger_type: 'page_visit' | 'tool_usage' | 'time_delay' | 'engagement_score' | 'profile_completion' | 'inactivity';
  conditions: Record<string, any>;
  delay_minutes: number;
  persona_filter: string;
  segmentation_rules: Record<string, any>;
  is_active: boolean;
  created_at: string;
  triggered_count: number;
  conversion_count: number;
}

export interface EmailCampaign {
  id: string;
  name: string;
  subject_variants: string[];
  content_template: string;
  personalization_enabled: boolean;
  optimal_timing: boolean;
  ab_test_enabled: boolean;
  send_time_optimization: string;
  audience_segment: string;
  conversion_goals: string[];
  created_at: string;
  performance_metrics: {
    sent: number;
    opened: number;
    clicked: number;
    converted: number;
    open_rate: number;
    click_rate: number;
    conversion_rate: number;
  };
}

export interface BehaviorEvent {
  id: string;
  user_id: string;
  event_type: string;
  event_data: Record<string, any>;
  timestamp: string;
  persona: string;
  engagement_score: number;
}

export const useAdvancedEmailTriggers = () => {
  const [triggers, setTriggers] = useState<EmailTrigger[]>([]);
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [behaviorEvents, setBehaviorEvents] = useState<BehaviorEvent[]>([]);
  const [analytics, setAnalytics] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Initialize behavior tracking
  useEffect(() => {
    const trackBehavior = (eventType: string, eventData: Record<string, any> = {}) => {
      const event: BehaviorEvent = {
        id: crypto.randomUUID(),
        user_id: 'current_user', // Will be replaced with actual user ID
        event_type: eventType,
        event_data: eventData,
        timestamp: new Date().toISOString(),
        persona: getUserPersona(),
        engagement_score: calculateEngagementScore()
      };
      
      // Store locally and process triggers
      const existingEvents = JSON.parse(localStorage.getItem('behavior_events') || '[]');
      const updatedEvents = [event, ...existingEvents].slice(0, 1000);
      localStorage.setItem('behavior_events', JSON.stringify(updatedEvents));
      
      setBehaviorEvents(updatedEvents);
      processTriggers(event);
    };

    // Track page visits
    const handleLocationChange = () => {
      trackBehavior('page_visit', {
        url: window.location.pathname,
        timestamp: Date.now()
      });
    };

    // Track tool usage (button clicks, form submissions)
    const handleToolUsage = (event: Event) => {
      const target = event.target as HTMLElement;
      if (target.closest('[data-tool-usage]')) {
        const toolName = target.closest('[data-tool-usage]')?.getAttribute('data-tool-usage');
        trackBehavior('tool_usage', {
          tool_name: toolName,
          action: event.type,
          element: target.tagName
        });
      }
    };

    // Set up event listeners
    window.addEventListener('popstate', handleLocationChange);
    document.addEventListener('click', handleToolUsage);
    document.addEventListener('submit', handleToolUsage);

    // Initial page load
    handleLocationChange();

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      document.removeEventListener('click', handleToolUsage);
      document.removeEventListener('submit', handleToolUsage);
    };
  }, []);

  const getUserPersona = (): string => {
    // Get from localStorage or context
    return localStorage.getItem('user_persona') || 'advisor';
  };

  const calculateEngagementScore = (): number => {
    const events = JSON.parse(localStorage.getItem('behavior_events') || '[]');
    const recentEvents = events.filter((e: BehaviorEvent) => 
      Date.now() - new Date(e.timestamp).getTime() < 7 * 24 * 60 * 60 * 1000 // Last 7 days
    );
    
    // Simple scoring based on activity frequency and recency
    const score = Math.min(100, recentEvents.length * 5);
    return score;
  };

  const processTriggers = async (event: BehaviorEvent) => {
    const activeTriggers = triggers.filter(t => t.is_active);
    
    for (const trigger of activeTriggers) {
      let shouldTrigger = false;
      
      switch (trigger.trigger_type) {
        case 'page_visit':
          if (event.event_type === 'page_visit') {
            const pattern = trigger.conditions.url_pattern;
            if (pattern && event.event_data.url.match(new RegExp(pattern))) {
              shouldTrigger = true;
            }
          }
          break;
          
        case 'tool_usage':
          if (event.event_type === 'tool_usage') {
            const toolName = trigger.conditions.tool_name;
            if (!toolName || event.event_data.tool_name === toolName) {
              shouldTrigger = true;
            }
          }
          break;
          
        case 'engagement_score':
          if (event.engagement_score >= trigger.conditions.threshold) {
            shouldTrigger = true;
          }
          break;
          
        case 'inactivity':
          // Check if user has been inactive for specified time
          const lastActivity = new Date(event.timestamp);
          const inactivityThreshold = trigger.conditions.hours || 24;
          if (Date.now() - lastActivity.getTime() > inactivityThreshold * 60 * 60 * 1000) {
            shouldTrigger = true;
          }
          break;
      }
      
      if (shouldTrigger) {
        await executeTrigger(trigger, event);
      }
    }
  };

  const executeTrigger = async (trigger: EmailTrigger, event: BehaviorEvent) => {
    try {
      // Check if user matches persona filter
      if (trigger.persona_filter && trigger.persona_filter !== event.persona) {
        return;
      }

      // Apply delay if specified
      const executeTime = trigger.delay_minutes > 0 
        ? new Date(Date.now() + trigger.delay_minutes * 60 * 1000)
        : new Date();

      // Call advanced email automation edge function
      const { data, error } = await supabase.functions.invoke('advanced-email-automation', {
        body: {
          action: 'execute_trigger',
          trigger_id: trigger.id,
          user_event: event,
          execute_at: executeTime.toISOString(),
          personalization_data: await getPersonalizationData(event.user_id, event.persona)
        }
      });

      if (error) throw error;

      // Update trigger stats
      const updatedTrigger = {
        ...trigger,
        triggered_count: trigger.triggered_count + 1
      };
      
      setTriggers(prev => prev.map(t => t.id === trigger.id ? updatedTrigger : t));
      
      analytics.track('email_trigger_executed', {
        trigger_id: trigger.id,
        trigger_type: trigger.trigger_type,
        user_persona: event.persona,
        engagement_score: event.engagement_score
      });

    } catch (error) {
      console.error('Error executing trigger:', error);
    }
  };

  const getPersonalizationData = async (userId: string, persona: string) => {
    // Fetch user profile and behavioral data for personalization
    const behaviorEvents = JSON.parse(localStorage.getItem('behavior_events') || '[]');
    const recentEvents = behaviorEvents.filter((e: BehaviorEvent) => 
      Date.now() - new Date(e.timestamp).getTime() < 30 * 24 * 60 * 60 * 1000 // Last 30 days
    );

    // Calculate personalization variables
    const engagementLevel = calculateEngagementScore();
    const favoriteTools = getFavoriteTools(recentEvents);
    const lastActivity = getLastActivity(recentEvents);
    const profileCompletion = getProfileCompletion();

    return {
      first_name: localStorage.getItem('user_first_name') || 'there',
      company: localStorage.getItem('user_company') || '',
      persona: persona,
      engagement_score: engagementLevel,
      engagement_level: engagementLevel > 70 ? 'high' : engagementLevel > 30 ? 'medium' : 'low',
      last_activity: lastActivity,
      favorite_tools: favoriteTools,
      profile_completion: profileCompletion,
      relevant_tools: getRelevantToolsForPersona(persona),
      optimal_send_time: getOptimalSendTime(recentEvents)
    };
  };

  const getFavoriteTools = (events: BehaviorEvent[]) => {
    const toolUsage = events
      .filter(e => e.event_type === 'tool_usage')
      .reduce((acc: Record<string, number>, e) => {
        const tool = e.event_data.tool_name;
        acc[tool] = (acc[tool] || 0) + 1;
        return acc;
      }, {});
    
    return Object.entries(toolUsage)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([tool]) => tool);
  };

  const getLastActivity = (events: BehaviorEvent[]) => {
    if (events.length === 0) return 'Never';
    
    const lastEvent = events[0];
    const daysSince = Math.floor((Date.now() - new Date(lastEvent.timestamp).getTime()) / (24 * 60 * 60 * 1000));
    
    if (daysSince === 0) return 'Today';
    if (daysSince === 1) return 'Yesterday';
    return `${daysSince} days ago`;
  };

  const getProfileCompletion = () => {
    // Check localStorage for profile completion status
    const hasName = localStorage.getItem('user_first_name');
    const hasCompany = localStorage.getItem('user_company');
    const hasPersona = localStorage.getItem('user_persona');
    
    let completion = 0;
    if (hasName) completion += 33;
    if (hasCompany) completion += 33;
    if (hasPersona) completion += 34;
    
    return completion;
  };

  const getRelevantToolsForPersona = (persona: string) => {
    const toolsByPersona: Record<string, string[]> = {
      advisor: ['Portfolio Analysis', 'Risk Assessment', 'Client Dashboard'],
      cpa: ['Tax Calculator', 'Compliance Tracker', 'Document Manager'],
      attorney: ['Contract Generator', 'Legal Research', 'Case Manager'],
      coach: ['Goal Tracker', 'Progress Analytics', 'Client Portal'],
      insurance: ['Quote Calculator', 'Risk Analysis', 'Claims Tracker']
    };
    
    return toolsByPersona[persona] || [];
  };

  const getOptimalSendTime = (events: BehaviorEvent[]) => {
    // Analyze user activity patterns to determine optimal send time
    const hourlyActivity = events.reduce((acc: Record<number, number>, e) => {
      const hour = new Date(e.timestamp).getHours();
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {});
    
    const bestHour = Object.entries(hourlyActivity)
      .sort(([,a], [,b]) => b - a)[0]?.[0];
    
    return bestHour ? `${bestHour}:00` : '10:00'; // Default to 10 AM
  };

  const createTrigger = async (triggerData: Omit<EmailTrigger, 'id' | 'created_at' | 'triggered_count' | 'conversion_count'>) => {
    setLoading(true);
    try {
      const newTrigger: EmailTrigger = {
        ...triggerData,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        triggered_count: 0,
        conversion_count: 0
      };
      
      // Store locally (in production, this would go to database)
      const existingTriggers = JSON.parse(localStorage.getItem('email_triggers') || '[]');
      const updatedTriggers = [newTrigger, ...existingTriggers];
      localStorage.setItem('email_triggers', JSON.stringify(updatedTriggers));
      
      setTriggers(updatedTriggers);
      
      analytics.track('email_trigger_created', {
        trigger_type: triggerData.trigger_type,
        persona_filter: triggerData.persona_filter
      });
      
    } catch (error) {
      console.error('Error creating trigger:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createCampaign = async (campaignData: Omit<EmailCampaign, 'id' | 'created_at' | 'performance_metrics'>) => {
    setLoading(true);
    try {
      const newCampaign: EmailCampaign = {
        ...campaignData,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        performance_metrics: {
          sent: 0,
          opened: 0,
          clicked: 0,
          converted: 0,
          open_rate: 0,
          click_rate: 0,
          conversion_rate: 0
        }
      };
      
      const existingCampaigns = JSON.parse(localStorage.getItem('email_campaigns') || '[]');
      const updatedCampaigns = [newCampaign, ...existingCampaigns];
      localStorage.setItem('email_campaigns', JSON.stringify(updatedCampaigns));
      
      setCampaigns(updatedCampaigns);
      
    } catch (error) {
      console.error('Error creating campaign:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateTrigger = async (id: string, updates: Partial<EmailTrigger>) => {
    const existingTriggers = JSON.parse(localStorage.getItem('email_triggers') || '[]');
    const updatedTriggers = existingTriggers.map((t: EmailTrigger) => 
      t.id === id ? { ...t, ...updates } : t
    );
    localStorage.setItem('email_triggers', JSON.stringify(updatedTriggers));
    setTriggers(updatedTriggers);
  };

  const testTrigger = async (triggerId: string) => {
    const trigger = triggers.find(t => t.id === triggerId);
    if (!trigger) return;

    // Create a test event
    const testEvent: BehaviorEvent = {
      id: crypto.randomUUID(),
      user_id: 'test_user',
      event_type: 'test_event',
      event_data: { test: true },
      timestamp: new Date().toISOString(),
      persona: getUserPersona(),
      engagement_score: calculateEngagementScore()
    };

    await executeTrigger(trigger, testEvent);
    
    toast({
      title: "Test Triggered",
      description: `Test email sent for trigger: ${trigger.name}`
    });
  };

  // Load data on mount
  useEffect(() => {
    const loadData = () => {
      const triggers = JSON.parse(localStorage.getItem('email_triggers') || '[]');
      const campaigns = JSON.parse(localStorage.getItem('email_campaigns') || '[]');
      const events = JSON.parse(localStorage.getItem('behavior_events') || '[]');
      
      setTriggers(triggers);
      setCampaigns(campaigns);
      setBehaviorEvents(events);
    };
    
    loadData();
  }, []);

  return {
    triggers,
    campaigns,
    behaviorEvents,
    analytics,
    loading,
    createTrigger,
    createCampaign,
    updateTrigger,
    testTrigger,
    getPersonalizationData,
    processTriggers
  };
};