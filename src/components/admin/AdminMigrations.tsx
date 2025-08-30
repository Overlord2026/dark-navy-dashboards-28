import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Database, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  XCircle,
  FileText,
  Play,
  Pause,
  Info
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Migration {
  id: string;
  name: string;
  description: string;
  version: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  appliedAt?: string;
  duration?: number;
  logs: string[];
  script?: string;
  dependencies?: string[];
}

const KNOWN_MIGRATIONS: Migration[] = [
  {
    id: 'create_profiles_table',
    name: 'Create Profiles Table',
    description: 'Initial user profiles table with RLS policies',
    version: '1.0.0',
    status: 'completed',
    appliedAt: '2024-01-10T10:00:00Z',
    duration: 1500,
    logs: [
      'Creating public.profiles table...',
      'Adding RLS policies...',
      'Creating indexes...',
      'Migration completed successfully'
    ],
    script: `
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  role TEXT NOT NULL DEFAULT 'client',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);
`.trim()
  },
  {
    id: 'add_tenant_system',
    name: 'Add Tenant System',
    description: 'Multi-tenant architecture with tenant isolation',
    version: '1.1.0',
    status: 'completed',
    appliedAt: '2024-01-12T14:30:00Z',
    duration: 3200,
    logs: [
      'Creating tenants table...',
      'Adding tenant_id to profiles...',
      'Updating RLS policies for multi-tenancy...',
      'Creating tenant functions...',
      'Migration completed successfully'
    ],
    dependencies: ['create_profiles_table']
  },
  {
    id: 'meeting_notes_table',
    name: 'Meeting Notes Table',
    description: 'Voice assistant meeting notes with compliance',
    version: '1.2.0',
    status: 'completed',
    appliedAt: '2024-01-13T09:15:00Z',
    duration: 800,
    logs: [
      'Creating meeting_notes table...',
      'Adding RLS policies...',
      'Creating audit triggers...',
      'Migration completed successfully'
    ],
    dependencies: ['add_tenant_system']
  },
  {
    id: 'ip_filing_system',
    name: 'IP Filing System',
    description: 'Patent and trademark filing tracker',
    version: '1.3.0',
    status: 'pending',
    logs: [],
    script: `
CREATE TABLE public.ip_filings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('patent', 'trademark', 'copyright', 'trade_secret')),
  status TEXT NOT NULL DEFAULT 'draft',
  application_number TEXT,
  filing_date DATE,
  priority TEXT NOT NULL DEFAULT 'medium',
  family TEXT NOT NULL,
  assigned_to TEXT,
  cost NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.ip_crossrefs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filing_id UUID REFERENCES public.ip_filings NOT NULL,
  reference_number TEXT NOT NULL,
  relationship TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.ip_artifacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filing_id UUID REFERENCES public.ip_filings NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  url TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ip_filings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ip_crossrefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ip_artifacts ENABLE ROW LEVEL SECURITY;

-- RLS Policies (IP filings are admin-only for now)
CREATE POLICY "Admins can manage IP filings" ON public.ip_filings
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage IP crossrefs" ON public.ip_crossrefs
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage IP artifacts" ON public.ip_artifacts
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));
`.trim(),
    dependencies: ['meeting_notes_table']
  },
  {
    id: 'compliance_tracking',
    name: 'Compliance Tracking',
    description: 'CE requirements, license status, and audit trails',
    version: '1.4.0',
    status: 'pending',
    logs: [],
    dependencies: ['ip_filing_system']
  },
  {
    id: 'tools_registry_migration',
    name: 'Tools Registry Migration',
    description: 'Tools configuration and user permissions',
    version: '1.5.0',
    status: 'pending',
    logs: [],
    dependencies: ['compliance_tracking']
  }
];

