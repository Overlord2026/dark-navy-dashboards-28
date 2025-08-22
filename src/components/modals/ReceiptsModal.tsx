import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, Receipt, Search, Calendar, Download, CheckCircle, Clock, X } from 'lucide-react';

interface ReceiptsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MOCK_RECEIPTS = [
  {
    id: '1',
    type: 'document_upload',
    title: 'Estate Documents Upload',
    description: 'Uploaded Will, Trust, and POA documents to secure vault',
    timestamp: '2024-01-22T10:30:00Z',
    verified: true,
    category: 'Estate Planning'
  },
  {
    id: '2',
    type: 'calculation_run',
    title: 'Retirement Analysis',
    description: 'Generated retirement roadmap with Monte Carlo analysis',
    timestamp: '2024-01-22T09:15:00Z',
    verified: true,
    category: 'Financial Planning'
  },
  {
    id: '3',
    type: 'advisor_invite',
    title: 'Professional Invitation',
    description: 'Sent collaboration invite to financial advisor',
    timestamp: '2024-01-21T16:45:00Z',
    verified: false,
    category: 'Collaboration'
  },
  {
    id: '4',
    type: 'account_link',
    title: 'Bank Account Connected',
    description: 'Linked primary checking account for analysis',
    timestamp: '2024-01-21T14:20:00Z',
    verified: true,
    category: 'Data Integration'
  },
  {
    id: '5',
    type: 'compliance_check',
    title: 'RMD Compliance Review',
    description: 'Verified required minimum distribution calculations',
    timestamp: '2024-01-21T11:30:00Z',
    verified: true,
    category: 'Tax Compliance'
  }
];

const RECEIPT_TYPES = {
  document_upload: { label: 'Document', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100' },
  account_link: { label: 'Account', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' },
  advisor_invite: { label: 'Invite', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100' },
  calculation_run: { label: 'Analysis', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100' },
  compliance_check: { label: 'Compliance', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100' }
};

export function ReceiptsModal({ isOpen, onClose }: ReceiptsModalProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterType, setFilterType] = React.useState<string>('all');
  const [filteredReceipts, setFilteredReceipts] = React.useState(MOCK_RECEIPTS);

  const handleEscapeKey = React.useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  React.useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      return () => document.removeEventListener('keydown', handleEscapeKey);
    }
  }, [isOpen, handleEscapeKey]);

  React.useEffect(() => {
    let filtered = MOCK_RECEIPTS;

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(receipt => receipt.type === filterType);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(receipt => 
        receipt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        receipt.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        receipt.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredReceipts(filtered);
  }, [searchTerm, filterType]);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-[800px] max-h-[80vh] overflow-hidden flex flex-col"
        aria-describedby="receipts-description"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="w-5 h-5" />
            Proof Slips & Receipts
          </DialogTitle>
          <DialogDescription id="receipts-description">
            View and verify all cryptographic proof slips for your family workspace activities
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 space-y-4 overflow-hidden">
          {/* Search and Filter Controls */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search receipts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 min-h-[44px]"
              />
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px] min-h-[44px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="document_upload">Documents</SelectItem>
                <SelectItem value="calculation_run">Analysis</SelectItem>
                <SelectItem value="account_link">Accounts</SelectItem>
                <SelectItem value="advisor_invite">Invitations</SelectItem>
                <SelectItem value="compliance_check">Compliance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Showing {filteredReceipts.length} of {MOCK_RECEIPTS.length} receipts
            </span>
            <Button variant="ghost" size="sm" className="h-8">
              <Download className="w-4 h-4 mr-2" />
              Export All
            </Button>
          </div>

          {/* Receipts List */}
          <div className="flex-1 overflow-y-auto space-y-2 max-h-[400px]">
            {filteredReceipts.map((receipt) => {
              const typeConfig = RECEIPT_TYPES[receipt.type as keyof typeof RECEIPT_TYPES];
              return (
                <Card key={receipt.id} className="hover:shadow-sm transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className={typeConfig.color}>
                            {typeConfig.label}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {receipt.category}
                          </Badge>
                          {receipt.verified ? (
                            <CheckCircle className="w-4 h-4 text-green-600" aria-label="Verified" />
                          ) : (
                            <Clock className="w-4 h-4 text-orange-500" aria-label="Pending verification" />
                          )}
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-sm">{receipt.title}</h4>
                          <p className="text-xs text-muted-foreground">{receipt.description}</p>
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <time dateTime={receipt.timestamp}>
                              {formatTimestamp(receipt.timestamp)}
                            </time>
                          </div>
                          <span className="font-mono">ID: {receipt.id}</span>
                        </div>
                      </div>
                      
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Download className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            
            {filteredReceipts.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Receipt className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No receipts found matching your criteria</p>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose} className="min-h-[44px]">
              <X className="w-4 h-4 mr-2" />
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}