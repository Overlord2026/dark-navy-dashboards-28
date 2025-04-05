
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  FileText, 
  Upload, 
  Trash2, 
  Edit, 
  Calendar, 
  Building, 
  DollarSign,
  Users,
  ClipboardCheck
} from "lucide-react";
import { InsurancePolicy } from "@/types/insurance";
import { Badge } from "@/components/ui/badge";

interface InsurancePolicyCardProps {
  policy: InsurancePolicy;
  onRemove: () => void;
  onEdit?: () => void;
  onUploadDocument: () => void;
}

export const InsurancePolicyCard = ({ 
  policy, 
  onRemove, 
  onEdit, 
  onUploadDocument 
}: InsurancePolicyCardProps) => {
  const getPolicyIcon = () => {
    switch (policy.type) {
      case "term-life":
      case "permanent-life":
        return <Heart className="h-5 w-5 text-red-500" />;
      case "annuity":
        return <FileText className="h-5 w-5 text-blue-500" />;
      case "health":
      case "long-term-care":
        return <ClipboardCheck className="h-5 w-5 text-green-500" />;
      case "homeowners":
      case "auto":
        return <Building className="h-5 w-5 text-amber-500" />;
      case "umbrella":
        return <DollarSign className="h-5 w-5 text-purple-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const getPolicyTypeLabel = () => {
    switch (policy.type) {
      case "term-life": return "Term Life";
      case "permanent-life": return "Permanent Life";
      case "annuity": return "Annuity";
      case "health": return "Health";
      case "long-term-care": return "Long-Term Care";
      case "homeowners": return "Homeowners";
      case "auto": return "Auto";
      case "umbrella": return "Umbrella";
      default: return policy.type;
    }
  };
  
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          {getPolicyIcon()}
          <div className="ml-3">
            <h3 className="font-medium">{policy.name}</h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Badge variant="outline">{getPolicyTypeLabel()}</Badge>
              <span>{policy.provider}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-1">
          {onEdit && (
            <Button variant="ghost" size="icon" onClick={onEdit}>
              <Edit className="h-4 w-4" />
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={onRemove}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-y-2 text-sm">
        <div className="flex items-center">
          <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>
            <span className="font-medium">${policy.premium.toLocaleString()}</span>
            <span className="text-muted-foreground"> / {policy.frequency}</span>
          </span>
        </div>
        
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>
            {policy.startDate}
            {policy.endDate && ` to ${policy.endDate}`}
          </span>
        </div>
        
        <div className="flex items-center col-span-2">
          <ClipboardCheck className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>
            <span className="font-medium">${policy.coverageAmount.toLocaleString()}</span>
            <span className="text-muted-foreground"> coverage</span>
          </span>
        </div>
        
        {policy.beneficiaries && (
          <div className="flex items-center col-span-2">
            <Users className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{policy.beneficiaries}</span>
          </div>
        )}
      </div>
      
      <div className="mt-4 pt-3 border-t">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm text-muted-foreground">
              {policy.documents?.length || 0} document{(policy.documents?.length || 0) !== 1 ? 's' : ''}
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={onUploadDocument}>
            <Upload className="h-3.5 w-3.5 mr-1" /> Upload
          </Button>
        </div>
      </div>
    </Card>
  );
};
