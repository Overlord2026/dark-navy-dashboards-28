
import React from "react";
import { useBills } from "@/hooks/useBills";
import { Card } from "@/components/ui/card";
import { useTheme } from "@/context/ThemeContext";
import { CalendarIcon, ArrowUpCircleIcon, LineChartIcon, ArrowDownCircleIcon } from "lucide-react";

export function BillsOverview() {
  const { bills, insights } = useBills();
  const { theme } = useTheme();
  const isLightTheme = theme === "light";

  const totalMonthlyBills = bills.filter(bill => 
    bill.recurring && bill.recurringPeriod === "Monthly"
  ).reduce((sum, bill) => sum + bill.amount, 0);

  const upcomingBillsTotal = bills.filter(bill => 
    bill.status === "Upcoming"
  ).reduce((sum, bill) => sum + bill.amount, 0);

  const overdueTotal = bills.filter(bill => 
    bill.status === "Overdue"
  ).reduce((sum, bill) => sum + bill.amount, 0);

  const potentialSavings = insights.reduce((sum, insight) => 
    sum + insight.potentialSavings, 0
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className={`p-4 ${isLightTheme ? "bg-[#F2F0E1] border-[#DCD8C0]" : "bg-[#121a2c] border-gray-800"}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm ${isLightTheme ? "text-[#555555]" : "text-gray-400"}`}>
              Monthly Bills
            </p>
            <p className={`text-2xl font-semibold ${isLightTheme ? "text-[#222222]" : "text-white"}`}>
              ${totalMonthlyBills.toFixed(2)}
            </p>
          </div>
          <div className={`p-3 rounded-full ${isLightTheme ? "bg-[#E9E7D8]" : "bg-gray-800"}`}>
            <LineChartIcon className={`h-5 w-5 ${isLightTheme ? "text-[#222222]" : "text-white"}`} />
          </div>
        </div>
      </Card>
      
      <Card className={`p-4 ${isLightTheme ? "bg-[#F2F0E1] border-[#DCD8C0]" : "bg-[#121a2c] border-gray-800"}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm ${isLightTheme ? "text-[#555555]" : "text-gray-400"}`}>
              Upcoming Due
            </p>
            <p className={`text-2xl font-semibold ${isLightTheme ? "text-[#222222]" : "text-white"}`}>
              ${upcomingBillsTotal.toFixed(2)}
            </p>
          </div>
          <div className={`p-3 rounded-full ${isLightTheme ? "bg-[#E9E7D8]" : "bg-gray-800"}`}>
            <CalendarIcon className={`h-5 w-5 ${isLightTheme ? "text-[#222222]" : "text-white"}`} />
          </div>
        </div>
      </Card>
      
      <Card className={`p-4 ${isLightTheme ? "bg-[#F2F0E1] border-[#DCD8C0]" : "bg-[#121a2c] border-gray-800"}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm ${isLightTheme ? "text-[#555555]" : "text-gray-400"}`}>
              Overdue
            </p>
            <p className={`text-2xl font-semibold ${isLightTheme ? "text-[#222222]" : "text-white"}`}>
              ${overdueTotal.toFixed(2)}
            </p>
          </div>
          <div className={`p-3 rounded-full ${isLightTheme ? "bg-[#E9E7D8]" : "bg-gray-800"}`}>
            <ArrowUpCircleIcon className={`h-5 w-5 ${isLightTheme ? "text-red-600" : "text-red-400"}`} />
          </div>
        </div>
      </Card>
      
      <Card className={`p-4 ${isLightTheme ? "bg-[#F2F0E1] border-[#DCD8C0]" : "bg-[#121a2c] border-gray-800"}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm ${isLightTheme ? "text-[#555555]" : "text-gray-400"}`}>
              Potential Savings
            </p>
            <p className={`text-2xl font-semibold ${isLightTheme ? "text-[#222222]" : "text-white"}`}>
              ${potentialSavings.toFixed(2)}
            </p>
          </div>
          <div className={`p-3 rounded-full ${isLightTheme ? "bg-[#E9E7D8]" : "bg-gray-800"}`}>
            <ArrowDownCircleIcon className={`h-5 w-5 ${isLightTheme ? "text-green-600" : "text-green-400"}`} />
          </div>
        </div>
      </Card>
    </div>
  );
}
