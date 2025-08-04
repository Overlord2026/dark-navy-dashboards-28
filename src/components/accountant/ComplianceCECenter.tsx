import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Calendar, AlertTriangle, BookOpen, Upload, Download, FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format, differenceInDays } from 'date-fns';

interface LicenseStatus {
  id: string;
  state: string;
  credential_type: string;
  license_number: string;
  expiration_date: string;
  renewal_status: string;
  ce_hours_completed: number;
  ce_hours_required: number;
  ethics_hours_completed: number;
  ethics_hours_required: number;
  audit_flag: boolean;
}

interface CERecord {
  id: string;
  course_name: string;
  provider: string;
  ce_hours: number;
  ethics_hours: number;
  date_completed: string;
  certificate_url?: string;
  status: string;
}

interface CEAlert {
  id: string;
  alert_type: string;
  due_date?: string;
  priority: string;
  notes?: string;
  resolved: boolean;
}

export default function ComplianceCECenter() {
  const [licenses, setLicenses] = useState<LicenseStatus[]>([]);
  const [ceRecords, setCeRecords] = useState<CERecord[]>([]);
  const [alerts, setAlerts] = useState<CEAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch license statuses
      const { data: licenseData, error: licenseError } = await supabase
        .from('accountant_license_status')
        .select('*')
        .order('expiration_date', { ascending: true });

      if (licenseError) throw licenseError;

      // Fetch CE records
      const { data: ceData, error: ceError } = await supabase
        .from('accountant_ce_records')
        .select('*')
        .order('date_completed', { ascending: false });

      if (ceError) throw ceError;

      // Fetch alerts
      const { data: alertData, error: alertError } = await supabase
        .from('accountant_ce_alerts')
        .select('*')
        .eq('resolved', false)
        .order('due_date', { ascending: true });

      if (alertError) throw alertError;

      setLicenses(licenseData || []);
      setCeRecords(ceData || []);
      setAlerts(alertData || []);
    } catch (error) {
      console.error('Error fetching compliance data:', error);
      toast.error('Failed to load compliance data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (renewalStatus: string) => {
    switch (renewalStatus) {
      case 'active': return 'bg-green-500';
      case 'pending_renewal': return 'bg-yellow-500';
      case 'expired': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getDaysUntilExpiration = (expirationDate: string) => {
    return differenceInDays(new Date(expirationDate), new Date());
  };

  const calculateProgress = (completed: number, required: number) => {
    return Math.min((completed / required) * 100, 100);
  };

  const getAlertPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading compliance data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Compliance & CE Center</h1>
          <p className="text-muted-foreground">Manage your continuing education and license renewals</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Import CE Records
          </Button>
          <Button>
            <BookOpen className="w-4 h-4 mr-2" />
            Browse Courses
          </Button>
        </div>
      </div>

      {/* Alert Banner */}
      {alerts.length > 0 && (
        <Card className="border-destructive bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center text-destructive">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Active Alerts ({alerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {alerts.slice(0, 3).map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-2 bg-background rounded-md">
                  <span className="text-sm">{alert.notes || alert.alert_type}</span>
                  <Badge variant={getAlertPriorityColor(alert.priority)}>
                    {alert.priority}
                  </Badge>
                </div>
              ))}
              {alerts.length > 3 && (
                <p className="text-sm text-muted-foreground">+{alerts.length - 3} more alerts</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="licenses">Licenses</TabsTrigger>
          <TabsTrigger value="ce-records">CE Records</TabsTrigger>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {licenses.map((license) => {
              const daysUntilExpiration = getDaysUntilExpiration(license.expiration_date);
              const ceProgress = calculateProgress(license.ce_hours_completed, license.ce_hours_required);
              const ethicsProgress = calculateProgress(license.ethics_hours_completed, license.ethics_hours_required);

              return (
                <Card key={license.id} className="relative">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{license.credential_type} - {license.state}</CardTitle>
                      <Badge className={getStatusColor(license.renewal_status)}>
                        {license.renewal_status}
                      </Badge>
                    </div>
                    <CardDescription>
                      License: {license.license_number}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center text-sm">
                      <Calendar className="w-4 h-4 mr-2" />
                      Expires: {format(new Date(license.expiration_date), 'MMM dd, yyyy')}
                      <span className={`ml-2 ${daysUntilExpiration < 90 ? 'text-destructive' : 'text-muted-foreground'}`}>
                        ({daysUntilExpiration} days)
                      </span>
                    </div>

                    {license.audit_flag && (
                      <div className="flex items-center text-sm text-destructive">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Selected for Audit
                      </div>
                    )}

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>CE Hours</span>
                          <span>{license.ce_hours_completed}/{license.ce_hours_required}</span>
                        </div>
                        <Progress value={ceProgress} className="h-2" />
                      </div>

                      {license.ethics_hours_required > 0 && (
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Ethics Hours</span>
                            <span>{license.ethics_hours_completed}/{license.ethics_hours_required}</span>
                          </div>
                          <Progress value={ethicsProgress} className="h-2" />
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <FileText className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="licenses" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>License Management</CardTitle>
                  <CardDescription>Track all your professional licenses and credentials</CardDescription>
                </div>
                <Button>Add License</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {licenses.map((license) => (
                  <div key={license.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{license.credential_type} - {license.state}</h3>
                        <Badge className={getStatusColor(license.renewal_status)}>
                          {license.renewal_status}
                        </Badge>
                        {license.audit_flag && (
                          <Badge variant="destructive">Audit</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">License: {license.license_number}</p>
                      <p className="text-sm text-muted-foreground">
                        Expires: {format(new Date(license.expiration_date), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ce-records" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>CE Records</CardTitle>
                  <CardDescription>Track your completed continuing education courses</CardDescription>
                </div>
                <Button>Add CE Record</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ceRecords.map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium">{record.course_name}</h3>
                      <p className="text-sm text-muted-foreground">Provider: {record.provider}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>CE Hours: {record.ce_hours}</span>
                        {record.ethics_hours > 0 && (
                          <span>Ethics: {record.ethics_hours}</span>
                        )}
                        <span>Completed: {format(new Date(record.date_completed), 'MMM dd, yyyy')}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={record.status === 'verified' ? 'default' : 'secondary'}>
                        {record.status === 'verified' ? (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        ) : (
                          <Clock className="w-3 h-3 mr-1" />
                        )}
                        {record.status}
                      </Badge>
                      {record.certificate_url && (
                        <Button variant="outline" size="sm">
                          <FileText className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marketplace" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>CE Marketplace</CardTitle>
              <CardDescription>Browse and book continuing education courses from approved providers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">CE Marketplace Coming Soon</h3>
                <p className="text-muted-foreground mb-4">
                  Browse courses from Becker, Surgent, AICPA, and other approved providers
                </p>
                <Button variant="outline">Request Early Access</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}