
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BanknoteIcon, ArrowRightLeft, WalletIcon } from "lucide-react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { useSubscription } from "@/context/SubscriptionContext";
import { WelcomeTrialBanner } from "@/components/dashboard/WelcomeTrialBanner";

const Dashboard = () => {
  const { isInTrial } = useSubscription();
  const [showTrialBanner, setShowTrialBanner] = React.useState(true);

  const handleDismissBanner = () => {
    setShowTrialBanner(false);
  };

  return (
    <ThreeColumnLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Welcome to Financial Dashboard</h1>
        
        {isInTrial && showTrialBanner && (
          <WelcomeTrialBanner onDismiss={handleDismissBanner} />
        )}
        
        <div className="grid grid-cols-1 gap-6 mb-8">
          <Card className="bg-[#1E1E2E] text-white border-0">
            <CardHeader>
              <CardTitle className="text-2xl">Cash Management</CardTitle>
              <CardDescription className="text-gray-400">
                Manage your banking accounts and view insights
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="mb-4">Access your accounts, view balances, and analyze your cash flow.</p>
              <Button asChild className="w-full bg-yellow-500 hover:bg-yellow-600 text-black">
                <Link to="/cash-management">
                  <BanknoteIcon className="mr-2 h-4 w-4" />
                  Go to Cash Management
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-[#1E1E2E] text-white border-0">
            <CardHeader>
              <CardTitle className="text-2xl">Transfers</CardTitle>
              <CardDescription className="text-gray-400">
                Move money between accounts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="mb-4">Transfer funds between accounts or to external recipients.</p>
              <Button asChild className="w-full bg-yellow-500 hover:bg-yellow-600 text-black">
                <Link to="/banking-transfers">
                  <ArrowRightLeft className="mr-2 h-4 w-4" />
                  Go to Transfers
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-[#1E1E2E] text-white border-0">
            <CardHeader>
              <CardTitle className="text-2xl">Funding Accounts</CardTitle>
              <CardDescription className="text-gray-400">
                Manage your funding sources
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="mb-4">Add and manage accounts for transfers and payments.</p>
              <Button asChild className="w-full bg-yellow-500 hover:bg-yellow-600 text-black">
                <Link to="/funding-accounts">
                  <WalletIcon className="mr-2 h-4 w-4" />
                  Go to Funding Accounts
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </ThreeColumnLayout>
  );
};

export default Dashboard;
