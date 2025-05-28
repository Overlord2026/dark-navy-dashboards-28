
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { z } from "zod";
import { beneficiarySchema } from "./beneficiarySchema";
import { format } from "date-fns";

interface BeneficiaryViewDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  beneficiary: z.infer<typeof beneficiarySchema> | null;
}

export function BeneficiaryViewDialog({ 
  isOpen, 
  onOpenChange, 
  beneficiary 
}: BeneficiaryViewDialogProps) {
  if (!beneficiary) return null;

  const formatDate = (date: Date) => {
    try {
      return format(date, "MMMM dd, yyyy");
    } catch {
      return "Invalid date";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Beneficiary Details - {beneficiary.firstName} {beneficiary.lastName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-white">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-400">First Name</label>
                <p className="text-white">{beneficiary.firstName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-400">Last Name</label>
                <p className="text-white">{beneficiary.lastName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-400">Relationship</label>
                <p className="text-white">{beneficiary.relationship}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-400">Date of Birth</label>
                <p className="text-white">{formatDate(beneficiary.dateOfBirth)}</p>
              </div>
              {beneficiary.ssn && (
                <div>
                  <label className="text-sm font-medium text-gray-400">SSN</label>
                  <p className="text-white">***-**-{beneficiary.ssn.slice(-4)}</p>
                </div>
              )}
              {beneficiary.email && (
                <div>
                  <label className="text-sm font-medium text-gray-400">Email</label>
                  <p className="text-white">{beneficiary.email}</p>
                </div>
              )}
            </div>
          </div>

          {/* Address Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-white">Address Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-400">Address</label>
                <p className="text-white">{beneficiary.address}</p>
              </div>
              {beneficiary.address2 && (
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-400">Address Line 2</label>
                  <p className="text-white">{beneficiary.address2}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-400">City</label>
                <p className="text-white">{beneficiary.city}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-400">State</label>
                <p className="text-white">{beneficiary.state}</p>
              </div>
              {beneficiary.zipCode && (
                <div>
                  <label className="text-sm font-medium text-gray-400">ZIP Code</label>
                  <p className="text-white">{beneficiary.zipCode}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
