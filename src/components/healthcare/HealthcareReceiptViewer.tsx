import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Receipt, 
  Shield, 
  FileText, 
  Archive,
  Clock,
  Hash,
  ExternalLink
} from 'lucide-react';
import { 
  healthcareReceiptStore,
  type HealthRDS,
  type ConsentRDS,
  type VaultRDS 
} from '@/features/healthcare';
import { formatDistanceToNow } from 'date-fns';

export function HealthcareReceiptViewer() {
  const [selectedTab, setSelectedTab] = useState('all');
  
  const healthReceipts = healthcareReceiptStore.getByType<HealthRDS>('Health-RDS');
  const consentReceipts = healthcareReceiptStore.getByType<ConsentRDS>('Consent-RDS');
  const vaultReceipts = healthcareReceiptStore.getByType<VaultRDS>('Vault-RDS');
  const allReceipts = healthcareReceiptStore.getRecent(20);

  const getResultVariant = (result: string) => {
    switch (result) {
      case 'allow': return 'default';
      case 'deny': return 'destructive';
      default: return 'secondary';
    }
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'Health-RDS': return <Shield className="w-4 h-4" />;
      case 'Consent-RDS': return <FileText className="w-4 h-4" />;
      case 'Vault-RDS': return <Archive className="w-4 h-4" />;
      default: return <Receipt className="w-4 h-4" />;
    }
  };

  const HealthReceiptCard = ({ receipt }: { receipt: HealthRDS }) => (
    <Card className="mb-3">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            <span className="font-medium">{receipt.action}</span>
            <Badge variant={getResultVariant(receipt.result)}>
              {receipt.result}
            </Badge>
          </div>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(receipt.ts), { addSuffix: true })}
          </span>
        </div>
        
        {receipt.reasons.length > 0 && (
          <div className="mb-2">
            <p className="text-sm font-medium mb-1">Reasons:</p>
            <div className="flex flex-wrap gap-1">
              {receipt.reasons.map((reason, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {reason}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {receipt.disclosures.length > 0 && (
          <div className="mb-2">
            <p className="text-sm font-medium mb-1">Disclosures:</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              {receipt.disclosures.map((disclosure, idx) => (
                <li key={idx}>• {disclosure}</li>
              ))}
            </ul>
          </div>
        )}

        {receipt.financial && (
          <div className="mb-2">
            <p className="text-sm font-medium mb-1">Financial:</p>
            <div className="text-xs text-muted-foreground">
              {receipt.financial.estimated_cost_cents && (
                <span>Est. Cost: ${(receipt.financial.estimated_cost_cents / 100).toFixed(2)}</span>
              )}
              {receipt.financial.coverage_type && (
                <span className="ml-2">Coverage: {receipt.financial.coverage_type}</span>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t">
          <span className="flex items-center gap-1">
            <Hash className="w-3 h-3" />
            {receipt.inputs_hash}
          </span>
          <span>v{receipt.policy_version}</span>
          {receipt.anchor_ref && (
            <span className="flex items-center gap-1">
              <ExternalLink className="w-3 h-3" />
              Anchored
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const ConsentReceiptCard = ({ receipt }: { receipt: ConsentRDS }) => (
    <Card className="mb-3">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            <span className="font-medium">HIPAA Consent</span>
            <Badge variant="default">
              Fresh: {Math.round(receipt.freshness_score * 100)}%
            </Badge>
          </div>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(receipt.ts), { addSuffix: true })}
          </span>
        </div>

        <div className="space-y-2 text-sm">
          <div>
            <span className="font-medium">Purpose:</span> {receipt.purpose_of_use}
          </div>
          <div>
            <span className="font-medium">Scope:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {receipt.hipaa_scope.map((scope, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {scope}
                </Badge>
              ))}
            </div>
          </div>
          {receipt.expiry && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              Expires: {new Date(receipt.expiry).toLocaleDateString()}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t">
          <span className="flex items-center gap-1">
            <Hash className="w-3 h-3" />
            {receipt.proof_hash}
          </span>
          <span>v{receipt.policy_version}</span>
        </div>
      </CardContent>
    </Card>
  );

  const VaultReceiptCard = ({ receipt }: { receipt: VaultRDS }) => (
    <Card className="mb-3">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <Archive className="w-4 h-4 text-primary" />
            <span className="font-medium">Vault {receipt.action}</span>
            <Badge variant="secondary">{receipt.action}</Badge>
          </div>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(receipt.ts), { addSuffix: true })}
          </span>
        </div>

        {receipt.doc_id && (
          <div className="text-sm mb-2">
            <span className="font-medium">Document ID:</span> 
            <code className="ml-2 text-xs bg-muted px-1 py-0.5 rounded">
              {receipt.doc_id}
            </code>
          </div>
        )}

        <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t">
          <span className="flex items-center gap-1">
            <Hash className="w-3 h-3" />
            {receipt.inputs_hash}
          </span>
          <span>v{receipt.policy_version}</span>
          {receipt.anchor_ref && (
            <span className="flex items-center gap-1">
              <ExternalLink className="w-3 h-3" />
              {receipt.anchor_ref}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="w-5 h-5" />
          Healthcare Receipts & Audit Trail
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All ({allReceipts.length})</TabsTrigger>
            <TabsTrigger value="health">Health ({healthReceipts.length})</TabsTrigger>
            <TabsTrigger value="consent">Consent ({consentReceipts.length})</TabsTrigger>
            <TabsTrigger value="vault">Vault ({vaultReceipts.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            <ScrollArea className="h-96">
              {allReceipts.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No receipts recorded yet
                </p>
              ) : (
                allReceipts.map((receipt, idx) => (
                  <div key={idx}>
                    {receipt.type === 'Health-RDS' && <HealthReceiptCard receipt={receipt as HealthRDS} />}
                    {receipt.type === 'Consent-RDS' && <ConsentReceiptCard receipt={receipt as ConsentRDS} />}
                    {receipt.type === 'Vault-RDS' && <VaultReceiptCard receipt={receipt as VaultRDS} />}
                  </div>
                ))
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="health" className="mt-4">
            <ScrollArea className="h-96">
              {healthReceipts.map((receipt, idx) => (
                <HealthReceiptCard key={idx} receipt={receipt} />
              ))}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="consent" className="mt-4">
            <ScrollArea className="h-96">
              {consentReceipts.map((receipt, idx) => (
                <ConsentReceiptCard key={idx} receipt={receipt} />
              ))}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="vault" className="mt-4">
            <ScrollArea className="h-96">
              {vaultReceipts.map((receipt, idx) => (
                <VaultReceiptCard key={idx} receipt={receipt} />
              ))}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}