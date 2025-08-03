import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Play, 
  Pause, 
  Square, 
  Clock, 
  Plus, 
  Calendar,
  Timer,
  DollarSign,
  User
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface TimeEntry {
  id: string;
  client_id: string;
  task_description: string;
  hours_worked: number;
  hourly_rate: number;
  work_date: string;
  is_billable: boolean;
  status: 'draft' | 'submitted' | 'approved' | 'billed';
  created_at: string;
  accountant_clients?: {
    business_name: string;
  };
}

interface Client {
  id: string;
  business_name: string;
}

export function TimeTrackingWidget() {
  const { toast } = useToast();
  const [isTracking, setIsTracking] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([
    {
      id: '1',
      client_id: '1',
      task_description: 'Tax return preparation and review',
      hours_worked: 3.5,
      hourly_rate: 150,
      work_date: '2024-02-01',
      is_billable: true,
      status: 'billed',
      created_at: '2024-02-01T10:00:00Z',
      accountant_clients: { business_name: 'Johnson Corp' }
    },
    {
      id: '2',
      client_id: '2',
      task_description: 'Quarterly financial review',
      hours_worked: 2.0,
      hourly_rate: 150,
      work_date: '2024-02-02',
      is_billable: true,
      status: 'approved',
      created_at: '2024-02-02T14:00:00Z',
      accountant_clients: { business_name: 'Smith LLC' }
    }
  ]);
  
  const [clients, setClients] = useState<Client[]>([
    { id: '1', business_name: 'Johnson Corp' },
    { id: '2', business_name: 'Smith LLC' },
    { id: '3', business_name: 'Davis Enterprises' }
  ]);
  
  const [isAddEntryOpen, setIsAddEntryOpen] = useState(false);
  
  const [currentTask, setCurrentTask] = useState({
    client_id: '',
    task_description: '',
    hourly_rate: 150,
    is_billable: true
  });

  const [newEntry, setNewEntry] = useState({
    client_id: '',
    task_description: '',
    hours_worked: 0,
    hourly_rate: 150,
    work_date: format(new Date(), 'yyyy-MM-dd'),
    is_billable: true
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTracking && startTime) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime.getTime()) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTracking, startTime]);

  const startTracking = () => {
    if (!currentTask.client_id || !currentTask.task_description) {
      toast({
        title: "Missing Information",
        description: "Please select a client and enter a task description",
        variant: "destructive",
      });
      return;
    }

    setStartTime(new Date());
    setIsTracking(true);
    setElapsedTime(0);
    
    toast({
      title: "Timer Started",
      description: "Time tracking has begun",
    });
  };

  const pauseTracking = () => {
    setIsTracking(false);
    toast({
      title: "Timer Paused",
      description: "Time tracking has been paused",
    });
  };

  const stopTracking = () => {
    if (!startTime) return;

    const hours = elapsedTime / 3600;
    
    const entry: TimeEntry = {
      id: Math.random().toString(36).substr(2, 9),
      client_id: currentTask.client_id,
      task_description: currentTask.task_description,
      hours_worked: hours,
      hourly_rate: currentTask.hourly_rate,
      work_date: format(new Date(), 'yyyy-MM-dd'),
      is_billable: currentTask.is_billable,
      status: 'draft',
      created_at: new Date().toISOString(),
      accountant_clients: { business_name: clients.find(c => c.id === currentTask.client_id)?.business_name || '' }
    };

    setTimeEntries(prev => [entry, ...prev]);
    setIsTracking(false);
    setStartTime(null);
    setElapsedTime(0);
    setCurrentTask({
      client_id: '',
      task_description: '',
      hourly_rate: 150,
      is_billable: true
    });

    toast({
      title: "Time Entry Saved",
      description: `Tracked ${hours.toFixed(2)} hours`,
    });
  };

  const addManualEntry = () => {
    if (!newEntry.client_id || !newEntry.task_description || newEntry.hours_worked <= 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const entry: TimeEntry = {
      id: Math.random().toString(36).substr(2, 9),
      ...newEntry,
      status: 'draft',
      created_at: new Date().toISOString(),
      accountant_clients: { business_name: clients.find(c => c.id === newEntry.client_id)?.business_name || '' }
    };

    setTimeEntries(prev => [entry, ...prev]);
    setIsAddEntryOpen(false);
    setNewEntry({
      client_id: '',
      task_description: '',
      hours_worked: 0,
      hourly_rate: 150,
      work_date: format(new Date(), 'yyyy-MM-dd'),
      is_billable: true
    });

    toast({
      title: "Time Entry Added",
      description: "Manual time entry has been added",
    });
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'billed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalHours = timeEntries.reduce((sum, entry) => sum + entry.hours_worked, 0);
  const totalValue = timeEntries.reduce((sum, entry) => sum + (entry.hours_worked * entry.hourly_rate), 0);
  const billableHours = timeEntries.filter(entry => entry.is_billable).reduce((sum, entry) => sum + entry.hours_worked, 0);

  return (
    <div className="space-y-6">
      {/* Active Timer */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Timer className="h-5 w-5" />
            Time Tracker
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-4xl font-mono font-bold text-primary mb-4">
              {formatTime(elapsedTime)}
            </div>
            {isTracking && currentTask.task_description && (
              <p className="text-muted-foreground mb-4">
                Working on: {currentTask.task_description}
              </p>
            )}
          </div>

          {!isTracking ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Client</Label>
                  <Select value={currentTask.client_id} onValueChange={(value) => setCurrentTask({...currentTask, client_id: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.business_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Hourly Rate</Label>
                  <Input
                    type="number"
                    value={currentTask.hourly_rate}
                    onChange={(e) => setCurrentTask({...currentTask, hourly_rate: Number(e.target.value)})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Task Description</Label>
                <Textarea
                  value={currentTask.task_description}
                  onChange={(e) => setCurrentTask({...currentTask, task_description: e.target.value})}
                  placeholder="What are you working on?"
                />
              </div>
              <Button onClick={startTracking} className="w-full">
                <Play className="h-4 w-4 mr-2" />
                Start Timer
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button onClick={pauseTracking} variant="outline" className="flex-1">
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
              <Button onClick={stopTracking} variant="destructive" className="flex-1">
                <Square className="h-4 w-4 mr-2" />
                Stop & Save
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHours.toFixed(1)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Billable Hours</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{billableHours.toFixed(1)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toFixed(0)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Entries */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Time Entries</CardTitle>
          <Dialog open={isAddEntryOpen} onOpenChange={setIsAddEntryOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Manual Entry
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Manual Time Entry</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Client</Label>
                    <Select value={newEntry.client_id} onValueChange={(value) => setNewEntry({...newEntry, client_id: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select client" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.business_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={newEntry.work_date}
                      onChange={(e) => setNewEntry({...newEntry, work_date: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Task Description</Label>
                  <Textarea
                    value={newEntry.task_description}
                    onChange={(e) => setNewEntry({...newEntry, task_description: e.target.value})}
                    placeholder="Describe the work performed"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Hours</Label>
                    <Input
                      type="number"
                      step="0.25"
                      value={newEntry.hours_worked}
                      onChange={(e) => setNewEntry({...newEntry, hours_worked: Number(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Hourly Rate</Label>
                    <Input
                      type="number"
                      value={newEntry.hourly_rate}
                      onChange={(e) => setNewEntry({...newEntry, hourly_rate: Number(e.target.value)})}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setIsAddEntryOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={addManualEntry}>
                  Add Entry
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {timeEntries.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{entry.accountant_clients?.business_name}</span>
                    <Badge className={getStatusColor(entry.status)}>
                      {entry.status}
                    </Badge>
                    {entry.is_billable && (
                      <Badge variant="outline">Billable</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{entry.task_description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(entry.work_date), 'MMM d, yyyy')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {entry.hours_worked.toFixed(2)}h
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      ${(entry.hours_worked * entry.hourly_rate).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {timeEntries.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No time entries yet. Start tracking time or add a manual entry.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}