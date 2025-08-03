import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Users, 
  Plus, 
  Calendar as CalendarIcon, 
  Heart, 
  Clock, 
  Gift,
  Settings,
  Bell,
  Mail,
  Smartphone,
  AlertCircle,
  Check,
  X,
  Edit
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface Recipient {
  id: string;
  name: string;
  email: string;
  relationship: string;
  notificationPreferences: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  deliveryEvents: DeliveryEvent[];
}

interface DeliveryEvent {
  id: string;
  type: 'birthday' | 'anniversary' | 'graduation' | 'milestone_age' | 'custom_date' | 'upon_death';
  title: string;
  description?: string;
  triggerDate?: Date;
  recurrence?: 'none' | 'yearly' | 'custom';
  conditions?: Record<string, any>;
  status: 'active' | 'paused' | 'completed';
  messageIds: string[];
}

interface LegacyCircleManagerProps {
  vaultId: string;
  currentMembers: any[];
}

export function LegacyCircleManager({ vaultId, currentMembers }: LegacyCircleManagerProps) {
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [showAddRecipientDialog, setShowAddRecipientDialog] = useState(false);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(null);
  const [newRecipient, setNewRecipient] = useState({
    name: '',
    email: '',
    relationship: '',
    notificationPreferences: {
      email: true,
      sms: false,
      push: true
    }
  });
  const [newEvent, setNewEvent] = useState({
    type: 'birthday' as DeliveryEvent['type'],
    title: '',
    description: '',
    triggerDate: undefined as Date | undefined,
    recurrence: 'yearly' as DeliveryEvent['recurrence'],
    conditions: {}
  });
  
  const { toast } = useToast();

  const relationshipTypes = [
    'Child',
    'Grandchild',
    'Spouse/Partner',
    'Sibling',
    'Parent',
    'Close Friend',
    'Extended Family',
    'Professional Contact',
    'Other'
  ];

  const eventTypes = [
    { id: 'birthday', label: 'Birthday', icon: Gift },
    { id: 'anniversary', label: 'Anniversary', icon: Heart },
    { id: 'graduation', label: 'Graduation', icon: Clock },
    { id: 'milestone_age', label: 'Milestone Age', icon: CalendarIcon },
    { id: 'custom_date', label: 'Custom Date', icon: CalendarIcon },
    { id: 'upon_death', label: 'Upon Death', icon: AlertCircle }
  ];

  const handleAddRecipient = () => {
    if (!newRecipient.name.trim() || !newRecipient.email.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const recipient: Recipient = {
      id: Date.now().toString(),
      ...newRecipient,
      deliveryEvents: []
    };

    setRecipients(prev => [...prev, recipient]);
    setNewRecipient({
      name: '',
      email: '',
      relationship: '',
      notificationPreferences: {
        email: true,
        sms: false,
        push: true
      }
    });
    setShowAddRecipientDialog(false);

    toast({
      title: "Recipient Added",
      description: `${recipient.name} has been added to your Legacy Circle.`,
    });
  };

  const handleAddEvent = () => {
    if (!selectedRecipient || !newEvent.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const event: DeliveryEvent = {
      id: Date.now().toString(),
      type: newEvent.type,
      title: newEvent.title,
      description: newEvent.description,
      triggerDate: newEvent.triggerDate,
      recurrence: newEvent.recurrence,
      conditions: newEvent.conditions,
      status: 'active',
      messageIds: []
    };

    setRecipients(prev => prev.map(recipient => 
      recipient.id === selectedRecipient.id
        ? { ...recipient, deliveryEvents: [...recipient.deliveryEvents, event] }
        : recipient
    ));

    setNewEvent({
      type: 'birthday',
      title: '',
      description: '',
      triggerDate: undefined,
      recurrence: 'yearly',
      conditions: {}
    });
    setShowEventDialog(false);

    toast({
      title: "Delivery Event Added",
      description: `"${event.title}" has been scheduled for ${selectedRecipient.name}.`,
    });
  };

  const getEventTypeIcon = (type: string) => {
    const eventType = eventTypes.find(et => et.id === type);
    if (eventType) {
      const IconComponent = eventType.icon;
      return <IconComponent className="h-4 w-4" />;
    }
    return <CalendarIcon className="h-4 w-4" />;
  };

  const getEventStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'paused':
        return 'bg-yellow-100 text-yellow-700';
      case 'completed':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatEventTrigger = (event: DeliveryEvent) => {
    switch (event.type) {
      case 'birthday':
        return event.triggerDate ? `Every ${format(event.triggerDate, 'MMMM do')}` : 'Birthday (date not set)';
      case 'anniversary':
        return event.triggerDate ? `Every ${format(event.triggerDate, 'MMMM do')}` : 'Anniversary (date not set)';
      case 'custom_date':
        return event.triggerDate ? format(event.triggerDate, 'PPP') : 'Custom date (not set)';
      case 'milestone_age':
        return `At age ${(event.conditions as any)?.age || 'TBD'}`;
      case 'upon_death':
        return 'Upon death notification';
      default:
        return event.title;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Legacy Circle</h2>
          <p className="text-muted-foreground">
            Manage recipients and delivery events for your family messages and memories.
          </p>
        </div>
        
        <Dialog open={showAddRecipientDialog} onOpenChange={setShowAddRecipientDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Recipient
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Legacy Circle Recipient</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter full name"
                  value={newRecipient.name}
                  onChange={(e) => setNewRecipient(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  value={newRecipient.email}
                  onChange={(e) => setNewRecipient(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Relationship</Label>
                <Select 
                  value={newRecipient.relationship} 
                  onValueChange={(value) => setNewRecipient(prev => ({ ...prev, relationship: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    {relationshipTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-3">
                <Label>Notification Preferences</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <Label htmlFor="email-notif">Email Notifications</Label>
                    </div>
                    <Switch
                      id="email-notif"
                      checked={newRecipient.notificationPreferences.email}
                      onCheckedChange={(checked) => 
                        setNewRecipient(prev => ({
                          ...prev,
                          notificationPreferences: { ...prev.notificationPreferences, email: checked }
                        }))
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      <Label htmlFor="sms-notif">SMS Notifications</Label>
                    </div>
                    <Switch
                      id="sms-notif"
                      checked={newRecipient.notificationPreferences.sms}
                      onCheckedChange={(checked) => 
                        setNewRecipient(prev => ({
                          ...prev,
                          notificationPreferences: { ...prev.notificationPreferences, sms: checked }
                        }))
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      <Label htmlFor="push-notif">Push Notifications</Label>
                    </div>
                    <Switch
                      id="push-notif"
                      checked={newRecipient.notificationPreferences.push}
                      onCheckedChange={(checked) => 
                        setNewRecipient(prev => ({
                          ...prev,
                          notificationPreferences: { ...prev.notificationPreferences, push: checked }
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowAddRecipientDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddRecipient}>
                  Add Recipient
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Current Recipients */}
      <div className="grid gap-6">
        {recipients.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Legacy Circle Recipients</h3>
              <p className="text-muted-foreground mb-4">
                Add family members, friends, or loved ones who should receive your messages and memories.
              </p>
              <Button onClick={() => setShowAddRecipientDialog(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Your First Recipient
              </Button>
            </CardContent>
          </Card>
        ) : (
          recipients.map((recipient) => (
            <Card key={recipient.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-gold to-emerald rounded-full flex items-center justify-center text-navy font-medium text-lg">
                      {recipient.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{recipient.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{recipient.email}</p>
                      {recipient.relationship && (
                        <Badge variant="outline" className="mt-1">
                          {recipient.relationship}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {recipient.notificationPreferences.email && <Mail className="h-4 w-4 text-green-500" />}
                      {recipient.notificationPreferences.sms && <Smartphone className="h-4 w-4 text-blue-500" />}
                      {recipient.notificationPreferences.push && <Bell className="h-4 w-4 text-purple-500" />}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedRecipient(recipient);
                        setShowEventDialog(true);
                      }}
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Event
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-3">Delivery Events ({recipient.deliveryEvents.length})</h4>
                    {recipient.deliveryEvents.length === 0 ? (
                      <p className="text-sm text-muted-foreground italic">
                        No delivery events configured. Add events to schedule when messages will be delivered.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {recipient.deliveryEvents.map((event) => (
                          <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-full ${getEventStatusColor(event.status)}`}>
                                {getEventTypeIcon(event.type)}
                              </div>
                              <div>
                                <p className="font-medium text-sm">{event.title}</p>
                                <p className="text-xs text-muted-foreground">
                                  {formatEventTrigger(event)}
                                </p>
                                {event.description && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {event.description}
                                  </p>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Badge 
                                variant="outline" 
                                className={cn("text-xs", getEventStatusColor(event.status))}
                              >
                                {event.status}
                              </Badge>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Add Event Dialog */}
      <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Delivery Event</DialogTitle>
          </DialogHeader>
          
          {selectedRecipient && (
            <div className="space-y-4">
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm">
                  Adding delivery event for <strong>{selectedRecipient.name}</strong>
                </p>
              </div>
              
              <div className="space-y-2">
                <Label>Event Type</Label>
                <div className="grid grid-cols-2 gap-3">
                  {eventTypes.map((eventType) => {
                    const IconComponent = eventType.icon;
                    const isSelected = newEvent.type === eventType.id;
                    
                    return (
                      <Card 
                        key={eventType.id}
                        className={cn(
                          "cursor-pointer transition-all",
                          isSelected ? "ring-2 ring-gold" : ""
                        )}
                        onClick={() => setNewEvent(prev => ({ ...prev, type: eventType.id as DeliveryEvent['type'] }))}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center gap-2">
                            <IconComponent className="h-4 w-4" />
                            <span className="text-sm font-medium">{eventType.label}</span>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="event-title">Event Title *</Label>
                <Input
                  id="event-title"
                  placeholder="e.g., 18th Birthday Message"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="event-description">Description</Label>
                <Textarea
                  id="event-description"
                  placeholder="Optional description of this delivery event"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                  rows={2}
                />
              </div>
              
              {(newEvent.type === 'birthday' || newEvent.type === 'anniversary' || newEvent.type === 'custom_date') && (
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !newEvent.triggerDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newEvent.triggerDate ? format(newEvent.triggerDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newEvent.triggerDate}
                        onSelect={(date) => setNewEvent(prev => ({ ...prev, triggerDate: date }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}
              
              {newEvent.type === 'milestone_age' && (
                <div className="space-y-2">
                  <Label htmlFor="milestone-age">Milestone Age</Label>
                  <Input
                    id="milestone-age"
                    type="number"
                    placeholder="e.g., 18, 21, 30, 50"
                    value={newEvent.conditions?.age?.toString() || ''}
                    onChange={(e) => setNewEvent(prev => ({
                      ...prev,
                      conditions: { ...prev.conditions, age: parseInt(e.target.value) || undefined }
                    }))}
                  />
                </div>
              )}
              
              {newEvent.type !== 'upon_death' && newEvent.type !== 'custom_date' && (
                <div className="space-y-2">
                  <Label>Recurrence</Label>
                  <Select 
                    value={newEvent.recurrence} 
                    onValueChange={(value: DeliveryEvent['recurrence']) => 
                      setNewEvent(prev => ({ ...prev, recurrence: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">One-time event</SelectItem>
                      <SelectItem value="yearly">Every year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowEventDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddEvent}>
                  Add Event
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}