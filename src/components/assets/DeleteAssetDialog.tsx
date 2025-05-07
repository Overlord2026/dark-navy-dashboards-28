
import React from "react";
import { useNetWorth } from "@/context/NetWorthContext";
import { Asset } from "@/types/assets";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface DeleteAssetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asset: Asset | null;
}

export const DeleteAssetDialog: React.FC<DeleteAssetDialogProps> = ({ 
  open, 
  onOpenChange, 
  asset 
}) => {
  const { removeAsset } = useNetWorth();
  
  const handleDelete = () => {
    if (!asset) return;
    
    removeAsset(asset.id);
    toast.success("Asset deleted successfully");
    onOpenChange(false);
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
            <p><strong>Value:</strong> ${asset.value.toLocaleString()}</p>
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
