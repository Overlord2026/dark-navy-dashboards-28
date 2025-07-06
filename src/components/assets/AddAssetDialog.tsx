
import React, { useState } from "react";
import { useOtherAssets } from "@/hooks/useOtherAssets";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AddAssetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddAssetDialog: React.FC<AddAssetDialogProps> = ({ open, onOpenChange }) => {
  const { addAsset } = useOtherAssets();
  
  const [assetName, setAssetName] = useState("");
  const [assetType, setAssetType] = useState("");
  const [assetOwner, setAssetOwner] = useState("");
  const [assetValue, setAssetValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const resetForm = () => {
    setAssetName("");
    setAssetType("");
    setAssetOwner("");
    setAssetValue("");
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!assetName || !assetType || !assetOwner || !assetValue) {
      return;
    }
    
    setIsSubmitting(true);
    
    const result = await addAsset({
      name: assetName,
      type: assetType,
      owner: assetOwner,
      value: parseFloat(assetValue)
    });
    
    if (result) {
      resetForm();
      onOpenChange(false);
    }
    
    setIsSubmitting(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Add New Asset</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="assetName">Asset Name</Label>
            <Input
              id="assetName"
              value={assetName}
              onChange={(e) => setAssetName(e.target.value)}
              placeholder="e.g., Family Car, Summer Home, etc."
              required
              disabled={isSubmitting}
            />
          </div>
          
          <div>
            <Label htmlFor="assetType">Asset Type</Label>
            <Select value={assetType} onValueChange={setAssetType} required disabled={isSubmitting}>
              <SelectTrigger>
                <SelectValue placeholder="Select asset type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="property">Real Estate</SelectItem>
                <SelectItem value="vehicle">Vehicle (Car, RV, Camper)</SelectItem>
                <SelectItem value="boat">Boat/Watercraft</SelectItem>
                <SelectItem value="cash">Cash & Equivalents</SelectItem>
                <SelectItem value="investment">Investments</SelectItem>
                <SelectItem value="retirement">Retirement Accounts</SelectItem>
                <SelectItem value="art">Art</SelectItem>
                <SelectItem value="antique">Antiques</SelectItem>
                <SelectItem value="jewelry">Jewelry</SelectItem>
                <SelectItem value="collectible">Collectibles</SelectItem>
                <SelectItem value="digital">Digital Assets</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="assetOwner">Owner Name</Label>
            <Input
              id="assetOwner"
              value={assetOwner}
              onChange={(e) => setAssetOwner(e.target.value)}
              placeholder="e.g., John Smith, Family Trust, etc."
              required
              disabled={isSubmitting}
            />
          </div>
          
          <div>
            <Label htmlFor="assetValue">Valuation ($)</Label>
            <Input
              id="assetValue"
              type="number"
              value={assetValue}
              onChange={(e) => setAssetValue(e.target.value)}
              placeholder="e.g., 25000"
              required
              disabled={isSubmitting}
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                resetForm();
                onOpenChange(false);
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Asset"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
