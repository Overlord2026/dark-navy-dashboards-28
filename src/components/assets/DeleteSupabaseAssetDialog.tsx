
import React from "react";
import { useSupabaseAssets, SupabaseAsset } from "@/hooks/useSupabaseAssets";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/formatters";

interface DeleteSupabaseAssetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asset: SupabaseAsset | null;
}

export const DeleteSupabaseAssetDialog: React.FC<DeleteSupabaseAssetDialogProps> = ({ 
  open, 
  onOpenChange, 
  asset 
}) => {
  const { deleteAsset } = useSupabaseAssets();
  
  const handleDelete = async () => {
    if (!asset) return;
    
    const success = await deleteAsset(asset.id);
    if (success) {
      onOpenChange(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Asset</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this asset? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        
        {asset && (
          <div className="py-4">
            <p><strong>Name:</strong> {asset.name}</p>
            <p><strong>Type:</strong> {asset.type}</p>
            <p><strong>Value:</strong> {formatCurrency(Number(asset.value))}</p>
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
