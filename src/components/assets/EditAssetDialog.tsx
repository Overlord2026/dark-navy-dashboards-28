
import React, { useState, useEffect } from "react";
import { useNetWorth, Asset } from "@/context/NetWorthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface EditAssetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asset: Asset | null;
}

export const EditAssetDialog: React.FC<EditAssetDialogProps> = ({ 
  open, 
  onOpenChange, 
  asset 
}) => {
  const { updateAsset } = useNetWorth();
  const [assetName, setAssetName] = useState("");
  const [assetValue, setAssetValue] = useState("");
  const [assetOwner, setAssetOwner] = useState("");
  
  useEffect(() => {
    if (asset) {
      setAssetName(asset.name);
      setAssetValue(asset.value.toString());
      setAssetOwner(asset.owner);
    }
  }, [asset]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!asset) return;
    
    updateAsset(asset.id, {
      name: assetName,
      value: parseFloat(assetValue),
      owner: assetOwner,
      lastUpdated: new Date().toISOString().split('T')[0]
    });
    
    toast.success("Asset updated successfully");
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Asset</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="assetName">Asset Name</Label>
            <Input
              id="assetName"
              value={assetName}
              onChange={(e) => setAssetName(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="assetValue">Current Value ($)</Label>
            <Input
              id="assetValue"
              type="number"
              value={assetValue}
              onChange={(e) => setAssetValue(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="assetOwner">Owner</Label>
            <Input
              id="assetOwner"
              value={assetOwner}
              onChange={(e) => setAssetOwner(e.target.value)}
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
