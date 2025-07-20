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
} from "@/components/ui/animated-alert-dialog";

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

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{asset ? getAssetDisplayName(asset) : 'this digital asset'}"? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete Asset
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
