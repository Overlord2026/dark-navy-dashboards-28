
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SecurityForm } from "./SecurityForm";

interface TwoFactorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TwoFactorDialog({ open, onOpenChange }: TwoFactorDialogProps) {
  const handleSuccess = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-[#0F0F2D] border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">Enable Two-Factor Authentication</DialogTitle>
          <DialogDescription className="text-gray-400">
            Secure your account with an additional layer of protection
          </DialogDescription>
        </DialogHeader>
        <SecurityForm onSave={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
