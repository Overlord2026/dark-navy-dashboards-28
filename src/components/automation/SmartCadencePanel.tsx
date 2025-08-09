import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Zap, 
  Clock, 
  DollarSign, 
  Brain, 
  Mail, 
  Calendar,
  TrendingUp,
  Settings,
  Play,
  Pause
} from 'lucide-react';
import { analytics } from '@/lib/analytics';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CadenceRule {
  id: string;
  name: string;
  trigger: string;
  condition: string;
  action: string;
  template: string;
  isActive: boolean;
  icon: React.ReactNode;
  color: string;
  description: string;
}

const cadencePresets: CadenceRule[] = [
  {
    id: 'no_reply_48h',
    name: '48h No Reply',
    trigger: 'no_response',
    condition: '48_hours',
    action: 'propose_meeting',
    template: 'Hey {{firstName}}, I wanted to follow up on our conversation. Would you like to schedule a quick 15-minute call to discuss your financial goals?',
    isActive: true,
    icon: <Clock className="h-4 w-4" />,
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    description: 'Automatically follow up when leads don\'t respond within 48 hours'
  },
  {
    id: 'price_objection',
    name: 'Price Objection',
    trigger: 'objection_detected',
    condition: 'price_concern',
    action: 'send_calculator',
    template: 'I understand cost is a consideration. Here\'s a personalized value calculator that shows the potential ROI: {{valueCalculatorLink}}',
    isActive: true,
    icon: <DollarSign className="h-4 w-4" />,
    color: 'bg-green-100 text-green-800 border-green-200',
    description: 'Send value calculator when price objections are detected'
  },
  {
    id: 'thinking_nurture',
    name: 'Thinking/Considering',
    trigger: 'status_change',
    condition: 'thinking',
    action: 'send_roadmap',
    template: 'While you\'re considering your options, here\'s a preview of what your financial roadmap could look like: {{roadmapPreview}}',
    isActive: false,
    icon: <Brain className="h-4 w-4" />,
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    description: 'Send SWAG roadmap preview when leads are in consideration phase'
  },
  {
    id: 'meeting_scheduled',
    name: 'Meeting Reminder',
    trigger: 'meeting_scheduled',
    condition: '24_hours_before',
    action: 'send_reminder',
    template: 'Looking forward to our meeting tomorrow at {{meetingTime}}. I\'ve attached a brief agenda for our discussion.',
    isActive: true,
    icon: <Calendar className="h-4 w-4" />,
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    description: 'Automatic meeting reminders and preparation'
  },
  {
    id: 'proposal_follow_up',
    name: 'Proposal Follow-up',
    trigger: 'proposal_sent',
    condition: '72_hours',
    action: 'gentle_follow_up',
    template: 'Hi {{firstName}}, I wanted to check if you had any questions about the proposal I sent. Happy to discuss any details!',
    isActive: true,
    icon: <Mail className="h-4 w-4" />,
    color: 'bg-orange-100 text-orange-800 border-orange-200',
    description: 'Follow up on proposals that haven\'t received a response'
  }
];

interface SmartCadencePanelProps {
  className?: string;
}

export function SmartCadencePanel({ className }: SmartCadencePanelProps) {
  const [rules, setRules] = useState<CadenceRule[]>(cadencePresets);
  const [triggeredRules, setTriggeredRules] = useState<Array<{ rule: CadenceRule; leadId: string; triggeredAt: string }>>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate some triggered rules for demo
    setTriggeredRules([
      {
        rule: cadencePresets[0],
        leadId: 'lead_123',
        triggeredAt: '2 minutes ago'
      },
      {
        rule: cadencePresets[1],
        leadId: 'lead_456',
        triggeredAt: '15 minutes ago'
      }
    ]);
  }, []);

  const toggleRule = async (ruleId: string) => {
    const updatedRules = rules.map(rule => 
      rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
    );
    setRules(updatedRules);

    const rule = updatedRules.find(r => r.id === ruleId);
    
    toast({
      title: `Smart Cadence ${rule?.isActive ? 'Enabled' : 'Disabled'}`,
      description: `${rule?.name} automation ${rule?.isActive ? 'activated' : 'paused'}`,
    });

    // Track analytics
    analytics.track('smart_cadence_toggle', {
      ruleId,
      isActive: rule?.isActive,
      timestamp: Date.now()
    });
  };

  const triggerRule = async (rule: CadenceRule, leadId: string = 'demo_lead') => {
    try {
      // Trigger smart cadence via existing edge function
      const { error } = await supabase.functions.invoke('automated-follow-up', {
        body: {
          leadId,
          cadenceRule: rule.id,
          template: rule.template,
          action: rule.action
        }
      });

      if (error) {
        console.error('Smart cadence trigger error:', error);
      }

      // Track analytics
      analytics.track('smart_cadence_triggered', {
        reason: rule.trigger,
        templateId: rule.id,
        leadId,
        timestamp: Date.now()
      });

      toast({
        title: "Smart Cadence Triggered",
        description: `${rule.name} automation executed successfully`,
      });

    } catch (error) {
      console.error('Error triggering smart cadence:', error);
      toast({
        title: "Error",
        description: "Failed to trigger smart cadence",
        variant: "destructive",
      });
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Active Rules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Smart Cadence Rules
            <Badge variant="secondary" className="ml-auto">
              {rules.filter(r => r.isActive).length} active
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className="flex items-center justify-between p-4 border rounded-lg bg-muted/30"
            >
              <div className="flex items-center gap-3 flex-1">
                <Badge className={rule.color}>
                  {rule.icon}
                </Badge>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{rule.name}</span>
                    {rule.isActive && (
                      <Badge variant="outline" className="text-xs">
                        <Play className="h-2 w-2 mr-1" />
                        Active
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {rule.description}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => triggerRule(rule)}
                  disabled={!rule.isActive}
                >
                  Test
                </Button>
                <Switch
                  checked={rule.isActive}
                  onCheckedChange={() => toggleRule(rule.id)}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recently Triggered */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-success" />
            Recently Triggered
          </CardTitle>
        </CardHeader>
        <CardContent>
          {triggeredRules.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-8 w-8 mx-auto mb-2" />
              <p>No recent triggers</p>
              <p className="text-sm">Smart cadence automations will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {triggeredRules.map((triggered, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded bg-background"
                >
                  <div className="flex items-center gap-3">
                    <Badge className={triggered.rule.color}>
                      {triggered.rule.icon}
                    </Badge>
                    <div>
                      <div className="font-medium">{triggered.rule.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Lead: {triggered.leadId}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {triggered.triggeredAt}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Automation Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-muted-foreground" />
            Automation Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="global-automation">Global Automation</Label>
              <p className="text-sm text-muted-foreground">
                Enable all smart cadence automations
              </p>
            </div>
            <Switch id="global-automation" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="ai-triggers">AI-Triggered Responses</Label>
              <p className="text-sm text-muted-foreground">
                Allow AI to automatically trigger responses based on objections
              </p>
            </div>
            <Switch id="ai-triggers" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="business-hours">Business Hours Only</Label>
              <p className="text-sm text-muted-foreground">
                Only send automated messages during business hours
              </p>
            </div>
            <Switch id="business-hours" defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}