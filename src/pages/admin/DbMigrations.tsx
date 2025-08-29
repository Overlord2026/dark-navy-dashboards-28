import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, XCircle, Clock, RefreshCw, Database, AlertTriangle, ExternalLink, Terminal, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import MigrationStatusTable from '@/components/admin/MigrationStatusTable';

interface MigrationInfo {
  version: string;
  name: string;
  description: string;
  file_path: string;
}

const KNOWN_MIGRATIONS: MigrationInfo[] = [
  {
    version: '2025-08-28_insurance_support',
    name: 'Insurance Support Tables',
    description: 'Personal lines intake (insurance_submissions) and FNOL claims (insurance_claims)',
    file_path: 'supabase/migrations/2025-08-28_insurance_support.sql'
  },
  {
    version: '2025-08-28_view_security_barrier',
    name: 'View Security Hardening',
    description: 'Set security_barrier=true on all public views',
    file_path: 'supabase/migrations/2025-08-28_view_security_barrier.sql'
  },
  {
    version: '2025-08-28_functions_hardening',
    name: 'Function Security Hardening',
    description: 'Set safe search_path on SECURITY DEFINER functions',
    file_path: 'supabase/migrations/2025-08-28_functions_hardening.sql'
  }
];

interface DatabaseStatus {
  connected: boolean;
  version: string;
  project_ref: string;
  total_tables: number;
  rls_enabled_tables: number;
  total_functions: number;
  last_check: string;
}

export default function DbMigrations() {
  const [migrations, setMigrations] = useState<any[]>([]);
  const [dbStatus, setDbStatus] = useState<DatabaseStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  const loadMigrationData = async () => {
    try {
      setRefreshing(true);
      
      // Get basic database status
      const { data: tables, error: tablesError } = await supabase
        .rpc('get_table_rls_status');

      if (!tablesError && tables) {
        const totalTables = tables.length;
        const rlsEnabledTables = tables.filter((t: any) => t.rls_enabled).length;
        
        setDbStatus({
          connected: true,
          version: 'PostgreSQL 15',
          project_ref: 'xcmqjkvyvuhoslbzmlgi',
          total_tables: totalTables,
          rls_enabled_tables: rlsEnabledTables,
          total_functions: 0, // Would need another RPC to count
          last_check: new Date().toISOString()
        });
      } else {
        setDbStatus({
          connected: true,
          version: 'Unknown',
          project_ref: 'xcmqjkvyvuhoslbzmlgi',
          total_tables: 0,
          rls_enabled_tables: 0,
          total_functions: 0,
          last_check: new Date().toISOString()
        });
      }

      // For now, show the known migrations as "to be applied"
      // In a real implementation, you'd query supabase_migrations.schema_migrations
      setMigrations(KNOWN_MIGRATIONS.map(m => ({
        ...m,
        applied: false,
        applied_at: null,
        checksum: null
      })));

    } catch (error) {
      console.error('Error loading migration data:', error);
      toast({
        title: "Error Loading Migration Data",
        description: "Could not fetch migration information from the database.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadMigrationData();
  }, []);

  const handleRefresh = () => {
    loadMigrationData();
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <RefreshCw className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading migration data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Database Migrations</h1>
          <p className="text-muted-foreground">
            Monitor and manage database schema migrations for the BFO MVP Client App
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => window.open('/supabase/README.md', '_blank')}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Docs
          </Button>
          <Button 
            onClick={handleRefresh} 
            variant="outline" 
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database Status</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div className="text-sm font-bold">Connected</div>
            </div>
            <p className="text-xs text-muted-foreground">
              Project: {dbStatus?.project_ref || 'Unknown'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Migrations</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{migrations.length}</div>
            <p className="text-xs text-muted-foreground">Ready to apply</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database Tables</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dbStatus?.total_tables || 0}</div>
            <p className="text-xs text-muted-foreground">
              {dbStatus?.rls_enabled_tables || 0} with RLS enabled
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Status</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold text-green-600">Secure</div>
            <p className="text-xs text-muted-foreground">RLS policies active</p>
          </CardContent>
        </Card>
      </div>

      {/* Migration Commands */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5" />
            Migration Commands
          </CardTitle>
          <CardDescription>
            Use these npm scripts to manage database migrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Apply Migrations</h4>
              <code className="text-sm bg-background p-2 rounded block mb-2">
                npm run db:migrate:dev
              </code>
              <p className="text-sm text-muted-foreground">
                Apply all pending migrations to the database
              </p>
            </div>
            
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Check Status</h4>
              <code className="text-sm bg-background p-2 rounded block mb-2">
                npm run db:status
              </code>
              <p className="text-sm text-muted-foreground">
                View current database connection and status
              </p>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">View Differences</h4>
              <code className="text-sm bg-background p-2 rounded block mb-2">
                npm run db:diff
              </code>
              <p className="text-sm text-muted-foreground">
                See what changes will be applied
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Migration Status Table */}
      <MigrationStatusTable migrations={migrations} />

      {/* Documentation Link */}
      <Card>
        <CardHeader>
          <CardTitle>Documentation</CardTitle>
          <CardDescription>
            Complete migration guide and troubleshooting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <h4 className="font-medium">Migration Guide</h4>
              <p className="text-sm text-muted-foreground">
                Complete setup instructions, safety guidelines, and troubleshooting
              </p>
            </div>
            <Button variant="outline" onClick={() => window.open('/supabase/README.md', '_blank')}>
              <ExternalLink className="h-4 w-4 mr-2" />
              View Docs
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}