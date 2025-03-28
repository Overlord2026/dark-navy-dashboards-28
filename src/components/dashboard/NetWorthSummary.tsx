import { DashboardCard } from "@/components/ui/DashboardCard";
import { Progress } from "@/components/ui/progress";
import { ArrowUpRight, Wallet, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const NetWorthSummary = () => {
  return (
    <div className="bg-[#121a2c]/80 rounded-lg p-4 border border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center">
          <Wallet className="mr-2 h-5 w-5 text-blue-400" />
          Net Worth Summary
        </h2>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Maximize2 className="h-4 w-4" />
            <span className="sr-only">Expand</span>
          </Button>
          <span className="text-green-400 flex items-center text-sm">
            <ArrowUpRight className="mr-1 h-4 w-4" />
            +5.2% from last month
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-[#1a2236] p-4 rounded-lg border border-gray-800">
          <div className="text-sm text-gray-400 mb-1">Total Assets</div>
          <div className="text-2xl font-semibold">$2,458,320</div>
          <div className="text-xs text-green-400 mt-1">+$124,500 (5.3%)</div>
        </div>
        
        <div className="bg-[#1a2236] p-4 rounded-lg border border-gray-800">
          <div className="text-sm text-gray-400 mb-1">Total Liabilities</div>
          <div className="text-2xl font-semibold">$845,210</div>
          <div className="text-xs text-red-400 mt-1">+$12,300 (1.5%)</div>
        </div>
        
        <div className="bg-[#1a2236] p-4 rounded-lg border border-gray-800">
          <div className="text-sm text-gray-400 mb-1">Net Worth</div>
          <div className="text-2xl font-semibold text-blue-400">$1,613,110</div>
          <div className="text-xs text-green-400 mt-1">+$112,200 (7.5%)</div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium mb-3">Asset Allocation</h3>
          <div className="space-y-3">
            <AssetItem label="Real Estate" value="$1,250,000" percentage={51} color="bg-blue-500" />
            <AssetItem label="Retirement Accounts" value="$642,000" percentage={26} color="bg-purple-500" />
            <AssetItem label="Investments" value="$380,000" percentage={15} color="bg-green-500" />
            <AssetItem label="Cash & Equivalents" value="$186,320" percentage={8} color="bg-amber-500" />
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-3">Liability Breakdown</h3>
          <div className="space-y-3">
            <AssetItem label="Mortgage" value="$685,000" percentage={81} color="bg-red-500" />
            <AssetItem label="Auto Loans" value="$48,210" percentage={6} color="bg-orange-500" />
            <AssetItem label="Student Loans" value="$72,000" percentage={9} color="bg-pink-500" />
            <AssetItem label="Credit Cards" value="$40,000" percentage={4} color="bg-cyan-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

interface AssetItemProps {
  label: string;
  value: string;
  percentage: number;
  color: string;
}

const AssetItem = ({ label, value, percentage, color }: AssetItemProps) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm">{label}</span>
        <span className="text-sm font-medium">{value}</span>
      </div>
      <div className="flex items-center">
        <Progress value={percentage} className={`h-2 ${color}/20`} indicatorClassName={color} />
        <span className="ml-2 text-xs">{percentage}%</span>
      </div>
    </div>
  );
};
