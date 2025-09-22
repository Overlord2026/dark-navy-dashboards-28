import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  Plus, 
  Calendar, 
  FileText, 
  MessageSquare, 
  Clock, 
  AlertCircle,
  CheckCircle,
  Search,
  Filter
} from 'lucide-react';
import { useProfessionalTeams } from '@/hooks/useProfessionalTeams';

export function ClientCoordinationPanel() {
  const { assignments, professionals, loading } = useProfessionalTeams();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Group assignments by client
  const clientGroups = assignments.reduce((groups, assignment) => {
    if (!groups[assignment.clientId]) {
      groups[assignment.clientId] = {
        clientName: assignment.clientName,
        clientId: assignment.clientId,
        professionals: []
      };
    }
    groups[assignment.clientId].professionals.push(assignment);
    return groups;
  }, {} as Record<string, { clientName: string; clientId: string; professionals: typeof assignments }>);

  const filteredClients = Object.values(clientGroups).filter(client => {
    const matchesSearch = client.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
      client.professionals.some(p => p.status === statusFilter);
    const matchesType = typeFilter === 'all' || 
      client.professionals.some(p => p.professionalType.includes(typeFilter));
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'completed': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getProfessionalTypeIcon = (type: string) => {
    if (type.includes('Tax') || type.includes('Accountant')) return '🧮';
    if (type.includes('Estate') || type.includes('Attorney')) return '⚖️';
    if (type.includes('Insurance')) return '🛡️';
    if (type.includes('Financial') || type.includes('Advisor')) return '📊';
    return '👤';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-6 bg-muted rounded mb-4"></div>
                <div className="h-32 bg-muted rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Client Coordination</h2>
          <p className="text-muted-foreground">Manage multi-professional client teams</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Professional
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search clients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Tax">Tax Professional</SelectItem>
                <SelectItem value="Estate">Estate Attorney</SelectItem>
                <SelectItem value="Insurance">Insurance Specialist</SelectItem>
                <SelectItem value="Financial">Financial Advisor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Client Teams */}
      <div className="space-y-4">
        {filteredClients.map((client) => (
          <Card key={client.clientId}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {client.clientName}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {client.professionals.length} professionals
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Message Team
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Calendar className="h-4 w-4 mr-1" />
                    Schedule Meeting
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Professional Team */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {client.professionals.map((assignment) => (
                  <div key={assignment.id} className="p-4 border rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>
                            {getInitials(assignment.professionalName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -top-1 -right-1 text-lg">
                          {getProfessionalTypeIcon(assignment.professionalType)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm truncate">
                            {assignment.professionalName}
                          </h4>
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(assignment.status)}`} />
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">
                          {assignment.professionalType}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          Assigned {new Date(assignment.assignedDate).toLocaleDateString()}
                        </div>
                        {assignment.notes && (
                          <p className="text-xs text-muted-foreground mt-2 p-2 bg-muted rounded">
                            {assignment.notes}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3 pt-3 border-t">
                      <Badge 
                        variant={assignment.status === 'active' ? 'default' : 
                               assignment.status === 'pending' ? 'secondary' : 'outline'}
                        className="text-xs"
                      >
                        {assignment.status}
                      </Badge>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                          <FileText className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                          <MessageSquare className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coordination Status */}
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">Team Coordination Status</span>
                  </div>
                  <Badge variant="outline" className="text-green-600 border-green-200">
                    All professionals active
                  </Badge>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Last team communication: 2 days ago • Next scheduled review: Jan 30, 2025
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm">
                  <Plus className="h-3 w-3 mr-1" />
                  Add Professional
                </Button>
                <Button variant="outline" size="sm">
                  <Calendar className="h-3 w-3 mr-1" />
                  Team Meeting
                </Button>
                <Button variant="outline" size="sm">
                  <FileText className="h-3 w-3 mr-1" />
                  Share Documents
                </Button>
                <Button variant="outline" size="sm">
                  <MessageSquare className="h-3 w-3 mr-1" />
                  Group Message
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredClients.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No clients found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' 
                ? 'Try adjusting your filters to see more clients.'
                : 'Start by assigning professionals to your clients for coordinated care.'}
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Assign Professional
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}