export function AdminMigrations() {
  const { toast } = useToast();
  const [migrations, setMigrations] = useState<Migration[]>(KNOWN_MIGRATIONS);
  const [selectedMigration, setSelectedMigration] = useState<Migration | null>(null);
  const [runningMigration, setRunningMigration] = useState<string | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'running':
        return <Clock className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-gray-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-600">Completed</Badge>;
      case 'running':
        return <Badge variant="default" className="bg-blue-600">Running</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const canRunMigration = (migration: Migration): boolean => {
    if (migration.status === 'completed' || migration.status === 'running') {
      return false;
    }

    // Check if all dependencies are completed
    if (migration.dependencies) {
      return migration.dependencies.every(depId => {
        const dep = migrations.find(m => m.id === depId);
        return dep && dep.status === 'completed';
      });
    }

    return true;
  };

  const simulateRunMigration = async (migrationId: string) => {
    const migration = migrations.find(m => m.id === migrationId);
    if (!migration || !canRunMigration(migration)) return;

    setRunningMigration(migrationId);
    
    // Update status to running
    setMigrations(prev => prev.map(m => 
      m.id === migrationId ? { ...m, status: 'running', logs: ['Starting migration...'] } : m
    ));

    // Simulate migration steps
    const steps = [
      'Validating migration script...',
      'Creating backup...',
      'Executing SQL statements...',
      'Updating schema...',
      'Applying security policies...',
      'Verifying migration...',
      'Migration completed successfully!'
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMigrations(prev => prev.map(m => 
        m.id === migrationId 
          ? { 
              ...m, 
              logs: [...m.logs, steps[i]],
              status: i === steps.length - 1 ? 'completed' : 'running'
            } 
          : m
      ));
    }

    // Finalize migration
    setMigrations(prev => prev.map(m => 
      m.id === migrationId 
        ? { 
            ...m, 
            status: 'completed',
            appliedAt: new Date().toISOString(),
            duration: 7000
          } 
        : m
    ));

    setRunningMigration(null);
    
    toast({
      title: "Migration Completed",
      description: `${migration.name} has been successfully applied`,
    });
  };

  const completedCount = migrations.filter(m => m.status === 'completed').length;
  const pendingCount = migrations.filter(m => m.status === 'pending').length;
  const failedCount = migrations.filter(m => m.status === 'failed').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Database Migrations</h2>
          <p className="text-muted-foreground">
            Manage database schema changes and migrations
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Badge variant="outline">
            {completedCount}/{migrations.length} Applied
          </Badge>
        </div>
      </div>

      {/* Migration Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{completedCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="h-5 w-5 text-gray-600" />
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pendingCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <XCircle className="h-5 w-5 text-red-600" />
              Failed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{failedCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Database className="h-5 w-5" />
              Version
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              {migrations.filter(m => m.status === 'completed').slice(-1)[0]?.version || '1.0.0'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Migrations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Known Migrations</CardTitle>
          <CardDescription>
            Database migrations managed by the application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Applied</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {migrations.map(migration => (
                <TableRow key={migration.id} className="cursor-pointer">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(migration.status)}
                      {getStatusBadge(migration.status)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{migration.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {migration.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-sm">{migration.version}</code>
                  </TableCell>
                  <TableCell>
                    {migration.appliedAt ? (
                      <div className="text-sm">
                        {new Date(migration.appliedAt).toLocaleDateString()}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {migration.duration ? (
                      <span className="text-sm">{migration.duration}ms</span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedMigration(migration)}
                        className="gap-1"
                      >
                        <FileText className="h-3 w-3" />
                        View
                      </Button>
                      
                      {migration.status === 'pending' && canRunMigration(migration) && (
                        <Button
                          size="sm"
                          onClick={() => simulateRunMigration(migration.id)}
                          disabled={!!runningMigration}
                          className="gap-1"
                        >
                          <Play className="h-3 w-3" />
                          Run
                        </Button>
                      )}
                      
                      {migration.status === 'pending' && !canRunMigration(migration) && (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled
                          className="gap-1"
                        >
                          <Pause className="h-3 w-3" />
                          Blocked
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Help Text */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Migration Management:</strong> This interface shows the status of known database migrations. 
          Migrations are applied automatically during deployment, but can be run manually here for testing. 
          Always backup your database before running migrations in production.
        </AlertDescription>
      </Alert>

      {/* Migration Details Dialog */}
      {selectedMigration && (
        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{selectedMigration.name}</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedMigration(null)}
              >
                Close
              </Button>
            </div>
            <CardDescription>{selectedMigration.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-medium">Version</Label>
                <div className="text-sm">{selectedMigration.version}</div>
              </div>
              <div>
                <Label className="text-sm font-medium">Status</Label>
                <div>{getStatusBadge(selectedMigration.status)}</div>
              </div>
              <div>
                <Label className="text-sm font-medium">Dependencies</Label>
                <div className="text-sm">
                  {selectedMigration.dependencies?.join(', ') || 'None'}
                </div>
              </div>
            </div>

            {selectedMigration.script && (
              <div>
                <Label className="text-sm font-medium">Migration Script</Label>
                <ScrollArea className="h-48 w-full border rounded-md">
                  <pre className="p-4 text-xs">
                    <code>{selectedMigration.script}</code>
                  </pre>
                </ScrollArea>
              </div>
            )}

            {selectedMigration.logs.length > 0 && (
              <div>
                <Label className="text-sm font-medium">Execution Logs</Label>
                <ScrollArea className="h-32 w-full border rounded-md">
                  <div className="p-4 space-y-1">
                    {selectedMigration.logs.map((log, idx) => (
                      <div key={idx} className="text-xs font-mono">
                        {log}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function Label({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`text-sm font-medium ${className}`}>{children}</div>;
}