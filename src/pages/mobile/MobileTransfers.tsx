
import React from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MobileTransfers() {
  return (
    <MobileLayout title="Transfers">
      <div className="p-4 space-y-6">
        {/* Transfer Options */}
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-[#1B1B32] border border-[#2A2A45] flex items-center">
            <div className="mr-4 p-2 bg-[#2A2A45] rounded-full">
              <ArrowDownIcon className="h-6 w-6 text-green-400" />
            </div>
            <div>
              <h3 className="font-medium text-white">Deposit</h3>
              <p className="text-sm text-gray-400">Into Family Office</p>
            </div>
            <Button variant="ghost" className="ml-auto">
              <ArrowUpIcon className="h-4 w-4 text-white" />
            </Button>
          </div>
          
          <div className="p-4 rounded-lg bg-[#1B1B32] border border-[#2A2A45] flex items-center">
            <div className="mr-4 p-2 bg-[#2A2A45] rounded-full">
              <ArrowUpIcon className="h-6 w-6 text-red-400" />
            </div>
            <div>
              <h3 className="font-medium text-white">Withdraw</h3>
              <p className="text-sm text-gray-400">From Family Office</p>
            </div>
            <Button variant="ghost" className="ml-auto">
              <ArrowUpIcon className="h-4 w-4 text-white" />
            </Button>
          </div>
        </div>
        
        {/* Funding Account Section */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-3">Funding Account</h2>
          <div className="p-4 rounded-lg bg-[#1B1B32] border border-[#2A2A45]">
            <p className="text-gray-300">
              Talk to your advisor if you would like to add or change your funding account.
            </p>
          </div>
        </div>
        
        {/* Activity Section */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-3">Activity</h2>
          <div className="p-6 rounded-lg bg-[#1B1B32] border border-[#2A2A45] text-center">
            <p className="text-gray-300">You have no transfer activity.</p>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
