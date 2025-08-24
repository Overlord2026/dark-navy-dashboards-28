import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, CheckCircle, FileText, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { BeneficiaryMismatch } from '@/features/estate/beneficiary/sync';
import { recordReceipt } from '@/features/receipts/record';
import { buildFixLetterPdf } from '@/features/estate/beneficiary/fixPdf';
import { storeInVault } from '@/features/vault/api';
import { useToast } from '@/hooks/use-toast';

interface BeneficiaryCenterProps {
  clientId: string;
}

export function BeneficiaryCenter({ clientId }: BeneficiaryCenterProps) {
  const [mismatches, setMismatches] = useState<BeneficiaryMismatch[]>([]);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [isFixingAll, setIsFixingAll] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load mismatches from localStorage (in real app, would come from API)
    const storedMismatches = JSON.parse(localStorage.getItem('beneficiary_mismatches') || '[]');
    const clientMismatches = storedMismatches.filter((m: any) => m.clientId === clientId);
    setMismatches(clientMismatches);

    // Load last sync time
    const lastSyncTime = localStorage.getItem('last_beneficiary_sync');
    if (lastSyncTime) {
      setLastSync(new Date(lastSyncTime));
    }
  }, [clientId]);

  const handleFixAll = async () => {
    setIsFixingAll(true);
    try {
      for (const mismatch of mismatches) {
        // Generate letter PDF
        const pdf = await buildFixLetterPdf({
          clientId,
          accountId: mismatch.accountId,
          intent: mismatch.intent,
          current: mismatch.current
        });

        // Store in vault
        await storeInVault(pdf, `beneficiary-fix-${mismatch.accountId}.pdf`, true);

        // Record Decision-RDS receipt
        await recordReceipt({
          type: 'Decision-RDS',
          action: 'beneficiary.fix',
          reasons: ['BENEFICIARY_FIX'],
          created_at: new Date().toISOString()
        } as any);
      }

      toast({
        title: "Fix Letters Generated",
        description: `Generated ${mismatches.length} beneficiary fix letters and stored in vault.`,
      });

      // Clear mismatches after fixing
      setMismatches([]);
      const storedMismatches = JSON.parse(localStorage.getItem('beneficiary_mismatches') || '[]');
      const remainingMismatches = storedMismatches.filter((m: any) => m.clientId !== clientId);
      localStorage.setItem('beneficiary_mismatches', JSON.stringify(remainingMismatches));

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate fix letters. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsFixingAll(false);
    }
  };

  const handleRunSyncNow = async () => {
    try {
      // In real app, would call the job runner API
      toast({
        title: "Sync Started",
        description: "Beneficiary sync job has been triggered.",
      });
      setLastSync(new Date());
      localStorage.setItem('last_beneficiary_sync', new Date().toISOString());
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start sync job. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Status Header */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-sm font-medium">Beneficiary Sync Status</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <Clock className="h-3 w-3" />
              Last sync: {lastSync ? lastSync.toLocaleDateString() : 'Never'} • 
              Mismatches: {mismatches.length}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRunSyncNow}
            >
              Run Sync Now
            </Button>
            {mismatches.length > 0 && (
              <Button 
                size="sm"
                onClick={handleFixAll}
                disabled={isFixingAll}
              >
                {isFixingAll ? 'Generating...' : 'Fix All'}
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Mismatches Alert */}
      {mismatches.length > 0 ? (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {mismatches.length} beneficiary mismatch{mismatches.length > 1 ? 'es' : ''} detected. 
            Account beneficiaries don't match estate planning intentions.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            All account beneficiaries match estate planning intentions.
          </AlertDescription>
        </Alert>
      )}

      {/* Mismatches Table */}
      {mismatches.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Beneficiary Mismatches</CardTitle>
            <CardDescription>
              Accounts where current beneficiaries don't match estate planning intentions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account ID</TableHead>
                  <TableHead>Intended Beneficiary</TableHead>
                  <TableHead>Current Beneficiary</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mismatches.map((mismatch) => (
                  <TableRow key={mismatch.accountId}>
                    <TableCell className="font-medium">{mismatch.accountId}</TableCell>
                    <TableCell>{mismatch.intent}</TableCell>
                    <TableCell>{mismatch.current}</TableCell>
                    <TableCell>
                      <Badge variant="destructive">Mismatch</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        <FileText className="mr-2 h-3 w-3" />
                        Generate Fix Letter
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}