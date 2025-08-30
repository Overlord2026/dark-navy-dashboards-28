import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Database, 
  Play, 
  Square, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertTriangle,
  Download,
  Upload,
  Terminal,
  History
} from 'lucide-react';
import { AdminMigration } from '@/types/bfo-platform';

export function AdminMigrations() {
  const [migrations, setMigrations] = useState<AdminMigration[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [isRunning, setIsRunning] = useState(false);
  const [selectedMigration, setSelectedMigration] = useState<string | null>(null);

  useEffect(() => {
    // Load mock migration data
    const mockMigrations: AdminMigration[] = [
      {
        id: '2024030101',
        name: 'Add IP Filing Tables',
        description: 'Create tables for intellectual property filing tracking system',
        version: '1.0.1',
        status: 'completed',
        timestamp: '2024-03-01T10:00:00Z',
        duration: 1250,
        logs: [
          'Starting migration: Add IP Filing Tables',
          'Creating table: ip_filings',
          'Creating table: ip_timeline',
          'Adding foreign key constraints',
          'Creating indexes',
          'Migration completed successfully'
        ]
      },
      {
        id: '2024030102',
        name: 'Security Alert System',
        description: 'Implement comprehensive security alerting and monitoring',
        version: '1.0.2',
        status: 'completed',
        timestamp: '2024-03-01T14:30:00Z',
        duration: 890,
        logs: [
          'Starting migration: Security Alert System',
          'Creating table: security_alerts',
          'Creating table: security_policies',
          'Setting up triggers',
          'Migration completed successfully'
        ]
      },
      {
        id: '2024030103',
        name: 'Voice Assistant Integration',
        description: 'Add voice session tracking and command logging',
        version: '1.0.3',
        status: 'failed',
        timestamp: '2024-03-02T09:15:00Z',
        duration: 450,
        logs: [
          'Starting migration: Voice Assistant Integration',
          'Creating table: voice_sessions',
          'Error: Column conflict with existing schema',
          'Rolling back changes',
          'Migration failed'
        ]
      },
      {
        id: '2024030104',
        name: 'Automation Framework',
        description: 'Set up automation engine and workflow management',
        version: '1.0.4',
        status: 'pending',
        timestamp: '2024-03-03T16:00:00Z',
        logs: []
      }
    ];
    setMigrations(mockMigrations);
  }, []);

  const runMigration = async (migrationId: string) => {
    setIsRunning(true);
    setSelectedMigration(migrationId);

    // Simulate migration execution
    await new Promise(resolve => setTimeout(resolve, 3000));

    setMigrations(prev => prev.map(m => 
      m.id === migrationId 
        ? { 
            ...m, 
            status: Math.random() > 0.1 ? 'completed' : 'failed',
            duration: Math.floor(Math.random() * 2000) + 500,
            timestamp: new Date().toISOString(),
            logs: [
              `Starting migration: ${m.name}`,
              'Checking dependencies...',
              'Applying database changes...',
              Math.random() > 0.1 ? 'Migration completed successfully' : 'Migration failed: Dependency error'
            ]
          }
        : m
    ));

    setIsRunning(false);
    setSelectedMigration(null);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'secondary',
      running: 'default',
      completed: 'success',
      failed: 'destructive'
    } as const;

    return <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>{status}</Badge>;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'running':
        return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <Database className="h-4 w-4" />;
    }
  };

  const completedMigrations = migrations.filter(m => m.status === 'completed').length;
  const failedMigrations = migrations.filter(m => m.status === 'failed').length;
  const pendingMigrations = migrations.filter(m => m.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Database Migrations</h1>
          <p className="text-muted-foreground">Manage database schema changes and system updates</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Logs
          </Button>
          <Button className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload Migration
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Migrations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{migrations.length}</div>
            <p className="text-xs text-muted-foreground">All versions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedMigrations}</div>
            <p className="text-xs text-muted-foreground">Successfully applied</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{failedMigrations}</div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingMigrations}</div>
            <p className="text-xs text-muted-foreground">Ready to run</p>
          </CardContent>
        </Card>
      </div>

      {/* Running Migration Alert */}
      {isRunning && (
        <Alert>
          <RefreshCw className="h-4 w-4 animate-spin" />
          <AlertTitle>Migration in Progress</AlertTitle>
          <AlertDescription>
            Migration {selectedMigration} is currently running. Please do not close this window.
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="migrations">Migrations</TabsTrigger>
          <TabsTrigger value="create">Create New</TabsTrigger>
          <TabsTrigger value="logs">Execution Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Migration Status</CardTitle>
                <CardDescription>Current state of database migrations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Database Version</span>
                    <Badge variant="default">1.0.2</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Last Migration</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(migrations[1]?.timestamp || '').toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Next Scheduled</span>
                    <span className="text-sm text-muted-foreground">Manual</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Auto-rollback</span>
                    <Badge variant="default">Enabled</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest migration executions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {migrations.slice(0, 4).map(migration => (
                    <div key={migration.id} className="flex items-center gap-3 p-3 border rounded">
                      {getStatusIcon(migration.status)}
                      <div className="flex-1">
                        <p className="font-medium text-sm">{migration.name}</p>
                        <p className="text-xs text-muted-foreground">
                          v{migration.version} • {new Date(migration.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                      {getStatusBadge(migration.status)}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="migrations" className="space-y-6 mt-6">
          <div className="space-y-4">
            {migrations.map(migration => (
              <Card key={migration.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-3">
                        {getStatusIcon(migration.status)}
                        {migration.name}
                        <Badge variant="outline">v{migration.version}</Badge>
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {migration.description}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(migration.status)}
                      {migration.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => runMigration(migration.id)}
                          disabled={isRunning}
                          className="flex items-center gap-2"
                        >
                          <Play className="h-4 w-4" />
                          Run
                        </Button>
                      )}
                      {migration.status === 'failed' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => runMigration(migration.id)}
                          disabled={isRunning}
                          className="flex items-center gap-2"
                        >
                          <RefreshCw className="h-4 w-4" />
                          Retry
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Migration ID:</span>
                      <p className="text-muted-foreground">{migration.id}</p>
                    </div>
                    <div>
                      <span className="font-medium">Executed:</span>
                      <p className="text-muted-foreground">
                        {new Date(migration.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium">Duration:</span>
                      <p className="text-muted-foreground">
                        {migration.duration ? `${migration.duration}ms` : 'N/A'}
                      </p>
                    </div>
                  </div>

                  {migration.logs.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Execution Log:</h4>
                      <div className="bg-accent/10 rounded p-3 font-mono text-sm max-h-32 overflow-y-auto">
                        {migration.logs.map((log, index) => (
                          <div key={index} className="text-muted-foreground">
                            {log}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="create" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Create New Migration</CardTitle>
              <CardDescription>
                Create a new database migration for schema changes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CreateMigrationForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Terminal className="h-5 w-5" />
                Execution Logs
              </CardTitle>
              <CardDescription>Detailed logs from all migration executions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-black text-green-400 p-4 rounded font-mono text-sm max-h-96 overflow-y-auto">
                  {migrations.flatMap(m => m.logs.map((log, i) => (
                    <div key={`${m.id}-${i}`} className="mb-1">
                      <span className="text-gray-500">[{new Date(m.timestamp).toISOString()}]</span>{' '}
                      <span className="text-blue-400">{m.id}</span>: {log}
                    </div>
                  )))}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download Logs
                  </Button>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CreateMigrationForm() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    version: '',
    sql: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating migration:', formData);
    // Handle migration creation
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Migration Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Add user preferences table"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="version">Version</Label>
          <Input
            id="version"
            value={formData.version}
            onChange={(e) => setFormData({ ...formData, version: e.target.value })}
            placeholder="1.0.5"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe what this migration does..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="sql">SQL Commands</Label>
        <Textarea
          id="sql"
          value={formData.sql}
          onChange={(e) => setFormData({ ...formData, sql: e.target.value })}
          placeholder="CREATE TABLE user_preferences (...);"
          rows={8}
          className="font-mono"
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit">Create Migration</Button>
        <Button type="button" variant="outline">Validate SQL</Button>
      </div>
    </form>
  );
}