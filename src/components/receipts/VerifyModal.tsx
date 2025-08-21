import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, CheckCircle, XCircle, Info } from 'lucide-react';
import { verifyReceipt, getCanonicalJSON, VerificationResult } from '@/lib/receipt-verifier';
import { useToast } from '@/hooks/use-toast';

interface VerifyModalProps {
  receipt: any;
  isOpen: boolean;
  onClose: () => void;
}

export function VerifyModal({ receipt, isOpen, onClose }: VerifyModalProps) {
  const { toast } = useToast();
  const [verification, setVerification] = React.useState<VerificationResult | null>(null);
  const [canonicalJSON, setCanonicalJSON] = React.useState<string>('');

  React.useEffect(() => {
    if (receipt && isOpen) {
      const result = verifyReceipt(receipt);
      setVerification(result);
      setCanonicalJSON(getCanonicalJSON(receipt));
    }
  }, [receipt, isOpen]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard",
        description: "JSON content has been copied",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard",
        variant: "destructive",
      });
    }
  };

  if (!receipt || !verification) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Receipt Verification
            {verification.isValid ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
          </DialogTitle>
          <DialogDescription>
            Verify receipt integrity and policy compliance
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto space-y-6">
          {/* Verification Result */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Verification Result</h3>
            <div className={`p-4 rounded-lg border ${
              verification.isValid 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              <p className="font-medium">{verification.message}</p>
              
              {verification.details && (
                <div className="mt-3 space-y-1 text-sm">
                  {verification.details.policyMatch !== undefined && (
                    <div className="flex items-center gap-2">
                      <Badge variant={verification.details.policyMatch ? "default" : "destructive"}>
                        Policy Match: {verification.details.policyMatch ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                  )}
                  {verification.details.timestampValid !== undefined && (
                    <div className="flex items-center gap-2">
                      <Badge variant={verification.details.timestampValid ? "default" : "destructive"}>
                        Timestamp Valid: {verification.details.timestampValid ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                  )}
                  {verification.details.expectedHash && (
                    <div className="text-xs">
                      <p>Expected Hash: <code>{verification.details.expectedHash}</code></p>
                      <p>Actual Hash: <code>{verification.details.actualHash}</code></p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Receipt Details */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Receipt Details</h3>
              <div className="flex gap-2">
                <Badge variant="outline">{receipt.type}</Badge>
                {receipt.policy_version && (
                  <Badge variant="secondary">Policy {receipt.policy_version}</Badge>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">ID:</span> {receipt.id}
              </div>
              <div>
                <span className="font-medium">Timestamp:</span> {receipt.ts}
              </div>
              <div>
                <span className="font-medium">Session:</span> {receipt.session_id}
              </div>
              {receipt.step && (
                <div>
                  <span className="font-medium">Step:</span> {receipt.step}
                </div>
              )}
              {receipt.action && (
                <div>
                  <span className="font-medium">Action:</span> {receipt.action}
                </div>
              )}
              {receipt.persona && (
                <div>
                  <span className="font-medium">Persona:</span> {receipt.persona}
                </div>
              )}
            </div>
          </div>

          {/* Canonical JSON */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Canonical JSON</h3>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(canonicalJSON)}
                className="flex items-center gap-2"
              >
                <Copy className="h-4 w-4" />
                Copy JSON
              </Button>
            </div>
            <pre className="bg-muted p-4 rounded-lg text-xs overflow-auto max-h-64 whitespace-pre-wrap">
              {canonicalJSON}
            </pre>
          </div>

          {/* Help Text */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Info className="h-5 w-5 text-blue-500 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-2">About Verification:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Checks receipt against policy rules for the version specified</li>
                  <li>• Validates required fields and value constraints</li>
                  <li>• Verifies hash integrity if present</li>
                  <li>• Confirms timestamp format validity</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}