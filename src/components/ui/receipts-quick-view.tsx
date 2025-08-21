import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Receipt, FileText, Clock } from 'lucide-react';

interface ReceiptItem {
  id: string;
  type: string;
  date: string;
  status: 'pending' | 'approved' | 'processed';
}

const mockReceipts: ReceiptItem[] = [
  { id: '1', type: 'Health-RDS', date: '2024-08-21', status: 'processed' },
  { id: '2', type: 'Consent-RDS', date: '2024-08-20', status: 'approved' },
  { id: '3', type: 'Reason Receipt', date: '2024-08-19', status: 'pending' },
];

export function ReceiptsQuickView() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processed': return 'bg-mint text-ink';
      case 'approved': return 'bg-sky text-ink';
      case 'pending': return 'bg-gold-base text-ink';
      default: return 'bg-slate/30 text-ink';
    }
  };

  return (
    <Card className="rounded-2xl shadow-soft">
      <CardHeader className="pb-3 p-4">
        <CardTitle className="text-[15px] font-semibold flex items-center gap-2">
          <Receipt className="h-4 w-4" />
          Receipts
          <Badge variant="outline" className="ml-auto text-xs">
            {mockReceipts.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-3">
        {mockReceipts.map((receipt) => (
          <div key={receipt.id} className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2 flex-1">
              <FileText className="h-3 w-3 text-gold-hi" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-ink truncate">{receipt.type}</p>
                <p className="text-xs text-slate/80">{receipt.date}</p>
              </div>
            </div>
            <Badge className={`text-xs ${getStatusColor(receipt.status)}`}>
              {receipt.status}
            </Badge>
          </div>
        ))}
        
        <div className="pt-2 border-t border-slate/20">
          <Button variant="ghost" size="sm" className="w-full text-xs">
            View All Receipts
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}