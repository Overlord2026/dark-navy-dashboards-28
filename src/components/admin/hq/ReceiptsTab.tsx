import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Receipt, Hash, Clock } from 'lucide-react';

export function ReceiptsTab() {
  // Mock data - replace with actual Supabase query
  const receipts = [
    {
      id: '1234567890abcdef',
      entity_type: 'patent_application',
      action: 'filing_submitted',
      timestamp: '2024-01-15T10:30:00Z',
      outcome: 'approved',
      merkle_root: 'a1b2c3d4e5f6g7h8',
      status: 'anchored'
    },
    {
      id: 'abcdef1234567890',
      entity_type: 'trademark_application',
      action: 'renewal_requested',
      timestamp: '2024-01-14T15:45:00Z',
      outcome: 'pending',
      merkle_root: 'x9y8z7w6v5u4t3s2',
      status: 'pending_anchor'
    },
    {
      id: 'fedcba0987654321',
      entity_type: 'compliance_check',
      action: 'security_audit',
      timestamp: '2024-01-13T09:15:00Z',
      outcome: 'passed',
      merkle_root: 'm1n2o3p4q5r6s7t8',
      status: 'anchored'
    }
  ];

  const getOutcomeColor = (outcome: string) => {
    switch (outcome.toLowerCase()) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'passed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'anchored': return 'bg-blue-100 text-blue-800';
      case 'pending_anchor': return 'bg-orange-100 text-orange-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Receipts</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{receipts.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Anchored</CardTitle>
            <Hash className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {receipts.filter(r => r.status === 'anchored').length}
            </div>
            <p className="text-xs text-muted-foreground">Successfully anchored</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {receipts.filter(r => r.status === 'pending_anchor').length}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting anchor</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Audit Receipts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Receipt ID</TableHead>
                  <TableHead>Entity Type</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Outcome</TableHead>
                  <TableHead>Merkle Root</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {receipts.map((receipt) => (
                  <TableRow key={receipt.id}>
                    <TableCell className="font-mono text-xs">
                      {receipt.id.substring(0, 8)}...
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {receipt.entity_type.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="capitalize">
                      {receipt.action.replace('_', ' ')}
                    </TableCell>
                    <TableCell>
                      {new Date(receipt.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge className={getOutcomeColor(receipt.outcome)}>
                        {receipt.outcome}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {receipt.merkle_root.substring(0, 8)}...
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(receipt.status)}>
                        {receipt.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}