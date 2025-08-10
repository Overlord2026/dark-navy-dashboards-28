import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle, Clock, User, Calendar, FileText, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { track } from '@/lib/analytics/track';

interface ChecklistItem {
  id: string;
  week: string;
  segment: 'sports' | 'longevity' | 'ria';
  tier: 'gold' | 'silver' | 'bronze';
  target_name: string;
  target_type: string;
  key_actions: string[];
  owner: string;
  status: 'not_started' | 'in_progress' | 'complete';
  notes: string;
  assigned_at: string;
  completed_at: string;
}

const segmentColors = {
  sports: '#046B4D',   // Emerald
  longevity: '#0A152E', // Dark Navy  
  ria: '#A6192E'       // Red
};

const tierColors = {
  gold: '#FFD700',
  silver: '#C0C0C0', 
  bronze: '#CD7F32'
};

const checklistData = {
  '1-2': {
    focus: 'Gold Tier Blitz',
    sports: ['NFL', 'NBA', 'FIFA', 'UFC', 'MLB'],
    longevity: ['Tony Robbins', 'Peter Diamandis', 'David Sinclair', 'Andrew Huberman', 'Dr. Mark Hyman'],
    ria: ['Crescent Wealth', 'Mission Wealth', 'Mercer Advisors', 'Creative Planning', 'Edelman Financial Engines'],
    actions: [
      'Ship premium kits within 48h',
      'Send 60s HeyGen video email to Exec contacts', 
      'Book 15-min previews'
    ]
  },
  '3-4': {
    focus: 'Silver Tier Activation',
    sports: ['Formula 1', 'NASCAR', 'PGA Tour', 'LPGA', 'NHL'],
    longevity: ['Ben Greenfield', 'Dr. Rhonda Patrick', 'Peter Attia', 'Fountain Life', 'Human Longevity'],
    ria: ['Carson Group', 'Fisher Investments', 'Mariner Wealth', 'Buckingham', 'Wealth Enhancement Group'],
    actions: [
      'Ship kits and send follow-up emails',
      'Book demos'
    ]
  },
  '5-6': {
    focus: 'Bronze Tier Strategic Push', 
    sports: ['MLS', 'USOC', 'IOC', 'ONE Championship', 'World Rugby', 'ICC (Cricket)', 'Magic Johnson Enterprises', 'A-Rod Corp', 'WADA', 'International Paralympic Committee'],
    longevity: ['Thorne', 'Levels', 'Lifespan.io', 'Bryan Johnson', 'Precision Health Alliance', 'Chris Hemsworth', 'WHO Healthy Ageing', 'Blue Zones', 'Bupa', 'Mayo Clinic'],
    ria: ['Savant Wealth', 'Plancorp', 'Brighton Jones', 'Rebalance', 'Facet', 'Colony', 'EP Wealth', 'Summitry', 'Beacon Pointe', 'Laird Norton'],
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

export const LaunchChecklistInterface: React.FC = () => {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ segment: 'all', tier: 'all', week: 'all', status: 'all' });
  const [progress, setProgress] = useState({ total: 0, completed: 0, percentage: 0 });

  useEffect(() => {
    loadChecklistItems();
  }, []);

  const loadChecklistItems = async () => {
    try {
      const { data, error } = await supabase
        .from('launch_checklist_items')
        .select('*')
        .order('week', { ascending: true })
        .order('segment', { ascending: true })
        .order('tier', { ascending: true });

      if (error) throw error;

      if (!data || data.length === 0) {
        // Initialize checklist with seed data
        await initializeChecklist();
        return;
      }

      setItems(data as ChecklistItem[]);
      calculateProgress(data as ChecklistItem[]);
    } catch (error) {
      console.error('Error loading checklist:', error);
    } finally {
      setLoading(false);
    }
  };

  const initializeChecklist = async () => {
    const seedItems: Omit<ChecklistItem, 'id'>[] = [];

    Object.entries(checklistData).forEach(([week, weekData]) => {
      ['sports', 'longevity', 'ria'].forEach(segment => {
        const targets = weekData[segment] || [];
        const tier = week === '1-2' ? 'gold' : week === '3-4' ? 'silver' : 'bronze';
        
        targets.forEach(target => {
          seedItems.push({
            week,
            segment: segment as any,
            tier: tier as any,
            target_name: target,
            target_type: segment === 'longevity' && ['Tony Robbins', 'Peter Diamandis', 'David Sinclair', 'Andrew Huberman', 'Dr. Mark Hyman', 'Ben Greenfield', 'Dr. Rhonda Patrick', 'Peter Attia', 'Bryan Johnson', 'Chris Hemsworth'].includes(target) ? 'individual' : 'organization',
            key_actions: weekData.actions,
            owner: '',
            status: 'not_started',
            notes: '',
            assigned_at: '',
            completed_at: ''
          });
        });
      });
    });

    try {
      const { data, error } = await supabase
        .from('launch_checklist_items')
        .insert(seedItems)
        .select();

      if (error) throw error;

      setItems(data as ChecklistItem[]);
      calculateProgress(data as ChecklistItem[]);
    } catch (error) {
      console.error('Error initializing checklist:', error);
    }
  };

  const calculateProgress = (itemList: ChecklistItem[]) => {
    const total = itemList.length;
    const completed = itemList.filter(item => item.status === 'complete').length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    setProgress({ total, completed, percentage });
  };

  const updateItemStatus = async (id: string, status: ChecklistItem['status']) => {
    try {
      const updateData: any = { 
        status, 
        updated_at: new Date().toISOString() 
      };

      if (status === 'complete') {
        updateData.completed_at = new Date().toISOString();
      } else if (status === 'in_progress' && !items.find(i => i.id === id)?.assigned_at) {
        updateData.assigned_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('launch_checklist_items')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      const updatedItems = items.map(item => 
        item.id === id ? { ...item, ...updateData } : item
      );
      setItems(updatedItems);
      calculateProgress(updatedItems);

      const item = items.find(i => i.id === id);
      track('checklist_item_status_updated', {
        item_id: id,
        segment: item?.segment,
        tier: item?.tier,
        week: item?.week,
        new_status: status,
        target_name: item?.target_name
      });
    } catch (error) {
      console.error('Error updating item status:', error);
    }
  };

  const updateItemField = async (id: string, field: string, value: string) => {
    try {
      const { error } = await supabase
        .from('launch_checklist_items')
        .update({ [field]: value, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      setItems(items.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      ));
    } catch (error) {
      console.error('Error updating item field:', error);
    }
  };

  const sendDigest = async () => {
    try {
      track('weekly_digest_requested', { timestamp: new Date().toISOString() });
      
      const response = await supabase.functions.invoke('launch-digest', {
        body: { type: 'weekly' }
      });

      if (response.error) throw response.error;

      track('weekly_digest_sent', { 
        success: true,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error sending digest:', error);
    }
  };

  const filteredItems = items.filter(item => {
    return (filter.segment === 'all' || item.segment === filter.segment) &&
           (filter.tier === 'all' || item.tier === filter.tier) &&
           (filter.week === 'all' || item.week === filter.week) &&
           (filter.status === 'all' || item.status === filter.status);
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in_progress': return <Clock className="h-5 w-5 text-yellow-500" />;
      default: return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading checklist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Progress */}
      <Card className="bg-black border-gold/30">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-gold text-2xl">Founding 20 Launch Sequencing Checklist</CardTitle>
              <CardDescription className="text-white/70">
                8-week execution roadmap across Sports, Longevity, and RIA segments
              </CardDescription>
            </div>
            <Button 
              onClick={sendDigest}
              className="bg-gold text-black hover:bg-gold/90"
            >
              <Mail className="h-4 w-4 mr-2" />
              Send Digest
            </Button>
          </div>
          
          <div className="mt-6">
            <div className="flex justify-between text-sm text-white/70 mb-2">
              <span>Overall Progress</span>
              <span>{progress.completed}/{progress.total} ({progress.percentage}%)</span>
            </div>
            <Progress value={progress.percentage} className="h-3" />
          </div>
        </CardHeader>
      </Card>

      {/* Filters */}
      <Card className="bg-black border-gold/30">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Select value={filter.segment} onValueChange={(value) => setFilter({...filter, segment: value})}>
              <SelectTrigger className="bg-black/50 border-gold/30">
                <SelectValue placeholder="All Segments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Segments</SelectItem>
                <SelectItem value="sports">🏆 Sports</SelectItem>
                <SelectItem value="longevity">🧬 Longevity</SelectItem>
                <SelectItem value="ria">💼 RIA</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filter.tier} onValueChange={(value) => setFilter({...filter, tier: value})}>
              <SelectTrigger className="bg-black/50 border-gold/30">
                <SelectValue placeholder="All Tiers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="gold">🥇 Gold</SelectItem>
                <SelectItem value="silver">🥈 Silver</SelectItem>
                <SelectItem value="bronze">🥉 Bronze</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filter.week} onValueChange={(value) => setFilter({...filter, week: value})}>
              <SelectTrigger className="bg-black/50 border-gold/30">
                <SelectValue placeholder="All Weeks" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Weeks</SelectItem>
                <SelectItem value="1-2">Week 1-2</SelectItem>
                <SelectItem value="3-4">Week 3-4</SelectItem>
                <SelectItem value="5-6">Week 5-6</SelectItem>
                <SelectItem value="7-8">Week 7-8</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filter.status} onValueChange={(value) => setFilter({...filter, status: value})}>
              <SelectTrigger className="bg-black/50 border-gold/30">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="not_started">Not Started</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="complete">Complete</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Checklist Items */}
      <div className="space-y-4">
        {filteredItems.map((item) => (
          <Card key={item.id} className="bg-black border-gold/30">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {/* Item Info */}
                <div className="lg:col-span-2">
                  <div className="flex items-center gap-3 mb-3">
                    <Checkbox
                      checked={item.status === 'complete'}
                      onCheckedChange={(checked) => 
                        updateItemStatus(item.id, checked ? 'complete' : 'not_started')
                      }
                    />
                    {getStatusIcon(item.status)}
                    <Badge 
                      variant="outline" 
                      style={{ borderColor: segmentColors[item.segment], color: segmentColors[item.segment] }}
                    >
                      {item.segment.toUpperCase()}
                    </Badge>
                    <Badge 
                      variant="outline"
                      style={{ borderColor: tierColors[item.tier], color: tierColors[item.tier] }}
                    >
                      {item.tier.toUpperCase()}
                    </Badge>
                    <Badge variant="outline" className="border-gold/50 text-gold">
                      Week {item.week}
                    </Badge>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-white mb-2">{item.target_name}</h3>
                  
                  <div className="space-y-1">
                    {item.key_actions.map((action, index) => (
                      <div key={index} className="text-sm text-white/70 flex items-center gap-2">
                        <FileText className="h-3 w-3" />
                        {action}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Owner & Status */}
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-white/70 mb-1 block">Owner</label>
                    <Input
                      value={item.owner}
                      onChange={(e) => updateItemField(item.id, 'owner', e.target.value)}
                      placeholder="Assign owner"
                      className="bg-black/50 border-gold/30 text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm text-white/70 mb-1 block">Status</label>
                    <Select 
                      value={item.status} 
                      onValueChange={(value) => updateItemStatus(item.id, value as any)}
                    >
                      <SelectTrigger className="bg-black/50 border-gold/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="not_started">Not Started</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="complete">Complete</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="text-sm text-white/70 mb-1 block">Notes</label>
                  <Textarea
                    value={item.notes}
                    onChange={(e) => updateItemField(item.id, 'notes', e.target.value)}
                    placeholder="Add notes..."
                    rows={3}
                    className="bg-black/50 border-gold/30 text-white"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <Card className="bg-black border-gold/30">
          <CardContent className="p-12 text-center">
            <FileText className="h-16 w-16 text-gold mx-auto mb-4" />
            <p className="text-white/60">No items match the current filters</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};