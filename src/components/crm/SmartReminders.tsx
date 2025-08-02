import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Bell, Plus, Calendar, Phone, Mail, Gift, GraduationCap, AlertTriangle, CheckCircle, Clock, User } from 'lucide-react';
import { toast } from 'sonner';

interface Reminder {
  id: string;
  contact_name: string;
  contact_email?: string;
  reminder_type: 'follow_up' | 'renewal' | 'birthday' | 'anniversary' | 'ce_credits' | 'compliance' | 'custom';
  title: string;
  description?: string;
  due_date: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'completed' | 'snoozed';
  auto_generated: boolean;
  created_at: string;
  user_id: string;
}

const reminderIcons = {
  follow_up: Phone,
  renewal: Calendar,
  birthday: Gift,
  anniversary: Calendar,
  ce_credits: GraduationCap,
  compliance: AlertTriangle,
  custom: Bell
};

const reminderColors = {
  follow_up: 'bg-blue-100 text-blue-800',
  renewal: 'bg-orange-100 text-orange-800',
  birthday: 'bg-pink-100 text-pink-800',
  anniversary: 'bg-purple-100 text-purple-800',
  ce_credits: 'bg-green-100 text-green-800',
  compliance: 'bg-red-100 text-red-800',
  custom: 'bg-gray-100 text-gray-800'
};

const priorityColors = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800'
};

