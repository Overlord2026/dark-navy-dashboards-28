import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
  Plus, 
  MessageSquare, 
  Calendar,
  FileText,
  Phone,
  Mail,
  MoreHorizontal,
  CheckSquare
} from 'lucide-react';

interface CrmClientOverviewProps {
  isPremium?: boolean;
}

export const CrmClientOverview: React.FC<CrmClientOverviewProps> = ({ isPremium = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const clients = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah@email.com',
      phone: '(555) 123-4567',
      aum: '$1.2M',
      status: 'active',
      lastContact: '2024-01-15',
      nextAction: 'Quarterly Review',
      risk: 'Conservative',
      openTasks: 2,
      notes: 3
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'michael@email.com',
      phone: '(555) 234-5678',
      aum: '$850K',
      status: 'prospect',
      lastContact: '2024-01-12',
      nextAction: 'Follow-up Call',
      risk: 'Moderate',
      openTasks: 1,
      notes: 1
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      email: 'emily@email.com',
      phone: '(555) 345-6789',
      aum: '$2.1M',
      status: 'active',
      lastContact: '2024-01-10',
      nextAction: 'Estate Planning',
      risk: 'Aggressive',
      openTasks: 3,
      notes: 5
    }
  ];

  const recentTasks = [
    { id: 1, client: 'Sarah Johnson', task: 'Schedule quarterly review', due: '2024-01-20', priority: 'high' },
    { id: 2, client: 'Michael Chen', task: 'Send proposal documents', due: '2024-01-18', priority: 'medium' },
    { id: 3, client: 'Emily Rodriguez', task: 'Review estate planning docs', due: '2024-01-22', priority: 'high' }
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "outline"> = {
      active: 'default',
      prospect: 'secondary',
      inactive: 'outline'
    };
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: 'text-red-500',
      medium: 'text-yellow-500',
      low: 'text-green-500'
    };
    return colors[priority as keyof typeof colors];
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="clients" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="notes">Recent Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="clients" className="space-y-4">
          {/* Search and Filter */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Client
            </Button>
          </div>

          {/* Client List */}
          <div className="grid gap-4">
            {clients.map((client) => (
              <Card key={client.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary">
                          {client.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold">{client.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {client.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {client.phone}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="font-semibold">{client.aum}</div>
                        <div className="text-sm text-muted-foreground">{client.risk} Risk</div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm">{client.nextAction}</div>
                        <div className="text-xs text-muted-foreground">
                          Last contact: {new Date(client.lastContact).toLocaleDateString()}
                        </div>
                      </div>

                      {getStatusBadge(client.status)}

                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {client.openTasks} tasks
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {client.notes} notes
                        </Badge>
                      </div>

                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Calendar className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Upcoming Tasks</h3>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Task
            </Button>
          </div>

          <div className="grid gap-3">
            {recentTasks.map((task) => (
              <Card key={task.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckSquare className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{task.task}</div>
                        <div className="text-sm text-muted-foreground">
                          Client: {task.client}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`text-sm font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority.toUpperCase()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Due: {new Date(task.due).toLocaleDateString()}
                      </div>
                      <Button size="sm" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Recent Client Notes</h3>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Note
            </Button>
          </div>

          <div className="grid gap-3">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <FileText className="h-4 w-4 text-muted-foreground mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">Sarah Johnson</span>
                      <Badge variant="outline" className="text-xs">Meeting</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Discussed retirement planning goals and risk tolerance. Client interested in diversifying into real estate.
                    </p>
                    <div className="text-xs text-muted-foreground">
                      Jan 15, 2024 • 2:30 PM
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <FileText className="h-4 w-4 text-muted-foreground mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">Michael Chen</span>
                      <Badge variant="outline" className="text-xs">Call</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Follow-up on investment proposal. Client requested additional information on fees and performance metrics.
                    </p>
                    <div className="text-xs text-muted-foreground">
                      Jan 12, 2024 • 10:15 AM
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};