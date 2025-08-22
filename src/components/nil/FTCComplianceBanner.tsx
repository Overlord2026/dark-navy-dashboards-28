import React, { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  ExternalLink,
  Info,
  X
} from 'lucide-react';
import { NILActions } from '@/lib/nil/proofSlips';

interface FTCComplianceBannerProps {
  postId?: string;
  athleteId?: string;
  disclosureText?: string;
  hasRequiredDisclosure?: boolean;
  onDismiss?: () => void;
  variant?: 'warning' | 'error' | 'success' | 'info';
}

export const FTCComplianceBanner: React.FC<FTCComplianceBannerProps> = ({
  postId,
  athleteId,
  disclosureText,
  hasRequiredDisclosure = false,
  onDismiss,
  variant = 'warning'
}) => {
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);

  const handleValidateCompliance = async () => {
    if (!postId || !athleteId) return;
    
    setIsValidating(true);
    try {
      const result = await NILActions.validateFTCCompliance(
        postId, 
        athleteId, 
        hasRequiredDisclosure, 
        disclosureText
      );
      setValidationResult(result);
    } catch (error) {
      console.error('FTC validation failed:', error);
    } finally {
      setIsValidating(false);
    }
  };

  const getIcon = () => {
    switch (variant) {
      case 'success':
        return <CheckCircle className="h-4 w-4" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4" />;
      case 'info':
        return <Info className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  const getAlertVariant = () => {
    switch (variant) {
      case 'error':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const ftcGuidelines = [
    'Use clear disclosure language like "#ad", "#sponsored", or "#paidpartnership"',
    'Place disclosures where they are easily noticed (beginning of posts)',
    'Make disclosures in the same language as the content',
    'Ensure disclosures are visible on all platforms and devices',
    'Disclose the relationship even for free products or services'
  ];

  return (
    <Alert variant={getAlertVariant()} className="border-l-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-2">
          {getIcon()}
          <div className="flex-1">
            <AlertDescription>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <strong>FTC Disclosure Compliance</strong>
                  <Badge variant={hasRequiredDisclosure ? 'success' : 'destructive'}>
                    {hasRequiredDisclosure ? 'Compliant' : 'Requires Attention'}
                  </Badge>
                </div>
                
                {!hasRequiredDisclosure && (
                  <div className="text-sm">
                    <p className="mb-2">
                      This content appears to be sponsored but lacks proper FTC disclosure. 
                      Federal law requires clear disclosure of paid partnerships.
                    </p>
                    
                    <details className="mb-3">
                      <summary className="cursor-pointer font-medium text-primary hover:underline">
                        View FTC Guidelines
                      </summary>
                      <ul className="mt-2 ml-4 space-y-1 text-xs">
                        {ftcGuidelines.map((guideline, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-muted-foreground">•</span>
                            {guideline}
                          </li>
                        ))}
                      </ul>
                    </details>
                  </div>
                )}

                {hasRequiredDisclosure && disclosureText && (
                  <div className="text-sm">
                    <p className="mb-2">✅ Proper disclosure detected:</p>
                    <div className="bg-muted/50 p-2 rounded text-xs font-mono">
                      "{disclosureText}"
                    </div>
                  </div>
                )}

                {validationResult && (
                  <div className="text-sm p-2 bg-muted/50 rounded">
                    <p className="font-medium">Validation Complete</p>
                    <p className="text-xs text-muted-foreground">
                      Proof slip generated: {validationResult.id}
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={handleValidateCompliance}
                    disabled={isValidating || !postId || !athleteId}
                  >
                    <Shield className="h-3 w-3 mr-1" />
                    {isValidating ? 'Validating...' : 'Generate Proof Slip'}
                  </Button>
                  
                  <Button size="sm" variant="ghost" asChild>
                    <a 
                      href="https://www.ftc.gov/tips-advice/business-center/guidance/ftcs-endorsement-guides-what-people-are-asking"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      FTC Guidelines
                    </a>
                  </Button>
                </div>
              </div>
            </AlertDescription>
          </div>
        </div>
        
        {onDismiss && (
          <Button variant="ghost" size="sm" onClick={onDismiss}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </Alert>
  );
};

export default FTCComplianceBanner;