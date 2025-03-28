
import { DashboardCard } from "@/components/ui/DashboardCard";
import { Progress } from "@/components/ui/progress";
import { ArrowUpRight, Receipt, Maximize2, Save, FileBarChart, Calculator, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
              Est. $32,450 saved
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-[#1a2236] p-4 rounded-lg border border-gray-800">
            <div className="text-sm text-gray-400 mb-1">Current Tax Bracket</div>
            <div className="text-2xl font-semibold">32%</div>
            <div className="text-xs text-amber-400 mt-1">Federal Income Tax</div>
          </div>
          
          <div className="bg-[#1a2236] p-4 rounded-lg border border-gray-800">
            <div className="text-sm text-gray-400 mb-1">Estimated Tax Liability</div>
            <div className="text-2xl font-semibold">$146,820</div>
            <div className="text-xs text-green-400 mt-1">-$8,450 from last year</div>
          </div>
          
          <div className="bg-[#1a2236] p-4 rounded-lg border border-gray-800">
            <div className="text-sm text-gray-400 mb-1">Potential Tax Savings</div>
            <div className="text-2xl font-semibold text-blue-400">$32,450</div>
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
              <TaxStrategyCard 
                title="Maximize Retirement Contributions"
                description="Increase 401(k) contributions to reduce taxable income"
                impact="$8,700"
                icon={<Save className="h-5 w-5 text-green-400" />}
                status="implemented"
              />
              
              <TaxStrategyCard 
                title="Tax Loss Harvesting"
                description="Offset capital gains with strategic losses"
                impact="$5,200"
                icon={<FileBarChart className="h-5 w-5 text-blue-400" />}
                status="recommended"
              />
              
              <TaxStrategyCard 
                title="Charitable Giving"
                description="Optimize charitable contributions for tax benefits"
                impact="$4,800"
                icon={<Wallet className="h-5 w-5 text-purple-400" />}
                status="in-progress"
              />
              
              <TaxStrategyCard 
                title="Business Expense Review"
                description="Comprehensive review of deductible business expenses"
                impact="$13,750"
                icon={<Calculator className="h-5 w-5 text-amber-400" />}
                status="recommended"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="calendar">
            <div className="bg-[#1a2236] p-4 rounded-lg border border-gray-800">
              <h3 className="text-lg font-medium mb-3">Upcoming Tax Deadlines</h3>
              <div className="space-y-4">
                <TaxDeadlineItem
                  date="Apr 15, 2024"
                  title="Federal Income Tax Filing Deadline"
                  description="File your 2023 federal income tax return or request an extension"
                  daysLeft={10}
                />
                
                <TaxDeadlineItem
                  date="Jun 15, 2024"
                  title="Estimated Tax Payment (Q2)"
                  description="Second quarter estimated tax payment due"
                  daysLeft={71}
                />
                
                <TaxDeadlineItem
                  date="Sep 15, 2024"
                  title="Estimated Tax Payment (Q3)"
                  description="Third quarter estimated tax payment due"
                  daysLeft={163}
                />
                
                <TaxDeadlineItem
                  date="Dec 31, 2024"
                  title="Tax-Loss Harvesting Deadline"
                  description="Last day to realize investment losses for current tax year"
                  daysLeft={270}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="deductions">
            <div className="bg-[#1a2236] p-4 rounded-lg border border-gray-800">
              <h3 className="text-lg font-medium mb-3">Potential Deductions</h3>
              <div className="space-y-3">
                <DeductionItem
                  category="Business Expenses"
                  amount={38500}
                  percentage={28}
                  color="bg-blue-500"
                />
                <DeductionItem
                  category="Retirement Contributions"
                  amount={22500}
                  percentage={16}
                  color="bg-green-500"
                />
                <DeductionItem
                  category="Mortgage Interest"
                  amount={19200}
                  percentage={14}
                  color="bg-purple-500"
                />
                <DeductionItem
                  category="Charitable Donations"
                  amount={12500}
                  percentage={9}
                  color="bg-amber-500"
                />
                <DeductionItem
                  category="Medical Expenses"
                  amount={8300}
                  percentage={6}
                  color="bg-red-500"
                />
                <DeductionItem
                  category="Other Deductions"
                  amount={37500}
                  percentage={27}
                  color="bg-cyan-500"
                />
              </div>
              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Potential Deductions</span>
                  <span className="font-medium text-xl text-green-400">$138,500</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

interface TaxStrategyCardProps {
  title: string;
  description: string;
  impact: string;
  icon: React.ReactNode;
  status: "implemented" | "recommended" | "in-progress";
}

const TaxStrategyCard = ({ title, description, impact, icon, status }: TaxStrategyCardProps) => {
  const getStatusBadge = () => {
    switch (status) {
      case "implemented":
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
            Implemented
          </span>
        );
      case "recommended":
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
            Recommended
          </span>
        );
      case "in-progress":
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-400">
            In Progress
          </span>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="bg-[#1a2236] p-4 rounded-lg border border-gray-800">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center">
          {icon}
          <h3 className="ml-2 font-medium">{title}</h3>
        </div>
        {getStatusBadge()}
      </div>
      <p className="text-sm text-gray-400 mb-3">{description}</p>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-400">Potential Savings</span>
        <span className="font-medium text-green-400">{impact}</span>
      </div>
    </div>
  );
};

interface TaxDeadlineItemProps {
  date: string;
  title: string;
  description: string;
  daysLeft: number;
}

const TaxDeadlineItem = ({ date, title, description, daysLeft }: TaxDeadlineItemProps) => {
  return (
    <div className="border border-gray-700 rounded-lg p-3">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium">{title}</h4>
        <div className="flex flex-col items-end">
          <span className="text-sm font-medium">{date}</span>
          <span className={`text-xs mt-1 ${daysLeft < 30 ? 'text-red-400' : 'text-blue-400'}`}>
            {daysLeft} days left
          </span>
        </div>
      </div>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  );
};

interface DeductionItemProps {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

const DeductionItem = ({ category, amount, percentage, color }: DeductionItemProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm">{category}</span>
        <span className="text-sm font-medium">{formatCurrency(amount)}</span>
      </div>
      <div className="flex items-center">
        <Progress value={percentage} className={`h-2 ${color}/20`} indicatorClassName={color} />
        <span className="ml-2 text-xs">{percentage}%</span>
      </div>
    </div>
  );
};
