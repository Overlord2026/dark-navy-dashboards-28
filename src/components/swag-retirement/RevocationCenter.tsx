import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Copy, Loader2 } from "lucide-react";

interface ConsentToken {
  id: string;
  status: string;
  created_at: string;
  scopes: Record<string, unknown>;
  conditions: Record<string, unknown>;
}

function safeParse<T>(value: unknown, fallback: T): T {
  try {
    if (typeof value === "string") return JSON.parse(value) as T;
    if (typeof value === "object" && value !== null) return value as T;
  } catch {}
  return fallback;
}

function fmtDate(d?: string | null) {
  if (!d) return "—";
  try { return new Date(d).toLocaleString(); } catch { return d; }
}

export function RevocationCenter() {
  const [tokens, setTokens] = useState<ConsentToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [revoking, setRevoking] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadTokens();
  }, []);

  const loadTokens = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("consent_tokens")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;

      const parsed = (data || []).map((t: any) => ({
        ...t,
        scopes: safeParse<Record<string, unknown>>(t.scopes, {}),
        conditions: safeParse<Record<string, unknown>>(t.conditions, {}),
      })) as ConsentToken[];

      setTokens(parsed);
    } catch (error: any) {
      console.error("Error loading tokens:", error);
      toast({ title: "Error", description: error.message ?? "Failed to load tokens.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const revoke = async (id: string) => {
    setRevoking(id);
    try {
      const { error } = await supabase.functions.invoke("propagate-revocation", {
        body: { consent_id: id, reason: "user request" },
      });
      if (error) throw error;

      toast({ title: "Success", description: "Consent token revoked successfully" });
      await loadTokens();
    } catch (error: any) {
      console.error("Error revoking token:", error);
      toast({
        title: "Error",
        description: error?.message ?? "Failed to revoke token",
        variant: "destructive",
      });
    } finally {
      setRevoking(null);
    }
  };

  const copyId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      toast({ title: "Copied", description: "Token ID copied to clipboard." });
    } catch {
      toast({ title: "Copy failed", description: "Unable to copy token ID.", variant: "destructive" });
    }
  };

  if (loading) {
    return <div className="text-center p-4 text-sm text-muted-foreground">Loading consent tokens…</div>;
  }

  return (
    <div className="space-y-2 max-h-96 overflow-y-auto">
      {tokens.length === 0 ? (
        <div className="text-center text-muted-foreground p-4">No consent tokens found</div>
      ) : (
        tokens.map((token) => (
          <Card key={token.id} className="p-2">
            <CardContent className="p-0">
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs">{token.id.slice(0, 8)}…</span>
                    <Badge
                      variant={
                        token.status === "active"
                          ? "default"
                          : token.status === "revoked"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {token.status}
                    </Badge>
                    <span className="text-[11px] text-muted-foreground">Created: {fmtDate(token.created_at as any)}</span>
                  </div>
                  {token.scopes && Object.keys(token.scopes as any).length > 0 && (
                    <div className="text-[11px] text-muted-foreground mt-1">
                      Scopes: {Object.keys(token.scopes as any).join(", ")}
                    </div>
                  )}
                </div>
                <div className="ml-2 flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => copyId(token.id)}>
                    <Copy className="h-3.5 w-3.5 mr-1" /> Copy ID
                  </Button>
                  {token.status === "active" && (
                    <Button
                      onClick={() => revoke(token.id)}
                      variant="destructive"
                      size="sm"
                      disabled={revoking === token.id}
                    >
                      {revoking === token.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Revoke"}
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