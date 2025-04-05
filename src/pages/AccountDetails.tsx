
import React from "react";
import { useParams } from "react-router-dom";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";

interface AccountData {
  id: string;
  name: string;
  type: string;
  balance: number;
  institution: string;
  lastUpdated: string;
  transactions: {
    id: string;
    date: string;
    description: string;
    amount: number;
    category: string;
  }[];
}

const AccountDetails = () => {
  const { accountId } = useParams<{ accountId: string }>();

  // Mock data fetching with react-query
  const { data: account, isLoading, error } = useQuery({
    queryKey: ['account', accountId],
    queryFn: async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock account data
      const mockAccount: AccountData = {
        id: accountId || "unknown",
        name: "Primary Checking Account",
        type: "Checking",
        balance: 12589.45,
        institution: "First National Bank",
        lastUpdated: new Date().toISOString(),
        transactions: [
          {
            id: "t1",
            date: "2025-04-01",
            description: "Grocery Store",
            amount: -125.34,
            category: "Food & Dining"
          },
          {
            id: "t2",
            date: "2025-03-29",
            description: "Salary Deposit",
            amount: 3500.00,
            category: "Income"
          },
          {
            id: "t3",
            date: "2025-03-28",
            description: "Electric Bill",
            amount: -89.99,
            category: "Utilities"
          },
          {
            id: "t4",
            date: "2025-03-25",
            description: "Restaurant",
            amount: -75.20,
            category: "Food & Dining"
          },
          {
            id: "t5",
            date: "2025-03-20",
            description: "Transfer to Savings",
            amount: -500.00,
            category: "Transfer"
          }
        ]
      };
      
      return mockAccount;
    }
  });

  if (isLoading) {
    return (
      <ThreeColumnLayout title="Account Details">
        <div className="p-4">Loading account details...</div>
      </ThreeColumnLayout>
    );
  }

  if (error) {
    return (
      <ThreeColumnLayout title="Account Details">
        <div className="p-4 text-red-600">Error loading account details.</div>
      </ThreeColumnLayout>
    );
  }

  return (
    <ThreeColumnLayout title={`Account: ${account?.name || 'Unknown'}`}>
      <div className="container py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Account Summary Card */}
          <Card className="p-6 flex-1">
            <h2 className="text-2xl font-semibold mb-4">Account Summary</h2>
            <div className="grid gap-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Account Type:</span>
                <span className="font-medium">{account?.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Institution:</span>
                <span className="font-medium">{account?.institution}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Current Balance:</span>
                <span className="font-semibold text-lg">${account?.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Updated:</span>
                <span>{new Date(account?.lastUpdated || "").toLocaleDateString()}</span>
              </div>
            </div>
          </Card>

          {/* Quick Actions Card */}
          <Card className="p-6 flex-1">
            <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid gap-3">
              <button className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition-colors">
                Transfer Money
              </button>
              <button className="bg-secondary text-secondary-foreground px-4 py-2 rounded hover:bg-secondary/90 transition-colors">
                Update Account Details
              </button>
              <button className="bg-secondary text-secondary-foreground px-4 py-2 rounded hover:bg-secondary/90 transition-colors">
                View Statements
              </button>
              <button className="bg-destructive/10 text-destructive px-4 py-2 rounded hover:bg-destructive/20 transition-colors">
                Close Account
              </button>
            </div>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card className="mt-6 p-6">
          <h2 className="text-2xl font-semibold mb-4">Recent Transactions</h2>
          <Separator className="mb-4" />
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4">Date</th>
                  <th className="text-left py-2 px-4">Description</th>
                  <th className="text-left py-2 px-4">Category</th>
                  <th className="text-right py-2 px-4">Amount</th>
                </tr>
              </thead>
              <tbody>
                {account?.transactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">{transaction.date}</td>
                    <td className="py-3 px-4">{transaction.description}</td>
                    <td className="py-3 px-4">{transaction.category}</td>
                    <td className={`py-3 px-4 text-right ${transaction.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                      ${Math.abs(transaction.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-center">
            <button className="text-primary hover:underline">
              View All Transactions
            </button>
          </div>
        </Card>
      </div>
    </ThreeColumnLayout>
  );
};

export default AccountDetails;
