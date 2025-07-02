
import React from "react";
import { DigitalAsset } from "@/hooks/useDigitalAssets";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteDigitalAssetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asset: DigitalAsset | null;
  onConfirm: () => void;
}

export function DeleteDigitalAssetDialog({
  open,
  onOpenChange,
  asset,
  onConfirm,
}: DeleteDigitalAssetDialogProps) {
  const getAssetDisplayName = (asset: DigitalAsset) => {
    return asset.asset_type === 'Other' ? asset.custom_asset_type : asset.asset_type;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Digital Asset</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this digital asset? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        {asset && (
          <div className="py-4 space-y-2">
            <p><strong>Asset:</strong> {getAssetDisplayName(asset)}</p>
            <p><strong>Quantity:</strong> {asset.quantity.toLocaleString()}</p>
            <p><strong>Total Value:</strong> {formatCurrency(asset.total_value)}</p>
          </div>
        )}
        
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
