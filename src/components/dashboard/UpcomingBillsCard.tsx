
import React from "react";
import { CalendarIcon, ArrowRight } from "lucide-react";
import { DashboardCard } from "@/components/ui/DashboardCard";
import { Button } from "@/components/ui/button";

const upcomingBills = [
  {
    id: 1,
    name: "Internet Service",
    amount: "$89.99",
    dueDate: "May 15, 2025"
  },
  {
    id: 2,
    name: "Electric Bill",
    amount: "$142.50",
    dueDate: "May 18, 2025"
  },
  {
    id: 3,
    name: "Mortgage Payment",
    amount: "$1,875.00",
    dueDate: "May 20, 2025"
  },
  {
    id: 4,
    name: "Car Insurance",
    amount: "$128.75",
    dueDate: "May 23, 2025"
  }
];

export const UpcomingBillsCard = () => {
  return (
    <DashboardCard 
      title="Upcoming Bills" 
      icon={<CalendarIcon className="h-5 w-5" />}
    >
      <div className="space-y-3">
        {upcomingBills.map((bill) => (
          <div key={bill.id} className="flex justify-between items-center border-b border-border/30 pb-2 last:border-0">
            <div>
              <p className="font-medium text-sm">{bill.name}</p>
              <p className="text-xs text-muted-foreground">Due {bill.dueDate}</p>
            </div>
            <p className="font-semibold text-sm">{bill.amount}</p>
          </div>
        ))}
      </div>
      
      <Button 
        variant="link" 
        size="sm" 
        className="mt-4 p-0 h-auto text-accent"
      >
        View all bills
        <ArrowRight className="ml-1 h-3 w-3" />
      </Button>
    </DashboardCard>
  );
};
