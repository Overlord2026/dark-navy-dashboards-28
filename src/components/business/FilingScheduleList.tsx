import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, AlertTriangle, CheckCircle, Plus } from 'lucide-react';
import { FilingSchedule, BusinessEntity } from '@/hooks/useEntityManagement';

interface FilingScheduleListProps {
  filings: FilingSchedule[];
  entities: BusinessEntity[];
}

export const FilingScheduleList = ({ filings, entities }: FilingScheduleListProps) => {
  const getStatusColor = (status: string, dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const daysDiff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 3600 * 24));

    if (status === 'completed') return 'default';
    if (status === 'overdue' || daysDiff < 0) return 'destructive';
    if (daysDiff <= 7) return 'destructive';
    if (daysDiff <= 30) return 'secondary';
    return 'outline';
  };

  const getStatusIcon = (status: string, dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const daysDiff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 3600 * 24));

    if (status === 'completed') return CheckCircle;
    if (status === 'overdue' || daysDiff < 0) return AlertTriangle;
    if (daysDiff <= 7) return AlertTriangle;
    return Clock;
  };

  const getDaysDifference = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const daysDiff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 3600 * 24));
    
    if (daysDiff < 0) return `${Math.abs(daysDiff)} days overdue`;
    if (daysDiff === 0) return 'Due today';
    if (daysDiff === 1) return 'Due tomorrow';
    return `Due in ${daysDiff} days`;
  };

  const getEntityName = (entityId: string) => {
    const entity = entities.find(e => e.id === entityId);
    return entity?.entity_name || 'Unknown Entity';
  };

  const sortedFilings = [...filings].sort((a, b) => {
    // Sort by due date, then by status
    const dateA = new Date(a.due_date);
    const dateB = new Date(b.due_date);
    
    if (dateA.getTime() !== dateB.getTime()) {
      return dateA.getTime() - dateB.getTime();
    }
    
    const statusOrder = { 'overdue': 0, 'pending': 1, 'in_progress': 2, 'completed': 3 };
    return statusOrder[a.status] - statusOrder[b.status];
  });

  if (filings.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-semibold">No filing schedules</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Create entities first, then set up their filing schedules.
            </p>
            <div className="mt-6">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Filing Schedule
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filing Schedule</h3>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Filing
        </Button>
      </div>

      <div className="space-y-3">
        {sortedFilings.map((filing) => {
          const StatusIcon = getStatusIcon(filing.status, filing.due_date);
          
          return (
            <Card key={filing.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <StatusIcon className={`h-5 w-5 ${
                      filing.status === 'completed' ? 'text-green-600' :
                      getStatusColor(filing.status, filing.due_date) === 'destructive' ? 'text-destructive' :
                      'text-yellow-600'
                    }`} />
                    <div>
                      <h4 className="font-semibold">{filing.filing_name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {getEntityName(filing.entity_id)} • {filing.jurisdiction}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <Badge variant={getStatusColor(filing.status, filing.due_date)}>
                      {filing.status.replace('_', ' ')}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-1">
                      {getDaysDifference(filing.due_date)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>Due: {new Date(filing.due_date).toLocaleDateString()}</span>
                    <span>Frequency: {filing.frequency}</span>
                    {filing.estimated_hours && (
                      <span>Est. {filing.estimated_hours}h</span>
                    )}
                    {filing.estimated_cost && (
                      <span>${filing.estimated_cost}</span>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                    {filing.status !== 'completed' && (
                      <Button size="sm">
                        Mark Complete
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};