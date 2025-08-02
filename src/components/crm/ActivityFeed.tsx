import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Plus, Phone, Mail, Calendar, MessageSquare, FileText, DollarSign, Filter } from 'lucide-react';
import { toast } from 'sonner';

interface Activity {
  id: string;
  contact_id: string;
  contact_name: string;
  contact_email: string;
  activity_type: 'call' | 'email' | 'meeting' | 'note' | 'task' | 'deal_update';
  title: string;
  description?: string;
  duration_minutes?: number;
  outcome?: string;
  next_steps?: string;
  created_at: string;
  user_id: string;
}

const activityIcons = {
  call: Phone,
  email: Mail,
  meeting: Calendar,
  note: MessageSquare,
  task: FileText,
  deal_update: DollarSign
};

const activityColors = {
  call: 'bg-blue-100 text-blue-800',
  email: 'bg-green-100 text-green-800',
  meeting: 'bg-purple-100 text-purple-800',
  note: 'bg-yellow-100 text-yellow-800',
  task: 'bg-orange-100 text-orange-800',
  deal_update: 'bg-red-100 text-red-800'
};

export function ActivityFeed() {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newActivity, setNewActivity] = useState({
    contact_name: '',
    contact_email: '',
    activity_type: 'call' as const,
    title: '',
    description: '',
    duration_minutes: '',
    outcome: '',
    next_steps: ''
  });

  useEffect(() => {
    if (user) {
      fetchActivities();
    }
  }, [user]);

  const fetchActivities = async () => {
    try {
      const { data, error } = await supabase
        .from('crm_activities')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setActivities(data || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
      toast.error('Failed to load activities');
    } finally {
      setLoading(false);
    }
  };

  const handleAddActivity = async () => {
    try {
      const activityData = {
        ...newActivity,
        duration_minutes: newActivity.duration_minutes ? parseInt(newActivity.duration_minutes) : null,
        user_id: user?.id
      };

      const { error } = await supabase
        .from('crm_activities')
        .insert([activityData]);

      if (error) throw error;

      toast.success('Activity logged successfully');
      setIsAddDialogOpen(false);
      setNewActivity({
        contact_name: '',
        contact_email: '',
        activity_type: 'call',
        title: '',
        description: '',
        duration_minutes: '',
        outcome: '',
        next_steps: ''
      });
      fetchActivities();
    } catch (error) {
      console.error('Error adding activity:', error);
      toast.error('Failed to log activity');
    }
  };

  const filteredActivities = activities.filter(activity => 
    typeFilter === 'all' || activity.activity_type === typeFilter
  );

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading activities...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Activity Feed</h2>
          <p className="text-muted-foreground">Track all interactions with your contacts</p>
        </div>
        
        <div className="flex gap-3">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Activities</SelectItem>
              <SelectItem value="call">Calls</SelectItem>
              <SelectItem value="email">Emails</SelectItem>
              <SelectItem value="meeting">Meetings</SelectItem>
              <SelectItem value="note">Notes</SelectItem>
              <SelectItem value="task">Tasks</SelectItem>
              <SelectItem value="deal_update">Deal Updates</SelectItem>
            </SelectContent>
          </Select>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Log Activity
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Log New Activity</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="contact_name">Contact Name *</Label>
                  <Input
                    id="contact_name"
                    value={newActivity.contact_name}
                    onChange={(e) => setNewActivity({...newActivity, contact_name: e.target.value})}
                    placeholder="Contact name"
                  />
                </div>
                <div>
                  <Label htmlFor="contact_email">Contact Email</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={newActivity.contact_email}
                    onChange={(e) => setNewActivity({...newActivity, contact_email: e.target.value})}
                    placeholder="contact@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="activity_type">Activity Type</Label>
                  <Select value={newActivity.activity_type} onValueChange={(value: any) => setNewActivity({...newActivity, activity_type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="call">Phone Call</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="meeting">Meeting</SelectItem>
                      <SelectItem value="note">Note</SelectItem>
                      <SelectItem value="task">Task</SelectItem>
                      <SelectItem value="deal_update">Deal Update</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={newActivity.title}
                    onChange={(e) => setNewActivity({...newActivity, title: e.target.value})}
                    placeholder="Activity title"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newActivity.description}
                    onChange={(e) => setNewActivity({...newActivity, description: e.target.value})}
                    placeholder="Activity details..."
                  />
                </div>
                {newActivity.activity_type === 'call' && (
                  <div>
                    <Label htmlFor="duration_minutes">Duration (minutes)</Label>
                    <Input
                      id="duration_minutes"
                      type="number"
                      value={newActivity.duration_minutes}
                      onChange={(e) => setNewActivity({...newActivity, duration_minutes: e.target.value})}
                      placeholder="30"
                    />
                  </div>
                )}
                <div>
                  <Label htmlFor="outcome">Outcome</Label>
                  <Input
                    id="outcome"
                    value={newActivity.outcome}
                    onChange={(e) => setNewActivity({...newActivity, outcome: e.target.value})}
                    placeholder="Meeting outcome"
                  />
                </div>
                <div>
                  <Label htmlFor="next_steps">Next Steps</Label>
                  <Textarea
                    id="next_steps"
                    value={newActivity.next_steps}
                    onChange={(e) => setNewActivity({...newActivity, next_steps: e.target.value})}
                    placeholder="Follow-up actions..."
                  />
                </div>
                <Button onClick={handleAddActivity} className="w-full">
                  Log Activity
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="space-y-4">
        {filteredActivities.map((activity) => {
          const Icon = activityIcons[activity.activity_type];
          
          return (
            <Card key={activity.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="p-2 rounded-full bg-muted">
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-medium">{activity.title}</h3>
                        <Badge className={activityColors[activity.activity_type]}>
                          {activity.activity_type.charAt(0).toUpperCase() + activity.activity_type.slice(1)}
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {formatRelativeTime(activity.created_at)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${activity.contact_name}`} />
                        <AvatarFallback className="text-xs">
                          {activity.contact_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{activity.contact_name}</span>
                      {activity.contact_email && (
                        <span className="text-sm text-muted-foreground">({activity.contact_email})</span>
                      )}
                      {activity.duration_minutes && (
                        <Badge variant="outline" className="text-xs">
                          {activity.duration_minutes}m
                        </Badge>
                      )}
                    </div>
                    
                    {activity.description && (
                      <p className="text-sm text-muted-foreground mb-3">
                        {activity.description}
                      </p>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {activity.outcome && (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">Outcome:</p>
                          <p className="text-sm">{activity.outcome}</p>
                        </div>
                      )}
                      {activity.next_steps && (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">Next Steps:</p>
                          <p className="text-sm">{activity.next_steps}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredActivities.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground">
            {typeFilter !== 'all' 
              ? `No ${typeFilter} activities found` 
              : 'No activities yet. Log your first interaction to get started.'}
          </div>
        </div>
      )}
    </div>
  );
}