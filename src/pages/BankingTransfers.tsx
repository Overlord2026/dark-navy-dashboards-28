
import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AlertCircle, AlertTriangle, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const BankingTransfers = () => {
  const { toast } = useToast();
  const [transferType, setTransferType] = useState("deposit");
  
  // Form states for different transfer types
  const [depositForm, setDepositForm] = useState({
    amount: "",
    toAccount: ""
  });
  
  const [withdrawalForm, setWithdrawalForm] = useState({
    amount: "",
    fromAccount: ""
  });
  
  // Sample accounts data (normally would come from an API or context)
  const accounts = [
    {
      id: "acc-1",
      name: "Primary Checking",
      type: "checking",
      balance: 12467.52,
      isACHEnabled: true
    },
    {
      id: "acc-2",
      name: "Emergency Savings",
      type: "savings",
      balance: 35920.18,
      isACHEnabled: false
    },
    {
      id: "acc-3",
      name: "High-Yield Savings",
      type: "savings",
      balance: 78350.44,
      isACHEnabled: true
    }
  ];
  
  // Filter accounts eligible for ACH transfers
  const achEligibleAccounts = accounts.filter(acc => acc.isACHEnabled);
  
  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!depositForm.amount || !depositForm.toAccount) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    // This would normally connect to an API to process the deposit
    toast({
      title: "Deposit Request Submitted",
      description: `Your deposit request for $${depositForm.amount} has been submitted for processing.`,
    });
    
    // Reset form
    setDepositForm({
      amount: "",
      toAccount: ""
    });
  };
  
  const handleWithdrawalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!withdrawalForm.amount || !withdrawalForm.fromAccount) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    // This would normally connect to an API to process the withdrawal
    toast({
      title: "Withdrawal Request Submitted",
      description: `Your withdrawal request for $${withdrawalForm.amount} has been submitted for processing.`,
    });
    
    // Reset form
    setWithdrawalForm({
      amount: "",
      fromAccount: ""
    });
  };
  
  // Show the wire transfer instructions modal
  const showWireInstructions = () => {
    toast({
      title: "Wire Transfer Instructions",
      description: "Please contact your wealth advisor for wire transfer instructions.",
      duration: 5000,
    });
  };
  
  return (
    <ThreeColumnLayout title="Banking Transfers">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Banking Transfers</h1>
          <p className="text-muted-foreground mt-2">
            Securely transfer funds to and from your accounts.
          </p>
        </div>
        
        <Tabs value={transferType} onValueChange={setTransferType} className="space-y-6">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="deposit">One-time Deposit</TabsTrigger>
            <TabsTrigger value="withdrawal">Withdrawal</TabsTrigger>
          </TabsList>
          
          {/* Deposit Tab */}
          <TabsContent value="deposit">
            <Card>
              <CardHeader>
                <CardTitle>One-time deposit</CardTitle>
                <CardDescription>
                  Looking to make a deposit into your account? Simply follow the steps below to initiate the transaction.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleDepositSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="deposit-to-account">Deposit to</Label>
                    <Select 
                      value={depositForm.toAccount}
                      onValueChange={(value) => setDepositForm({...depositForm, toAccount: value})}
                    >
                      <SelectTrigger id="deposit-to-account">
                        <SelectValue placeholder="Select account" />
                      </SelectTrigger>
                      <SelectContent>
                        {accounts.map((account) => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.name} (${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="deposit-amount">Amount</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <Input 
                        id="deposit-amount"
                        type="number"
                        placeholder="0.00"
                        className="pl-8"
                        value={depositForm.amount}
                        onChange={(e) => setDepositForm({...depositForm, amount: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="bg-amber-50 border border-amber-200 rounded-md p-4 flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-amber-800">
                        Please contact your wealth advisor to set up ACH Authorization.
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <button 
                      type="button"
                      onClick={showWireInstructions}
                      className="text-primary flex items-center hover:underline"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      <span>Prefer to send a wire transfer?</span>
                    </button>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={!depositForm.amount || !depositForm.toAccount}
                  >
                    Deposit
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Withdrawal Tab */}
          <TabsContent value="withdrawal">
            <Card>
              <CardHeader>
                <CardTitle>Withdraw funds</CardTitle>
                <CardDescription>
                  Looking to make a withdrawal out of your account? Simply follow the steps below to initiate the transaction.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {achEligibleAccounts.length > 0 ? (
                  <form onSubmit={handleWithdrawalSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="withdrawal-from-account">Withdraw from</Label>
                      <Select 
                        value={withdrawalForm.fromAccount}
                        onValueChange={(value) => setWithdrawalForm({...withdrawalForm, fromAccount: value})}
                      >
                        <SelectTrigger id="withdrawal-from-account">
                          <SelectValue placeholder="Select account" />
                        </SelectTrigger>
                        <SelectContent>
                          {achEligibleAccounts.map((account) => (
                            <SelectItem key={account.id} value={account.id}>
                              {account.name} (${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="withdrawal-amount">Amount</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        <Input 
                          id="withdrawal-amount"
                          type="number"
                          placeholder="0.00"
                          className="pl-8"
                          value={withdrawalForm.amount}
                          onChange={(e) => setWithdrawalForm({...withdrawalForm, amount: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="bg-amber-50 border border-amber-200 rounded-md p-4 flex items-start space-x-3">
                      <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-amber-800">
                          Please contact your wealth advisor to set up ACH Authorization.
                        </p>
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={!withdrawalForm.amount || !withdrawalForm.fromAccount}
                    >
                      Withdraw
                    </Button>
                  </form>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-red-800 font-medium">
                        None of your accounts are eligible for ACH transfers
                      </p>
                      <p className="text-sm text-red-700 mt-1">
                        Please contact your wealth advisor to set up ACH Authorization for your accounts.
                      </p>
                      <Button variant="outline" className="mt-4" asChild>
                        <Link to="/advisor-profile">
                          Contact Advisor
                        </Link>
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Wire Transfer Instructions Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Wire Transfer Information</CardTitle>
            <CardDescription>
              For faster processing of large transfers, you may prefer to use wire transfers.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-2">Wire Transfer Instructions</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Please contact your wealth advisor for specific wire instructions for your account.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">Bank Name:</p>
                  <p className="text-muted-foreground">First National Bank</p>
                </div>
                <div>
                  <p className="font-medium">Bank Address:</p>
                  <p className="text-muted-foreground">123 Financial St, New York, NY 10001</p>
                </div>
                <div>
                  <p className="font-medium">ABA/Routing Number:</p>
                  <p className="text-muted-foreground">Contact advisor</p>
                </div>
                <div>
                  <p className="font-medium">Account Number:</p>
                  <p className="text-muted-foreground">Contact advisor</p>
                </div>
                <div>
                  <p className="font-medium">SWIFT Code (International):</p>
                  <p className="text-muted-foreground">Contact advisor</p>
                </div>
              </div>
              <Button className="mt-4" variant="outline" asChild>
                <Link to="/advisor-profile">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Contact Advisor for Full Instructions
                </Link>
              </Button>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h3 className="font-medium text-blue-800 mb-2">Important Notes</h3>
              <ul className="list-disc list-inside space-y-2 text-sm text-blue-700">
                <li>Wire transfers are typically processed within 1-2 business days.</li>
                <li>Fees may apply for outgoing wire transfers.</li>
                <li>For security reasons, we may contact you to verify wire transfer requests.</li>
                <li>International wire transfers may require additional documentation.</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </ThreeColumnLayout>
  );
};

export default BankingTransfers;
