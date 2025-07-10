import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownToLine, ArrowUpFromLine } from "lucide-react";

const CreateTransfer = () => {
  const handleTransferType = (type: 'deposit' | 'withdrawal') => {
    // TODO: Navigate to specific transfer flow
    console.log(`${type} transfer selected`);
  };

  return (
    <ThreeColumnLayout title="Create Transfer">
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] p-6">
        <div className="w-full max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold mb-2">Create Transfer</h1>
            <p className="text-muted-foreground">Select the type of transfer you'd like to make</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card 
              className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
              onClick={() => handleTransferType('deposit')}
            >
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <ArrowDownToLine className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl">Deposit</CardTitle>
                <CardDescription>
                  Transfer funds from your external accounts to your family office
                </CardDescription>
              </CardHeader>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
              onClick={() => handleTransferType('withdrawal')}
            >
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <ArrowUpFromLine className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Withdrawal</CardTitle>
                <CardDescription>
                  Transfer funds from your family office to external accounts
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </ThreeColumnLayout>
  );
};

export default CreateTransfer;