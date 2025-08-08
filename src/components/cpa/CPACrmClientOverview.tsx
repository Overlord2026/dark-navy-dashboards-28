import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Plus, 
  User, 
  Calendar, 
  FileText, 
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign
} from 'lucide-react';

interface CPACrmClientOverviewProps {
  isPremium?: boolean;
}

export const CPACrmClientOverview: React.FC<CPACrmClientOverviewProps> = ({ isPremium }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedClient, setSelectedClient] = useState<number | null>(null);

  const clients = [
    {
      id: 1,
      name: 'Johnson Family Trust',
      type: 'Individual',
      status: 'Active',
      nextDeadline: '2024-04-15',
      services: ['Tax Prep', 'Planning'],
      revenue: '$12,500',
      lastContact: '2024-03-10',
      priority: 'High'
    },
    {
      id: 2,
      name: 'TechStart LLC',
      type: 'Business',
      status: 'Active',
      nextDeadline: '2024-03-15',
      services: ['Corporate Tax', 'Bookkeeping'],
      revenue: '$8,750',
      lastContact: '2024-03-08',
      priority: 'Medium'
    },
    {
      id: 3,
      name: 'Sarah Mitchell',
      type: 'Individual',
      status: 'Pending',
      nextDeadline: '2024-04-01',
      services: ['Tax Prep'],
      revenue: '$850',
      lastContact: '2024-03-05',
      priority: 'Low'
    }
  ];

  const tasks = [
    { id: 1, client: 'Johnson Family Trust', task: 'Review Q4 statements', due: '2024-03-15', priority: 'High' },
    { id: 2, client: 'TechStart LLC', task: 'Prepare quarterly filing', due: '2024-03-20', priority: 'Medium' },
    { id: 3, client: 'Sarah Mitchell', task: 'Follow up on documents', due: '2024-03-18', priority: 'Low' }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      'Active': 'default',
      'Pending': 'secondary',
      'Inactive': 'outline'
    } as const;
    return <Badge variant={variants[status as keyof typeof variants] || 'outline'}>{status}</Badge>;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'High': 'text-red-600',
      'Medium': 'text-yellow-600',
      'Low': 'text-green-600'
    };
    return colors[priority as keyof typeof colors] || 'text-gray-600';
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || client.status.toLowerCase() === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <Tabs defaultValue="clients" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="clients">Client Overview</TabsTrigger>
          <TabsTrigger value="tasks">Tasks & Deadlines</TabsTrigger>
          <TabsTrigger value="notes">Quick Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="clients" className="space-y-4">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clients</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Client
            </Button>
          </div>

          <div className="grid gap-4">
            {filteredClients.map((client) => (
              <motion.div
                key={client.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="cursor-pointer"
                onClick={() => setSelectedClient(client.id)}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{client.name}</CardTitle>
                          <CardDescription>{client.type} • Last contact: {client.lastContact}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(client.status)}
                        <Badge variant="outline" className={getPriorityColor(client.priority)}>
                          {client.priority}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Next Deadline</div>
                        <div className="font-medium flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {client.nextDeadline}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Services</div>
                        <div className="font-medium">{client.services.join(', ')}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Revenue</div>
                        <div className="font-medium flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          {client.revenue}
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Upcoming Tasks & Deadlines</h3>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Task
            </Button>
          </div>

          <div className="grid gap-3">
            {tasks.map((task) => (
              <Card key={task.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        task.priority === 'High' ? 'bg-red-100' : 
                        task.priority === 'Medium' ? 'bg-yellow-100' : 'bg-green-100'
                      }`}>
                        <AlertCircle className={`h-4 w-4 ${getPriorityColor(task.priority)}`} />
                      </div>
                      <div>
                        <div className="font-medium">{task.task}</div>
                        <div className="text-sm text-muted-foreground">{task.client}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-sm">
                        <div className="text-muted-foreground">Due</div>
                        <div className="font-medium">{task.due}</div>
                      </div>
                      <Button variant="outline" size="sm">
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quick Client Notes</CardTitle>
              <CardDescription>Add notes for client follow-ups and important reminders</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id.toString()}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Textarea
                placeholder="Enter your note..."
                className="min-h-[100px]"
              />
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Auto-saved
                </div>
                <Button>Save Note</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};