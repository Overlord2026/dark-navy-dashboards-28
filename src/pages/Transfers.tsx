
import React from "react";
import { useNavigate } from "react-router-dom";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Building2, CreditCard } from "lucide-react";

const Transfers = () => {
  const navigate = useNavigate();

  const handleAddFundingAccount = () => {
    // TODO: Navigate to add funding account page or open modal
    console.log("Add funding account clicked");
  };

  const handleCreateTransfer = () => {
    navigate('/create-transfer');
  };

  // Mock funding accounts data - replace with actual data later
  const fundingAccounts = [
    {
      id: 1,
      name: "Chase Business Checking",
      type: "Checking",
      accountNumber: "****1234",
      bank: "JPMorgan Chase"
    },
    {
      id: 2,
      name: "Wells Fargo Savings",
      type: "Savings",
      accountNumber: "****5678",
      bank: "Wells Fargo"
    }
  ];

  return (
    <ThreeColumnLayout title="Transfers">
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] p-6">
        <div className="w-full max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-semibold">Funding Account</h1>
            <div className="flex items-center gap-3">
              <Button onClick={handleAddFundingAccount} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add a Funding Account
              </Button>
              <Button 
                onClick={handleCreateTransfer} 
                variant="default" 
                className="flex items-center gap-2"
              >
                Create Transfer
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {fundingAccounts.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <CardTitle className="mb-2">No Funding Accounts</CardTitle>
                  <CardDescription>
                    Add a funding account to start transferring funds to your family office.
                  </CardDescription>
                </CardContent>
              </Card>
            ) : (
              fundingAccounts.map((account) => (
                <Card key={account.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-8 w-8 text-primary" />
                        <div>
                          <CardTitle className="text-lg">{account.name}</CardTitle>
                          <CardDescription>
                            {account.bank} • {account.type} • {account.accountNumber}
                          </CardDescription>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </div>
                  </CardHeader>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </ThreeColumnLayout>
  );
};

export default Transfers;
