
import React from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { useNetWorth } from "@/context/NetWorthContext";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useUser } from "@/context/UserContext";

export default function MobileHome() {
  const { assets, totalAssetValue, totalLiabilityValue } = useNetWorth();
  const { userProfile } = useUser();
  
  const netWorth = totalAssetValue - totalLiabilityValue;
  const formattedNetWorth = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(netWorth);
  
  return (
    <MobileLayout title="Boutique Family Office">
      <div className="flex flex-col space-y-6 p-4">
        {/* Net Worth Summary Card */}
        <div className="p-4 rounded-xl bg-[#1B1B32] border border-[#2A2A45]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-200">Net Worth</h2>
            <Link to="/all-assets" className="text-blue-400 text-sm flex items-center">
              <span>All Assets</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          <div className="text-3xl font-bold mb-2">{formattedNetWorth}</div>
          
          <div className="flex justify-between mt-4 border-t border-gray-800 pt-4">
            <div>
              <p className="text-gray-400 text-sm">Assets</p>
              <p className="text-white font-medium">${totalAssetValue.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Liabilities</p>
              <p className="text-white font-medium">${totalLiabilityValue.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        {/* Quick Actions Card */}
        <div className="p-4 rounded-xl bg-[#1B1B32] border border-[#2A2A45]">
          <h2 className="text-lg font-semibold text-gray-200 mb-4">Quick Actions</h2>
          
          <div className="grid grid-cols-2 gap-3">
            <Link to="/transfers" className="flex flex-col items-center p-3 bg-[#2A2A45] rounded-lg">
              <ArrowUpRight className="h-6 w-6 mb-2 text-blue-400" />
              <span className="text-sm">Make Transfer</span>
            </Link>
            
            <Link to="/documents" className="flex flex-col items-center p-3 bg-[#2A2A45] rounded-lg">
              <ArrowUpRight className="h-6 w-6 mb-2 text-blue-400" />
              <span className="text-sm">View Documents</span>
            </Link>
            
            <Link to="/advisor-profile" className="flex flex-col items-center p-3 bg-[#2A2A45] rounded-lg">
              <ArrowUpRight className="h-6 w-6 mb-2 text-blue-400" />
              <span className="text-sm">Contact Advisor</span>
            </Link>
            
            <Link to="/all-assets" className="flex flex-col items-center p-3 bg-[#2A2A45] rounded-lg">
              <ArrowUpRight className="h-6 w-6 mb-2 text-blue-400" />
              <span className="text-sm">Add Asset</span>
            </Link>
          </div>
        </div>
        
        {/* Recent Activity Card */}
        <div className="p-4 rounded-xl bg-[#1B1B32] border border-[#2A2A45]">
          <h2 className="text-lg font-semibold text-gray-200 mb-4">Recent Activity</h2>
          
          {/* Placeholder for no activity */}
          <div className="text-center py-6 text-gray-400">
            <p>No recent activity to display</p>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
