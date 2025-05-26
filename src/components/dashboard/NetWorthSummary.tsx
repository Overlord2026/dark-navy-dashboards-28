
import React from "react";
import { Progress } from "@/components/ui/progress";
import { ArrowUpRight, Wallet, Maximize2, Home, User, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNetWorth } from "@/context/NetWorthContext";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { formatCurrency } from "@/lib/formatters";

export const NetWorthSummary = () => {
  console.log('NetWorthSummary rendering');
  try {
    const { assets, getTotalNetWorth, getTotalAssetsByType, getAssetsByOwner } = useNetWorth();
    console.log('NetWorthSummary: useNetWorth hook loaded successfully', assets.length);
    const { userProfile } = useUser();
    const navigate = useNavigate();
    
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
    
    // New asset categories
    const vehiclesValue = getTotalAssetsByType('vehicle') + getTotalAssetsByType('boat');
    const vehiclesPercentage = totalNetWorth > 0 ? Math.round((vehiclesValue / totalNetWorth) * 100) : 0;
    
    // Get property count
    const propertyCount = assets.filter(asset => asset.type === 'property').length;
    const vehicleCount = assets.filter(asset => asset.type === 'vehicle' || asset.type === 'boat').length;
    
    // Get unique asset owners - simplified to show only top 2
    const owners = Array.from(new Set(assets.map(asset => asset.owner))).slice(0, 2);

    return (
      <div className="bg-[#121a2c]/80 rounded-lg p-4 border border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center">
            <Wallet className="mr-2 h-5 w-5 text-blue-400" />
            Net Worth Summary
          </h2>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6"
              onClick={() => navigate('/all-assets')}
            >
              <Maximize2 className="h-4 w-4" />
              <span className="sr-only">View All Assets</span>
            </Button>
            <span className="text-green-400 flex items-center text-sm">
              <ArrowUpRight className="mr-1 h-4 w-4" />
              +5.2%
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-[#1a2236] p-3 rounded-lg border border-gray-800">
            <div className="text-sm text-gray-400 mb-1">Total Assets</div>
            <div className="text-xl font-semibold">{formatCurrency(totalNetWorth)}</div>
            <div className="text-xs text-green-400">+$124,500 (5.3%)</div>
          </div>
          
          <div className="bg-[#1a2236] p-3 rounded-lg border border-gray-800">
            <div className="text-sm text-gray-400 mb-1">Total Liabilities</div>
            <div className="text-xl font-semibold">{formatCurrency(845210)}</div>
            <div className="text-xs text-red-400">+$12,300 (1.5%)</div>
          </div>
          
          <div className="bg-[#1a2236] p-3 rounded-lg border border-gray-800 relative">
            <div className="text-sm text-gray-400 mb-1">Net Worth</div>
            <div className="text-xl font-semibold text-blue-400">{formatCurrency(totalNetWorth - 845210)}</div>
            <div className="text-xs text-green-400">+$112,200 (7.5%)</div>
            
            <div className="flex gap-1 absolute top-1 right-1">
              {propertyCount > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs flex items-center text-blue-400 hover:text-blue-300 px-1"
                  onClick={() => navigate('/properties')}
                >
                  <Home className="h-3 w-3 mr-1" />
                  {propertyCount}
                </Button>
              )}
              
              {vehicleCount > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs flex items-center text-green-400 hover:text-green-300 px-1"
                  onClick={() => navigate('/all-assets')}
                >
                  <Car className="h-3 w-3 mr-1" />
                  {vehicleCount}
                </Button>
              )}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium mb-3">Asset Allocation</h3>
            <div className="space-y-2">
              {realEstateValue > 0 && (
                <AssetItem 
                  label="Real Estate" 
                  value={formatCurrency(realEstateValue)} 
                  percentage={realEstatePercentage} 
                  color="bg-blue-500" 
                />
              )}
              
              {vehiclesValue > 0 && (
                <AssetItem 
                  label="Vehicles & Boats" 
                  value={formatCurrency(vehiclesValue)} 
                  percentage={vehiclesPercentage} 
                  color="bg-green-500" 
                />
              )}
              
              {retirementValue > 0 && (
                <AssetItem 
                  label="Retirement Accounts" 
                  value={formatCurrency(retirementValue)} 
                  percentage={retirementPercentage} 
                  color="bg-purple-500" 
                />
              )}
              
              {investmentsValue > 0 && (
                <AssetItem 
                  label="Investments" 
                  value={formatCurrency(investmentsValue)} 
                  percentage={investmentsPercentage} 
                  color="bg-indigo-500" 
                />
              )}
              
              {cashValue > 0 && (
                <AssetItem 
                  label="Cash & Equivalents" 
                  value={formatCurrency(cashValue)} 
                  percentage={cashPercentage} 
                  color="bg-amber-500" 
                />
              )}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-3">Ownership Breakdown</h3>
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
          </div>
        </div>
        
        <div className="mt-4 pt-3 border-t border-gray-800 flex justify-end">
          <Button 
            variant="link" 
            className="text-blue-400 hover:text-blue-300 text-sm p-0" 
            onClick={() => navigate('/all-assets')}
          >
            View All Assets →
          </Button>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error in NetWorthSummary:', error);
    return (
      <div className="bg-[#121a2c]/80 rounded-lg p-3 border border-gray-800">
        <h2 className="text-xl font-semibold">Net Worth Summary</h2>
        <div className="p-4 text-center text-red-400">
          Unable to load net worth data. Please reload the page.
        </div>
      </div>
    );
  }
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
