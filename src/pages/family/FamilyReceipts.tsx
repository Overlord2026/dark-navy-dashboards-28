import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ToolHeader } from '@/components/tools/ToolHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { listReceipts, getReceiptsCount } from '@/features/receipts/record';
import { Search, Filter, Receipt } from 'lucide-react';

export default function FamilyReceipts() {
  const [receipts, setReceipts] = React.useState<any[]>([]);
  const [filteredReceipts, setFilteredReceipts] = React.useState<any[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterType, setFilterType] = React.useState('all');

  React.useEffect(() => {
    const loadReceipts = () => {
      const allReceipts = listReceipts();
      setReceipts(allReceipts);
      setFilteredReceipts(allReceipts);
    };

    loadReceipts();
    
    // Set up interval to refresh receipts
    const interval = setInterval(loadReceipts, 1000);
    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    let filtered = receipts;

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(receipt => receipt.type === filterType);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(receipt => 
        receipt.reasons?.some((reason: string) => 
          reason.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        receipt.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredReceipts(filtered);
  }, [receipts, searchTerm, filterType]);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getReceiptTypeColor = (type: string) => {
    switch (type) {
      case 'Decision-RDS': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'Health-RDS': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  return (
    <>
      <Helmet>
        <title>Family Receipts | Proof Slips & Activity Log</title>
        <meta name="description" content="View all your family financial activity proof slips and receipts" />
      </Helmet>
      
      <ToolHeader title="Family Receipts" />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Proof Slips</h1>
              <p className="text-muted-foreground">
                Your family's financial activity log ({getReceiptsCount()} total)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-primary" />
              <Badge variant="outline">{filteredReceipts.length} shown</Badge>
            </div>
          </div>

          {/* Search and Filter */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search receipts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="all">All Types</option>
                  <option value="Decision-RDS">Decision RDS</option>
                  <option value="Health-RDS">Health RDS</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Receipts List */}
          <div className="space-y-4">
            {filteredReceipts.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Receipt className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No receipts found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm || filterType !== 'all' 
                      ? 'Try adjusting your search or filter criteria'
                      : 'Start using tools to generate proof slips'
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredReceipts.map((receipt, index) => (
                <Card key={receipt.id || index}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge className={getReceiptTypeColor(receipt.type)}>
                            {receipt.type}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {receipt.policy_version}
                          </span>
                        </div>
                        <p className="font-medium">ID: {receipt.id}</p>
                        {receipt.reasons && (
                          <div className="space-y-1">
                            <p className="text-sm font-medium">Reasons:</p>
                            {receipt.reasons.map((reason: string, i: number) => (
                              <Badge key={i} variant="outline" className="text-xs mr-1">
                                {reason}
                              </Badge>
                            ))}
                          </div>
                        )}
                        {receipt.result && (
                          <p className="text-sm">
                            Result: <span className="font-medium">{receipt.result}</span>
                          </p>
                        )}
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        {formatTimestamp(receipt.created_at)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
    </>
  );
}