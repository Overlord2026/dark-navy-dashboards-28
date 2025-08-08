import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Video, Calendar as CalendarIcon, Clock, Shield, CheckCircle2 } from 'lucide-react';
import { getStateCompliance } from '../stateCompliance';
import { useEstateRequests } from '../hooks/useEstateRequests';

interface NotarySchedulerProps {
  requestId: string;
  stateCode: string;
  className?: string;
}

export const NotaryScheduler: React.FC<NotarySchedulerProps> = ({
  requestId,
  stateCode,
  className = ''
}) => {
  const { createNotarySession } = useEstateRequests();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const [sessionType, setSessionType] = useState<'notary' | 'witness'>('notary');
  const [loading, setLoading] = useState(false);

  const compliance = getStateCompliance(stateCode);
  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', 
    '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];

  const handleSchedule = async () => {
    if (!selectedDate || !selectedTime) return;
    
    setLoading(true);
    try {
      const scheduledDateTime = new Date(selectedDate);
      const [time, period] = selectedTime.split(' ');
      const [hours, minutes] = time.split(':');
      let hour = parseInt(hours);
      
      if (period === 'PM' && hour !== 12) hour += 12;
      if (period === 'AM' && hour === 12) hour = 0;
      
      scheduledDateTime.setHours(hour, parseInt(minutes || '0'));
      
      await createNotarySession(requestId, sessionType, scheduledDateTime.toISOString());
    } finally {
      setLoading(false);
    }
  };

  if (!compliance) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">
            State compliance information not available for {stateCode}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="h-5 w-5" />
          Schedule Notary Session
        </CardTitle>
        <div className="space-y-2">
          <Badge variant="secondary" className="w-fit">
            {stateCode} Requirements
          </Badge>
          <div className="text-sm text-muted-foreground space-y-1">
            {compliance.ronAllowed && (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Remote Online Notarization (RON) Available</span>
              </div>
            )}
            {compliance.rinAllowed && (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Remote In-Person Notarization (RIN) Available</span>
              </div>
            )}
            {compliance.wetSignatureRequired && (
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-orange-500" />
                <span>Wet Signature Required</span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Session Type Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Session Type</label>
          <Select value={sessionType} onValueChange={(value: 'notary' | 'witness') => setSessionType(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="notary">Notary Session</SelectItem>
              <SelectItem value="witness">Witness Session</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            Select Date
          </label>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
            className="rounded-md border"
          />
        </div>

        {/* Time Selection */}
        {selectedDate && (
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Select Time
            </label>
            <div className="grid grid-cols-2 gap-2">
              {timeSlots.map((time) => (
                <Button
                  key={time}
                  variant={selectedTime === time ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedTime(time)}
                >
                  {time}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Provider Information */}
        <div className="p-4 bg-muted/50 rounded-lg space-y-2">
          <h4 className="font-medium">Session Details</h4>
          <div className="text-sm space-y-1">
            <p><span className="text-muted-foreground">Provider:</span> DocuSign Notary</p>
            <p><span className="text-muted-foreground">Type:</span> {compliance.ronAllowed ? 'Remote Online' : 'Remote In-Person'}</p>
            <p><span className="text-muted-foreground">Duration:</span> 30-45 minutes</p>
            <p><span className="text-muted-foreground">Recording:</span> Session will be recorded for compliance</p>
          </div>
        </div>

        {/* Schedule Button */}
        <Button 
          className="w-full" 
          onClick={handleSchedule}
          disabled={!selectedDate || !selectedTime || loading}
        >
          {loading ? 'Scheduling...' : 'Schedule Session'}
        </Button>

        {/* Important Notes */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Valid government-issued ID required</p>
          <p>• Stable internet connection recommended</p>
          <p>• Session can be rescheduled up to 2 hours before start time</p>
          {compliance.witnessesRequired > 0 && (
            <p>• {compliance.witnessesRequired} witnesses will also need to attend</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};