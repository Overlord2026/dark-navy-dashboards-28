
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash, UploadCloud, FileText, Clock, AlertTriangle } from "lucide-react";
import { InsurancePolicy } from "@/types/insurance";

interface InsurancePolicyCardProps {
  policy: InsurancePolicy;
  onRemove: () => void;
  onUploadDocument: () => void;
}

export const InsurancePolicyCard: React.FC<InsurancePolicyCardProps> = ({
  policy,
  onRemove,
  onUploadDocument
}) => {
  const isRenewalSoon = () => {
    const renewalDate = new Date(policy.renewalDate);
    const now = new Date();
    const diffDays = Math.ceil((renewalDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 30;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <CardTitle className="text-lg">{policy.provider}</CardTitle>
          {isRenewalSoon() && (
            <div className="flex items-center text-amber-500">
              <AlertTriangle className="h-4 w-4 mr-1" />
              <span className="text-xs">Renewal soon</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-muted-foreground">Policy Number</span>
              <span className="font-medium">{policy.policyNumber}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-muted-foreground">Coverage</span>
              <span className="font-medium">{formatCurrency(policy.coverage)}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-muted-foreground">Premium</span>
              <span className="font-medium">{formatCurrency(policy.premium)}/year</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Renewal Date</span>
              <span className="font-medium flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {policy.renewalDate}
              </span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1" onClick={onUploadDocument}>
              <UploadCloud className="h-4 w-4 mr-2" />
              Upload
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <FileText className="h-4 w-4 mr-2" />
              {policy.documents?.length || 0} Documents
            </Button>
            <Button variant="outline" size="sm" onClick={onRemove} className="text-destructive hover:bg-destructive/10">
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
