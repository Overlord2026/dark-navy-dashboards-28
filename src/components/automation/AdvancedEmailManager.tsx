import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAdvancedEmailTriggers } from '@/hooks/useAdvancedEmailTriggers';
import { 
  Mail, Clock, Users, TrendingUp, Settings, Brain, 
  Target, Zap, BarChart, TestTube, Calendar, Split 
} from 'lucide-react';

export const AdvancedEmailManager = () => {
  const [activeTab, setActiveTab] = useState('triggers');
  const { toast } = useToast();
  
  const {
    triggers,
    campaigns,
    analytics,
    loading,
    createTrigger,
    createCampaign,
    updateTrigger,
    testTrigger,
    getPersonalizationData
  } = useAdvancedEmailTriggers();

  // Trigger configuration state
  const [triggerForm, setTriggerForm] = useState({
    name: '',
    trigger_type: '',
    conditions: {},
    delay_minutes: 0,
    persona_filter: '',
    segmentation_rules: {},
    is_active: true
  });

  // Campaign configuration state  
  const [campaignForm, setCampaignForm] = useState({
    name: '',
    subject_variants: [''],
    content_template: '',
    personalization_enabled: true,
    optimal_timing: true,
    ab_test_enabled: false,
    send_time_optimization: 'smart',
    audience_segment: '',
    conversion_goals: []
  });

  const triggerTypes = [
    { value: 'page_visit', label: 'Page Visit', icon: '👁️' },
    { value: 'tool_usage', label: 'Tool Usage', icon: '🔧' },
    { value: 'time_delay', label: 'Time Delay', icon: '⏰' },
    { value: 'engagement_score', label: 'Engagement Threshold', icon: '📈' },
    { value: 'profile_completion', label: 'Profile Completion', icon: '✅' },
    { value: 'inactivity', label: 'Inactivity Period', icon: '😴' }
  ];

  const handleCreateTrigger = async () => {
    try {
      // Ensure trigger_type is one of the valid enum values
      if (!triggerTypes.some(type => type.value === triggerForm.trigger_type)) {
        toast({
          title: "Error",
          description: "Please select a valid trigger type",
          variant: "destructive"
        });
        return;
      }

      await createTrigger({
        ...triggerForm,
        trigger_type: triggerForm.trigger_type as 'tool_usage' | 'page_visit' | 'time_delay' | 'engagement_score' | 'profile_completion' | 'inactivity'
      });
      setTriggerForm({
        name: '',
        trigger_type: '',
        conditions: {},
        delay_minutes: 0,
        persona_filter: '',
        segmentation_rules: {},
        is_active: true
      });
      toast({
        title: "Success",
        description: "Email trigger created successfully"
      });
    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to create trigger",
        variant: "destructive"
      });
    }
  };

  const handleCreateCampaign = async () => {
    try {
      await createCampaign(campaignForm);
      setCampaignForm({
        name: '',
        subject_variants: [''],
        content_template: '',
        personalization_enabled: true,
        optimal_timing: true,
        ab_test_enabled: false,
        send_time_optimization: 'smart',
        audience_segment: '',
        conversion_goals: []
      });
      toast({
        title: "Success",
        description: "Email campaign created successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create campaign", 
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Advanced Email Automation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="triggers" className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Triggers
              </TabsTrigger>
              <TabsTrigger value="campaigns" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Campaigns
              </TabsTrigger>
              <TabsTrigger value="personalization" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Personalization
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart className="h-4 w-4" />
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="triggers" className="space-y-6">
              {/* Trigger Creation */}
              <Card>
                <CardHeader>
                  <CardTitle>Behavioral Triggers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="Trigger Name"
                      value={triggerForm.name}
                      onChange={(e) => setTriggerForm({...triggerForm, name: e.target.value})}
                    />
                    <Select 
                      value={triggerForm.trigger_type}
                      onValueChange={(value) => setTriggerForm({...triggerForm, trigger_type: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Trigger Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {triggerTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.icon} {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {triggerForm.trigger_type === 'time_delay' && (
                    <div className="space-y-2">
                      <Label>Delay (minutes)</Label>
                      <Input
                        type="number"
                        value={triggerForm.delay_minutes}
                        onChange={(e) => setTriggerForm({...triggerForm, delay_minutes: parseInt(e.target.value)})}
                      />
                    </div>
                  )}

                  {triggerForm.trigger_type === 'page_visit' && (
                    <div className="space-y-2">
                      <Label>Page URL Pattern</Label>
                      <Input 
                        placeholder="/tools/*, /pricing, etc."
                        onChange={(e) => setTriggerForm({
                          ...triggerForm, 
                          conditions: {...triggerForm.conditions, url_pattern: e.target.value}
                        })}
                      />
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="trigger-active"
                      checked={triggerForm.is_active}
                      onCheckedChange={(checked) => setTriggerForm({...triggerForm, is_active: checked})}
                    />
                    <Label htmlFor="trigger-active">Active</Label>
                  </div>

                  <Button onClick={handleCreateTrigger} disabled={loading}>
                    Create Trigger
                  </Button>
                </CardContent>
              </Card>

              {/* Active Triggers */}
              <Card>
                <CardHeader>
                  <CardTitle>Active Triggers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {triggers.map((trigger) => (
                      <div key={trigger.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{trigger.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {triggerTypes.find(t => t.value === trigger.trigger_type)?.label}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant={trigger.is_active ? "default" : "secondary"}>
                            {trigger.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                          <Button variant="outline" size="sm" onClick={() => testTrigger(trigger.id)}>
                            <TestTube className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="campaigns" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Smart Email Campaigns</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Campaign Name"
                    value={campaignForm.name}
                    onChange={(e) => setCampaignForm({...campaignForm, name: e.target.value})}
                  />

                  <div className="space-y-2">
                    <Label>Subject Line Variants (A/B Testing)</Label>
                    {campaignForm.subject_variants.map((variant, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder={`Subject variant ${index + 1}`}
                          value={variant}
                          onChange={(e) => {
                            const newVariants = [...campaignForm.subject_variants];
                            newVariants[index] = e.target.value;
                            setCampaignForm({...campaignForm, subject_variants: newVariants});
                          }}
                        />
                        {index === campaignForm.subject_variants.length - 1 && (
                          <Button 
                            variant="outline" 
                            onClick={() => setCampaignForm({
                              ...campaignForm, 
                              subject_variants: [...campaignForm.subject_variants, '']
                            })}
                          >
                            +
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  <Textarea
                    placeholder="Email Content Template (use {{variables}} for personalization)"
                    rows={8}
                    value={campaignForm.content_template}
                    onChange={(e) => setCampaignForm({...campaignForm, content_template: e.target.value})}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="personalization"
                        checked={campaignForm.personalization_enabled}
                        onCheckedChange={(checked) => setCampaignForm({...campaignForm, personalization_enabled: checked})}
                      />
                      <Label htmlFor="personalization">Smart Personalization</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="ab-test"
                        checked={campaignForm.ab_test_enabled}
                        onCheckedChange={(checked) => setCampaignForm({...campaignForm, ab_test_enabled: checked})}
                      />
                      <Label htmlFor="ab-test">A/B Test Subject Lines</Label>
                    </div>
                  </div>

                  <Select 
                    value={campaignForm.send_time_optimization}
                    onValueChange={(value) => setCampaignForm({...campaignForm, send_time_optimization: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Send Time Strategy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Send Immediately</SelectItem>
                      <SelectItem value="smart">Smart Timing (AI Optimized)</SelectItem>
                      <SelectItem value="timezone">Recipient Timezone</SelectItem>
                      <SelectItem value="engagement">Peak Engagement Hours</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button onClick={handleCreateCampaign} disabled={loading}>
                    <Split className="h-4 w-4 mr-2" />
                    Create Campaign
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="personalization" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Dynamic Personalization Engine</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Available Variables</h4>
                      <div className="space-y-2 text-sm">
                        <div className="p-2 bg-muted rounded">
                          <code>{'{{first_name}}'}</code> - User's first name
                        </div>
                        <div className="p-2 bg-muted rounded">
                          <code>{'{{company}}'}</code> - User's company
                        </div>
                        <div className="p-2 bg-muted rounded">
                          <code>{'{{persona}}'}</code> - Professional persona
                        </div>
                        <div className="p-2 bg-muted rounded">
                          <code>{'{{engagement_score}}'}</code> - Activity level
                        </div>
                        <div className="p-2 bg-muted rounded">
                          <code>{'{{last_activity}}'}</code> - Last platform use
                        </div>
                        <div className="p-2 bg-muted rounded">
                          <code>{'{{relevant_tools}}'}</code> - Tools for their persona
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Smart Content Rules</h4>
                      <div className="space-y-3">
                        <div className="p-3 border rounded">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">High Engagement</span>
                            <Badge>Active</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Advanced features and premium content for active users
                          </p>
                        </div>
                        
                        <div className="p-3 border rounded">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">New User</span>
                            <Badge>Active</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Welcome sequence and getting started guides
                          </p>
                        </div>

                        <div className="p-3 border rounded">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Dormant User</span>
                            <Badge>Active</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Re-engagement content and special offers
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Campaign Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Open Rate</p>
                        <p className="text-2xl font-bold">68.5%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Click Rate</p>
                        <p className="text-2xl font-bold">24.2%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Conversion Rate</p>
                        <p className="text-2xl font-bold">8.7%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>A/B Test Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Subject A</span>
                        <Badge>Winner</Badge>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '68%' }}></div>
                      </div>
                      <p className="text-xs text-muted-foreground">68% open rate vs 52%</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Optimal Send Times</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Tuesday 10 AM</span>
                        <span className="text-sm font-medium">Best</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Wednesday 2 PM</span>
                        <span className="text-sm font-medium">Good</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Thursday 9 AM</span>
                        <span className="text-sm font-medium">Good</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};