
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BanknoteIcon, ArrowRightLeft, WalletIcon } from "lucide-react";

const IndexPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome to Financial Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Cash Management</CardTitle>
            <CardDescription>
              Manage your banking accounts and view insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Access your accounts, view balances, and analyze your cash flow.</p>
            <Button asChild className="w-full">
              <Link to="/cash-management">
                <BanknoteIcon className="mr-2 h-4 w-4" />
                Go to Cash Management
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Transfers</CardTitle>
            <CardDescription>
              Move money between accounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Transfer funds between accounts or to external recipients.</p>
            <Button asChild className="w-full">
              <Link to="/banking-transfers">
                <ArrowRightLeft className="mr-2 h-4 w-4" />
                Go to Transfers
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Funding Accounts</CardTitle>
            <CardDescription>
              Manage your funding sources
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Add and manage accounts for transfers and payments.</p>
            <Button asChild className="w-full">
              <Link to="/funding-accounts">
                <WalletIcon className="mr-2 h-4 w-4" />
                Go to Funding Accounts
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Debug Tools</CardTitle>
            <CardDescription>
              Access diagnostic tools for troubleshooting
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link to="/debug">
                Go to Debug Page
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IndexPage;
