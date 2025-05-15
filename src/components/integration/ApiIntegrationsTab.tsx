
import React from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, RefreshCw, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SupabaseRequiredNotice } from './SupabaseRequiredNotice';

export const ApiIntegrationsTab: React.FC = () => {
  const apis = [
    { 
      name: 'Document API', 
      status: 'active', 
      lastChecked: '2025-05-14T23:15:00',
      endpoints: 4,
      version: 'v1.2.3'
    },
    { 
      name: 'Reporting API', 
      status: 'active', 
      lastChecked: '2025-05-14T22:30:00',
      endpoints: 7,
      version: 'v2.0.1'
    },
    { 
      name: 'User Management API', 
      status: 'active', 
      lastChecked: '2025-05-14T21:45:00',
      endpoints: 5,
      version: 'v1.5.0'
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold mb-1">API Integrations</h2>
          <p className="text-muted-foreground">Manage and monitor your API connections</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Status
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Integration
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>API Status</CardTitle>
          <CardDescription>Current status of connected APIs</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>List of all connected APIs</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>API Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Endpoints</TableHead>
                <TableHead>Last Checked</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apis.map((api) => (
                <TableRow key={api.name}>
                  <TableCell className="font-medium">{api.name}</TableCell>
                  <TableCell>
                    <Badge variant={api.status === 'active' ? 'success' : 'destructive'}>
                      {api.status === 'active' ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>{api.version}</TableCell>
                  <TableCell>{api.endpoints}</TableCell>
                  <TableCell>{new Date(api.lastChecked).toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="ghost">
                      <ExternalLink className="h-4 w-4" />
                      <span className="sr-only">View details</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <SupabaseRequiredNotice />
    </div>
  );
};
