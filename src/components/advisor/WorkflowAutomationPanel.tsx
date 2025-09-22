import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Calendar, 
  Mail, 
  MessageSquare, 
  Gift, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  Settings,
  Plus,
  Zap
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface WorkflowAutomation {
  id: string;
  trigger_type: string;
  action_type: string;
  status: 'active' | 'paused' | 'error';
  trigger_data: any;
  action_data: any;
  processed_at?: string;
  error_message?: string;
  created_at: string;
}

interface UpcomingEvent {
  id: string;
  type: 'birthday' | 'anniversary' | 'meeting' | 'review' | 'rmd';
  clientName: string;
  clientId: string;
  date: string;
  description: string;
  automated: boolean;
}

export function WorkflowAutomationPanel() {
  const [automations, setAutomations] = useState<WorkflowAutomation[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadAutomations();
    loadUpcomingEvents();
  }, []);

  const loadAutomations = async () => {
    try {
      const { data, error } = await supabase
        .from('workflow_automations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error loading automations:', error);
        // Use mock data if database fails
        setAutomations(getMockAutomations());
      } else {
        setAutomations(data || []);
      }
    } catch (error) {
      console.error('Error in loadAutomations:', error);
      setAutomations(getMockAutomations());
    }
  };

  const loadUpcomingEvents = async () => {
    try {
      // Mock upcoming events - in real implementation, this would query client data
      const mockEvents: UpcomingEvent[] = [
        {
          id: '1',
          type: 'birthday',
          clientName: 'John Smith',
          clientId: '1',
          date: '2025-02-15',
          description: '75th birthday - consider gift tax strategies',
          automated: true
        },
        {
          id: '2',
          type: 'anniversary',
          clientName: 'Sarah & Mike Johnson',
          clientId: '2',
          date: '2025-02-20',
          description: '25th wedding anniversary',
          automated: true
        },
        {
          id: '3',
          type: 'review',
          clientName: 'Michael Brown',
          clientId: '3',
          date: '2025-02-28',
          description: 'Quarterly portfolio review',
          automated: false
        },
        {
          id: '4',
          type: 'rmd',
          clientName: 'Robert Wilson',
          clientId: '4',
          date: '2025-12-31',
          description: 'Required minimum distribution deadline',
          automated: true
        }
      ];

      setUpcomingEvents(mockEvents);
    } catch (error) {
      console.error('Error loading upcoming events:', error);
      setUpcomingEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const getMockAutomations = (): WorkflowAutomation[] => [
    {
      id: '1',
      trigger_type: 'client_birthday',
      action_type: 'send_email',
      status: 'active',
      trigger_data: { days_before: 7 },
      action_data: { template: 'birthday_wishes', include_gift_strategy: true },
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      trigger_type: 'quarterly_review_due',
      action_type: 'schedule_meeting',
      status: 'active',
      trigger_data: { review_cycle: 'quarterly' },
      action_data: { meeting_type: 'portfolio_review', duration: 60 },
      created_at: new Date().toISOString()
    },
    {
      id: '3',
      trigger_type: 'rmd_deadline_approaching',
      action_type: 'send_notification',
      status: 'active',
      trigger_data: { days_before: 60 },
      action_data: { notification_type: 'rmd_reminder', include_calculation: true },
      created_at: new Date().toISOString()
    }
  ];

  const toggleAutomation = async (automationId: string, newStatus: 'active' | 'paused') => {
    try {
      const { error } = await supabase
        .from('workflow_automations')
        .update({ status: newStatus })
        .eq('id', automationId);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update automation status",
          variant: "destructive"
        });
        return;
      }

      setAutomations(prev => prev.map(automation => 
        automation.id === automationId 
          ? { ...automation, status: newStatus }
          : automation
      ));

      toast({
        title: "Success",
        description: `Automation ${newStatus === 'active' ? 'enabled' : 'paused'}`,
      });
    } catch (error) {
      console.error('Error toggling automation:', error);
      // Update local state anyway for demo
      setAutomations(prev => prev.map(automation => 
        automation.id === automationId 
          ? { ...automation, status: newStatus }
          : automation
      ));
    }
  };

  const getEventIcon = (type: UpcomingEvent['type']) => {
    switch (type) {
      case 'birthday': return <Gift className="h-4 w-4 text-pink-500" />;
      case 'anniversary': return <Gift className="h-4 w-4 text-purple-500" />;
      case 'meeting': return <Calendar className="h-4 w-4 text-blue-500" />;
      case 'review': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rmd': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getAutomationIcon = (triggerType: string) => {
    if (triggerType.includes('birthday') || triggerType.includes('anniversary')) {
      return <Gift className="h-4 w-4 text-pink-500" />;
    }
    if (triggerType.includes('meeting') || triggerType.includes('review')) {
      return <Calendar className="h-4 w-4 text-blue-500" />;
    }
    if (triggerType.includes('email')) {
      return <Mail className="h-4 w-4 text-green-500" />;
    }
    return <Zap className="h-4 w-4 text-purple-500" />;
  };

  const getDaysUntil = (dateString: string) => {
    const eventDate = new Date(dateString);
    const today = new Date();
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Workflow Automation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Active Automations */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-purple-500" />
              Active Automations
            </CardTitle>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Automation
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {automations.map((automation) => (
            <div key={automation.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                {getAutomationIcon(automation.trigger_type)}
                <div>
                  <p className="font-medium capitalize">
                    {automation.trigger_type.replace(/_/g, ' ')} → {automation.action_type.replace(/_/g, ' ')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {automation.trigger_data?.days_before && 
                      `Triggers ${automation.trigger_data.days_before} days before event`
                    }
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={automation.status === 'active' ? 'default' : 'secondary'}>
                  {automation.status}
                </Badge>
                <Switch
                  checked={automation.status === 'active'}
                  onCheckedChange={(checked) => 
                    toggleAutomation(automation.id, checked ? 'active' : 'paused')
                  }
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-500" />
            Upcoming Client Events
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {upcomingEvents
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .map((event) => {
              const daysUntil = getDaysUntil(event.date);
              return (
                <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getEventIcon(event.type)}
                    <div>
                      <p className="font-medium">{event.clientName}</p>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(event.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className={`text-sm font-medium ${
                        daysUntil <= 7 ? 'text-orange-600' : 
                        daysUntil <= 30 ? 'text-yellow-600' : 'text-muted-foreground'
                      }`}>
                        {daysUntil > 0 ? `${daysUntil} days` : 'Today'}
                      </p>
                      {event.automated && (
                        <Badge variant="outline" className="text-xs">
                          <Zap className="h-3 w-3 mr-1" />
                          Auto
                        </Badge>
                      )}
                    </div>
                    <Button variant="outline" size="sm">
                      {event.type === 'birthday' || event.type === 'anniversary' ? 'Send Card' :
                       event.type === 'meeting' ? 'Schedule' :
                       event.type === 'review' ? 'Prepare' : 'Process'}
                    </Button>
                  </div>
                </div>
              );
            })}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Mail className="h-6 w-6" />
              <span className="text-sm">Send Birthday Cards</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Calendar className="h-6 w-6" />
              <span className="text-sm">Schedule Reviews</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <MessageSquare className="h-6 w-6" />
              <span className="text-sm">Client Check-ins</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <AlertTriangle className="h-6 w-6" />
              <span className="text-sm">RMD Reminders</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}