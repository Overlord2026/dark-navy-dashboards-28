import React, { useState, useMemo } from 'react';
import { listReceipts } from '@/features/receipts/record';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Filter } from 'lucide-react';
import { toast } from 'sonner';
import type { AnyRDS } from '@/features/receipts/types';

export default function AdminReceiptsPanel() {
  const receipts = listReceipts();
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const receiptTypes = ['Decision-RDS', 'Consent-RDS', 'Settlement-RDS', 'Delta-RDS'];

  const filteredReceipts = useMemo(() => {
    if (selectedTypes.length === 0) return receipts;
    return receipts.filter(receipt => selectedTypes.includes(receipt.type));
  }, [receipts, selectedTypes]);

  const toggleTypeFilter = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const exportToCSV = () => {
    if (filteredReceipts.length === 0) {
      toast.error('No receipts to export');
      return;
    }

    const headers = ['ID', 'Type', 'Timestamp', 'Policy Version', 'Action', 'Result'];
    const rows = filteredReceipts.map(receipt => [
      (receipt as any).id || 'N/A',
      receipt.type,
      (receipt as any).timestamp || new Date().toISOString(),
      (receipt as any).policy_version || 'N/A',
      (receipt as any).action || 'N/A',
      (receipt as any).result || 'N/A'
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `receipts-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    toast.success('Receipts exported to CSV');
  };

  const getReceiptBadgeVariant = (type: string) => {
    switch (type) {
      case 'Decision-RDS': return 'default';
      case 'Consent-RDS': return 'secondary';
      case 'Settlement-RDS': return 'outline';
      case 'Delta-RDS': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Receipts Management
          </span>
          <Button onClick={exportToCSV} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </CardTitle>
        <CardDescription>
          View and manage all system receipts with filtering and export capabilities
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2">
          {receiptTypes.map(type => (
            <Badge
              key={type}
              variant={selectedTypes.includes(type) ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => toggleTypeFilter(type)}
            >
              {type}
            </Badge>
          ))}
          {selectedTypes.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedTypes([])}
              className="h-6 px-2 text-xs"
            >
              Clear filters
            </Button>
          )}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {receiptTypes.map(type => {
            const count = receipts.filter(r => r.type === type).length;
            return (
              <div key={type} className="text-center p-3 border rounded-lg">
                <p className="text-2xl font-bold">{count}</p>
                <p className="text-sm text-muted-foreground">{type}</p>
              </div>
            );
          })}
        </div>

        {/* Receipts Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Policy Version</TableHead>
                <TableHead>Action/Result</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReceipts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    {receipts.length === 0 ? 'No receipts found' : 'No receipts match the selected filters'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredReceipts.map((receipt, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-mono text-xs">
                      {((receipt as any).id || 'N/A').substring(0, 8)}...
                    </TableCell>
                    <TableCell>
                      <Badge variant={getReceiptBadgeVariant(receipt.type)}>
                        {receipt.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date((receipt as any).timestamp || Date.now()).toLocaleString()}
                    </TableCell>
                    <TableCell>{(receipt as any).policy_version || 'N/A'}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {(receipt as any).action && (
                          <div className="text-sm">{(receipt as any).action}</div>
                        )}
                        {(receipt as any).result && (
                          <Badge variant="outline" className="text-xs">
                            {(receipt as any).result}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}