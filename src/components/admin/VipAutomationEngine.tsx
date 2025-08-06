import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Zap, 
  Settings, 
  Clock, 
  Users, 
  Bell, 
  Target,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  PlayCircle,
  PauseCircle,
  SkipForward,
  Calendar,
  Mail,
  MessageSquare,
  Phone,
  Timer,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface AutomationRule {
  id: string;
  name: string;
  type: 'follow_up' | 'reminder' | 'wave_trigger' | 'referral_reward';
  trigger: {
    condition: string;
    value: number;
    unit: 'hours' | 'days' | 'percent';
  };
  action: {
    type: 'email' | 'sms' | 'notification' | 'wave_launch';
    template: string;
    delay?: number;
  };
  is_active: boolean;
  persona_filter?: string[];
  wave_filter?: string[];
  created_at: string;
  last_run?: string;
  success_count: number;
  error_count: number;
}

interface FomoUpdate {
  id: string;
  message: string;
  type: 'join' | 'referral' | 'milestone' | 'urgency';
  persona?: string;
  member_name?: string;
  timestamp: string;
  is_active: boolean;
}

const AUTOMATION_TEMPLATES = {
  follow_up_unopened: {
    subject: "Don't miss your VIP Founding Spot - {{name}}",
    body: `Hi {{name}},

We noticed you haven't had a chance to claim your VIP Founding Member spot yet. 

⏰ Limited Time: Only {{spots_remaining}} founding spots left for {{persona_display}}

Your reserved benefits:
• Exclusive "Founding 100" recognition
• Premium directory placement
• Early access to all platform features
• Direct pipeline to high-value prospects

Claim your spot now: {{activation_link}}

Don't let this exclusive opportunity pass by!

Best,
Tony Gomes
Boutique Family Office™`
  },
  
  wave_urgency: {
    subject: "Final Call: Wave {{wave_number}} Closing Soon",
    body: `Hi {{name}},

Wave {{wave_number}} of our VIP Founding Member program is {{percentage_full}}% full and will close automatically once we reach capacity.

🔥 Only {{spots_remaining}} spots left for {{persona_display}} professionals

Join now before it's too late: {{activation_link}}

Next wave won't have the same founding benefits!

Urgent regards,
Tony Gomes`
  },

  referral_reward: {
    subject: "🎉 Thank you for your referral, {{name}}!",
    body: `Hi {{name}},

Congratulations! {{referred_name}} just joined the Family Office Marketplace thanks to your referral.

🏆 Your referral count: {{referral_count}}
🎯 Special recognition coming your way!

Keep referring and unlock exclusive rewards:
• 3 referrals: Featured profile highlight
• 5 referrals: VIP networking event invitation
• 10 referrals: Platinum Partner status

Best,
Tony Gomes`
  }
};

const FOMO_MESSAGES = [
  "🎉 {{name}} just joined as a Founding {{persona}}!",
  "🔥 Only {{count}} {{persona}} spots left in Wave {{wave}}!",
  "⚡ {{name}} earned their 5th referral and unlocked VIP status!",
  "🏆 {{name}} is leading the {{persona}} leaderboard with {{count}} referrals!",
  "⏰ Wave {{wave}} is {{percentage}}% full - spots filling fast!",
  "🌟 {{name}} from {{firm}} just activated their Founding Member profile!"
];

