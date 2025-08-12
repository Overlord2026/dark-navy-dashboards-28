import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Download, 
  Eye, 
  Shield,
  Calendar,
  Hash
} from 'lucide-react';

interface Receipt {
  id: string;
  type: 'outcome' | 'monitoring';
  timestamp: string;
  phase?: string;
  sha256: string;
  metrics: {
    ISP?: number;
    DGBP?: number;
    OS?: number;
  };
}

interface ReceiptTableProps {
  receipts: Receipt[];
}

export const ReceiptTable: React.FC<ReceiptTableProps> = ({ 
  receipts = [
    {
      id: '1',
      type: 'outcome',
      timestamp: '2024-01-15T10:30:00Z',
      sha256: 'a1b2c3d4e5f6...',
      metrics: { ISP: 0.87, DGBP: 0.15, OS: 84 }
    },
    {
      id: '2',
      type: 'monitoring',
      timestamp: '2024-01-14T15:45:00Z',
      phase: 'income_now',
      sha256: 'f6e5d4c3b2a1...',
      metrics: { ISP: 0.85, DGBP: 0.18, OS: 82 }
    },
    {
      id: '3',
      type: 'outcome',
      timestamp: '2024-01-10T09:15:00Z',
      sha256: '1a2b3c4d5e6f...',
      metrics: { ISP: 0.83, DGBP: 0.20, OS: 80 }
    }
  ]
}) => {
  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getReceiptTypeColor = (type: string) => {
    switch (type) {
      case 'outcome': return 'bg-blue-100 text-blue-800';
      case 'monitoring': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPercentage = (value?: number) => {
    return value ? `${(value * 100).toFixed(1)}%` : 'N/A';
  };

  const truncateHash = (hash: string) => {
    return `${hash.substring(0, 8)}...${hash.substring(hash.length - 8)}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Analysis Receipts
            </CardTitle>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Cryptographically signed records of all SWAG analysis results and monitoring events.
          </p>
        </CardContent>
      </Card>

      {/* Receipts List */}
      <div className="space-y-4">
        {receipts.map((receipt) => (
          <Card key={receipt.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Receipt #{receipt.id}</span>
                      <Badge className={getReceiptTypeColor(receipt.type)}>
                        {receipt.type}
                      </Badge>
                      {receipt.phase && (
                        <Badge variant="outline">{receipt.phase}</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(receipt.timestamp)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>

              {/* Metrics Preview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-muted-foreground">ISP</div>
                  <div className="text-lg font-bold">{formatPercentage(receipt.metrics.ISP)}</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-muted-foreground">DGBP</div>
                  <div className="text-lg font-bold">{formatPercentage(receipt.metrics.DGBP)}</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-muted-foreground">Outcome Score</div>
                  <div className="text-lg font-bold">{receipt.metrics.OS || 'N/A'}</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-muted-foreground">Status</div>
                  <div className="text-lg font-bold text-green-600">Verified</div>
                </div>
              </div>

              {/* Hash */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground border-t pt-3">
                <Hash className="h-4 w-4" />
                <span>SHA256:</span>
                <code className="bg-gray-100 px-2 py-1 rounded font-mono">
                  {truncateHash(receipt.sha256)}
                </code>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {receipts.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Receipts Found</h3>
            <p className="text-muted-foreground">
              Analysis receipts will appear here after running SWAG calculations.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};