import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { getEnvironmentConfig } from "@/utils/environment";

export default function DevTryPage() {
  const [orgId, setOrgId] = useState("org_awmlabs");
  const [matterType, setMatterType] = useState("PersonalInjury");
  const [receiptId, setReceiptId] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const env = getEnvironmentConfig();

  // Guard: only show in non-production
  if (env.isProduction) {
    return (
      <div className="container mx-auto py-8">
        <Alert>
          <AlertDescription>
            This page is only available in development environments.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const handleCreateReceipt = async () => {
    setLoading("create");
    setError(null);
    setResults(null);

    try {
      const piPayload = {
        org_id: orgId,
        matter_type: matterType,
        disclaimers: [
          'Personal injury consultation recorded for legal compliance',
          'Attorney-client privilege may apply to this conversation', 
          'Recording stored securely per state bar requirements'
        ],
        sample_data: {
          client_name: 'Jane Doe',
          incident_date: '2024-01-15', 
          injury_type: 'auto_accident'
        }
      };

      const response = await fetch('/api/voice/intake/finish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(piPayload)
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      setResults({ type: 'create', data });
      setReceiptId(data.receipt_id);
      toast({
        title: "Receipt Created",
        description: `Receipt ID: ${data.receipt_id}`
      });
    } catch (err: any) {
      setError(err.message || 'Failed to create receipt');
      toast({
        title: "Error",
        description: err.message || 'Failed to create receipt',
        variant: "destructive"
      });
    } finally {
      setLoading(null);
    }
  };

  const handleSignReceipt = async () => {
    if (!receiptId) {
      setError("Please enter a receipt ID");
      return;
    }

    setLoading("sign");
    setError(null);
    setResults(null);

    try {
      const response = await fetch('/api/voice/intake/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receipt_id: receiptId })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      setResults({ type: 'sign', data });
      toast({
        title: "Receipt Signed",
        description: `Signatures count: ${data.count || 0}`
      });
    } catch (err: any) {
      setError(err.message || 'Failed to sign receipt');
      toast({
        title: "Error",
        description: err.message || 'Failed to sign receipt',
        variant: "destructive"
      });
    } finally {
      setLoading(null);
    }
  };

  const handleExportBundle = async () => {
    if (!receiptId) {
      setError("Please enter a receipt ID");
      return;
    }

    setLoading("export");
    setError(null);
    setResults(null);

    try {
      const response = await fetch('/api/voice/intake/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receipt_id: receiptId })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      setResults({ type: 'export', data });
      toast({
        title: "Evidence Bundle Exported",
        description: "Download link generated"
      });
    } catch (err: any) {
      setError(err.message || 'Failed to export bundle');
      toast({
        title: "Error",
        description: err.message || 'Failed to export bundle',
        variant: "destructive"
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">AIES Receipt Try-It Tool</h1>
        <p className="text-muted-foreground mt-2">
          Development tool for testing AIES receipt creation, signing, and export
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
            <CardDescription>
              Set up your test parameters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="orgId">Organization ID</Label>
              <Input
                id="orgId"
                value={orgId}
                onChange={(e) => setOrgId(e.target.value)}
                placeholder="org_awmlabs"
              />
            </div>

            <div>
              <Label htmlFor="matterType">Matter Type</Label>
              <Select value={matterType} onValueChange={setMatterType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PersonalInjury">Personal Injury</SelectItem>
                  <SelectItem value="ContractDispute">Contract Dispute</SelectItem>
                  <SelectItem value="FamilyLaw">Family Law</SelectItem>
                  <SelectItem value="CriminalDefense">Criminal Defense</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="receiptId">Receipt ID</Label>
              <Input
                id="receiptId"
                value={receiptId}
                onChange={(e) => setReceiptId(e.target.value)}
                placeholder="Enter receipt ID or create new"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
            <CardDescription>
              Test the AIES receipt workflow
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={handleCreateReceipt}
              disabled={loading === "create"}
              className="w-full"
            >
              {loading === "create" ? "Creating..." : "1. Create PI Receipt"}
            </Button>

            <Button
              onClick={handleSignReceipt}
              disabled={loading === "sign" || !receiptId}
              variant="outline"
              className="w-full"
            >
              {loading === "sign" ? "Signing..." : "2. Sign Receipt"}
            </Button>

            <Button
              onClick={handleExportBundle}
              disabled={loading === "export" || !receiptId}
              variant="outline"
              className="w-full"
            >
              {loading === "export" ? "Exporting..." : "3. Export Evidence Bundle"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {error && (
        <Alert className="mt-6" variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {results && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Results</CardTitle>
          </CardHeader>
          <CardContent>
            {results.type === 'create' && (
              <div>
                <p className="font-medium">Receipt Created Successfully</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Receipt ID: {results.data.receipt_id}
                </p>
                <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto">
                  {JSON.stringify(results.data, null, 2)}
                </pre>
              </div>
            )}

            {results.type === 'sign' && (
              <div>
                <p className="font-medium">Receipt Signed Successfully</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Signatures count: {results.data.count || 0}
                </p>
                <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto">
                  {JSON.stringify(results.data, null, 2)}
                </pre>
              </div>
            )}

            {results.type === 'export' && (
              <div>
                <p className="font-medium">Evidence Bundle Exported</p>
                {results.data.download_url && (
                  <a
                    href={results.data.download_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-primary hover:underline"
                  >
                    Download Evidence Bundle
                  </a>
                )}
                <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto">
                  {JSON.stringify(results.data, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}