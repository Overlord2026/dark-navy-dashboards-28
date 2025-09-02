import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CheckCircle, Clock, Shield, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DecisionRDS } from '@/services/decisions';

interface ReceiptChipProps {
  receipt: DecisionRDS;
  className?: string;
  variant?: 'default' | 'compact' | 'detailed';
  showHash?: boolean;
  showAnchored?: boolean;
}

export function ReceiptChip({ 
  receipt, 
  className,
  variant = 'default',
  showHash = true,
  showAnchored = true
}: ReceiptChipProps) {
  const isAnchored = receipt.anchor_ref?.proof_ok || false;
  const isApproved = receipt.result === 'approve';
  const isPending = receipt.result === 'pending';
  
  // Get short hash for display
  const shortHash = receipt.receipt_hash.slice(0, 8);
  const fullHash = receipt.receipt_hash;
  
  // Determine status color and icon
  const getStatusInfo = () => {
    if (isPending) {
      return {
        color: 'bg-amber-100 text-amber-800 border-amber-300',
        icon: Clock,
        label: 'Pending'
      };
    }
    
    if (isApproved) {
      return {
        color: 'bg-green-100 text-green-800 border-green-300',
        icon: CheckCircle,
        label: 'Approved'
      };
    }
    
    return {
      color: 'bg-red-100 text-red-800 border-red-300',
      icon: CheckCircle,
      label: 'Denied'
    };
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  if (variant === 'compact') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge 
              variant="outline" 
              className={cn(
                'flex items-center gap-1 text-xs',
                statusInfo.color,
                className
              )}
            >
              <StatusIcon className="h-3 w-3" />
              {showAnchored && isAnchored && <Shield className="h-3 w-3" />}
              {showHash && <span className="font-mono">{shortHash}</span>}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <div className="space-y-1 text-xs">
              <div><strong>Action:</strong> {receipt.action}</div>
              <div><strong>Status:</strong> {statusInfo.label}</div>
              <div><strong>Hash:</strong> <span className="font-mono">{fullHash}</span></div>
              {isAnchored && <div><strong>Anchored:</strong> ✓ Verified</div>}
              <div><strong>Created:</strong> {new Date(receipt.created_at).toLocaleString()}</div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (variant === 'detailed') {
    return (
      <div className={cn(
        'p-3 rounded-lg border bg-background',
        statusInfo.color.replace('bg-', 'border-').replace('text-', 'border-'),
        className
      )}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <StatusIcon className="h-4 w-4" />
            <div>
              <div className="font-medium text-sm">{receipt.action.replace(/_/g, ' ')}</div>
              <div className="text-xs text-muted-foreground">
                {new Date(receipt.created_at).toLocaleString()}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {showAnchored && isAnchored && (
              <Badge variant="outline" className="text-xs">
                <Shield className="h-3 w-3 mr-1" />
                Anchored
              </Badge>
            )}
            
            {showHash && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="outline" className="font-mono text-xs">
                      <FileText className="h-3 w-3 mr-1" />
                      {shortHash}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <span className="font-mono text-xs">{fullHash}</span>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
        
        {receipt.reasons.length > 0 && (
          <div className="mt-2">
            <div className="text-xs font-medium text-muted-foreground">Reasons:</div>
            <div className="flex flex-wrap gap-1 mt-1">
              {receipt.reasons.map((reason, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {reason.replace(/_/g, ' ')}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant="outline" 
            className={cn(
              'flex items-center gap-2',
              statusInfo.color,
              className
            )}
          >
            <StatusIcon className="h-3 w-3" />
            <span className="text-xs">{receipt.action.replace(/_/g, ' ')}</span>
            
            {showAnchored && isAnchored && (
              <Shield className="h-3 w-3 text-blue-600" />
            )}
            
            {showHash && (
              <span className="font-mono text-xs border-l pl-2 ml-1">
                {shortHash}
              </span>
            )}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1 text-xs">
            <div><strong>Action:</strong> {receipt.action}</div>
            <div><strong>Status:</strong> {statusInfo.label}</div>
            <div><strong>Policy:</strong> {receipt.policy_version}</div>
            {receipt.model_id && (
              <div><strong>Model:</strong> {receipt.model_id}</div>
            )}
            <div><strong>Hash:</strong> <span className="font-mono">{fullHash}</span></div>
            {isAnchored && <div><strong>Anchored:</strong> ✓ Verified</div>}
            <div><strong>Created:</strong> {new Date(receipt.created_at).toLocaleString()}</div>
            {receipt.reasons.length > 0 && (
              <div><strong>Reasons:</strong> {receipt.reasons.join(', ')}</div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

/**
 * Component to display multiple receipts
 */
interface ReceiptListProps {
  receipts: DecisionRDS[];
  variant?: 'default' | 'compact' | 'detailed';
  className?: string;
  emptyMessage?: string;
}

export function ReceiptList({ 
  receipts, 
  variant = 'default',
  className,
  emptyMessage = 'No receipts found'
}: ReceiptListProps) {
  if (receipts.length === 0) {
    return (
      <div className={cn('text-center text-muted-foreground text-sm py-4', className)}>
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={cn('space-y-2', className)}>
      {receipts.map((receipt) => (
        <ReceiptChip 
          key={receipt.id} 
          receipt={receipt} 
          variant={variant}
        />
      ))}
    </div>
  );
}