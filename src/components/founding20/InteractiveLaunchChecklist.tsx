import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckSquare, Calendar, User, Mail, BarChart3 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { track } from '@/lib/analytics/track';
import { trackItemUpdated } from '@/lib/telemetry';
import { useUserPlanKey } from '@/hooks/useUserPlanKey';

interface ChecklistItem {
  id: string;
  week: string;
  segment: 'sports' | 'longevity' | 'ria';
  tier: 'gold' | 'silver' | 'bronze';
  target_name: string;
  target_type?: string;
  key_actions: string[];
  owner?: string;
  status: 'not_started' | 'in_progress' | 'complete';
  notes?: string;
  assigned_at?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

interface ProgressData {
  segment: string;
  tier: string;
  week: string;
  total_items: number;
  completed_items: number;
  completion_percentage: number;
}

const segmentColors = {
  sports: 'emerald',
  longevity: 'navy', 
  ria: 'red'
};

const tierColors = {
  gold: '#FFD700',
  silver: '#C0C0C0',
  bronze: '#CD7F32'
};

// Launch sequence data
const launchSequenceData = {
  '1-2': {
    focus: 'Gold Tier Blitz',
    sports: ['NFL','NBA','FIFA','UFC','MLB'],
    longevity: ['Tony Robbins','Peter Diamandis','David Sinclair','Andrew Huberman','Dr. Mark Hyman'],
    ria: ['Crescent Wealth','Mission Wealth','Mercer Advisors','Creative Planning','Edelman Financial Engines'],
    actions: [
      'Ship premium kits within 48h',
      'Send 60s HeyGen video email to Exec contacts', 
      'Book 15-min previews'
    ]
  },
  '3-4': {
    focus: 'Silver Tier Activation',
    sports: ['Formula 1','NASCAR','PGA Tour','LPGA','NHL'],
    longevity: ['Ben Greenfield','Dr. Rhonda Patrick','Peter Attia','Fountain Life','Human Longevity'],
    ria: ['Carson Group','Fisher Investments','Mariner Wealth','Buckingham','Wealth Enhancement Group'],
    actions: [
      'Ship kits and send follow-up emails',
      'Book demos'
    ]
  },
  '5-6': {
    focus: 'Bronze Tier Strategic Push',
    sports: ['MLS','USOC','IOC','ONE Championship','World Rugby','ICC (Cricket)','Magic Johnson Enterprises','A-Rod Corp','WADA','International Paralympic Committee'],
    longevity: ['Thorne','Levels','Lifespan.io','Bryan Johnson','Precision Health Alliance','Chris Hemsworth','WHO Healthy Ageing','Blue Zones','Bupa','Mayo Clinic'],
    ria: ['Savant Wealth','Plancorp','Brighton Jones','Rebalance','Facet','Colony','EP Wealth','Summitry','Beacon Pointe','Laird Norton'],
    actions: [
      'Selective kit shipments',
      'Digital follow-ups'
    ]
  },
  '7-8': {
    focus: 'Consolidation & PR Push',
    sports: [],
    longevity: [],
    ria: [],
    actions: [
      'Confirm partnerships',
      'Announce via press',
      'Prepare case studies'
    ]
  }
};

export const InteractiveLaunchChecklist: React.FC = () => {
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSegment, setSelectedSegment] = useState<string>('all');
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [selectedWeek, setSelectedWeek] = useState<string>('all');
  const planKey = useUserPlanKey();

  useEffect(() => {
    loadChecklistData();
    loadProgressData();
  }, []);

