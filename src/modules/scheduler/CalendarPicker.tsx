import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, MapPin } from 'lucide-react';
import { format, isToday, isTomorrow, isThisWeek } from 'date-fns';

interface TimeWindow {
  id: string;
  start_time: string;
  end_time: string;
  timezone: string;
  max_bookings?: number;
  current_bookings: number;
  is_available: boolean;
}

interface CalendarPickerProps {
  windows: TimeWindow[];
  selectedWindowId?: string;
  onSelectWindow: (windowId: string) => void;
  isLoading?: boolean;
}

export function CalendarPicker({ 
  windows, 
  selectedWindowId, 
  onSelectWindow, 
  isLoading 
}: CalendarPickerProps) {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  const formatDateLabel = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    if (isThisWeek(date)) return format(date, 'EEEE');
    return format(date, 'MMM d');
  };

  const getAvailabilityStatus = (window: TimeWindow) => {
    if (!window.is_available) return 'unavailable';
    
    const maxBookings = window.max_bookings || 1;
    const spotsLeft = maxBookings - window.current_bookings;
    
    if (spotsLeft === 0) return 'full';
    if (spotsLeft <= maxBookings * 0.3) return 'limited';
    return 'available';
  };

  const getAvailabilityBadge = (window: TimeWindow) => {
    const status = getAvailabilityStatus(window);
    const maxBookings = window.max_bookings || 1;
    const spotsLeft = maxBookings - window.current_bookings;

    switch (status) {
      case 'unavailable':
        return <Badge variant="destructive">Unavailable</Badge>;
      case 'full':
        return <Badge variant="destructive">Fully Booked</Badge>;
      case 'limited':
        return <Badge variant="secondary">{spotsLeft} spot{spotsLeft > 1 ? 's' : ''} left</Badge>;
      default:
        return maxBookings > 1 ? (
          <Badge variant="outline">{spotsLeft} of {maxBookings} available</Badge>
        ) : (
          <Badge variant="outline">Available</Badge>
        );
    }
  };

  const availableWindows = windows.filter(w => 
    w.is_available && 
    (w.max_bookings || 1) > w.current_bookings &&
    new Date(w.start_time) > new Date()
  );

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Select a Time
        </CardTitle>
      </CardHeader>
      <CardContent>
        {availableWindows.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No available time slots</p>
            <p className="text-sm">Check back later or contact the athlete directly</p>
          </div>
        ) : (
          <div className="space-y-3">
            {availableWindows.map((window) => {
              const startDate = new Date(window.start_time);
              const endDate = new Date(window.end_time);
              const isSelected = selectedWindowId === window.id;
              const canBook = getAvailabilityStatus(window) !== 'full';

              return (
                <div
                  key={window.id}
                  className={`
                    p-4 rounded-lg border cursor-pointer transition-all
                    ${isSelected 
                      ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
                      : 'border-border hover:border-primary/50'
                    }
                    ${!canBook ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                  onClick={() => canBook && onSelectWindow(window.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">
                            {formatDateLabel(startDate)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {format(startDate, 'h:mm a')} - {format(endDate, 'h:mm a')}
                          </span>
                        </div>
                      </div>

                      <div className="text-sm text-muted-foreground">
                        {format(startDate, 'EEEE, MMMM d, yyyy')} • {window.timezone}
                      </div>

                      {(window.max_bookings || 1) > 1 && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          Group session
                        </div>
                      )}
                    </div>

                    <div className="ml-4">
                      {getAvailabilityBadge(window)}
                    </div>
                  </div>

                  {isSelected && (
                    <div className="mt-3 pt-3 border-t">
                      <div className="flex items-center gap-2 text-sm text-primary">
                        <MapPin className="h-4 w-4" />
                        Selected for booking
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}