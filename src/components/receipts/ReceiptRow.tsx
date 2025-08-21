import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Eye, 
  Shield, 
  Clock, 
  CheckCircle, 
  XCircle,
  Link as LinkIcon 
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ReceiptRowProps {
  receipt: any;
  onViewJSON: () => void;
  onVerify: () => void;
}

export function ReceiptRow({ receipt, onViewJSON, onVerify }: ReceiptRowProps) {
  const getReceiptIcon = (type: string) => {
    switch (type) {
      case 'onboard_rds':
        return <FileText className="h-4 w-4 text-blue-500" />;
      case 'decision_rds':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'vault_rds':
        return <Shield className="h-4 w-4 text-purple-500" />;
      case 'consent_rds':
        return <Eye className="h-4 w-4 text-orange-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getReceiptTypeLabel = (type: string) => {
    switch (type) {
      case 'onboard_rds':
        return 'Onboarding';
      case 'decision_rds':
        return 'Decision';
      case 'vault_rds':
        return 'Vault';
      case 'consent_rds':
        return 'Consent';
      default:
        return type;
    }
  };

  const getActionDisplay = () => {
    if (receipt.step) return receipt.step;
    if (receipt.action) return receipt.action;
    if (receipt.scope) return receipt.scope.join(', ');
    return 'N/A';
  };

  const getReasonCodesDisplay = () => {
    if (receipt.reasons && Array.isArray(receipt.reasons)) {
      return receipt.reasons.join(', ');
    }
    if (receipt.purpose_of_use) return receipt.purpose_of_use;
    if (receipt.source) return `Source: ${receipt.source}`;
    return 'N/A';
  };

  const hasAnchor = receipt.anchor_ref || receipt.anchor_txid;
  const timestamp = new Date(receipt.ts);
  const timeAgo = formatDistanceToNow(timestamp, { addSuffix: true });

  return (
    <div className="border rounded-lg p-4 space-y-3 hover:bg-muted/30 transition-colors">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {getReceiptIcon(receipt.type)}
          <div>
            <h4 className="font-medium text-sm">{getReceiptTypeLabel(receipt.type)}</h4>
            <p className="text-xs text-muted-foreground">
              {receipt.id.substring(0, 12)}...
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {receipt.policy_version || 'v1.0'}
          </Badge>
          {hasAnchor && (
            <Badge variant="secondary" className="text-xs flex items-center gap-1">
              <LinkIcon className="h-3 w-3" />
              Anchored
            </Badge>
          )}
        </div>
      </div>

      {/* Details Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div>
          <span className="font-medium text-muted-foreground">Time:</span>
          <p className="flex items-center gap-1 mt-1">
            <Clock className="h-3 w-3" />
            {timeAgo}
          </p>
        </div>
        
        <div>
          <span className="font-medium text-muted-foreground">Action:</span>
          <p className="mt-1 truncate">{getActionDisplay()}</p>
        </div>
        
        <div>
          <span className="font-medium text-muted-foreground">Reason/Scope:</span>
          <p className="mt-1 truncate">{getReasonCodesDisplay()}</p>
        </div>
        
        <div>
          <span className="font-medium text-muted-foreground">Status:</span>
          <div className="mt-1 flex items-center gap-1">
            {hasAnchor ? (
              <Badge variant="default" className="text-xs">
                <CheckCircle className="h-3 w-3 mr-1" />
                Anchored
              </Badge>
            ) : (
              <Badge variant="secondary" className="text-xs">
                <XCircle className="h-3 w-3 mr-1" />
                Local
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Actions Row */}
      <div className="flex justify-end gap-2 pt-2 border-t">
        <Button
          size="sm"
          variant="outline"
          onClick={onViewJSON}
          className="text-xs"
        >
          <Eye className="h-3 w-3 mr-1" />
          View JSON
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={onVerify}
          className="text-xs"
        >
          <Shield className="h-3 w-3 mr-1" />
          Verify
        </Button>
      </div>
    </div>
  );
}