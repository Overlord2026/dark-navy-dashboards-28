import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, AlertTriangle, CheckCircle, Plus, Filter } from 'lucide-react';

export const ComplianceWorkflow: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const workflowItems = [
    {
      id: 1,
      title: 'ADV Part 2 Annual Update',
      type: 'SEC/FINRA',
      priority: 'high',
      status: 'overdue',
      dueDate: '2024-01-15',
      assignedTo: 'Sarah Johnson',
      description: 'Annual disclosure document update and filing'
    },
    {
      id: 2,
      title: 'Privacy Policy CCPA Update',
      type: 'State',
      priority: 'medium',
      status: 'in_progress',
      dueDate: '2024-02-01',
      assignedTo: 'Mike Chen',
      description: 'Update privacy policy for California compliance'
    },
    {
      id: 3,
      title: 'AML Training Q1 2024',
      type: 'Training',
      priority: 'medium',
      status: 'upcoming',
      dueDate: '2024-03-15',
      assignedTo: 'All Staff',
      description: 'Quarterly anti-money laundering training'
    },
    {
      id: 4,
      title: 'Client File Audit',
      type: 'Internal',
      priority: 'low',
      status: 'scheduled',
      dueDate: '2024-02-15',
      assignedTo: 'Compliance Team',
      description: 'Monthly client file completeness review'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'overdue':
        return <Badge variant="destructive">Overdue</Badge>;
      case 'in_progress':
        return <Badge variant="default">In Progress</Badge>;
      case 'upcoming':
        return <Badge variant="outline">Upcoming</Badge>;
      case 'scheduled':
        return <Badge variant="secondary">Scheduled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-destructive';
      case 'medium':
        return 'text-warning';
      case 'low':
        return 'text-muted-foreground';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-bold">Compliance Workflow</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button size="sm" className="btn-primary-gold">
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>
      </div>

      <Tabs defaultValue="calendar" className="space-y-4">
        <TabsList>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar">
          <Card className="premium-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Compliance Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {workflowItems.map((item) => (
                  <Card key={item.id} className="border-l-4 border-l-primary">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-sm">{item.title}</h4>
                        {getStatusBadge(item.status)}
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs">
                          <Clock className="h-3 w-3" />
                          <span>Due: {new Date(item.dueDate).toLocaleDateString()}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs">
                          <AlertTriangle className={`h-3 w-3 ${getPriorityColor(item.priority)}`} />
                          <span className="capitalize">{item.priority} Priority</span>
                        </div>
                        
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                        
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-xs text-muted-foreground">
                            Assigned: {item.assignedTo}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {item.type}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="kanban">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {['Upcoming', 'In Progress', 'Under Review', 'Completed'].map((column) => (
              <Card key={column} className="premium-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">{column}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {workflowItems
                    .filter(item => {
                      if (column === 'Upcoming') return item.status === 'upcoming' || item.status === 'scheduled';
                      if (column === 'In Progress') return item.status === 'in_progress';
                      if (column === 'Under Review') return item.status === 'overdue';
                      return false;
                    })
                    .map((item) => (
                      <Card key={item.id} className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="p-3">
                          <h5 className="font-medium text-sm mb-2">{item.title}</h5>
                          <div className="flex items-center justify-between">
                            {getStatusBadge(item.status)}
                            <span className="text-xs text-muted-foreground">
                              {new Date(item.dueDate).toLocaleDateString()}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="list">
          <Card className="premium-card">
            <CardHeader>
              <CardTitle>All Compliance Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workflowItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <CheckCircle className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <h4 className="font-medium">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">{item.assignedTo}</p>
                        <p className="text-xs text-muted-foreground">
                          Due: {new Date(item.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                      {getStatusBadge(item.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};