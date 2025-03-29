
import React from "react";
import { useBills } from "@/hooks/useBills";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { CalendarIcon, DollarSignIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const UpcomingBillsCard = () => {
  const { getUpcomingBills } = useBills();
  const navigate = useNavigate();
  
  // Get bills due in the next 14 days
  const upcomingBills = getUpcomingBills(14);
  
  // Calculate total
  const upcomingTotal = upcomingBills.reduce((sum, bill) => sum + bill.amount, 0);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md font-medium">Upcoming Bills</CardTitle>
        <Button 
          variant="ghost" 
          className="h-8 w-8 p-0"
          onClick={() => navigate("/bills-management")}
        >
          <DollarSignIcon className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {upcomingBills.length === 0 ? (
          <p className="text-sm text-muted-foreground">No upcoming bills in the next 14 days</p>
        ) : (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Next 14 days: <span className="font-medium text-primary">${upcomingTotal.toFixed(2)}</span>
            </div>
            <div className="space-y-2">
              {upcomingBills.slice(0, 3).map((bill) => (
                <div key={bill.id} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{bill.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">${bill.amount.toFixed(2)}</div>
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(bill.dueDate), "MMM d")}
                    </div>
                  </div>
                </div>
              ))}
              
              {upcomingBills.length > 3 && (
                <Button 
                  variant="link" 
                  size="sm" 
                  className="pt-2 w-full text-xs"
                  onClick={() => navigate("/bills-management")}
                >
                  View all ({upcomingBills.length}) bills
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