export function SmartReminders() {
  const { user } = useAuth();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('pending');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newReminder, setNewReminder] = useState({
    contact_name: '',
    contact_email: '',
    reminder_type: 'custom' as const,
    title: '',
    description: '',
    due_date: '',
    priority: 'medium' as const
  });

  useEffect(() => {
    if (user) {
      fetchReminders();
    }
  }, [user]);

  const fetchReminders = async () => {
    try {
      const { data, error } = await supabase
        .from('crm_reminders')
        .select('*')
        .eq('user_id', user?.id)
        .order('due_date', { ascending: true });

      if (error) throw error;
      setReminders(data || []);
    } catch (error) {
      console.error('Error fetching reminders:', error);
      toast.error('Failed to load reminders');
    } finally {
      setLoading(false);
    }
  };

  const handleAddReminder = async () => {
    try {
      const reminderData = {
        ...newReminder,
        auto_generated: false,
        status: 'pending',
        user_id: user?.id
      };

      const { error } = await supabase
        .from('crm_reminders')
        .insert([reminderData]);

      if (error) throw error;

      toast.success('Reminder created successfully');
      setIsAddDialogOpen(false);
      setNewReminder({
        contact_name: '',
        contact_email: '',
        reminder_type: 'custom',
        title: '',
        description: '',
        due_date: '',
        priority: 'medium'
      });
      fetchReminders();
    } catch (error) {
      console.error('Error adding reminder:', error);
      toast.error('Failed to create reminder');
    }
  };

  const handleCompleteReminder = async (reminderId: string) => {
    try {
      const { error } = await supabase
        .from('crm_reminders')
        .update({ status: 'completed' })
        .eq('id', reminderId);

      if (error) throw error;

      setReminders(prev => prev.map(reminder =>
        reminder.id === reminderId
          ? { ...reminder, status: 'completed' as const }
          : reminder
      ));

      toast.success('Reminder marked as completed');
    } catch (error) {
      console.error('Error completing reminder:', error);
      toast.error('Failed to complete reminder');
    }
  };

  const handleSnoozeReminder = async (reminderId: string) => {
    try {
      const newDueDate = new Date();
      newDueDate.setDate(newDueDate.getDate() + 1); // Snooze for 1 day

      const { error } = await supabase
        .from('crm_reminders')
        .update({ 
          status: 'pending',
          due_date: newDueDate.toISOString().split('T')[0]
        })
        .eq('id', reminderId);

      if (error) throw error;

      fetchReminders(); // Refresh to get updated data
      toast.success('Reminder snoozed for 1 day');
    } catch (error) {
      console.error('Error snoozing reminder:', error);
      toast.error('Failed to snooze reminder');
    }
  };

  const filteredReminders = reminders.filter(reminder => 
    statusFilter === 'all' || reminder.status === statusFilter
  );

  const getOverdueCount = () => {
    const today = new Date().toISOString().split('T')[0];
    return reminders.filter(r => r.status === 'pending' && r.due_date < today).length;
  };

  const getTodayCount = () => {
    const today = new Date().toISOString().split('T')[0];
    return reminders.filter(r => r.status === 'pending' && r.due_date === today).length;
  };

  const getUpcomingCount = () => {
    const today = new Date().toISOString().split('T')[0];
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const nextWeekStr = nextWeek.toISOString().split('T')[0];
    
    return reminders.filter(r => 
      r.status === 'pending' && 
      r.due_date > today && 
      r.due_date <= nextWeekStr
    ).length;
  };

  const formatDueDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''}`;
    } else if (diffDays === 0) {
      return 'Due today';
    } else if (diffDays === 1) {
      return 'Due tomorrow';
    } else {
      return `Due in ${diffDays} days`;
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading reminders...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Smart Reminders</h2>
          <p className="text-muted-foreground">Stay on top of important follow-ups and deadlines</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Reminder
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Reminder</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="contact_name">Contact Name *</Label>
                <Input
                  id="contact_name"
                  value={newReminder.contact_name}
                  onChange={(e) => setNewReminder({...newReminder, contact_name: e.target.value})}
                  placeholder="Contact name"
                />
              </div>
              <div>
                <Label htmlFor="contact_email">Contact Email</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={newReminder.contact_email}
                  onChange={(e) => setNewReminder({...newReminder, contact_email: e.target.value})}
                  placeholder="contact@example.com"
                />
              </div>
              <div>
                <Label htmlFor="reminder_type">Reminder Type</Label>
                <Select value={newReminder.reminder_type} onValueChange={(value: any) => setNewReminder({...newReminder, reminder_type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="follow_up">Follow-up</SelectItem>
                    <SelectItem value="renewal">Renewal</SelectItem>
                    <SelectItem value="birthday">Birthday</SelectItem>
                    <SelectItem value="anniversary">Anniversary</SelectItem>
                    <SelectItem value="ce_credits">CE Credits</SelectItem>
                    <SelectItem value="compliance">Compliance</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={newReminder.title}
                  onChange={(e) => setNewReminder({...newReminder, title: e.target.value})}
                  placeholder="Reminder title"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newReminder.description}
                  onChange={(e) => setNewReminder({...newReminder, description: e.target.value})}
                  placeholder="Additional details..."
                />
              </div>
              <div>
                <Label htmlFor="due_date">Due Date *</Label>
                <Input
                  id="due_date"
                  type="date"
                  value={newReminder.due_date}
                  onChange={(e) => setNewReminder({...newReminder, due_date: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select value={newReminder.priority} onValueChange={(value: any) => setNewReminder({...newReminder, priority: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddReminder} className="w-full">
                Create Reminder
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold text-red-900">{getOverdueCount()}</p>
                <p className="text-sm text-red-700">Overdue</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold text-orange-900">{getTodayCount()}</p>
                <p className="text-sm text-orange-700">Due Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold text-yellow-900">{getUpcomingCount()}</p>
                <p className="text-sm text-yellow-700">This Week</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-900">
                  {reminders.filter(r => r.status === 'completed').length}
                </p>
                <p className="text-sm text-green-700">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <Button
          variant={statusFilter === 'pending' ? 'default' : 'outline'}
          onClick={() => setStatusFilter('pending')}
          size="sm"
        >
          Pending ({reminders.filter(r => r.status === 'pending').length})
        </Button>
        <Button
          variant={statusFilter === 'completed' ? 'default' : 'outline'}
          onClick={() => setStatusFilter('completed')}
          size="sm"
        >
          Completed ({reminders.filter(r => r.status === 'completed').length})
        </Button>
        <Button
          variant={statusFilter === 'all' ? 'default' : 'outline'}
          onClick={() => setStatusFilter('all')}
          size="sm"
        >
          All ({reminders.length})
        </Button>
      </div>

      {/* Reminders List */}
      <div className="space-y-3">
        {filteredReminders.map((reminder) => {
          const Icon = reminderIcons[reminder.reminder_type];
          const isOverdue = reminder.status === 'pending' && reminder.due_date < new Date().toISOString().split('T')[0];
          
          return (
            <Card key={reminder.id} className={`${isOverdue ? 'border-red-200 bg-red-50' : ''} hover:shadow-md transition-shadow`}>
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
                        <h3 className="font-medium">{reminder.title}</h3>
                        <Badge className={reminderColors[reminder.reminder_type]}>
                          {reminder.reminder_type.replace('_', ' ').charAt(0).toUpperCase() + reminder.reminder_type.replace('_', ' ').slice(1)}
                        </Badge>
                        <Badge className={priorityColors[reminder.priority]}>
                          {reminder.priority.charAt(0).toUpperCase() + reminder.priority.slice(1)}
                        </Badge>
                        {reminder.auto_generated && (
                          <Badge variant="outline" className="text-xs">Auto</Badge>
                        )}
                      </div>
                      <span className={`text-sm font-medium ${isOverdue ? 'text-red-600' : 'text-muted-foreground'}`}>
                        {formatDueDate(reminder.due_date)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${reminder.contact_name}`} />
                        <AvatarFallback className="text-xs">
                          {reminder.contact_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{reminder.contact_name}</span>
                      {reminder.contact_email && (
                        <span className="text-sm text-muted-foreground">({reminder.contact_email})</span>
                      )}
                    </div>
                    
                    {reminder.description && (
                      <p className="text-sm text-muted-foreground mb-3">
                        {reminder.description}
                      </p>
                    )}
                    
                    {reminder.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleCompleteReminder(reminder.id)}>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Complete
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleSnoozeReminder(reminder.id)}>
                          <Clock className="h-3 w-3 mr-1" />
                          Snooze
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredReminders.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground">
            {statusFilter === 'pending' 
              ? 'No pending reminders. Great job staying on top of things!' 
              : statusFilter === 'completed'
              ? 'No completed reminders yet.'
              : 'No reminders yet. Create your first reminder to get started.'}
          </div>
        </div>
      )}
    </div>
  );
}