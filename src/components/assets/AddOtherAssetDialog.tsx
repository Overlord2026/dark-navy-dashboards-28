
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSupabaseAssets } from "@/hooks/useSupabaseAssets";
import { toast } from "sonner";

interface AddOtherAssetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const otherAssetTypes = [
  { value: "annuities", label: "Annuities" },
  { value: "vehicle", label: "Vehicle" },
  { value: "collectible", label: "Collectible" },
  { value: "insurance_policy", label: "Insurance Policy" },
  { value: "other", label: "Other" },
];

export const AddOtherAssetDialog = ({ open, onOpenChange }: AddOtherAssetDialogProps) => {
  const { addAsset } = useSupabaseAssets();
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [value, setValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setName("");
    setType("");
    setValue("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !type || !value) {
      toast.error("Please fill in all fields");
      return;
    }

    const numericValue = parseFloat(value);
    if (isNaN(numericValue) || numericValue < 0) {
      toast.error("Please enter a valid value");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await addAsset({
        name: name.trim(),
        type: type,
        owner: "Self", // Default owner
        value: numericValue
      });

      if (result) {
        toast.success("Other asset added successfully");
        resetForm();
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error adding other asset:', error);
      toast.error("Failed to add other asset");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Other Asset</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Life Insurance Policy, Vintage Car"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="type">Type *</Label>
            <Select value={type} onValueChange={setType} required>
              <SelectTrigger>
                <SelectValue placeholder="Select asset type" />
              </SelectTrigger>
              <SelectContent>
                {otherAssetTypes.map((assetType) => (
                  <SelectItem key={assetType.value} value={assetType.value}>
                    {assetType.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="value">Value ($) *</Label>
            <Input
              id="value"
              type="number"
              step="0.01"
              min="0"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
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
