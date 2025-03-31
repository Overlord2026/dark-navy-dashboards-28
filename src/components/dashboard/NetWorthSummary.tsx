
import { DashboardCard } from "@/components/ui/DashboardCard";
import { Progress } from "@/components/ui/progress";
import { ArrowUpRight, Wallet, Maximize2, Home, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNetWorth } from "@/context/NetWorthContext";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";

export const NetWorthSummary = () => {
  const { assets, getTotalNetWorth, getTotalAssetsByType, getAssetsByOwner } = useNetWorth();
  const { userProfile } = useUser();
  const navigate = useNavigate();
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Calculate asset allocation percentages
  const totalNetWorth = getTotalNetWorth();
  const realEstateValue = getTotalAssetsByType('property');
  const realEstatePercentage = totalNetWorth > 0 ? Math.round((realEstateValue / totalNetWorth) * 100) : 0;
  
  const retirementValue = getTotalAssetsByType('retirement');
  const retirementPercentage = totalNetWorth > 0 ? Math.round((retirementValue / totalNetWorth) * 100) : 0;
  
  const investmentsValue = getTotalAssetsByType('investment');
  const investmentsPercentage = totalNetWorth > 0 ? Math.round((investmentsValue / totalNetWorth) * 100) : 0;
  
  const cashValue = getTotalAssetsByType('cash');
  const cashPercentage = totalNetWorth > 0 ? Math.round((cashValue / totalNetWorth) * 100) : 0;
  
  const otherValue = getTotalAssetsByType('other');
  const otherPercentage = totalNetWorth > 0 ? Math.round((otherValue / totalNetWorth) * 100) : 0;
  
  // Get property count
  const propertyCount = assets.filter(asset => asset.type === 'property').length;
  
  // Get unique asset owners
  const owners = Array.from(new Set(assets.map(asset => asset.owner)));

  return (
    <div className="bg-[#121a2c]/80 rounded-lg p-3 border border-gray-800">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold flex items-center">
          <Wallet className="mr-2 h-5 w-5 text-blue-400" />
          Net Worth Summary
        </h2>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <Maximize2 className="h-4 w-4" />
            <span className="sr-only">Expand</span>
          </Button>
          <span className="text-green-400 flex items-center text-sm">
            <ArrowUpRight className="mr-1 h-4 w-4" />
            +5.2% from last month
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
        <div className="bg-[#1a2236] p-3 rounded-lg border border-gray-800">
          <div className="text-sm text-gray-400 mb-1">Total Assets</div>
          <div className="text-2xl font-semibold">{formatCurrency(totalNetWorth)}</div>
          <div className="text-xs text-green-400">+$124,500 (5.3%)</div>
        </div>
        
        <div className="bg-[#1a2236] p-3 rounded-lg border border-gray-800">
          <div className="text-sm text-gray-400 mb-1">Total Liabilities</div>
          <div className="text-2xl font-semibold">{formatCurrency(845210)}</div>
          <div className="text-xs text-red-400">+$12,300 (1.5%)</div>
        </div>
        
        <div className="bg-[#1a2236] p-3 rounded-lg border border-gray-800 relative">
          <div className="text-sm text-gray-400 mb-1">Net Worth</div>
          <div className="text-2xl font-semibold text-blue-400">{formatCurrency(totalNetWorth - 845210)}</div>
          <div className="text-xs text-green-400">+$112,200 (7.5%)</div>
          
          {propertyCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute top-1 right-1 text-xs flex items-center text-blue-400 hover:text-blue-300"
              onClick={() => navigate('/properties')}
            >
              <Home className="h-3 w-3 mr-1" />
              {propertyCount} Properties
            </Button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <h3 className="text-sm font-medium mb-2">Asset Allocation</h3>
          <div className="space-y-2">
            <AssetItem 
              label="Real Estate" 
              value={formatCurrency(realEstateValue)} 
              percentage={realEstatePercentage} 
              color="bg-blue-500" 
            />
            <AssetItem 
              label="Retirement Accounts" 
              value={formatCurrency(retirementValue)} 
              percentage={retirementPercentage} 
              color="bg-purple-500" 
            />
            <AssetItem 
              label="Investments" 
              value={formatCurrency(investmentsValue)} 
              percentage={investmentsPercentage} 
              color="bg-green-500" 
            />
            <AssetItem 
              label="Cash & Equivalents" 
              value={formatCurrency(cashValue)} 
              percentage={cashPercentage} 
              color="bg-amber-500" 
            />
            {otherValue > 0 && (
              <AssetItem 
                label="Other Assets" 
                value={formatCurrency(otherValue)} 
                percentage={otherPercentage} 
                color="bg-gray-500" 
              />
            )}
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2">Ownership Breakdown</h3>
          <div className="space-y-2">
            {owners.map((owner, index) => {
              const ownerAssets = getAssetsByOwner(owner);
              const ownerTotal = ownerAssets.reduce((sum, asset) => sum + asset.value, 0);
              const ownerPercentage = totalNetWorth > 0 ? Math.round((ownerTotal / totalNetWorth) * 100) : 0;
              
              return (
                <div key={index}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm flex items-center">
                      <User className="h-3 w-3 mr-1 text-blue-400" />
                      {owner}
                    </span>
                    <span className="text-sm font-medium">{formatCurrency(ownerTotal)}</span>
                  </div>
                  <div className="flex items-center">
                    <Progress value={ownerPercentage} className="h-2 bg-blue-500/20" indicatorClassName="bg-blue-500" />
                    <span className="ml-2 text-xs">{ownerPercentage}%</span>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Liability Breakdown</h3>
            <div className="space-y-2">
              <AssetItem label="Mortgage" value="$685,000" percentage={81} color="bg-red-500" />
              <AssetItem label="Auto Loans" value="$48,210" percentage={6} color="bg-orange-500" />
              <AssetItem label="Student Loans" value="$72,000" percentage={9} color="bg-pink-500" />
              <AssetItem label="Credit Cards" value="$40,000" percentage={4} color="bg-cyan-500" />
            </div>
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
