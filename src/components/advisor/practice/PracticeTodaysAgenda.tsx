import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Clock, 
  CheckSquare, 
  AlertTriangle, 
  User,
  Phone,
  Video
} from 'lucide-react';

export function PracticeTodaysAgenda() {
  const todaysItems = [
    {
      type: 'meeting',
      time: '10:00 AM',
      title: 'Annual Review - Johnson Family',
      description: 'Portfolio review and rebalancing discussion',
      priority: 'high',
      icon: Video,
      status: 'upcoming'
    },
    {
      type: 'task',
      time: '2:00 PM',
      title: 'Complete RMD Calculations',
      description: '5 clients requiring RMD calculations',
      priority: 'medium',
      icon: CheckSquare,
      status: 'pending'
    },
    {
      type: 'deadline',
      time: 'Today',
      title: 'Compliance Documentation',
      description: 'Submit quarterly compliance report',
      priority: 'high',
      icon: AlertTriangle,
      status: 'urgent'
    },
    {
      type: 'meeting',
      time: '4:30 PM',
      title: 'Prospect Call - Sarah Chen',
      description: 'Initial consultation for investment advisory',
      priority: 'medium',
      icon: Phone,
      status: 'upcoming'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'urgent': return <Badge variant="destructive">Urgent</Badge>;
      case 'upcoming': return <Badge variant="default">Upcoming</Badge>;
      case 'pending': return <Badge variant="secondary">Pending</Badge>;
      default: return <Badge variant="outline">Scheduled</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Today's Agenda
        </CardTitle>
        <Button variant="outline" size="sm">
          View Full Calendar
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {todaysItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="flex items-start gap-4 p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-1 h-12 rounded-full ${getPriorityColor(item.priority)}`} />
                  <div className="p-2 rounded-full bg-muted">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="font-medium text-sm truncate">{item.title}</h4>
                    {getStatusBadge(item.status)}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{item.time}</span>
                  </div>
                </div>

                <Button variant="ghost" size="sm">
                  View
                </Button>
              </div>
            );
          })}
        </div>
        
        {todaysItems.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No items scheduled for today</p>
            <Button variant="outline" size="sm" className="mt-3">
              Add Task or Meeting
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}