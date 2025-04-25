
import React from "react";
import { CreditCard, Building } from "lucide-react";

interface PaymentTypeSelectorProps {
  paymentType: "card" | "bank";
  onSelect: (type: "card" | "bank") => void;
}

export const PaymentTypeSelector: React.FC<PaymentTypeSelectorProps> = ({ 
  paymentType, 
  onSelect 
}) => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div
        className={`p-4 border rounded-lg cursor-pointer hover:bg-muted/50 ${
          paymentType === "card" ? "border-primary bg-primary/5" : ""
        }`}
        onClick={() => onSelect("card")}
      >
        <div className="flex items-center gap-2 mb-2">
          <CreditCard className="h-5 w-5" />
          <h3 className="font-medium">Credit/Debit Card</h3>
        </div>
        <p className="text-xs text-muted-foreground">
          Add a credit or debit card for payments
        </p>
      </div>

      <div
        className={`p-4 border rounded-lg cursor-pointer hover:bg-muted/50 ${
          paymentType === "bank" ? "border-primary bg-primary/5" : ""
        }`}
        onClick={() => onSelect("bank")}
      >
        <div className="flex items-center gap-2 mb-2">
          <Building className="h-5 w-5" />
          <h3 className="font-medium">Bank Account</h3>
        </div>
        <p className="text-xs text-muted-foreground">
          Link a bank account for direct payments
        </p>
      </div>
    </div>
  );
};
