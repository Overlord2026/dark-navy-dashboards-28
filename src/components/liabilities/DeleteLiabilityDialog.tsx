
import React from "react";
import { SupabaseLiability } from "@/hooks/useSupabaseLiabilities";
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

interface DeleteLiabilityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  liability: SupabaseLiability | null;
  onConfirm: () => void;
}

export function DeleteLiabilityDialog({
  open,
  onOpenChange,
  liability,
  onConfirm,
}: DeleteLiabilityDialogProps) {
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
          <AlertDialogTitle>Delete Liability</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this liability? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        {liability && (
          <div className="py-4 space-y-2">
            <p><strong>Name:</strong> {liability.name}</p>
            <p><strong>Type:</strong> {liability.type}</p>
            <p><strong>Current Balance:</strong> {formatCurrency(liability.current_balance)}</p>
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
