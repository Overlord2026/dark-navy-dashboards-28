import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload, FileText, Users, CheckCircle, AlertCircle, Clock, Download } from 'lucide-react';

interface ImportRecord {
  id: string;
  import_type: string;
  original_filename: string;
  import_status: string;
  created_at: string;
  client_count: number;
  parsed_data: any;
  error_log?: string;
}

interface MigrationStatus {
  id: string;
  total_clients_to_migrate: number;
  clients_migrated: number;
  migration_started_at: string;
  previous_platform: string;
}

export function PlanImportDashboard() {
  const [imports, setImports] = useState<ImportRecord[]>([]);
  const [migrationStatus, setMigrationStatus] = useState<MigrationStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadImportData();
  }, []);

  const loadImportData = async () => {
    try {
      // Load import records
      const { data: importData, error: importError } = await supabase
        .from('plan_imports')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (importError) throw importError;
      setImports(importData || []);

      // Load migration status
      const { data: migrationData, error: migrationError } = await supabase
        .from('advisor_migration_status')
        .select('*')
        .single();

      if (migrationError && migrationError.code !== 'PGRST116') {
        throw migrationError;
      }
      setMigrationStatus(migrationData);

    } catch (error: any) {
      console.error('Error loading import data:', error);
      toast({
        title: "Error Loading Data",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case 'parsing':
      case 'uploaded':
        return <Clock className="h-4 w-4 text-warning" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      completed: 'default',
      failed: 'destructive',
      parsing: 'secondary',
      uploaded: 'secondary',
      review: 'outline'
    };

    return (
      <Badge variant={variants[status] || 'outline'} className="gap-1">
        {getStatusIcon(status)}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const migrationProgress = migrationStatus 
    ? Math.round((migrationStatus.clients_migrated / migrationStatus.total_clients_to_migrate) * 100)
    : 0;

  const totalImports = imports.length;
  const successfulImports = imports.filter(i => i.import_status === 'completed').length;
  const failedImports = imports.filter(i => i.import_status === 'failed').length;
  const pendingImports = imports.filter(i => ['uploaded', 'parsing', 'review'].includes(i.import_status)).length;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-muted rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Migration Overview */}
      {migrationStatus && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Migration Progress
            </CardTitle>
            <CardDescription>
              Migrating from {migrationStatus.previous_platform}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>
                {migrationStatus.clients_migrated} of {migrationStatus.total_clients_to_migrate} clients migrated
              </span>
              <span>{migrationProgress}%</span>
            </div>
            <Progress value={migrationProgress} className="h-3" />
            <p className="text-sm text-muted-foreground">
              Started: {formatDate(migrationStatus.migration_started_at)}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Import Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Imports</p>
                <p className="text-2xl font-bold">{totalImports}</p>
              </div>
              <Upload className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Successful</p>
                <p className="text-2xl font-bold text-success">{successfulImports}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-warning">{pendingImports}</p>
              </div>
              <Clock className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Failed</p>
                <p className="text-2xl font-bold text-destructive">{failedImports}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Imports Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Recent Imports
          </CardTitle>
          <CardDescription>
            Track the status of your plan imports and migrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Clients</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {imports.map((importRecord) => (
                <TableRow key={importRecord.id}>
                  <TableCell className="font-medium">
                    {importRecord.original_filename}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {importRecord.import_type === 'pdf_upload' ? 'PDF' : 'CSV'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(importRecord.import_status)}
                  </TableCell>
                  <TableCell>
                    {importRecord.client_count || 0}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(importRecord.created_at)}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {importRecord.import_status === 'completed' && (
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                      {importRecord.error_log && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => toast({
                            title: "Import Error",
                            description: importRecord.error_log,
                            variant: "destructive"
                          })}
                        >
                          <AlertCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {imports.length === 0 && (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No imports yet</p>
              <p className="text-sm text-muted-foreground">Import your first plan to get started</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}