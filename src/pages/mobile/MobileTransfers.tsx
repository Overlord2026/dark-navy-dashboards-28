
import React, { useState } from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { ArrowDownIcon, ArrowUpIcon, ArrowRightLeft, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TransferForm } from "@/components/transfers/TransferForm";
import { TransferHistory } from "@/components/transfers/TransferHistory";
import { useBankAccounts } from "@/hooks/useBankAccounts";

export default function MobileTransfers() {
  const { getFormattedTotalBalance } = useBankAccounts();
  const [activeTab, setActiveTab] = useState("transfer");

  return (
    <MobileLayout title="Transfers">
      <div className="p-4 space-y-6">
        {/* Header with Balance */}
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Balance</p>
              <p className="text-2xl font-semibold">{getFormattedTotalBalance()}</p>
            </div>
          </CardContent>
        </Card>

        {/* Mobile Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="transfer" className="flex items-center gap-2">
              <ArrowRightLeft className="h-4 w-4" />
              Transfer
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="transfer" className="space-y-6">
            <TransferForm onSuccess={() => setActiveTab("history")} />
            
            {/* Quick Actions for Mobile */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Transfer</CardTitle>
                <CardDescription>
                  Common transfer scenarios
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <ArrowDownIcon className="h-4 w-4 mr-2 text-green-500" />
                  Emergency → Checking
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <ArrowUpIcon className="h-4 w-4 mr-2 text-blue-500" />
                  Checking → Savings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <TransferHistory />
          </TabsContent>
        </Tabs>
      </div>
    </MobileLayout>
  );
}
