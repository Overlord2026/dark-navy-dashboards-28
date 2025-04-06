
import React from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProfessionals } from "@/hooks/useProfessionals";

interface DocumentSharingOptionsProps {
  category?: string;
  shareAfterUpload: boolean;
  selectedProfessionalId: string;
  onShareChange: (share: boolean) => void;
  onProfessionalSelect: (id: string) => void;
}

export function DocumentSharingOptions({
  category,
  shareAfterUpload,
  selectedProfessionalId,
  onShareChange,
  onProfessionalSelect
}: DocumentSharingOptionsProps) {
  const { professionals } = useProfessionals();
  
  if (category !== "professional-documents") {
    return null;
  }
  
  return (
    <div className="space-y-4 border-t pt-4">
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="share-after-upload"
          checked={shareAfterUpload}
          onCheckedChange={(checked) => onShareChange(checked === true)}
        />
        <Label htmlFor="share-after-upload" className="cursor-pointer">
          Share with professional immediately after upload
        </Label>
      </div>
      
      {shareAfterUpload && (
        <div className="space-y-2">
          <Label htmlFor="select-professional">Select Professional</Label>
          <Select
            value={selectedProfessionalId}
            onValueChange={onProfessionalSelect}
          >
            <SelectTrigger id="select-professional">
              <SelectValue placeholder="Choose a professional" />
            </SelectTrigger>
            <SelectContent>
              {professionals.map(pro => (
                <SelectItem key={pro.id} value={pro.id}>
                  {pro.name} - {pro.type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
