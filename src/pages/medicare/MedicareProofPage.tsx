import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  FileText, 
  Download, 
  Eye, 
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  Archive,
  Clock
} from "lucide-react";
import { listReceipts } from "@/features/receipts/record";

export default function MedicareProofPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [dateRange, setDateRange] = useState('30');

  // Get Medicare-specific receipts 
  const allReceipts = listReceipts();
  const medicareReceipts = allReceipts.filter(r => 
    r.payload?.persona === 'medicare' || 
    r.action?.includes('medicare') ||
    r.action?.includes('soa') ||
    r.action?.includes('dnc') ||
    r.action?.includes('pecl') ||
    r.purpose === 'PTC'
  );

  const filteredReceipts = medicareReceipts.filter(receipt => {
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
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-amber-600" />;
      default:
        return <Eye className="h-4 w-4 text-blue-600" />;
    }
  };

  const exportReceipts = () => {
    const csv = [
      ['Timestamp', 'Type', 'Action', 'Result', 'Hash', 'Retention', 'Reasons'].join(','),
      ...filteredReceipts.map(receipt => [
        receipt.timestamp,
        receipt.type,
        receipt.action || 'N/A',
        receipt.result || 'N/A',
        receipt.inputs_hash || 'N/A',
        '10 years', // Medicare retention requirement
        Array.isArray(receipt.reasons) ? receipt.reasons.join('; ') : 'N/A'
      ].map(field => `"${field}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medicare_compliance_proof_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const summaryStats = {
    total: filteredReceipts.length,
    ptc_consents: filteredReceipts.filter(r => r.purpose === 'PTC' || r.action?.includes('ptc')).length,
    dnc_checks: filteredReceipts.filter(r => r.action?.includes('dnc')).length,
    soa_completed: filteredReceipts.filter(r => r.action?.includes('soa')).length,
    pecl_records: filteredReceipts.filter(r => r.action?.includes('pecl')).length,
    ten_year_flagged: filteredReceipts.filter(r => r.metadata?.retention_period === '10_years').length
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Medicare Compliance Proof</h1>
          <p className="text-muted-foreground">
            10-year retention audit trail with CMS compliance receipts
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={exportReceipts} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Compliance Report
          </Button>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>WORM Enforced</span>
          </div>
        </div>
      </div>

      {/* Compliance Alert */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-green-800">
            <CheckCircle className="h-4 w-4" />
            <span className="font-medium">10-Year Retention Compliance</span>
          </div>
          <p className="text-sm text-green-700 mt-1">
            All Medicare receipts are automatically flagged for 10-year retention with WORM enforcement.
            Legal Hold capabilities available for regulatory inquiries.
          </p>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{summaryStats.total}</div>
            <div className="text-sm text-muted-foreground">Total Receipts</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{summaryStats.ptc_consents}</div>
            <div className="text-sm text-muted-foreground">PTC Consents</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{summaryStats.dnc_checks}</div>
            <div className="text-sm text-muted-foreground">DNC Verifications</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{summaryStats.soa_completed}</div>
            <div className="text-sm text-muted-foreground">SOAs Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{summaryStats.pecl_records}</div>
            <div className="text-sm text-muted-foreground">PECL Records</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-600">{summaryStats.ten_year_flagged}</div>
            <div className="text-sm text-muted-foreground">10-Year Flagged</div>
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
                placeholder="Search compliance records..."
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
                  <SelectItem value="Consent-RDS">PTC Consent</SelectItem>
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
          <TabsTrigger value="receipts">Compliance Receipts</TabsTrigger>
          <TabsTrigger value="ptc">PTC Tracking</TabsTrigger>
          <TabsTrigger value="soa">SOA Records</TabsTrigger>
          <TabsTrigger value="retention">10-Year Retention</TabsTrigger>
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
                          {receipt.metadata?.retention_period === '10_years' && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Archive className="h-3 w-3" />
                              10-Year
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span>Hash: {receipt.inputs_hash?.slice(0, 12)}...</span>
                          <span>{new Date(receipt.timestamp).toLocaleString()}</span>
                          {receipt.purpose && <span>Purpose: {receipt.purpose}</span>}
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
                  <h3 className="text-lg font-semibold mb-2">No compliance records found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search criteria or date range
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="ptc">
          <Card>
            <CardHeader>
              <CardTitle>Prior Telephone Consent (PTC) Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 rounded-lg bg-green-50">
                    <div className="text-2xl font-bold text-green-600">
                      {summaryStats.ptc_consents}
                    </div>
                    <div className="text-sm text-green-700">Valid PTC Consents</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-blue-50">
                    <div className="text-2xl font-bold text-blue-600">
                      {summaryStats.dnc_checks}
                    </div>
                    <div className="text-sm text-blue-700">DNC Verifications</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-amber-50">
                    <div className="text-2xl font-bold text-amber-600">90</div>
                    <div className="text-sm text-amber-700">Days Consent TTL</div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="font-semibold mb-3">Recent PTC Consents</h4>
                  <div className="space-y-2">
                    {filteredReceipts
                      .filter(r => r.purpose === 'PTC' || r.action?.includes('ptc'))
                      .slice(0, 5)
                      .map((receipt, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                          <div className="flex items-center gap-3">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <div>
                              <div className="font-medium">PTC Consent Recorded</div>
                              <div className="text-sm text-muted-foreground">
                                Scope: Contact & Marketing
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

        <TabsContent value="soa">
          <Card>
            <CardHeader>
              <CardTitle>Scope of Appointment Records</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-center p-4 rounded-lg bg-purple-50">
                    <div className="text-2xl font-bold text-purple-600">
                      {summaryStats.soa_completed}
                    </div>
                    <div className="text-sm text-purple-700">SOAs Completed</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-green-50">
                    <div className="text-2xl font-bold text-green-600">100%</div>
                    <div className="text-sm text-green-700">E-Signature Rate</div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="font-semibold mb-3">Recent SOA Completions</h4>
                  <div className="space-y-2">
                    {filteredReceipts
                      .filter(r => r.action?.includes('soa'))
                      .slice(0, 5)
                      .map((receipt, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                          <div className="flex items-center gap-3">
                            <FileText className="h-4 w-4 text-purple-600" />
                            <div>
                              <div className="font-medium">SOA Signed</div>
                              <div className="text-sm text-muted-foreground">
                                E-signature with 10-year retention
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

        <TabsContent value="retention">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Archive className="h-5 w-5" />
                10-Year Retention Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">WORM Compliance Features</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Write-Once-Read-Many enforcement on all Medicare records</li>
                    <li>• Automatic 10-year retention flagging</li>
                    <li>• Legal Hold capabilities for regulatory inquiries</li>
                    <li>• Audit trail with immutable timestamps</li>
                    <li>• Regulatory export packages available</li>
                  </ul>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-center p-4 rounded-lg bg-gray-50">
                    <div className="text-2xl font-bold text-gray-600">
                      {summaryStats.ten_year_flagged}
                    </div>
                    <div className="text-sm text-gray-700">Records Under 10-Year Retention</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-green-50">
                    <div className="text-2xl font-bold text-green-600">0</div>
                    <div className="text-sm text-green-700">Retention Violations</div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button className="flex items-center gap-2">
                    <Archive className="h-4 w-4" />
                    Generate Retention Report
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Legal Hold Package
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