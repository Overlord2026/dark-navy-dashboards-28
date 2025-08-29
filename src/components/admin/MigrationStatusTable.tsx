import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertTriangle, FileText } from 'lucide-react';

interface Migration {
  version: string;
  name: string;
  description: string;
  file_path: string;
  applied: boolean;
  applied_at: string | null;
  checksum: string | null;
}

interface MigrationStatusTableProps {
  migrations: Migration[];
}

export default function MigrationStatusTable({ migrations }: MigrationStatusTableProps) {
  const getStatusIcon = (applied: boolean) => {
    if (applied) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    return <Clock className="h-4 w-4 text-orange-500" />;
  };

  const getStatusBadge = (applied: boolean) => {
    if (applied) {
      return <Badge variant="default" className="bg-green-100 text-green-800">Applied</Badge>;
    }
    return <Badge variant="secondary" className="bg-orange-100 text-orange-800">Pending</Badge>;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not applied';
    return new Date(dateString).toLocaleString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Migration Status
        </CardTitle>
        <CardDescription>
          Current status of all database migration files
        </CardDescription>
      </CardHeader>
      <CardContent>
        {migrations.length === 0 ? (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <AlertTriangle className="h-5 w-5 mr-2" />
            No migrations found. Check your migration files directory.
          </div>
        ) : (
          <div className="space-y-3">
            {migrations.map((migration, index) => (
              <div key={migration.version}>
                <div className="flex items-start justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
                  <div className="flex items-start gap-3 flex-1">
                    {getStatusIcon(migration.applied)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm">{migration.name}</h4>
                        {getStatusBadge(migration.applied)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {migration.description}
                      </p>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div>Version: <code className="bg-background px-1 rounded">{migration.version}</code></div>
                        <div>File: <code className="bg-background px-1 rounded">{migration.file_path}</code></div>
                        {migration.checksum && (
                          <div>Checksum: <code className="bg-background px-1 rounded text-xs">{migration.checksum}</code></div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-sm ml-4">
                    <div className="text-muted-foreground">
                      {formatDate(migration.applied_at)}
                    </div>
                    {migration.applied && (
                      <div className="text-xs text-green-600 mt-1">
                        ✓ Success
                      </div>
                    )}
                  </div>
                </div>
                {index < migrations.length - 1 && (
                  <div className="h-px bg-border my-2" />
                )}
              </div>
            ))}
          </div>
        )}
        
        {migrations.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-900">Migration Safety</p>
                <p className="text-blue-700 mt-1">
                  All migrations are idempotent and safe to run multiple times. 
                  Run <code className="bg-blue-100 px-1 rounded">npm run db:migrate:dev</code> to apply pending migrations.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}