
import React from "react";
import { DashboardCard } from "@/components/ui/DashboardCard";
import { Receipt, Maximize2, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaxStrategyCard } from "./TaxStrategyCard";
import { TaxDeadlineItem } from "./TaxDeadlineItem";
import { DeductionItem } from "./DeductionItem";
import { 
  taxBracketData, 
  taxStrategies, 
  taxDeadlines, 
  deductionCategories,
  getIconComponent 
} from "@/data/tax-planning/mockTaxData";

export const TaxPlanningSummary = () => {
  return (
    <div className="space-y-6">
      <div className="bg-[#121a2c]/80 rounded-lg p-4 border border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center">
            <Receipt className="mr-2 h-5 w-5 text-blue-400" />
            Tax Planning Overview
          </h2>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Maximize2 className="h-4 w-4" />
              <span className="sr-only">Expand</span>
            </Button>
            <span className="text-green-400 flex items-center text-sm">
              <ArrowUpRight className="mr-1 h-4 w-4" />
              Est. ${taxBracketData.potentialSavings.toLocaleString()} saved
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-[#1a2236] p-4 rounded-lg border border-gray-800">
            <div className="text-sm text-gray-400 mb-1">Current Tax Bracket</div>
            <div className="text-2xl font-semibold">{taxBracketData.currentBracket}</div>
            <div className="text-xs text-amber-400 mt-1">Federal Income Tax</div>
          </div>
          
          <div className="bg-[#1a2236] p-4 rounded-lg border border-gray-800">
            <div className="text-sm text-gray-400 mb-1">Estimated Tax Liability</div>
            <div className="text-2xl font-semibold">${taxBracketData.estimatedLiability.toLocaleString()}</div>
            <div className="text-xs text-green-400 mt-1">${taxBracketData.yearOverYearChange.toLocaleString()} from last year</div>
          </div>
          
          <div className="bg-[#1a2236] p-4 rounded-lg border border-gray-800">
            <div className="text-sm text-gray-400 mb-1">Potential Tax Savings</div>
            <div className="text-2xl font-semibold text-blue-400">${taxBracketData.potentialSavings.toLocaleString()}</div>
            <div className="text-xs text-green-400 mt-1">With implemented strategies</div>
          </div>
        </div>
        
        <Tabs defaultValue="strategies" className="w-full">
          <TabsList className="w-full justify-start mb-4">
            <TabsTrigger value="strategies">Tax Strategies</TabsTrigger>
            <TabsTrigger value="calendar">Tax Calendar</TabsTrigger>
            <TabsTrigger value="deductions">Deductions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="strategies">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {taxStrategies.map(strategy => (
                <TaxStrategyCard
                  key={strategy.id}
                  title={strategy.title}
                  description={strategy.description}
                  impact={strategy.impact}
                  icon={getIconComponent(strategy.icon)}
                  status={strategy.status}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="calendar">
            <div className="bg-[#1a2236] p-4 rounded-lg border border-gray-800">
              <h3 className="text-lg font-medium mb-3">Upcoming Tax Deadlines</h3>
              <div className="space-y-4">
                {taxDeadlines.map(deadline => (
                  <TaxDeadlineItem
                    key={deadline.id}
                    date={deadline.date}
                    title={deadline.title}
                    description={deadline.description}
                    daysLeft={deadline.daysLeft}
                  />
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="deductions">
            <div className="bg-[#1a2236] p-4 rounded-lg border border-gray-800">
              <h3 className="text-lg font-medium mb-3">Potential Deductions</h3>
              <div className="space-y-3">
                {deductionCategories.map(deduction => (
                  <DeductionItem
                    key={deduction.id}
                    category={deduction.category}
                    amount={deduction.amount}
                    percentage={deduction.percentage}
                    color={deduction.color}
                  />
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Potential Deductions</span>
                  <span className="font-medium text-xl text-green-400">
                    ${deductionCategories.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