  const loadChecklistData = async () => {
    try {
      const { data, error } = await supabase
        .from('launch_checklist_items')
        .select('*')
        .order('week, segment, tier, target_name');

      if (error) throw error;

      if (!data || data.length === 0) {
        // Seed the database with initial data
        await seedChecklistData();
        return loadChecklistData(); // Reload after seeding
      }

      // Type assertion to ensure proper typing
      const typedData = data.map(item => ({
        ...item,
        segment: item.segment as 'sports' | 'longevity' | 'ria',
        tier: item.tier as 'gold' | 'silver' | 'bronze',
        status: item.status as 'not_started' | 'in_progress' | 'complete'
      }));

      setChecklistItems(typedData);
    } catch (error) {
      console.error('Error loading checklist:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProgressData = async () => {
    try {
      const { data, error } = await supabase
        .from('launch_checklist_progress')
        .select('*')
        .order('segment, tier, week');

      if (error) throw error;
      setProgressData(data || []);
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const seedChecklistData = async () => {
    const items: Omit<ChecklistItem, 'id' | 'created_at' | 'updated_at'>[] = [];

    Object.entries(launchSequenceData).forEach(([week, weekData]) => {
      const segments = ['sports', 'longevity', 'ria'] as const;
      
      segments.forEach(segment => {
        const targets = weekData[segment];
        const tier = week === '1-2' ? 'gold' : week === '3-4' ? 'silver' : 'bronze';
        
        if (targets && targets.length > 0) {
          targets.forEach(target => {
            items.push({
              week,
              segment,
              tier,
              target_name: target,
              target_type: segment === 'longevity' ? 'individual' : 'organization',
              key_actions: weekData.actions,
              status: 'not_started'
            });
          });
        }
      });
    });

    try {
      const { error } = await supabase
        .from('launch_checklist_items')
        .insert(items);

      if (error) throw error;
      console.log('Seeded checklist data successfully');
    } catch (error) {
      console.error('Error seeding checklist data:', error);
    }
  };

  const updateItemStatus = async (id: string, status: ChecklistItem['status'], notes?: string) => {
    try {
      const updates: any = { 
        status, 
        updated_at: new Date().toISOString() 
      };

      if (status === 'complete') {
        updates.completed_at = new Date().toISOString();
      }

      if (notes !== undefined) {
        updates.notes = notes;
      }

      const { error } = await supabase
        .from('launch_checklist_items')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setChecklistItems(prev => 
        prev.map(item => 
          item.id === id 
            ? { ...item, status, notes: notes ?? item.notes, updated_at: updates.updated_at }
            : item
        )
      );

      // Track analytics
      const item = checklistItems.find(i => i.id === id);
      if (item) {
        track('checklist_item_status_updated', {
          week: item.week,
          segment: item.segment,
          tier: item.tier,
          target: item.target_name,
          old_status: item.status,
          new_status: status
        });

        // Track legacy item updated event
        trackItemUpdated(item.target_name, {
          item_type: 'launch_checklist',
          week: item.week,
          segment: item.segment,
          tier: item.tier,
          old_status: item.status,
          new_status: status,
          notes: notes
        }, planKey);
      }

      // Reload progress data
      await loadProgressData();
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const sendDigest = async () => {
    try {
      const response = await supabase.functions.invoke('launch-digest', {
        body: { type: 'manual', force: true }
      });

      if (response.error) {
        throw response.error;
      }

      track('digest_sent_manually', { timestamp: new Date().toISOString() });
      alert('Digest sent successfully!');
    } catch (error) {
      console.error('Error sending digest:', error);
      alert('Failed to send digest');
    }
  };

  const filteredItems = checklistItems.filter(item => {
    if (selectedSegment !== 'all' && item.segment !== selectedSegment) return false;
    if (selectedTier !== 'all' && item.tier !== selectedTier) return false;
    if (selectedWeek !== 'all' && item.week !== selectedWeek) return false;
    return true;
  });

  const getOverallProgress = () => {
    if (progressData.length === 0) return { percentage: 0, completed: 0, total: 0 };
    
    const total = progressData.reduce((sum, p) => sum + p.total_items, 0);
    const completed = progressData.reduce((sum, p) => sum + p.completed_items, 0);
    
    return {
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
      completed,
      total
    };
  };

  const overallProgress = getOverallProgress();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold mx-auto"></div>
          <p className="text-muted-foreground">Loading checklist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with overall progress */}
      <Card className="bg-black border-gold/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-gold flex items-center gap-2">
                <CheckSquare className="h-6 w-6" />
                Founding 20 Launch Checklist
              </CardTitle>
              <CardDescription className="text-white/70">
                8-week execution roadmap across Sports, Longevity, and RIA segments
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gold">{overallProgress.percentage}%</div>
              <div className="text-sm text-white/60">
                {overallProgress.completed}/{overallProgress.total} items
              </div>
            </div>
          </div>
          <Progress value={overallProgress.percentage} className="h-3" />
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button onClick={sendDigest} className="bg-gold text-black hover:bg-gold/90">
              <Mail className="h-4 w-4 mr-2" />
              Send Digest
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="bg-black border-gold/30">
        <CardHeader>
          <CardTitle className="text-gold text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-white/80">Segment</label>
              <Select value={selectedSegment} onValueChange={setSelectedSegment}>
                <SelectTrigger className="bg-black/50 border-gold/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Segments</SelectItem>
                  <SelectItem value="sports">🏃 Sports</SelectItem>
                  <SelectItem value="longevity">🧬 Longevity</SelectItem>
                  <SelectItem value="ria">💼 RIA</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-white/80">Tier</label>
              <Select value={selectedTier} onValueChange={setSelectedTier}>
                <SelectTrigger className="bg-black/50 border-gold/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tiers</SelectItem>
                  <SelectItem value="gold">🥇 Gold</SelectItem>
                  <SelectItem value="silver">🥈 Silver</SelectItem>
                  <SelectItem value="bronze">🥉 Bronze</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-white/80">Week</label>
              <Select value={selectedWeek} onValueChange={setSelectedWeek}>
                <SelectTrigger className="bg-black/50 border-gold/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Weeks</SelectItem>
                  <SelectItem value="1-2">Week 1-2</SelectItem>
                  <SelectItem value="3-4">Week 3-4</SelectItem>
                  <SelectItem value="5-6">Week 5-6</SelectItem>
                  <SelectItem value="7-8">Week 7-8</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <div className="text-sm text-white/60">
                Showing {filteredItems.length} of {checklistItems.length} items
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Checklist Items */}
      <div className="space-y-4">
        {filteredItems.map((item) => (
          <Card key={item.id} className="bg-black border-gold/30">
            <CardContent className="p-6">
              <div className="grid lg:grid-cols-12 gap-4 items-start">
                {/* Checkbox and basic info */}
                <div className="lg:col-span-6 space-y-3">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={item.status === 'complete'}
                      onCheckedChange={(checked) => 
                        updateItemStatus(item.id, checked ? 'complete' : 'not_started')
                      }
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-white text-lg">{item.target_name}</h3>
                      <div className="flex gap-2 mt-2">
                        <Badge 
                          variant="outline" 
                          className={`border-${segmentColors[item.segment as keyof typeof segmentColors]}/50 text-${segmentColors[item.segment as keyof typeof segmentColors]}`}
                        >
                          {item.segment}
                        </Badge>
                        <Badge 
                          variant="outline"
                          style={{ 
                            borderColor: tierColors[item.tier as keyof typeof tierColors] + '80',
                            color: tierColors[item.tier as keyof typeof tierColors]
                          }}
                        >
                          {item.tier}
                        </Badge>
                        <Badge variant="outline" className="border-gold/50 text-gold">
                          Week {item.week}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Key Actions */}
                  <div>
                    <h4 className="text-sm font-medium text-white/80 mb-2">Key Actions:</h4>
                    <ul className="text-sm text-white/70 space-y-1">
                      {item.key_actions.map((action, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-gold">•</span>
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Status and notes */}
                <div className="lg:col-span-6 space-y-3">
                  <div>
                    <label className="text-sm font-medium text-white/80">Status</label>
                    <Select 
                      value={item.status} 
                      onValueChange={(value) => updateItemStatus(item.id, value as ChecklistItem['status'])}
                    >
                      <SelectTrigger className="bg-black/50 border-gold/30 text-white mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="not_started">Not Started</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="complete">Complete</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-white/80">Notes</label>
                    <Textarea
                      value={item.notes || ''}
                      onChange={(e) => {
                        // Update local state immediately for UX
                        setChecklistItems(prev => 
                          prev.map(i => i.id === item.id ? { ...i, notes: e.target.value } : i)
                        );
                      }}
                      onBlur={(e) => {
                        // Save to database on blur
                        if (e.target.value !== item.notes) {
                          updateItemStatus(item.id, item.status, e.target.value);
                        }
                      }}
                      placeholder="Add notes..."
                      className="bg-black/50 border-gold/30 text-white resize-none mt-1"
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <Card className="bg-black border-gold/30">
          <CardContent className="text-center py-12">
            <CheckSquare className="h-16 w-16 text-gold/50 mx-auto mb-4" />
            <p className="text-white/60">No items match the selected filters</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};