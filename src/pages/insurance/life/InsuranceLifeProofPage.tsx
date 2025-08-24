import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  FileText, 
  Download, 
  Eye, 
  Search,
  Archive,
  CheckCircle,
  AlertTriangle,
  Filter
} from "lucide-react";
import { listReceipts, getReceiptsByType } from "@/features/receipts/record";

export default function InsuranceLifeProofPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [dateRange, setDateRange] = useState('30');

  // Get receipts (in a real app, these would be filtered by user/tenant)
  const allReceipts = listReceipts();
  const insuranceReceipts = allReceipts.filter(r => 
    r.payload?.persona === 'insurance' || 
    r.action?.includes('insurance') ||
    r.action?.includes('1035') ||
    r.action?.includes('beneficiary') ||
    r.action?.includes('life')
  );

  const filteredReceipts = insuranceReceipts.filter(receipt => {
    const matchesSearch = !searchTerm || 
      receipt.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receipt.result?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receipt.inputs_hash?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || receipt.type === filterType;
    
    const matchesDate = (() => {
      if (dateRange === 'all') return true;
      const days = parseInt(dateRange);
      const receiptDate = new Date(receipt.timestamp);
      const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
      return receiptDate >= cutoff;
    })();
    
    return matchesSearch && matchesType && matchesDate;
  });

  const getReceiptTypeColor = (type: string) => {
    switch (type) {
      case 'Decision-RDS': return 'bg-blue-100 text-blue-800';
      case 'Consent-RDS': return 'bg-green-100 text-green-800';
      case 'Comms-RDS': return 'bg-purple-100 text-purple-800';
      case 'Engagement-RDS': return 'bg-orange-100 text-orange-800';
      case 'Vault-RDS': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getResultIcon = (result: string) => {
    switch (result) {
      case 'approve':
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'deny':
      case 'denied':
      case 'review_required':
        return <AlertTriangle className="h-4 w-4 text-amber-600" />;
      default:
        return <Eye className="h-4 w-4 text-blue-600" />;
    }
  };

  const exportReceipts = () => {
    const csv = [
      ['Timestamp', 'Type', 'Action', 'Result', 'Hash', 'Reasons'].join(','),
      ...filteredReceipts.map(receipt => [
        receipt.timestamp,
        receipt.type,
        receipt.action || 'N/A',
        receipt.result || 'N/A',
        receipt.inputs_hash || 'N/A',
        Array.isArray(receipt.reasons) ? receipt.reasons.join('; ') : 'N/A'
      ].map(field => `"${field}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `insurance_life_proof_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const summaryStats = {
    total: filteredReceipts.length,
    approved: filteredReceipts.filter(r => r.result === 'approve' || r.result === 'approved').length,
    pending: filteredReceipts.filter(r => r.result === 'review_required' || r.result === 'pending').length,
    exchanges_1035: filteredReceipts.filter(r => r.action?.includes('1035')).length,
    beneficiary_changes: filteredReceipts.filter(r => r.action?.includes('beneficiary')).length
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Life Insurance Proof & Compliance</h1>
          <p className="text-muted-foreground">
            Fiduciary proofs, audit trail, and compliance receipts
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={exportReceipts} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>Fiduciary Standard</span>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{summaryStats.total}</div>
            <div className="text-sm text-muted-foreground">Total Receipts</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{summaryStats.approved}</div>
            <div className="text-sm text-muted-foreground">Approved</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-amber-600">{summaryStats.pending}</div>
            <div className="text-sm text-muted-foreground">Pending Review</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{summaryStats.exchanges_1035}</div>
            <div className="text-sm text-muted-foreground">1035 Exchanges</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{summaryStats.beneficiary_changes}</div>
            <div className="text-sm text-muted-foreground">Beneficiary Changes</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search receipts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Decision-RDS">Decisions</SelectItem>
                  <SelectItem value="Consent-RDS">Consent</SelectItem>
                  <SelectItem value="Comms-RDS">Communications</SelectItem>
                  <SelectItem value="Engagement-RDS">Engagement</SelectItem>
                  <SelectItem value="Vault-RDS">Vault</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                  <SelectItem value="365">Last year</SelectItem>
                  <SelectItem value="all">All time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="receipts" className="space-y-6">
        <TabsList>
          <TabsTrigger value="receipts">Receipt Audit Trail</TabsTrigger>
          <TabsTrigger value="suitability">Suitability Analysis</TabsTrigger>
          <TabsTrigger value="carrier-binder">Carrier Binder</TabsTrigger>
        </TabsList>

        <TabsContent value="receipts">
          <div className="space-y-4">
            {filteredReceipts.map((receipt, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {getResultIcon(receipt.result || 'unknown')}
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{receipt.action || 'Unknown Action'}</h3>
                          <Badge className={getReceiptTypeColor(receipt.type)}>
                            {receipt.type}
                          </Badge>
                          {receipt.result && (
                            <Badge variant={receipt.result === 'approve' ? 'default' : 'secondary'}>
                              {receipt.result}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span>Hash: {receipt.inputs_hash?.slice(0, 12)}...</span>
                          <span>{new Date(receipt.timestamp).toLocaleString()}</span>
                          {receipt.reasons && Array.isArray(receipt.reasons) && (
                            <span>Reasons: {receipt.reasons.slice(0, 2).join(', ')}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Metadata */}
                  {receipt.metadata && (
                    <div className="mt-3 pt-3 border-t">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        {Object.entries(receipt.metadata).map(([key, value]) => (
                          <div key={key}>
                            <span className="text-muted-foreground">{key}:</span>
                            <span className="ml-1 font-medium">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
            
            {filteredReceipts.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No receipts found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search criteria or date range
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="suitability">
          <Card>
            <CardHeader>
              <CardTitle>1035 Exchange Suitability Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 rounded-lg bg-green-50">
                    <div className="text-2xl font-bold text-green-600">8</div>
                    <div className="text-sm text-green-700">Approved Exchanges</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-amber-50">
                    <div className="text-2xl font-bold text-amber-600">2</div>
                    <div className="text-sm text-amber-700">Pending Review</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-red-50">
                    <div className="text-2xl font-bold text-red-600">1</div>
                    <div className="text-sm text-red-700">Denied</div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="font-semibold mb-3">Recent Suitability Decisions</h4>
                  <div className="space-y-2">
                    {filteredReceipts
                      .filter(r => r.action?.includes('1035'))
                      .slice(0, 5)
                      .map((receipt, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                          <div className="flex items-center gap-3">
                            {getResultIcon(receipt.result || 'unknown')}
                            <div>
                              <div className="font-medium">{receipt.action}</div>
                              <div className="text-sm text-muted-foreground">
                                Score: {receipt.metadata?.suitability_score || 'N/A'}/100
                              </div>
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(receipt.timestamp).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="carrier-binder">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Archive className="h-5 w-5" />
                Carrier-Neutral Binder Export
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Export Package Contents</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Suitability analysis receipts</li>
                    <li>• 1035 exchange documentation</li>
                    <li>• Beneficiary change records</li>
                    <li>• Client meeting summaries</li>
                    <li>• Compliance audit trail</li>
                    <li>• Manifest with receipt verification</li>
                  </ul>
                </div>
                
                <div className="flex gap-3">
                  <Button className="flex items-center gap-2">
                    <Archive className="h-4 w-4" />
                    Generate Binder ZIP
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Download Manifest
                  </Button>
                </div>
                
                <div className="mt-6">
                  <h4 className="font-semibold mb-3">Recent Binder Exports</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 rounded-lg border">
                      <div>
                        <div className="font-medium">Life Insurance Binder - Wilson</div>
                        <div className="text-sm text-muted-foreground">
                          Contains 12 receipts, 1 suitability analysis
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">2 hours ago</span>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 rounded-lg border">
                      <div>
                        <div className="font-medium">1035 Exchange Bundle - Chen</div>
                        <div className="text-sm text-muted-foreground">
                          Contains 8 receipts, compliance verification
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">1 day ago</span>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}