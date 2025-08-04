import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Download, AlertTriangle, CheckCircle, Calendar, Scale, BookOpen, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AddCLERecordModal } from './AddCLERecordModal';

interface BarStatus {
  id: string;
  state: string;
  bar_number: string;
  admission_date: string | null;
  expiration_date: string;
  renewal_status: string;
  good_standing: boolean;
  cle_hours_completed: number;
  ethics_hours_completed: number;
  tech_hours_completed: number;
  cle_hours_required: number;
  ethics_hours_required: number;
  tech_hours_required: number;
}

interface CLERecord {
  id: string;
  state: string;
  bar_number: string | null;
  course_name: string;
  provider: string;
  cle_hours: number;
  ethics_hours: number;
  tech_hours: number;
  date_completed: string;
  certificate_url: string | null;
  status: string;
}

interface CLEAlert {
  id: string;
  alert_type: string;
  due_date: string | null;
  priority: string;
  resolved: boolean;
  notes: string | null;
}

interface CLEProvider {
  id: string;
  provider_name: string;
  approved_states: string[];
  url: string | null;
  specialty: string[];
  course_catalog_url: string | null;
}

export function AttorneyCLECenter() {
  const [barStatuses, setBarStatuses] = useState<BarStatus[]>([]);
  const [cleRecords, setCleRecords] = useState<CLERecord[]>([]);
  const [cleAlerts, setCleAlerts] = useState<CLEAlert[]>([]);
  const [cleProviders, setCleProviders] = useState<CLEProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch bar statuses
      const { data: barData } = await supabase
        .from('attorney_bar_status')
        .select('*')
        .eq('user_id', user.id)
        .order('state');

      // Fetch CLE records
      const { data: cleData } = await supabase
        .from('attorney_cle_records')
        .select('*')
        .eq('user_id', user.id)
        .order('date_completed', { ascending: false });

      // Fetch alerts
      const { data: alertsData } = await supabase
        .from('attorney_cle_alerts')
        .select('*')
        .eq('user_id', user.id)
        .eq('resolved', false)
        .order('due_date');

      // Fetch CLE providers
      const { data: providersData } = await supabase
        .from('attorney_cle_providers')
        .select('*')
        .eq('is_active', true)
        .order('provider_name');

      setBarStatuses(barData || []);
      setCleRecords(cleData || []);
      setCleAlerts(alertsData || []);
      setCleProviders(providersData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load CLE data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = (status: BarStatus) => {
    const totalRequired = status.cle_hours_required + status.ethics_hours_required + status.tech_hours_required;
    const totalCompleted = status.cle_hours_completed + status.ethics_hours_completed + status.tech_hours_completed;
    return totalRequired > 0 ? Math.round((totalCompleted / totalRequired) * 100) : 0;
  };

  const getDaysUntilExpiration = (expirationDate: string) => {
    const today = new Date();
    const expiry = new Date(expirationDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusColor = (status: string, daysUntil: number) => {
    if (status !== 'active') return 'destructive';
    if (daysUntil < 30) return 'destructive';
    if (daysUntil < 90) return 'default';
    return 'default';
  };

  const handleRecordAdded = () => {
    fetchData();
    setShowAddModal(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading CLE data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Attorney CLE & Compliance Center</h1>
        <p className="text-muted-foreground">
          Manage your Continuing Legal Education requirements and bar compliance across all jurisdictions.
        </p>
      </div>

      {/* Alerts Section */}
      {cleAlerts.length > 0 && (
        <div className="mb-6 space-y-3">
          {cleAlerts.map((alert) => (
            <Alert key={alert.id} className={alert.priority === 'high' ? 'border-destructive' : ''}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>{alert.alert_type}:</strong> {alert.notes}
                {alert.due_date && (
                  <span className="ml-2 text-sm text-muted-foreground">
                    Due: {new Date(alert.due_date).toLocaleDateString()}
                  </span>
                )}
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="bar-status">Bar Status</TabsTrigger>
          <TabsTrigger value="cle-records">CLE Records</TabsTrigger>
          <TabsTrigger value="marketplace">CLE Marketplace</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Bar Memberships</CardTitle>
                <Scale className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{barStatuses.filter(s => s.renewal_status === 'active').length}</div>
                <p className="text-xs text-muted-foreground">
                  {barStatuses.length} total jurisdictions
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">CLE Hours This Year</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {cleRecords
                    .filter(r => new Date(r.date_completed).getFullYear() === new Date().getFullYear())
                    .reduce((sum, r) => sum + r.cle_hours, 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Including ethics & technology
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Renewals</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {barStatuses.filter(s => getDaysUntilExpiration(s.expiration_date) <= 90).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Within 90 days
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Compliance Status</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {barStatuses.filter(s => calculateProgress(s) >= 100).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Current with requirements
                </p>
              </CardContent>
            </Card>
          </div>

          {/* State Progress Overview */}
          <Card>
            <CardHeader>
              <CardTitle>CLE Progress by State</CardTitle>
              <CardDescription>
                Track your progress toward meeting CLE requirements in each jurisdiction
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {barStatuses.map((status) => {
                  const progress = calculateProgress(status);
                  const daysUntil = getDaysUntilExpiration(status.expiration_date);
                  
                  return (
                    <div key={status.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge variant={getStatusColor(status.renewal_status, daysUntil)}>
                            {status.state}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            Bar #{status.bar_number}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {progress}% complete • {daysUntil} days until renewal
                        </div>
                      </div>
                      <Progress value={progress} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>
                          General: {status.cle_hours_completed}/{status.cle_hours_required}
                        </span>
                        <span>
                          Ethics: {status.ethics_hours_completed}/{status.ethics_hours_required}
                        </span>
                        <span>
                          Tech: {status.tech_hours_completed}/{status.tech_hours_required}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bar-status" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Bar Status & Memberships</h2>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Bar Membership
            </Button>
          </div>

          <div className="grid gap-6">
            {barStatuses.map((status) => {
              const progress = calculateProgress(status);
              const daysUntil = getDaysUntilExpiration(status.expiration_date);
              
              return (
                <Card key={status.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        {status.state} Bar
                        <Badge variant={getStatusColor(status.renewal_status, daysUntil)}>
                          {status.renewal_status}
                        </Badge>
                        {status.good_standing && (
                          <Badge variant="outline" className="text-green-600">
                            Good Standing
                          </Badge>
                        )}
                      </CardTitle>
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download Audit Packet
                      </Button>
                    </div>
                    <CardDescription>
                      Bar Number: {status.bar_number} • Renewal: {new Date(status.expiration_date).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Overall Progress</span>
                          <span>{progress}% complete</span>
                        </div>
                        <Progress value={progress} />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">General CLE Hours</p>
                          <p className="text-2xl font-bold">
                            {status.cle_hours_completed}/{status.cle_hours_required}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Ethics Hours</p>
                          <p className="text-2xl font-bold">
                            {status.ethics_hours_completed}/{status.ethics_hours_required}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Technology Hours</p>
                          <p className="text-2xl font-bold">
                            {status.tech_hours_completed}/{status.tech_hours_required}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="cle-records" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">CLE Records</h2>
            <div className="flex gap-2">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export Records
              </Button>
              <Button onClick={() => setShowAddModal(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add CLE Record
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-4 font-medium">Course</th>
                      <th className="text-left p-4 font-medium">Provider</th>
                      <th className="text-left p-4 font-medium">State</th>
                      <th className="text-left p-4 font-medium">Hours</th>
                      <th className="text-left p-4 font-medium">Date</th>
                      <th className="text-left p-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cleRecords.map((record) => (
                      <tr key={record.id} className="border-t">
                        <td className="p-4">
                          <div>
                            <p className="font-medium">{record.course_name}</p>
                            {record.certificate_url && (
                              <a 
                                href={record.certificate_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sm text-primary hover:underline"
                              >
                                View Certificate
                              </a>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-sm">{record.provider}</td>
                        <td className="p-4">
                          <Badge variant="outline">{record.state}</Badge>
                        </td>
                        <td className="p-4">
                          <div className="text-sm">
                            <p>General: {record.cle_hours}</p>
                            {record.ethics_hours > 0 && <p>Ethics: {record.ethics_hours}</p>}
                            {record.tech_hours > 0 && <p>Tech: {record.tech_hours}</p>}
                          </div>
                        </td>
                        <td className="p-4 text-sm">
                          {new Date(record.date_completed).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <Badge variant={record.status === 'completed' ? 'default' : 'secondary'}>
                            {record.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marketplace" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">CLE Marketplace</h2>
            <p className="text-muted-foreground">
              Discover and book CLE courses from approved providers
            </p>
          </div>

          <div className="grid gap-6">
            {cleProviders.map((provider) => (
              <Card key={provider.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      {provider.provider_name}
                      <Badge variant="outline" className="text-xs">
                        {provider.approved_states.length} states
                      </Badge>
                    </CardTitle>
                    <div className="flex gap-2">
                      {provider.course_catalog_url && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open(provider.course_catalog_url!, '_blank')}
                        >
                          Browse Courses
                        </Button>
                      )}
                      {provider.url && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open(provider.url!, '_blank')}
                        >
                          Visit Website
                        </Button>
                      )}
                    </div>
                  </div>
                  <CardDescription>
                    Specialties: {provider.specialty.join(', ')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Approved States:</p>
                    <div className="flex flex-wrap gap-1">
                      {provider.approved_states.map((state) => (
                        <Badge key={state} variant="secondary" className="text-xs">
                          {state}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {showAddModal && (
        <AddCLERecordModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onRecordAdded={handleRecordAdded}
          providers={cleProviders}
          barStatuses={barStatuses}
        />
      )}
    </div>
  );
}