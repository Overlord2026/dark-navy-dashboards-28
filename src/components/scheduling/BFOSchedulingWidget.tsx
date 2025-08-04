import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Video, Phone, Users, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format, addDays, parseISO } from 'date-fns';
import { bfoSchedulingService, SchedulingSlot, MeetingRequest } from '@/services/scheduling/BFOSchedulingService';
import { MeetingProvider } from '@/types/integrations';

interface BFOSchedulingWidgetProps {
  advisorId: string;
  advisorName: string;
  onMeetingScheduled?: (meeting: any) => void;
  className?: string;
}

export function BFOSchedulingWidget({ 
  advisorId, 
  advisorName, 
  onMeetingScheduled, 
  className = "" 
}: BFOSchedulingWidgetProps) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<'type' | 'time' | 'details' | 'confirm'>('type');
  const [selectedMeetingType, setSelectedMeetingType] = useState<MeetingProvider>('google_meet');
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [selectedSlot, setSelectedSlot] = useState<SchedulingSlot | null>(null);
  const [availableSlots, setAvailableSlots] = useState<SchedulingSlot[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [clientDetails, setClientDetails] = useState({
    name: '',
    email: '',
    phone: '',
    agenda: ''
  });

  const meetingTypesList = [
    { type: 'google_meet' as MeetingProvider, name: 'Google Meet', description: 'Video call via Google Meet', recommended: true },
    { type: 'zoom' as MeetingProvider, name: 'Zoom', description: 'Video call via Zoom', recommended: false },
    { type: 'teams' as MeetingProvider, name: 'Microsoft Teams', description: 'Video call via Teams', recommended: false }
  ];

  useEffect(() => {
    loadAvailableSlots();
  }, [selectedDate, advisorId]);

  const loadAvailableSlots = async () => {
    try {
      setLoading(true);
      const slots = await bfoSchedulingService.getAvailableSlots(advisorId, selectedDate);
      setAvailableSlots(slots.filter(slot => slot.available));
    } catch (error) {
      console.error('Error loading slots:', error);
      toast({
        title: "Error",
        description: "Failed to load available times",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleMeeting = async () => {
    if (!selectedSlot) return;

    try {
      setLoading(true);
      const request: MeetingRequest = {
        clientName: clientDetails.name,
        clientEmail: clientDetails.email,
        advisorId,
        selectedSlot,
        meetingType: selectedMeetingType,
        agenda: clientDetails.agenda,
        phoneNumber: clientDetails.phone
      };

      const meeting = await bfoSchedulingService.scheduleMeeting(request);
      
      toast({
        title: "Meeting Scheduled! ✅",
        description: `Your ${selectedMeetingType.replace('_', ' ')} with ${advisorName} is confirmed for ${format(parseISO(selectedSlot.start), 'MMM d, h:mm a')}`,
      });

      onMeetingScheduled?.(meeting);
      resetForm();
    } catch (error) {
      console.error('Error scheduling meeting:', error);
      toast({
        title: "Error",
        description: "Failed to schedule meeting. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCurrentStep('type');
    setSelectedSlot(null);
    setClientDetails({ name: '', email: '', phone: '', agenda: '' });
  };

  const getNextWeekDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      dates.push(addDays(new Date(), i));
    }
    return dates;
  };

  return (
    <Card className={`w-full max-w-2xl mx-auto ${className}`}>
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <span className="text-sm font-medium text-primary">BFO Scheduling</span>
        </div>
        <CardTitle className="text-xl">Schedule with {advisorName}</CardTitle>
        <p className="text-sm text-muted-foreground">
          Powered by BFO's intelligent scheduling engine
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Meeting Type Selection */}
        {currentStep === 'type' && (
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-3">Choose Meeting Type</h3>
              <div className="space-y-3">
                {meetingTypesList.map((type) => (
                  <div
                    key={type.type}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedMeetingType === type.type 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedMeetingType(type.type)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          {type.type === 'google_meet' && <Video className="h-4 w-4" />}
                          {type.type === 'zoom' && <Video className="h-4 w-4" />}
                          {type.type === 'teams' && <Users className="h-4 w-4" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{type.name}</span>
                            {type.recommended && (
                              <Badge variant="secondary" className="flex items-center gap-1">
                                <Star className="h-3 w-3" />
                                Recommended
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{type.description}</p>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        selectedMeetingType === type.type 
                          ? 'border-primary bg-primary' 
                          : 'border-border'
                      }`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <Button 
              onClick={() => setCurrentStep('time')} 
              className="w-full"
            >
              Continue to Time Selection
            </Button>
          </div>
        )}

        {/* Date and Time Selection */}
        {currentStep === 'time' && (
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-3">Select Date</h3>
              <div className="grid grid-cols-7 gap-2">
                {getNextWeekDates().map((date) => (
                  <Button
                    key={date.toISOString()}
                    variant={selectedDate === format(date, 'yyyy-MM-dd') ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedDate(format(date, 'yyyy-MM-dd'))}
                    className="flex flex-col gap-1 h-auto py-2"
                  >
                    <span className="text-xs">{format(date, 'EEE')}</span>
                    <span className="font-medium">{format(date, 'd')}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">Available Times</h3>
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading available times...
                </div>
              ) : availableSlots.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {availableSlots.map((slot) => (
                    <Button
                      key={slot.id}
                      variant={selectedSlot?.id === slot.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedSlot(slot)}
                      className="flex items-center gap-1"
                    >
                      <Clock className="h-3 w-3" />
                      {format(parseISO(slot.start), 'h:mm a')}
                    </Button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No available times for this date
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setCurrentStep('type')}>
                Back
              </Button>
              <Button 
                onClick={() => setCurrentStep('details')} 
                disabled={!selectedSlot}
                className="flex-1"
              >
                Continue to Details
              </Button>
            </div>
          </div>
        )}

        {/* Client Details */}
        {currentStep === 'details' && (
          <div className="space-y-4">
            <h3 className="font-medium">Your Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={clientDetails.name}
                  onChange={(e) => setClientDetails({...clientDetails, name: e.target.value})}
                  placeholder="Your name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={clientDetails.email}
                  onChange={(e) => setClientDetails({...clientDetails, email: e.target.value})}
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={clientDetails.phone}
                onChange={(e) => setClientDetails({...clientDetails, phone: e.target.value})}
                placeholder="(555) 123-4567"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="agenda">Meeting Agenda (Optional)</Label>
              <Textarea
                id="agenda"
                value={clientDetails.agenda}
                onChange={(e) => setClientDetails({...clientDetails, agenda: e.target.value})}
                placeholder="What would you like to discuss?"
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setCurrentStep('time')}>
                Back
              </Button>
              <Button 
                onClick={() => setCurrentStep('confirm')} 
                disabled={!clientDetails.name || !clientDetails.email}
                className="flex-1"
              >
                Review & Confirm
              </Button>
            </div>
          </div>
        )}

        {/* Confirmation */}
        {currentStep === 'confirm' && selectedSlot && (
          <div className="space-y-4">
            <h3 className="font-medium">Confirm Your Meeting</h3>
            
            <div className="bg-muted/50 p-4 rounded-lg space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Advisor:</span>
                <span className="font-medium">{advisorName}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date & Time:</span>
                <span className="font-medium">
                  {format(parseISO(selectedSlot.start), 'MMM d, yyyy h:mm a')}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duration:</span>
                <span className="font-medium">{selectedSlot.duration} minutes</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Meeting Type:</span>
                <span className="font-medium">
                  {meetingTypesList.find(t => t.type === selectedMeetingType)?.name}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Your Name:</span>
                <span className="font-medium">{clientDetails.name}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span className="font-medium">{clientDetails.email}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setCurrentStep('details')}>
                Back
              </Button>
              <Button 
                onClick={handleScheduleMeeting} 
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Scheduling...' : 'Confirm Meeting'}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}