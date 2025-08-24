import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Shield, 
  Download, 
  Search, 
  FileText, 
  Scale, 
  Lock,
  Hash,
  Calendar,
  User,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { getReceipts } from '@/features/receipts/record';

interface Receipt {
  id: string;
  type: string;
  timestamp: string;
  reasons: string[];
  result: string;
  policy_version: string;
  inputs_hash: string;
  anchor_ref?: any;
}

export default function AttorneyProofPage() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [filteredReceipts, setFilteredReceipts] = useState<Receipt[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterResult, setFilterResult] = useState('all');

  useEffect(() => {
    const allReceipts = getReceipts();
    setReceipts(allReceipts);
    setFilteredReceipts(allReceipts);
  }, []);

  useEffect(() => {
    let filtered = receipts;

    if (searchTerm) {
      filtered = filtered.filter(receipt => 
        receipt.reasons.some(reason => 
          reason.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        receipt.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(receipt => receipt.type === filterType);
    }

    if (filterResult !== 'all') {
      filtered = filtered.filter(receipt => receipt.result === filterResult);
    }

    setFilteredReceipts(filtered);
  }, [receipts, searchTerm, filterType, filterResult]);

  const handleExportCSV = () => {
    const csvContent = [
      ['ID', 'Type', 'Timestamp', 'Result', 'Reasons', 'Policy Version', 'Hash', 'Anchored'].join(','),
      ...filteredReceipts.map(receipt => [
        receipt.id,
        receipt.type,
        receipt.timestamp,
        receipt.result,
        receipt.reasons.join(';'),
        receipt.policy_version,
        receipt.inputs_hash,
        receipt.anchor_ref ? 'Yes' : 'No'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attorney_receipts_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getReceiptTypeIcon = (type: string) => {
    switch (type) {
      case 'Decision-RDS': return <Scale className="h-4 w-4" />;
      case 'Consent-RDS': return <User className="h-4 w-4" />;
      case 'Vault-RDS': return <FileText className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case 'approve': return 'bg-green-500/10 text-green-700 border-green-200';
      case 'deny': return 'bg-red-500/10 text-red-700 border-red-200';
      default: return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  const complianceMetrics = {
    total_receipts: receipts.length,
    privilege_protected: receipts.filter(r => r.reasons.some(reason => 
      reason.includes('PRIVILEGE') || reason.includes('ATTORNEY_CLIENT')
    )).length,
    anchored_receipts: receipts.filter(r => r.anchor_ref).length,
    conflict_checks: receipts.filter(r => r.reasons.includes('CONFLICT_SEARCH_EXECUTED')).length
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Attorney Proof & Compliance</h1>
          <p className="text-muted-foreground">
            Review audit trails, compliance receipts, and privilege-protected records
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleExportCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Compliance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center p-4">
            <Shield className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">{complianceMetrics.total_receipts}</p>
              <p className="text-sm text-muted-foreground">Total Receipts</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-4">
            <Lock className="h-8 w-8 text-red-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">{complianceMetrics.privilege_protected}</p>
              <p className="text-sm text-muted-foreground">Privilege Protected</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-4">
            <Hash className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">{complianceMetrics.anchored_receipts}</p>
              <p className="text-sm text-muted-foreground">Anchored Receipts</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-4">
            <Scale className="h-8 w-8 text-orange-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">{complianceMetrics.conflict_checks}</p>
              <p className="text-sm text-muted-foreground">Conflict Checks</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Receipt Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search receipts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Decision-RDS">Decision-RDS</SelectItem>
                <SelectItem value="Consent-RDS">Consent-RDS</SelectItem>
                <SelectItem value="Vault-RDS">Vault-RDS</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterResult} onValueChange={setFilterResult}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by result" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Results</SelectItem>
                <SelectItem value="approve">Approved</SelectItem>
                <SelectItem value="deny">Denied</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Receipts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Compliance Receipts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredReceipts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No receipts found matching your criteria
              </div>
            ) : (
              filteredReceipts.map((receipt) => (
                <div key={receipt.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        {getReceiptTypeIcon(receipt.type)}
                        <span className="font-medium">{receipt.type}</span>
                        <Badge className={getResultColor(receipt.result)}>
                          {receipt.result === 'approve' ? (
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                          ) : (
                            <AlertTriangle className="h-3 w-3 mr-1" />
                          )}
                          {receipt.result}
                        </Badge>
                        {receipt.anchor_ref && (
                          <Badge variant="outline">
                            <Hash className="h-3 w-3 mr-1" />
                            Anchored
                          </Badge>
                        )}
                        {receipt.reasons.some(r => r.includes('PRIVILEGE')) && (
                          <Badge variant="outline" className="text-red-700 border-red-200">
                            <Lock className="h-3 w-3 mr-1" />
                            Privilege Protected
                          </Badge>
                        )}
                      </div>

                      <div className="text-sm text-muted-foreground">
                        ID: {receipt.id}
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(receipt.timestamp).toLocaleString()}
                        </div>
                        <div>
                          Policy: {receipt.policy_version}
                        </div>
                      </div>

                      <div>
                        <div className="text-sm font-medium mb-1">Reasons:</div>
                        <div className="flex flex-wrap gap-1">
                          {receipt.reasons.map((reason, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {reason}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="text-xs text-muted-foreground font-mono">
                        Hash: {receipt.inputs_hash}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Compliance Notice */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="p-4">
          <div className="flex items-start space-x-2">
            <Shield className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-800">Attorney-Client Privilege Protection</h4>
              <p className="text-sm text-yellow-700">
                All receipts in this system are designed to protect attorney-client privilege. 
                Only content hashes and decision metadata are stored. Privileged communications 
                are never included in compliance records.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}