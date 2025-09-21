import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Users, Plus, Search, Filter, Clock, TrendingUp } from 'lucide-react';
import { useRetirementScenarios, type AdvisorClient } from '@/hooks/useRetirementScenarios';
import { ScenarioManagementPanel } from './ScenarioManagementPanel';
import { ClientMeetingScheduler } from './ClientMeetingScheduler';
import { ScenarioComparison } from './ScenarioComparison';

export function AdvisorClientDashboard() {
  const {
    clients,
    currentClient,
    setCurrentClient,
    scenarios,
    getScenariosForClient,
    loading
  } = useRetirementScenarios();

  const [searchQuery, setSearchQuery] = useState('');
  const [showNewClientForm, setShowNewClientForm] = useState(false);

  const filteredClients = clients.filter(client =>
    client.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.client_email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getClientStats = (client: AdvisorClient) => {
    const clientScenarios = getScenariosForClient(client.id);
    const activeScenarios = clientScenarios.filter(s => s.scenario_status === 'active').length;
    const draftScenarios = clientScenarios.filter(s => s.scenario_status === 'draft').length;
    
    return { total: clientScenarios.length, active: activeScenarios, drafts: draftScenarios };
  };

  const getNextMeetingStatus = (client: AdvisorClient) => {
    if (!client.next_meeting_date) return { status: 'none', days: 0 };
    
    const nextMeeting = new Date(client.next_meeting_date);
    const today = new Date();
    const diffTime = nextMeeting.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { status: 'overdue', days: Math.abs(diffDays) };
    if (diffDays <= 7) return { status: 'upcoming', days: diffDays };
    return { status: 'scheduled', days: diffDays };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Client Management Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage retirement scenarios and client relationships
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setShowNewClientForm(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Client
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{clients.length}</p>
                  <p className="text-sm text-muted-foreground">Total Clients</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">{scenarios.length}</p>
                  <p className="text-sm text-muted-foreground">Active Scenarios</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">
                    {clients.filter(c => {
                      const status = getNextMeetingStatus(c);
                      return status.status === 'upcoming';
                    }).length}
                  </p>
                  <p className="text-sm text-muted-foreground">Upcoming Meetings</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold">
                    {clients.filter(c => {
                      const status = getNextMeetingStatus(c);
                      return status.status === 'overdue';
                    }).length}
                  </p>
                  <p className="text-sm text-muted-foreground">Overdue Meetings</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="clients" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
            <TabsTrigger value="meetings">Meetings</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="clients" className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Client List */}
              <div className="lg:col-span-1 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Client List
                    </CardTitle>
                    <CardDescription>
                      Select a client to manage their retirement scenarios
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search clients..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    {/* Client Cards */}
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {filteredClients.map((client) => {
                        const stats = getClientStats(client);
                        const meetingStatus = getNextMeetingStatus(client);
                        
                        return (
                          <Card
                            key={client.id}
                            className={`cursor-pointer transition-all hover:shadow-md ${
                              currentClient?.id === client.id 
                                ? 'ring-2 ring-primary bg-primary/5' 
                                : ''
                            }`}
                            onClick={() => setCurrentClient(client)}
                          >
                            <CardContent className="p-4">
                              <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-semibold">{client.client_name}</h4>
                                    <p className="text-sm text-muted-foreground">{client.client_email}</p>
                                  </div>
                                  <Badge 
                                    variant={client.relationship_status === 'active' ? 'default' : 'secondary'}
                                    className="text-xs"
                                  >
                                    {client.relationship_status}
                                  </Badge>
                                </div>
                                
                                <div className="flex justify-between items-center text-sm">
                                  <span className="text-muted-foreground">
                                    {stats.total} scenarios ({stats.active} active)
                                  </span>
                                  {meetingStatus.status === 'upcoming' && (
                                    <Badge variant="outline" className="text-xs">
                                      Meeting in {meetingStatus.days} days
                                    </Badge>
                                  )}
                                  {meetingStatus.status === 'overdue' && (
                                    <Badge variant="destructive" className="text-xs">
                                      {meetingStatus.days} days overdue
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Client Details & Scenarios */}
              <div className="lg:col-span-2">
                {currentClient ? (
                  <ScenarioManagementPanel client={currentClient} />
                ) : (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Select a Client</h3>
                      <p className="text-muted-foreground">
                        Choose a client from the list to view and manage their retirement scenarios
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="scenarios" className="mt-8">
            {currentClient ? (
              <ScenarioComparison client={currentClient} />
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Select a Client</h3>
                  <p className="text-muted-foreground">
                    Choose a client to view and compare their retirement scenarios
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="meetings" className="mt-8">
            {currentClient ? (
              <ClientMeetingScheduler client={currentClient} />
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Select a Client</h3>
                  <p className="text-muted-foreground">
                    Choose a client to schedule and manage meetings
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="mt-8">
            <Card>
              <CardContent className="p-12 text-center">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Analytics Dashboard</h3>
                <p className="text-muted-foreground">
                  Client performance analytics and reporting coming soon
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}