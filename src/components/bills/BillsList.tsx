
import React, { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { Bill } from "@/types/bill";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckIcon, AlertCircleIcon, ClockIcon, CreditCardIcon, InfoIcon } from "lucide-react";
import { format } from "date-fns";
import { BillDetailsDialog } from "./BillDetailsDialog";

interface BillsListProps {
  bills: Bill[];
  showCategory?: boolean;
}

export function BillsList({ bills, showCategory = false }: BillsListProps) {
  const { theme } = useTheme();
  const isLightTheme = theme === "light";
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Paid":
        return <CheckIcon className="h-4 w-4 text-green-500" />;
      case "Overdue":
        return <AlertCircleIcon className="h-4 w-4 text-red-500" />;
      case "Upcoming":
        return <ClockIcon className="h-4 w-4 text-blue-500" />;
      default:
        return <InfoIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800 border-green-200";
      case "Overdue":
        return "bg-red-100 text-red-800 border-red-200";
      case "Upcoming":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleOpenDetails = (bill: Bill) => {
    setSelectedBill(bill);
    setIsDetailsOpen(true);
  };

  if (bills.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No bills to display</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bills.map((bill) => (
        <Card 
          key={bill.id}
          className={`p-4 ${isLightTheme ? "bg-[#F2F0E1] border-[#DCD8C0]" : "bg-[#121a2c] border-gray-800"}`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${isLightTheme ? "bg-[#E9E7D8]" : "bg-gray-800"}`}>
                <CreditCardIcon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium">{bill.name}</h3>
                {showCategory && (
                  <span className="text-sm text-gray-500">{bill.category}</span>
                )}
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="text-right mr-4">
                <p className="font-semibold">${bill.amount.toFixed(2)}</p>
                <p className="text-sm text-gray-500">
                  Due: {format(new Date(bill.dueDate), "MMM dd, yyyy")}
                </p>
              </div>
              
              <Badge 
                variant="outline"
                className={`flex items-center gap-1 ${getStatusColor(bill.status)}`}
              >
                {getStatusIcon(bill.status)} {bill.status}
              </Badge>
            </div>
            
            <div className="ml-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOpenDetails(bill)}
              >
                Details
              </Button>
            </div>
          </div>
        </Card>
      ))}

      {selectedBill && (
        <BillDetailsDialog
          bill={selectedBill}
          isOpen={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
        />
      )}
    </div>
  );
}
