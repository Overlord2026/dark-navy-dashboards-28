import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, Users, FileSignature, AlertCircle, MapPin } from 'lucide-react';
import { getStateCompliance } from '../stateCompliance';

interface StateComplianceCalloutProps {
  stateCode: string;
}

export const StateComplianceCallout: React.FC<StateComplianceCalloutProps> = ({ stateCode }) => {
  const compliance = getStateCompliance(stateCode);
  
  if (!compliance) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          State compliance information not available for {stateCode}.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="border-primary/20">
      <CardContent className="p-6">
        <div className="flex items-start gap-3 mb-4">
          <MapPin className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <h4 className="font-semibold text-lg">
              You're in {compliance.name}
            </h4>
            <p className="text-muted-foreground text-sm">
              Here are the requirements for your estate planning documents:
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Witnesses */}
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <Users className="h-5 w-5 text-primary" />
            <div>
              <div className="font-medium">
                {compliance.witnessesRequired} Witnesses Required
              </div>
              <div className="text-sm text-muted-foreground">
                For will execution
              </div>
            </div>
          </div>

          {/* Notarization */}
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <FileSignature className="h-5 w-5 text-primary" />
            <div>
              <div className="font-medium">
                {compliance.ronAllowed || compliance.rinAllowed ? 'Digital' : 'In-Person'} Notarization
              </div>
              <div className="text-sm text-muted-foreground">
                {compliance.ronAllowed && 'RON allowed'}
                {compliance.rinAllowed && ' • RIN allowed'}
                {compliance.wetSignatureRequired && 'Wet signature required'}
              </div>
            </div>
          </div>
        </div>

        {/* Capabilities */}
        <div className="space-y-2 mb-4">
          <h5 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
            Available Options
          </h5>
          <div className="flex flex-wrap gap-2">
            {compliance.ronAllowed && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Remote Online Notarization
              </Badge>
            )}
            {compliance.rinAllowed && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Remote In-Person Notarization
              </Badge>
            )}
            {compliance.selfProvingWillAllowed && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Self-Proving Wills
              </Badge>
            )}
            {compliance.filingOptions.includes('api') && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Electronic Filing
              </Badge>
            )}
          </div>
        </div>

        {/* Special Notes */}
        {compliance.specialNotes && compliance.specialNotes.length > 0 && (
          <div className="space-y-2">
            <h5 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              {compliance.name} Specific Notes
            </h5>
            <ul className="space-y-1">
              {compliance.specialNotes.map((note, index) => (
                <li key={index} className="text-sm flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};