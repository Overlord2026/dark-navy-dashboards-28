import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { analytics } from "@/lib/analytics";
import { CheckCircle, XCircle, Clock, Play } from "lucide-react";

interface AnalyticsEvent {
  name: string;
  description: string;
  category: 'core' | 'business' | 'user_journey' | 'errors';
  properties?: Record<string, any>;
  tested: boolean;
  status: 'pending' | 'success' | 'failed';
  timestamp?: string;
}

export function AnalyticsChecklist() {
  const { toast } = useToast();
  const [events, setEvents] = useState<AnalyticsEvent[]>([
    // Core Application Events
    { 
      name: 'app_loaded', 
      description: 'Application successfully loaded',
      category: 'core',
      properties: { page: 'dashboard', user_agent: navigator.userAgent },
      tested: false,
      status: 'pending'
    },
    { 
      name: 'page_view', 
      description: 'User navigates to a page',
      category: 'core',
      properties: { page: '/dashboard', referrer: document.referrer },
      tested: false,
      status: 'pending'
    },
    { 
      name: 'user_login', 
      description: 'User successfully logs in',
      category: 'user_journey',
      properties: { method: 'email', timestamp: new Date().toISOString() },
      tested: false,
      status: 'pending'
    },
    { 
      name: 'user_logout', 
      description: 'User logs out',
      category: 'user_journey',
      properties: { session_duration: 1800 },
      tested: false,
      status: 'pending'
    },

    // Business Critical Events
    { 
      name: 'subscription_started', 
      description: 'User starts subscription checkout',
      category: 'business',
      properties: { plan: 'premium', amount: 99 },
      tested: false,
      status: 'pending'
    },
    { 
      name: 'payment_completed', 
      description: 'Payment successfully processed',
      category: 'business',
      properties: { amount: 99, currency: 'USD', method: 'stripe' },
      tested: false,
      status: 'pending'
    },
    { 
      name: 'account_linked', 
      description: 'Bank account linked via Plaid',
      category: 'business',
      properties: { institution: 'test_bank', account_type: 'checking' },
      tested: false,
      status: 'pending'
    },

    // User Journey Events
    { 
      name: 'onboarding_started', 
      description: 'User begins onboarding process',
      category: 'user_journey',
      properties: { step: 1, source: 'signup' },
      tested: false,
      status: 'pending'
    },
    { 
      name: 'onboarding_completed', 
      description: 'User completes onboarding',
      category: 'user_journey',
      properties: { total_steps: 5, duration_minutes: 12 },
      tested: false,
      status: 'pending'
    },
    { 
      name: 'feature_used', 
      description: 'User interacts with a feature',
      category: 'core',
      properties: { feature: 'dashboard_widget', action: 'click' },
      tested: false,
      status: 'pending'
    },
    { 
      name: 'document_uploaded', 
      description: 'User uploads a document',
      category: 'business',
      properties: { file_type: 'pdf', file_size: 1024000 },
      tested: false,
      status: 'pending'
    },

    // CTA and Conversion Events
    { 
      name: 'cta_clicked', 
      description: 'Call-to-action button clicked',
      category: 'business',
      properties: { cta_text: 'Get Started', location: 'hero_section' },
      tested: false,
      status: 'pending'
    },
    { 
      name: 'conversion', 
      description: 'User converts (signup, purchase, etc.)',
      category: 'business',
      properties: { conversion_type: 'trial_signup', value: 99 },
      tested: false,
      status: 'pending'
    },

    // Error Tracking
    { 
      name: 'error', 
      description: 'Application error occurred',
      category: 'errors',
      properties: { 
        error_message: 'Test error for analytics', 
        error_stack: 'TestError: at analytics-test',
        severity: 'medium'
      },
      tested: false,
      status: 'pending'
    },
    { 
      name: 'api_error', 
      description: 'API request failed',
      category: 'errors',
      properties: { 
        endpoint: '/api/test', 
        status_code: 500, 
        error_message: 'Internal server error' 
      },
      tested: false,
      status: 'pending'
    },
    { 
      name: 'performance_issue', 
      description: 'Performance metric exceeded threshold',
      category: 'errors',
      properties: { 
        metric: 'page_load_time', 
        value: 3500, 
        threshold: 3000 
      },
      tested: false,
      status: 'pending'
    }
  ]);

  const [isTesting, setIsTesting] = useState(false);
  const [isPostHogLoaded, setIsPostHogLoaded] = useState(false);

  useEffect(() => {
    // Check if PostHog is loaded
    const checkPostHog = () => {
      if (typeof window !== 'undefined' && (window as any).posthog) {
        setIsPostHogLoaded(true);
      }
    };
    
    checkPostHog();
    const interval = setInterval(checkPostHog, 1000);
    return () => clearInterval(interval);
  }, []);

  const testEvent = async (eventIndex: number) => {
    const event = events[eventIndex];
    
    try {
      // Track the event
      analytics.track(event.name, event.properties || {});
      
      // Update the event status
      setEvents(prev => prev.map((e, i) => 
        i === eventIndex ? { 
          ...e, 
          tested: true, 
          status: 'success', 
          timestamp: new Date().toISOString() 
        } : e
      ));
      
      toast({
        title: "Event Tracked",
        description: `${event.name} event sent to PostHog`,
      });
    } catch (error) {
      setEvents(prev => prev.map((e, i) => 
        i === eventIndex ? { 
          ...e, 
          tested: true, 
          status: 'failed', 
          timestamp: new Date().toISOString() 
        } : e
      ));
      
      toast({
        title: "Event Failed",
        description: `Failed to track ${event.name}: ${error}`,
        variant: "destructive"
      });
    }
  };

  const testAllEvents = async () => {
    setIsTesting(true);
    
    for (let i = 0; i < events.length; i++) {
      await testEvent(i);
      // Small delay between events
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    setIsTesting(false);
    toast({
      title: "Analytics Test Complete",
      description: "All events have been tested. Check PostHog dashboard for data.",
    });
  };

  const resetTests = () => {
    setEvents(prev => prev.map(e => ({ 
      ...e, 
      tested: false, 
      status: 'pending' as const, 
      timestamp: undefined 
    })));
  };

  const getStatusIcon = (status: AnalyticsEvent['status']) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getCategoryColor = (category: AnalyticsEvent['category']) => {
    switch (category) {
      case 'core': return 'bg-blue-100 text-blue-800';
      case 'business': return 'bg-green-100 text-green-800';
      case 'user_journey': return 'bg-purple-100 text-purple-800';
      case 'errors': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const summary = {
    total: events.length,
    tested: events.filter(e => e.tested).length,
    success: events.filter(e => e.status === 'success').length,
    failed: events.filter(e => e.status === 'failed').length
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analytics Event Checklist</CardTitle>
        <CardDescription>
          Test all critical PostHog events to ensure proper tracking
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* PostHog Status */}
          <div className={`p-3 rounded-lg border ${
            isPostHogLoaded ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center gap-2">
              {isPostHogLoaded ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <span className="font-medium">
                PostHog Status: {isPostHogLoaded ? 'Loaded' : 'Not Loaded'}
              </span>
            </div>
            {!isPostHogLoaded && (
              <p className="text-sm mt-2 text-red-700">
                PostHog is not properly loaded. Check API key configuration in src/lib/analytics.ts
              </p>
            )}
          </div>

          {/* Test Controls */}
          <div className="flex gap-4 items-center">
            <Button 
              onClick={testAllEvents} 
              disabled={isTesting || !isPostHogLoaded}
            >
              Test All Events
            </Button>
            <Button 
              variant="outline" 
              onClick={resetTests}
              disabled={isTesting}
            >
              Reset Tests
            </Button>
            
            <div className="ml-auto text-sm text-gray-600">
              {summary.tested}/{summary.total} tested • {summary.success} success • {summary.failed} failed
            </div>
          </div>

          {/* Events List */}
          <div className="space-y-2">
            {events.map((event, index) => (
              <div key={event.name} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3 flex-1">
                  {getStatusIcon(event.status)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{event.name}</span>
                      <Badge className={getCategoryColor(event.category)}>
                        {event.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{event.description}</p>
                    {event.properties && (
                      <details className="mt-1">
                        <summary className="text-xs text-gray-500 cursor-pointer">Properties</summary>
                        <pre className="text-xs mt-1 p-2 bg-gray-100 rounded overflow-auto">
                          {JSON.stringify(event.properties, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {event.timestamp && (
                    <span className="text-xs text-gray-500">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </span>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => testEvent(index)}
                    disabled={isTesting || !isPostHogLoaded}
                  >
                    <Play className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* PostHog Dashboard Link */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">PostHog Dashboard</h4>
            <p className="text-sm text-blue-800 mb-3">
              After running tests, check your PostHog dashboard to verify events are being received:
            </p>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Events should appear in real-time (within 1-2 minutes)</li>
              <li>• Check the Events tab for individual event details</li>
              <li>• Verify user properties and event properties are correct</li>
              <li>• Set up funnels and insights for key conversion events</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}