export function VipAutomationEngine() {
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([]);
  const [fomoUpdates, setFomoUpdates] = useState<FomoUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeRule, setActiveRule] = useState<string | null>(null);
  const [newRule, setNewRule] = useState({
    name: '',
    type: 'follow_up' as const,
    trigger: { condition: 'time_since_sent', value: 48, unit: 'hours' as const },
    action: { type: 'email' as const, template: 'follow_up_unopened' }
  });

  useEffect(() => {
    loadAutomationData();
    
    // Simulate real-time FOMO updates
    const interval = setInterval(() => {
      if (Math.random() > 0.95) {
        generateFomoUpdate();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const loadAutomationData = async () => {
    try {
      // TODO: Replace with actual Supabase calls
      const mockRules: AutomationRule[] = [
        {
          id: '1',
          name: 'Follow-up Unopened Invites',
          type: 'follow_up',
          trigger: { condition: 'time_since_sent', value: 48, unit: 'hours' },
          action: { type: 'email', template: 'follow_up_unopened' },
          is_active: true,
          created_at: '2024-01-15T10:00:00Z',
          last_run: '2024-01-20T15:30:00Z',
          success_count: 23,
          error_count: 1
        },
        {
          id: '2',
          name: 'Wave Urgency Alerts',
          type: 'wave_trigger',
          trigger: { condition: 'wave_capacity', value: 80, unit: 'percent' },
          action: { type: 'email', template: 'wave_urgency' },
          is_active: true,
          created_at: '2024-01-15T10:00:00Z',
          last_run: '2024-01-19T12:15:00Z',
          success_count: 15,
          error_count: 0
        },
        {
          id: '3',
          name: 'Referral Rewards',
          type: 'referral_reward',
          trigger: { condition: 'new_referral', value: 1, unit: 'percent' },
          action: { type: 'email', template: 'referral_reward' },
          is_active: true,
          created_at: '2024-01-15T10:00:00Z',
          last_run: '2024-01-20T09:45:00Z',
          success_count: 8,
          error_count: 0
        }
      ];

      const mockFomoUpdates: FomoUpdate[] = [
        {
          id: '1',
          message: '🎉 John Smith just joined as a Founding Financial Advisor!',
          type: 'join',
          persona: 'advisor',
          member_name: 'John Smith',
          timestamp: new Date(Date.now() - 300000).toISOString(),
          is_active: true
        },
        {
          id: '2',
          message: '🔥 Only 12 Attorney spots left in Wave 1!',
          type: 'urgency',
          persona: 'attorney',
          timestamp: new Date(Date.now() - 600000).toISOString(),
          is_active: true
        },
        {
          id: '3',
          message: '⚡ Sarah Johnson earned her 3rd referral and unlocked featured placement!',
          type: 'milestone',
          member_name: 'Sarah Johnson',
          timestamp: new Date(Date.now() - 900000).toISOString(),
          is_active: true
        }
      ];

      setAutomationRules(mockRules);
      setFomoUpdates(mockFomoUpdates);
    } catch (error) {
      console.error('Error loading automation data:', error);
      toast.error('Failed to load automation data');
    } finally {
      setLoading(false);
    }
  };

  const generateFomoUpdate = () => {
    const templates = [
      { message: '🎉 Alex Johnson just joined as a Founding CPA!', type: 'join' as const },
      { message: '🔥 Only 8 Property Manager spots left!', type: 'urgency' as const },
      { message: '⚡ Michael Chen just earned his 4th referral!', type: 'milestone' as const }
    ];
    
    const template = templates[Math.floor(Math.random() * templates.length)];
    const newUpdate: FomoUpdate = {
      id: `fomo-${Date.now()}`,
      message: template.message,
      type: template.type,
      timestamp: new Date().toISOString(),
      is_active: true
    };

    setFomoUpdates(prev => [newUpdate, ...prev.slice(0, 9)]);
  };

  const toggleRule = async (ruleId: string) => {
    try {
      setAutomationRules(prev => 
        prev.map(rule => 
          rule.id === ruleId 
            ? { ...rule, is_active: !rule.is_active }
            : rule
        )
      );
      toast.success('Automation rule updated');
    } catch (error) {
      console.error('Error toggling rule:', error);
      toast.error('Failed to update rule');
    }
  };

  const runRuleNow = async (ruleId: string) => {
    try {
      setActiveRule(ruleId);
      
      // Simulate running the rule
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setAutomationRules(prev => 
        prev.map(rule => 
          rule.id === ruleId 
            ? { 
                ...rule, 
                last_run: new Date().toISOString(),
                success_count: rule.success_count + Math.floor(Math.random() * 5) + 1
              }
            : rule
        )
      );
      
      toast.success('Automation rule executed successfully');
    } catch (error) {
      console.error('Error running rule:', error);
      toast.error('Failed to run rule');
    } finally {
      setActiveRule(null);
    }
  };

  const createRule = async () => {
    try {
      const rule: AutomationRule = {
        id: `rule-${Date.now()}`,
        ...newRule,
        is_active: true,
        created_at: new Date().toISOString(),
        success_count: 0,
        error_count: 0
      };

      setAutomationRules(prev => [rule, ...prev]);
      setNewRule({
        name: '',
        type: 'follow_up',
        trigger: { condition: 'time_since_sent', value: 48, unit: 'hours' },
        action: { type: 'email', template: 'follow_up_unopened' }
      });
      
      toast.success('Automation rule created');
    } catch (error) {
      console.error('Error creating rule:', error);
      toast.error('Failed to create rule');
    }
  };

  const getRuleIcon = (type: string) => {
    switch (type) {
      case 'follow_up': return <Mail className="h-4 w-4" />;
      case 'reminder': return <Bell className="h-4 w-4" />;
      case 'wave_trigger': return <Zap className="h-4 w-4" />;
      case 'referral_reward': return <Target className="h-4 w-4" />;
      default: return <Settings className="h-4 w-4" />;
    }
  };

  const getFomoIcon = (type: string) => {
    switch (type) {
      case 'join': return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case 'urgency': return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case 'milestone': return <Sparkles className="h-4 w-4 text-purple-500" />;
      case 'referral': return <Users className="h-4 w-4 text-blue-500" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-48 bg-muted rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Zap className="h-8 w-8 text-blue-500" />
            VIP Automation Engine
          </h1>
          <p className="text-muted-foreground">
            Automate follow-ups, FOMO campaigns, and wave management for maximum conversion
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <PlayCircle className="h-5 w-5 text-emerald-500" />
              <span className="text-sm font-medium">Active Rules</span>
            </div>
            <div className="text-2xl font-bold mt-1">
              {automationRules.filter(r => r.is_active).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-medium">Total Executions</span>
            </div>
            <div className="text-2xl font-bold mt-1">
              {automationRules.reduce((sum, r) => sum + r.success_count, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium">Success Rate</span>
            </div>
            <div className="text-2xl font-bold mt-1">
              {automationRules.length > 0 
                ? Math.round((automationRules.reduce((sum, r) => sum + r.success_count, 0) / 
                  automationRules.reduce((sum, r) => sum + r.success_count + r.error_count, 1)) * 100)
                : 100}%
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              <span className="text-sm font-medium">FOMO Updates</span>
            </div>
            <div className="text-2xl font-bold mt-1">{fomoUpdates.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="rules" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="rules">Automation Rules</TabsTrigger>
          <TabsTrigger value="fomo">FOMO Engine</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="rules">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Existing Rules */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Active Automation Rules
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {automationRules.map((rule) => (
                    <div key={rule.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getRuleIcon(rule.type)}
                          <span className="font-medium">{rule.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={rule.is_active}
                            onCheckedChange={() => toggleRule(rule.id)}
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => runRuleNow(rule.id)}
                            disabled={activeRule === rule.id}
                          >
                            {activeRule === rule.id ? (
                              <Timer className="h-4 w-4 animate-spin" />
                            ) : (
                              <PlayCircle className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        Trigger: {rule.trigger.condition} after {rule.trigger.value} {rule.trigger.unit}
                      </div>
                      
                      <div className="flex justify-between text-xs">
                        <span>Success: {rule.success_count}</span>
                        <span>Errors: {rule.error_count}</span>
                        <span>
                          Last run: {rule.last_run 
                            ? new Date(rule.last_run).toLocaleDateString()
                            : 'Never'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Create New Rule */}
            <Card>
              <CardHeader>
                <CardTitle>Create New Rule</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="rule-name">Rule Name</Label>
                  <Input
                    id="rule-name"
                    value={newRule.name}
                    onChange={(e) => setNewRule(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Follow-up Non-responders"
                  />
                </div>

                <div>
                  <Label htmlFor="rule-type">Rule Type</Label>
                  <select
                    id="rule-type"
                    value={newRule.type}
                    onChange={(e) => setNewRule(prev => ({ ...prev, type: e.target.value as any }))}
                    className="w-full p-2 border rounded"
                  >
                    <option value="follow_up">Follow-up</option>
                    <option value="reminder">Reminder</option>
                    <option value="wave_trigger">Wave Trigger</option>
                    <option value="referral_reward">Referral Reward</option>
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label>Trigger After</Label>
                    <Input
                      type="number"
                      value={newRule.trigger.value}
                      onChange={(e) => setNewRule(prev => ({
                        ...prev,
                        trigger: { ...prev.trigger, value: parseInt(e.target.value) || 0 }
                      }))}
                    />
                  </div>
                  <div>
                    <Label>Unit</Label>
                    <select
                      value={newRule.trigger.unit}
                      onChange={(e) => setNewRule(prev => ({
                        ...prev,
                        trigger: { ...prev.trigger, unit: e.target.value as any }
                      }))}
                      className="w-full p-2 border rounded"
                    >
                      <option value="hours">Hours</option>
                      <option value="days">Days</option>
                      <option value="percent">Percent</option>
                    </select>
                  </div>
                  <div>
                    <Label>Action</Label>
                    <select
                      value={newRule.action.type}
                      onChange={(e) => setNewRule(prev => ({
                        ...prev,
                        action: { ...prev.action, type: e.target.value as any }
                      }))}
                      className="w-full p-2 border rounded"
                    >
                      <option value="email">Email</option>
                      <option value="sms">SMS</option>
                      <option value="notification">Notification</option>
                    </select>
                  </div>
                </div>

                <Button onClick={createRule} className="w-full" disabled={!newRule.name}>
                  Create Automation Rule
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="fomo">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Live FOMO Feed */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Live FOMO Updates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {fomoUpdates.map((update) => (
                    <motion.div
                      key={update.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg"
                    >
                      {getFomoIcon(update.type)}
                      <div className="flex-1">
                        <p className="text-sm">{update.message}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(update.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* FOMO Settings */}
            <Card>
              <CardHeader>
                <CardTitle>FOMO Engine Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-fomo">Auto-generate FOMO updates</Label>
                  <Switch id="auto-fomo" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="urgency-alerts">Urgency alerts at 80% capacity</Label>
                  <Switch id="urgency-alerts" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="milestone-celebration">Celebrate referral milestones</Label>
                  <Switch id="milestone-celebration" defaultChecked />
                </div>

                <div>
                  <Label htmlFor="fomo-frequency">Update Frequency (seconds)</Label>
                  <Input id="fomo-frequency" type="number" defaultValue="30" />
                </div>

                <div>
                  <Label htmlFor="custom-fomo">Custom FOMO Message</Label>
                  <Textarea 
                    id="custom-fomo"
                    placeholder="🔥 {{name}} just claimed their {{persona}} spot - only {{remaining}} left!"
                    rows={3}
                  />
                </div>

                <Button onClick={generateFomoUpdate} className="w-full">
                  Generate Test FOMO Update
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="templates">
          <div className="space-y-6">
            {Object.entries(AUTOMATION_TEMPLATES).map(([key, template]) => (
              <Card key={key}>
                <CardHeader>
                  <CardTitle className="capitalize">{key.replace('_', ' ')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Subject Line</Label>
                    <Input value={template.subject} readOnly className="bg-muted" />
                  </div>
                  <div>
                    <Label>Email Body</Label>
                    <Textarea 
                      value={template.body} 
                      readOnly 
                      className="bg-muted min-h-48"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Rule Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Rule Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {automationRules.map((rule) => {
                    const total = rule.success_count + rule.error_count;
                    const successRate = total > 0 ? (rule.success_count / total) * 100 : 0;
                    
                    return (
                      <div key={rule.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{rule.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {successRate.toFixed(1)}% success
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-emerald-500 h-2 rounded-full transition-all"
                            style={{ width: `${successRate}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{rule.success_count} successes</span>
                          <span>{rule.error_count} errors</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* FOMO Impact */}
            <Card>
              <CardHeader>
                <CardTitle>FOMO Impact Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Total FOMO Updates</span>
                    <span className="font-bold">{fomoUpdates.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Join Announcements</span>
                    <span className="font-bold">
                      {fomoUpdates.filter(u => u.type === 'join').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Urgency Alerts</span>
                    <span className="font-bold">
                      {fomoUpdates.filter(u => u.type === 'urgency').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Milestone Celebrations</span>
                    <span className="font-bold">
                      {fomoUpdates.filter(u => u.type === 'milestone').length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
