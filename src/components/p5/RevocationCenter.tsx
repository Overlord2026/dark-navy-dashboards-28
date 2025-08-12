import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ConsentToken } from '@/types/p5';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export function RevocationCenter() {
  const [tokens, setTokens] = useState<ConsentToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [revoking, setRevoking] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadTokens();
  }, []);

  const loadTokens = async () => {
    try {
      const { data } = await supabase
        .from('consent_tokens')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      setTokens(data || []);
    } catch (error) {
      console.error('Error loading tokens:', error);
    } finally {
      setLoading(false);
    }
  };

  const revoke = async (id: string) => {
    setRevoking(id);
    try {
      const { error } = await supabase.functions.invoke('propagate-revocation', { 
        body: { 
          consent_id: id, 
          reason: 'user request' 
        } 
      });
      
      if (error) throw error;
      
      toast({ title: "Success", description: "Consent token revoked successfully" });
      await loadTokens(); // Refresh the list
    } catch (error) {
      console.error('Error revoking token:', error);
      toast({ 
        title: "Error", 
        description: error instanceof Error ? error.message : "Failed to revoke token",
        variant: "destructive" 
      });
    } finally {
      setRevoking(null);
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading consent tokens...</div>;
  }

  return (
    <div className="space-y-2 max-h-96 overflow-y-auto">
      {tokens.length === 0 ? (
        <div className="text-center text-muted-foreground p-4">No consent tokens found</div>
      ) : (
        tokens.map(token => (
          <Card key={token.id} className="p-2">
            <CardContent className="p-0">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-xs">{token.id.slice(0, 8)}...</span>
                    <Badge variant={
                      token.status === 'active' ? 'default' : 
                      token.status === 'revoked' ? 'destructive' : 'secondary'
                    }>
                      {token.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Subject: {token.subject_user.slice(0, 8)}...
                  </div>
                  {token.scopes && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Scopes: {Object.keys(token.scopes).join(', ')}
                    </div>
                  )}
                </div>
                <div className="ml-4">
                  {token.status === 'active' && (
                    <Button 
                      onClick={() => revoke(token.id)} 
                      variant="destructive" 
                      size="sm"
                      disabled={revoking === token.id}
                    >
                      {revoking === token.id ? "Revoking..." : "Revoke"}
                    </Button>
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