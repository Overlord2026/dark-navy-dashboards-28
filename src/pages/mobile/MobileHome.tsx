
import React from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  ChevronRight, 
  CreditCard, 
  ArrowRightLeft, 
  FileText, 
  PieChart,
  Wallet,
  BarChart3,
  ShieldIcon,
  Building,
  GraduationCap
} from "lucide-react";
import { useNetWorth } from "@/context/NetWorthContext";

export default function MobileHome() {
  const { totalAssetValue, totalLiabilityValue } = useNetWorth();
  const netWorth = totalAssetValue - totalLiabilityValue;

  return (
    <MobileLayout title="Family Office">
      <div className="p-4 space-y-6">
        {/* Net Worth Card */}
        <Card className="bg-[#1B1B32] border border-[#2A2A45]">
          <CardContent className="p-6">
            <h3 className="text-gray-400 text-sm mb-1">Net Worth</h3>
            <p className="text-2xl font-bold">${netWorth.toLocaleString()}</p>
            <div className="flex justify-between mt-4 text-sm">
              <div>
                <p className="text-gray-400">Assets</p>
                <p className="font-medium">${totalAssetValue.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-400">Liabilities</p>
                <p className="font-medium">${totalLiabilityValue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link to="/accounts">
              <Card className="bg-[#1B1B32] border border-[#2A2A45] h-full">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                  <CreditCard className="h-6 w-6 mb-2 text-blue-400" />
                  <span className="text-sm">Accounts</span>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/transfers">
              <Card className="bg-[#1B1B32] border border-[#2A2A45] h-full">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                  <ArrowRightLeft className="h-6 w-6 mb-2 text-green-400" />
                  <span className="text-sm">Transfers</span>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/documents">
              <Card className="bg-[#1B1B32] border border-[#2A2A45] h-full">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                  <FileText className="h-6 w-6 mb-2 text-purple-400" />
                  <span className="text-sm">Documents</span>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/tax-planning">
              <Card className="bg-[#1B1B32] border border-[#2A2A45] h-full">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                  <PieChart className="h-6 w-6 mb-2 text-orange-400" />
                  <span className="text-sm">Tax Planning</span>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
        
        {/* Wealth Management Section */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Wealth Management</h2>
          <div className="space-y-3">
            <Link to="/accounts">
              <Card className="bg-[#1B1B32] border border-[#2A2A45]">
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="mr-4 p-2 bg-[#2A2A45] rounded-full">
                      <Wallet className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-medium">Accounts & Assets</h3>
                      <p className="text-xs text-gray-400">View all your financial accounts</p>
                    </div>
                    <ChevronRight className="ml-auto h-5 w-5 text-gray-500" />
                  </div>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/investments">
              <Card className="bg-[#1B1B32] border border-[#2A2A45]">
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="mr-4 p-2 bg-[#2A2A45] rounded-full">
                      <BarChart3 className="h-5 w-5 text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-medium">Investments</h3>
                      <p className="text-xs text-gray-400">Manage your investment portfolio</p>
                    </div>
                    <ChevronRight className="ml-auto h-5 w-5 text-gray-500" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
        
        {/* Education & Planning Section */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Education & Planning</h2>
          <div className="space-y-3">
            <Link to="/tax-planning">
              <Card className="bg-[#1B1B32] border border-[#2A2A45]">
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="mr-4 p-2 bg-[#2A2A45] rounded-full">
                      <PieChart className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-medium">Tax Planning</h3>
                      <p className="text-xs text-gray-400">Optimize your tax strategy</p>
                    </div>
                    <ChevronRight className="ml-auto h-5 w-5 text-gray-500" />
                  </div>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/education">
              <Card className="bg-[#1B1B32] border border-[#2A2A45]">
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="mr-4 p-2 bg-[#2A2A45] rounded-full">
                      <GraduationCap className="h-5 w-5 text-orange-400" />
                    </div>
                    <div>
                      <h3 className="font-medium">Education Center</h3>
                      <p className="text-xs text-gray-400">Learn financial concepts and strategies</p>
                    </div>
                    <ChevronRight className="ml-auto h-5 w-5 text-gray-500" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
