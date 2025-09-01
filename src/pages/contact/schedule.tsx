import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User } from 'lucide-react';

export default function SchedulePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/5">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <Calendar className="h-12 w-12 text-primary mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Schedule a Call</h1>
            <p className="text-muted-foreground">
              Connect with our licensed professionals for personalized guidance
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Available Time Slots</CardTitle>
              <CardDescription>
                Select a convenient time to speak with our team
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                {[
                  { time: "9:00 AM - 10:00 AM", date: "Today", available: true },
                  { time: "2:00 PM - 3:00 PM", date: "Today", available: false },
                  { time: "10:00 AM - 11:00 AM", date: "Tomorrow", available: true },
                  { time: "3:00 PM - 4:00 PM", date: "Tomorrow", available: true }
                ].map((slot, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{slot.time}</div>
                        <div className="text-sm text-muted-foreground">{slot.date}</div>
                      </div>
                    </div>
                    <Button 
                      variant={slot.available ? "default" : "secondary"} 
                      size="sm"
                      disabled={!slot.available}
                    >
                      {slot.available ? "Book Now" : "Unavailable"}
                    </Button>
                  </div>
                ))}
              </div>
              
              <div className="pt-4 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <User className="h-4 w-4" />
                  Licensed professionals available
                </div>
                <p className="text-xs text-muted-foreground">
                  All calls are conducted by licensed financial advisors, CPAs, or attorneys 
                  depending on your specific needs.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}