import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ReasonReceipt } from '@/types/p5';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export function ReasonCodesTimeline() {
  const [items, setItems] = useState<ReasonReceipt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReasonReceipts();
  }, []);

  const loadReasonReceipts = async () => {
    try {
      const { data } = await supabase
        .from('reason_receipts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      
      setItems((data || []).map(item => ({ ...item, reason_code: item.reason_code as any })));
    } catch (error) {
      console.error('Error loading reason receipts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading timeline...</div>;
  }

  return (
    <div className="space-y-2 max-h-96 overflow-y-auto">
      {items.length === 0 ? (
        <div className="text-center text-muted-foreground p-4">No reason receipts yet</div>
      ) : (
        items.map(item => (
          <Card key={item.id} className="p-2">
            <CardContent className="p-0">
              <div className="flex justify-between items-start text-sm">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-muted-foreground">
                      {new Date(item.created_at).toLocaleString()}
                    </span>
                    <Badge variant={item.reason_code === 'OK' ? 'default' : 'destructive'}>
                      {item.reason_code}
                    </Badge>
                  </div>
                  <div className="font-medium">{item.action_key}</div>
                  {item.explanation && (
                    <div className="text-muted-foreground">{item.explanation}</div>
                  )}
                </div>
                <div className="text-right">
                  <Badge variant={item.anchor_txid ? 'secondary' : 'outline'} className="text-xs">
                    {item.anchor_txid ? 'Anchored' : 'Local'}
                  </Badge>
                  {item.sha256 && (
                    <div className="font-mono text-xs text-muted-foreground mt-1">
                      {item.sha256.slice(0, 8)}...
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}