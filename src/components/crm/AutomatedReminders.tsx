import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Bell, 
  Clock, 
  Mail, 
  MessageSquare, 
  Phone, 
  Calendar, 
  Plus, 
  Edit, 
  Trash2,
  Play,
  Pause,
  Settings,
  Users,
  Target,
  Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { format, addDays, addHours } from 'date-fns';

interface ReminderRule {
  id: string;
  name: string;
  trigger_type: 'time_based' | 'action_based' | 'date_based';
  trigger_conditions: {
    delay_hours?: number;
    delay_days?: number;
    lead_status?: string;
    contact_status?: string;
    no_activity_days?: number;
    meeting_status?: string;
  };
  action_type: 'email' | 'sms' | 'task' | 'notification';
  template_content: string;
  is_active: boolean;
  priority: 'low' | 'medium' | 'high';
  advisor_id: string;
  created_at: string;
}

interface ScheduledReminder {
  id: string;
  rule_id: string;
  contact_id: string;
  lead_id?: string;
  scheduled_for: string;
  status: 'pending' | 'sent' | 'failed' | 'cancelled';
  sent_at?: string;
  error_message?: string;
  rule_name: string;
  contact_name: string;
  contact_email: string;
}

const triggerTypes = [
  { value: 'time_based', label: 'Time-Based', description: 'Trigger after a specific time period' },
  { value: 'action_based', label: 'Action-Based', description: 'Trigger based on contact actions' },
  { value: 'date_based', label: 'Date-Based', description: 'Trigger on specific dates' }
];

const actionTypes = [
  { value: 'email', label: 'Email', icon: Mail },
  { value: 'sms', label: 'SMS', icon: MessageSquare },
  { value: 'task', label: 'Task', icon: Calendar },
  { value: 'notification', label: 'Notification', icon: Bell }
];

