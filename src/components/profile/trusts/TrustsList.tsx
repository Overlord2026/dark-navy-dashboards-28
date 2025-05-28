
import React from "react";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2 } from "lucide-react";

interface Trust {
  id?: string;
  trustName: string;
  country: string;
  documents?: Array<{
    id: string;
    file_name: string;
    file_path: string;
    file_size: number;
    content_type: string;
  }>;
}

interface TrustsListProps {
  trusts: Trust[];
  onView: (trust: Trust) => void;
  onEdit: (trust: Trust) => void;
  onRemove: (id: string) => void;
}

export function TrustsList({ trusts, onView, onEdit, onRemove }: TrustsListProps) {
  if (trusts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-medium text-foreground">Current Trusts</h3>
      </div>
      
      <div className="space-y-2">
        {trusts.map((trust) => (
          <div key={trust.id} className="flex items-center justify-between border rounded-md p-3 bg-card">
            <div>
              <p className="font-medium text-foreground">{trust.trustName}</p>
              <p className="text-sm text-muted-foreground">{trust.country}</p>
              {trust.documents && trust.documents.length > 0 && (
                <p className="text-xs text-blue-600">{trust.documents.length} document(s) attached</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onView(trust)}
                className="flex items-center"
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(trust)}
                className="flex items-center"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => trust.id && onRemove(trust.id)}
                className="flex items-center"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
