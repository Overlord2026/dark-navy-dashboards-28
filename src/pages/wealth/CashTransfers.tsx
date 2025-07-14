import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WalletIcon, RepeatIcon, PlusIcon } from "lucide-react";
import { Link } from "react-router-dom";

const CashTransfers = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Cash & Transfers</h1>
          <p className="text-muted-foreground">Manage your cash flow and transfer funds between accounts</p>
        </div>
        <Button asChild>
          <Link to="/wealth/cash/transfers">
            <RepeatIcon className="mr-2 h-4 w-4" />
            New Transfer
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="management">Cash Management</TabsTrigger>
          <TabsTrigger value="transfers">Transfers</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <WalletIcon className="h-5 w-5" />
                  Cash Management
                </CardTitle>
                <CardDescription>Optimize your cash allocation and liquidity</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link to="/wealth/cash/management">Manage Cash</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RepeatIcon className="h-5 w-5" />
                  Transfers
                </CardTitle>
                <CardDescription>Transfer funds between your accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link to="/wealth/cash/transfers">View Transfers</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="management" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cash Management</CardTitle>
              <CardDescription>Detailed cash management tools and analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Cash management features will be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transfers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Transfer History</CardTitle>
              <CardDescription>View and manage your transfer history</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Transfer management features will be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CashTransfers;