export function AutomatedReminders() {
  const { toast } = useToast();
  const [rules, setRules] = useState<ReminderRule[]>([]);
  const [scheduledReminders, setScheduledReminders] = useState<ScheduledReminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState<ReminderRule | null>(null);

  const [newRule, setNewRule] = useState({
    name: '',
    trigger_type: 'time_based' as const,
    trigger_conditions: {},
    action_type: 'email' as const,
    template_content: '',
    priority: 'medium' as const
  });

  useEffect(() => {
    loadReminderRules();
    loadScheduledReminders();
  }, []);

  const loadReminderRules = async () => {
    try {
      // Mock data for demo
      setRules([
        {
          id: '1',
          name: 'New Lead Follow-up',
          trigger_type: 'time_based',
          trigger_conditions: { delay_hours: 24 },
          action_type: 'email',
          template_content: 'Hi {{first_name}}, thank you for your interest in our financial services. I wanted to follow up on your inquiry...',
          is_active: true,
          priority: 'high',
          advisor_id: 'advisor-1',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Inactive Lead Reminder',
          trigger_type: 'action_based',
          trigger_conditions: { no_activity_days: 7 },
          action_type: 'email',
          template_content: 'Hi {{first_name}}, I wanted to check in and see if you have any questions about our investment services...',
          is_active: true,
          priority: 'medium',
          advisor_id: 'advisor-1',
          created_at: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: '3',
          name: 'Meeting Reminder',
          trigger_type: 'time_based',
          trigger_conditions: { delay_hours: 2 },
          action_type: 'sms',
          template_content: 'Hi {{first_name}}, this is a reminder that we have a meeting scheduled for {{meeting_time}}. Looking forward to speaking with you!',
          is_active: true,
          priority: 'high',
          advisor_id: 'advisor-1',
          created_at: new Date(Date.now() - 172800000).toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const loadScheduledReminders = async () => {
    try {
      // Mock data
      setScheduledReminders([
        {
          id: '1',
          rule_id: '1',
          contact_id: 'contact-1',
          lead_id: 'lead-1',
          scheduled_for: addHours(new Date(), 2).toISOString(),
          status: 'pending',
          rule_name: 'New Lead Follow-up',
          contact_name: 'John Smith',
          contact_email: 'john@example.com'
        },
        {
          id: '2',
          rule_id: '2',
          contact_id: 'contact-2',
          scheduled_for: addDays(new Date(), 1).toISOString(),
          status: 'pending',
          rule_name: 'Inactive Lead Reminder',
          contact_name: 'Sarah Johnson',
          contact_email: 'sarah@example.com'
        }
      ]);
    } catch (error) {
      console.error('Error loading scheduled reminders:', error);
    }
  };

  const createRule = async () => {
    if (!newRule.name || !newRule.template_content) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      // Mock creation for demo
      const mockRule: ReminderRule = {
        id: Math.random().toString(36).substr(2, 9),
        ...newRule,
        advisor_id: 'current-user',
        is_active: true,
        created_at: new Date().toISOString()
      };

      setRules(prev => [mockRule, ...prev]);

      toast({
        title: "Rule Created",
        description: "Reminder rule has been created and activated",
      });

      setIsCreateOpen(false);
      setNewRule({
        name: '',
        trigger_type: 'time_based',
        trigger_conditions: {},
        action_type: 'email',
        template_content: '',
        priority: 'medium'
      });
    } catch (error) {
      console.error('Error creating rule:', error);
      toast({
        title: "Error",
        description: "Failed to create reminder rule",
        variant: "destructive",
      });
    }
  };

  const toggleRule = async (ruleId: string, isActive: boolean) => {
    try {
      // Mock toggle for demo
      setRules(prev => prev.map(rule => 
        rule.id === ruleId ? { ...rule, is_active: isActive } : rule
      ));

      toast({
        title: isActive ? "Rule Activated" : "Rule Deactivated",
        description: `Reminder rule has been ${isActive ? 'activated' : 'deactivated'}`,
      });
    } catch (error) {
      console.error('Error toggling rule:', error);
      toast({
        title: "Error",
        description: "Failed to update rule status",
        variant: "destructive",
      });
    }
  };

  const deleteRule = async (ruleId: string) => {
    try {
      // Mock deletion for demo
      setRules(prev => prev.filter(rule => rule.id !== ruleId));

      toast({
        title: "Rule Deleted",
        description: "Reminder rule has been removed",
      });
    } catch (error) {
      console.error('Error deleting rule:', error);
      toast({
        title: "Error",
        description: "Failed to delete rule",
        variant: "destructive",
      });
    }
  };

  const cancelReminder = async (reminderId: string) => {
    try {
      // Mock cancellation for demo
      setScheduledReminders(prev => prev.map(reminder => 
        reminder.id === reminderId ? { ...reminder, status: 'cancelled' } : reminder
      ));

      toast({
        title: "Reminder Cancelled",
        description: "Scheduled reminder has been cancelled",
      });
    } catch (error) {
      console.error('Error cancelling reminder:', error);
      toast({
        title: "Error",
        description: "Failed to cancel reminder",
        variant: "destructive",
      });
    }
  };

  const testRule = async (ruleId: string) => {
    try {
      const { error } = await supabase.functions.invoke('test-reminder-rule', {
        body: { rule_id: ruleId }
      });

      if (error) throw error;

      toast({
        title: "Test Sent",
        description: "Test reminder has been sent to your email",
      });
    } catch (error) {
      console.error('Error testing rule:', error);
      toast({
        title: "Test Failed",
        description: "Failed to send test reminder",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'sent': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionIcon = (actionType: string) => {
    const action = actionTypes.find(a => a.value === actionType);
    const Icon = action?.icon || Bell;
    return <Icon className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Automated Reminders</h2>
          <p className="text-muted-foreground">Set up automated follow-up workflows for leads and clients</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Rule
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Rules</p>
                <p className="text-2xl font-bold">{rules.filter(r => r.is_active).length}</p>
              </div>
              <Zap className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Reminders</p>
                <p className="text-2xl font-bold">{scheduledReminders.filter(r => r.status === 'pending').length}</p>
              </div>
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Sent Today</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <Target className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Response Rate</p>
                <p className="text-2xl font-bold">24%</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reminder Rules */}
      <Card>
        <CardHeader>
          <CardTitle>Reminder Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rules.map((rule) => (
              <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    {getActionIcon(rule.action_type)}
                  </div>
                  <div>
                    <h3 className="font-medium">{rule.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {rule.trigger_type === 'time_based' && rule.trigger_conditions.delay_hours && 
                        `Triggers ${rule.trigger_conditions.delay_hours} hours after initial contact`
                      }
                      {rule.trigger_type === 'time_based' && rule.trigger_conditions.delay_days && 
                        `Triggers ${rule.trigger_conditions.delay_days} days after initial contact`
                      }
                      {rule.trigger_type === 'action_based' && rule.trigger_conditions.no_activity_days && 
                        `Triggers after ${rule.trigger_conditions.no_activity_days} days of no activity`
                      }
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge className={getPriorityColor(rule.priority)}>
                    {rule.priority}
                  </Badge>
                  <Badge variant="outline">
                    {rule.action_type}
                  </Badge>
                  <Switch
                    checked={rule.is_active}
                    onCheckedChange={(checked) => toggleRule(rule.id, checked)}
                  />
                  <Button size="sm" variant="outline" onClick={() => testRule(rule.id)}>
                    <Play className="h-3 w-3 mr-1" />
                    Test
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setSelectedRule(rule)}>
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => deleteRule(rule.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Scheduled Reminders */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Reminders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {scheduledReminders.map((reminder) => (
              <div key={reminder.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-medium">{reminder.rule_name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {reminder.contact_name} • {reminder.contact_email}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Scheduled for {format(new Date(reminder.scheduled_for), 'MMM d, yyyy h:mm a')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(reminder.status)}>
                    {reminder.status}
                  </Badge>
                  {reminder.status === 'pending' && (
                    <Button size="sm" variant="outline" onClick={() => cancelReminder(reminder.id)}>
                      <Pause className="h-3 w-3 mr-1" />
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Create Rule Dialog */}
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Create Reminder Rule</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Rule Name</Label>
            <Input
              value={newRule.name}
              onChange={(e) => setNewRule({...newRule, name: e.target.value})}
              placeholder="e.g., New Lead Follow-up"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Trigger Type</Label>
              <Select 
                value={newRule.trigger_type} 
                onValueChange={(value: any) => setNewRule({...newRule, trigger_type: value, trigger_conditions: {}})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {triggerTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Action Type</Label>
              <Select 
                value={newRule.action_type} 
                onValueChange={(value: any) => setNewRule({...newRule, action_type: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {actionTypes.map((action) => (
                    <SelectItem key={action.value} value={action.value}>
                      {action.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Trigger Conditions */}
          {newRule.trigger_type === 'time_based' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Delay (Hours)</Label>
                <Input
                  type="number"
                  value={newRule.trigger_conditions.delay_hours || ''}
                  onChange={(e) => setNewRule({
                    ...newRule, 
                    trigger_conditions: {...newRule.trigger_conditions, delay_hours: Number(e.target.value)}
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label>Delay (Days)</Label>
                <Input
                  type="number"
                  value={newRule.trigger_conditions.delay_days || ''}
                  onChange={(e) => setNewRule({
                    ...newRule, 
                    trigger_conditions: {...newRule.trigger_conditions, delay_days: Number(e.target.value)}
                  })}
                />
              </div>
            </div>
          )}
          
          {newRule.trigger_type === 'action_based' && (
            <div className="space-y-2">
              <Label>No Activity Days</Label>
              <Input
                type="number"
                value={newRule.trigger_conditions.no_activity_days || ''}
                onChange={(e) => setNewRule({
                  ...newRule, 
                  trigger_conditions: {...newRule.trigger_conditions, no_activity_days: Number(e.target.value)}
                })}
                placeholder="Number of days without activity"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label>Priority</Label>
            <Select 
              value={newRule.priority} 
              onValueChange={(value: any) => setNewRule({...newRule, priority: value})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Template Content</Label>
            <Textarea
              value={newRule.template_content}
              onChange={(e) => setNewRule({...newRule, template_content: e.target.value})}
              placeholder="Use {{first_name}}, {{last_name}}, {{company}} for personalization"
              rows={4}
            />
            <p className="text-sm text-muted-foreground">
              Available variables: first_name, last_name, email, company, meeting_time
            </p>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={createRule}>
              Create Rule
            </Button>
          </div>
        </div>
      </DialogContent>
    </div>
  );
}