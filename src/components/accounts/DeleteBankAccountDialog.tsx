
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/animated-alert-dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Trash2 } from 'lucide-react';

interface DeleteBankAccountDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  accountName: string;
  accountType: string;
  isDeleting?: boolean;
}

export function DeleteBankAccountDialog({
  isOpen,
  onClose,
  onConfirm,
  accountName,
  accountType,
  isDeleting = false
}: DeleteBankAccountDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-red-100 rounded-full">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <AlertDialogTitle>Delete Bank Account</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-left">
            Are you sure you want to delete the account:
            <div className="mt-2 p-3 bg-muted rounded-md">
              <div className="font-semibold">{accountName}</div>
              <div className="text-sm text-muted-foreground capitalize">{accountType}</div>
            </div>
            <div className="mt-3 text-sm">
              <strong>Warning:</strong> This action cannot be undone. All transaction history 
              and account data will be permanently removed.
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Account
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
