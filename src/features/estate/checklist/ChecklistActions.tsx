import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, FileText, Gavel, Home, PiggyBank } from 'lucide-react';

interface ChecklistActionsProps {
  clientId: string;
  state: string;
  lastDocs: Record<string, string | undefined>;
}

export default function ChecklistActions({ clientId, state, lastDocs }: ChecklistActionsProps) {
  const handleNotarize = (docType: string, docId: string) => {
    // Navigate to notary launcher
    window.location.assign(`/notary/new?clientId=${clientId}&docId=${docId}&docType=${docType}&state=${state}`);
  };

  const handleRequestDeed = () => {
    // Navigate to deed request flow
    window.location.assign(`/estate/workbench?tab=property&clientId=${clientId}&state=${state}`);
  };

  const handlePrepareReview = () => {
    // Navigate to attorney review preparation
    const docIds = Object.values(lastDocs).filter(Boolean).join(',');
    window.location.assign(`/attorney/review/new?clientId=${clientId}&state=${state}&docIds=${docIds}`);
  };

  const handleGenerateFunding = () => {
    // Navigate to funding letter generation
    window.location.assign(`/advisors/estate?tab=funding&clientId=${clientId}&state=${state}`);
  };

  const handleBeneficiaryReview = () => {
    // Navigate to beneficiary designation review
    window.location.assign(`/advisors/estate?tab=beneficiaries&clientId=${clientId}&state=${state}`);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Gavel className="w-5 h-5" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Estate Core Actions */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Estate Documents</h4>
          <div className="flex flex-wrap gap-2">
            {lastDocs.Will && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleNotarize('Will', lastDocs.Will!)}
                className="flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Notarize Will
              </Button>
            )}
            {lastDocs.RLT && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleNotarize('RLT', lastDocs.RLT!)}
                className="flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Notarize Trust
              </Button>
            )}
            {lastDocs.POA && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleNotarize('POA', lastDocs.POA!)}
                className="flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Notarize POA
              </Button>
            )}
          </div>
        </div>

        {/* Property & Titling Actions */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Property & Titling</h4>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRequestDeed}
              className="flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Request Deed Recording
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleBeneficiaryReview}
              className="flex items-center gap-2"
            >
              <PiggyBank className="w-4 h-4" />
              Review Beneficiaries
            </Button>
          </div>
        </div>

        {/* Professional Services */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Professional Services</h4>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrepareReview}
              className="flex items-center gap-2"
            >
              <Gavel className="w-4 h-4" />
              Prepare Attorney Review
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerateFunding}
              className="flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Generate Funding Letters
            </Button>
          </div>
        </div>

        {/* External Links */}
        <div className="pt-2 border-t">
          <div className="flex flex-wrap gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open('/vault', '_blank')}
              className="flex items-center gap-2 text-xs"
            >
              <ExternalLink className="w-3 h-3" />
              Open Vault
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(`/family/estate?clientId=${clientId}`, '_blank')}
              className="flex items-center gap-2 text-xs"
            >
              <ExternalLink className="w-3 h-3" />
              Family View
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}