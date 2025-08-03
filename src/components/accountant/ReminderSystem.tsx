import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { 
  Bell, 
  Plus, 
  Calendar, 
  Clock, 
  User, 
  FileText,
  Settings,
  AlertTriangle,
  CheckCircle,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { format, addDays, isAfter, isBefore } from 'date-fns';

interface Reminder {
  id: string;
  client_id?: string;
  reminder_type: 'tax_deadline' | 'document_request' | 'payment_due' | 'meeting' | 'custom';
  title: string;
  description?: string;
  due_date: string;
  reminder_date: string;
  is_recurring: boolean;
  recurrence_interval?: string;
  status: 'active' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  accountant_clients?: {
    business_name: string;
  };
}

interface Client {
  id: string;
  business_name: string;
}

export function ReminderSystem() {
  const { toast } = useToast();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isAddReminderOpen, setIsAddReminderOpen] = useState(false);
  const [filter, setFilter] = useState('all');

  const [newReminder, setNewReminder] = useState({
    client_id: '',
    reminder_type: 'custom' as const,
    title: '',
    description: '',
    due_date: '',
    reminder_date: '',
    is_recurring: false,
    recurrence_interval: 'monthly',
    priority: 'medium' as const
  });

  useEffect(() => {
    fetchReminders();
    fetchClients();
    checkUpcomingReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      const { data, error } = await supabase
        .from('accountant_reminders')
        .select(`
          *,
          accountant_clients (
            business_name
          )
        `)
        .order('due_date', { ascending: true });

      if (error) throw error;
      setReminders(data || []);
    } catch (error) {
      console.error('Error fetching reminders:', error);
    }
  };

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('accountant_clients')
        .select('id, business_name')
        .eq('status', 'active')
        .order('business_name');

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const checkUpcomingReminders = async () => {
    try {
      const today = new Date();
      const tomorrow = addDays(today, 1);
      
      const { data, error } = await supabase
        .from('accountant_reminders')
        .select(`
          *,
          accountant_clients (
            business_name
          )
        `)
        .eq('status', 'active')
        .gte('reminder_date', format(today, 'yyyy-MM-dd'))
        .lte('reminder_date', format(tomorrow, 'yyyy-MM-dd'));

      if (error) throw error;

      if (data && data.length > 0) {
        data.forEach((reminder) => {
          toast({
            title: "Reminder Alert",
            description: `${reminder.title} is due ${format(new Date(reminder.due_date), 'MMM d, yyyy')}`,
          });
        });
      }
    } catch (error) {
      console.error('Error checking reminders:', error);
    }
  };

  const addReminder = async () => {
    try {
      const { error } = await supabase
        .from('accountant_reminders')
        .insert([{
          ...newReminder,
          status: 'active'
        }]);

      if (error) throw error;

      setIsAddReminderOpen(false);
      setNewReminder({
        client_id: '',
        reminder_type: 'custom',
        title: '',
        description: '',
        due_date: '',
        reminder_date: '',
        is_recurring: false,
        recurrence_interval: 'monthly',
        priority: 'medium'
      });

      fetchReminders();

      toast({
        title: "Reminder Added",
        description: "New reminder has been created",
      });
    } catch (error) {
      console.error('Error adding reminder:', error);
      toast({
        title: "Error",
        description: "Failed to add reminder",
        variant: "destructive",
      });
    }
  };

  const updateReminderStatus = async (reminderId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('accountant_reminders')
        .update({ status })
        .eq('id', reminderId);

      if (error) throw error;

      fetchReminders();

      toast({
        title: "Reminder Updated",
        description: `Reminder marked as ${status}`,
      });
    } catch (error) {
      console.error('Error updating reminder:', error);
      toast({
        title: "Error",
        description: "Failed to update reminder",
        variant: "destructive",
      });
    }
  };

  const deleteReminder = async (reminderId: string) => {
    try {
      const { error } = await supabase
        .from('accountant_reminders')
        .delete()
        .eq('id', reminderId);

      if (error) throw error;

      fetchReminders();

      toast({
        title: "Reminder Deleted",
        description: "Reminder has been deleted",
      });
    } catch (error) {
      console.error('Error deleting reminder:', error);
      toast({
        title: "Error",
        description: "Failed to delete reminder",
        variant: "destructive",
      });
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'tax_deadline': return <Calendar className="h-4 w-4" />;
      case 'document_request': return <FileText className="h-4 w-4" />;
      case 'payment_due': return <Clock className="h-4 w-4" />;
      case 'meeting': return <User className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'tax_deadline': return 'bg-red-100 text-red-800';
      case 'document_request': return 'bg-blue-100 text-blue-800';
      case 'payment_due': return 'bg-yellow-100 text-yellow-800';
      case 'meeting': return 'bg-green-100 text-green-800';
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

  const isOverdue = (dueDate: string) => {
    return isAfter(new Date(), new Date(dueDate));
  };

  const isUpcoming = (reminderDate: string) => {
    const today = new Date();
    const reminder = new Date(reminderDate);
    return isAfter(reminder, today) && isBefore(reminder, addDays(today, 7));
  };

  const filteredReminders = reminders.filter(reminder => {
    switch (filter) {
      case 'overdue': return reminder.status === 'active' && isOverdue(reminder.due_date);
      case 'upcoming': return reminder.status === 'active' && isUpcoming(reminder.reminder_date);
      case 'completed': return reminder.status === 'completed';
      case 'active': return reminder.status === 'active';
      default: return true;
    }
  });

  const stats = {
    total: reminders.length,
    active: reminders.filter(r => r.status === 'active').length,
    overdue: reminders.filter(r => r.status === 'active' && isOverdue(r.due_date)).length,
    upcoming: reminders.filter(r => r.status === 'active' && isUpcoming(r.reminder_date)).length
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reminders</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.upcoming}</div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter reminders" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Reminders</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>

        <Dialog open={isAddReminderOpen} onOpenChange={setIsAddReminderOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Reminder
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Reminder</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select 
                    value={newReminder.reminder_type} 
                    onValueChange={(value: any) => setNewReminder({...newReminder, reminder_type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tax_deadline">Tax Deadline</SelectItem>
                      <SelectItem value="document_request">Document Request</SelectItem>
                      <SelectItem value="payment_due">Payment Due</SelectItem>
                      <SelectItem value="meeting">Meeting</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Client (optional)</Label>
                  <Select value={newReminder.client_id} onValueChange={(value) => setNewReminder({...newReminder, client_id: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select client" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No specific client</SelectItem>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.business_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={newReminder.title}
                  onChange={(e) => setNewReminder({...newReminder, title: e.target.value})}
                  placeholder="Reminder title"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={newReminder.description}
                  onChange={(e) => setNewReminder({...newReminder, description: e.target.value})}
                  placeholder="Additional details"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <Input
                    type="date"
                    value={newReminder.due_date}
                    onChange={(e) => setNewReminder({...newReminder, due_date: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Reminder Date</Label>
                  <Input
                    type="date"
                    value={newReminder.reminder_date}
                    onChange={(e) => setNewReminder({...newReminder, reminder_date: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select 
                    value={newReminder.priority} 
                    onValueChange={(value: any) => setNewReminder({...newReminder, priority: value})}
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
                <div className="flex items-center space-x-2 pt-6">
                  <Switch
                    checked={newReminder.is_recurring}
                    onCheckedChange={(checked) => setNewReminder({...newReminder, is_recurring: checked})}
                  />
                  <Label>Recurring</Label>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsAddReminderOpen(false)}>
                Cancel
              </Button>
              <Button onClick={addReminder}>
                Add Reminder
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Reminders List */}
      <Card>
        <CardHeader>
          <CardTitle>Reminders ({filteredReminders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredReminders.map((reminder) => (
              <div 
                key={reminder.id} 
                className={`p-4 border rounded-lg ${
                  reminder.status === 'active' && isOverdue(reminder.due_date) 
                    ? 'border-red-200 bg-red-50' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge className={getTypeColor(reminder.reminder_type)}>
                        {getTypeIcon(reminder.reminder_type)}
                        <span className="ml-1">{reminder.reminder_type.replace('_', ' ')}</span>
                      </Badge>
                      <Badge className={getPriorityColor(reminder.priority)}>
                        {reminder.priority}
                      </Badge>
                      {reminder.is_recurring && (
                        <Badge variant="outline">Recurring</Badge>
                      )}
                      {reminder.status === 'active' && isOverdue(reminder.due_date) && (
                        <Badge className="bg-red-100 text-red-800">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Overdue
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-semibold">{reminder.title}</h3>
                    {reminder.description && (
                      <p className="text-sm text-muted-foreground">{reminder.description}</p>
                    )}
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      {reminder.accountant_clients && (
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {reminder.accountant_clients.business_name}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Due: {format(new Date(reminder.due_date), 'MMM d, yyyy')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Bell className="h-3 w-3" />
                        Remind: {format(new Date(reminder.reminder_date), 'MMM d, yyyy')}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {reminder.status === 'active' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateReminderStatus(reminder.id, 'completed')}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteReminder(reminder.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {filteredReminders.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                {filter === 'all' 
                  ? 'No reminders yet. Add your first reminder to get started.'
                  : `No ${filter} reminders found.`}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}