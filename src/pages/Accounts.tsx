
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Shield, TrendingUp, CreditCard, Building, Banknote } from "lucide-react";
import { RetirementAccountTracker } from "@/components/social-security/RetirementAccountTracker";

const Accounts = () => {
  const handleCompleteSetup = () => {
    console.log('Complete Setup clicked');
  };

  const handleAddAccount = (type: string) => {
    console.log(`Add ${type} clicked`);
  };

  return (
    <ThreeColumnLayout
      activeMainItem="accounts"
      title="Accounts"
    >
      <div className="container mx-auto px-4 py-6 max-w-7xl space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-border">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Accounts</h1>
            <p className="text-muted-foreground">Manage all your financial accounts in one place</p>
          </div>
        </div>
        
        <div className="grid gap-6">
          {/* BFO Managed */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5 text-primary" />
                BFO Managed
              </CardTitle>
              <CardDescription>Complete your account setup to view managed accounts.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleCompleteSetup} className="w-full sm:w-auto">
                Complete Setup
              </Button>
            </CardContent>
          </Card>

          {/* 401K/457/403B Plans */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-primary" />
                  401K/457/403B Plans
                </div>
                <span className="text-lg font-medium">$0.00</span>
              </CardTitle>
              <CardDescription>Track and manage your retirement accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <RetirementAccountTracker />
            </CardContent>
          </Card>

          {/* External Investment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-primary" />
                  External Investment
                </div>
                <span className="text-lg font-medium">$0.00</span>
              </CardTitle>
              <CardDescription>No external investment accounts linked.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => handleAddAccount('Investment Account')} variant="outline" className="w-full sm:w-auto">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Investment Account
              </Button>
            </CardContent>
          </Card>

          {/* External Manually-Tracked */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <CreditCard className="mr-2 h-5 w-5 text-primary" />
                  External Manually-Tracked
                </div>
                <span className="text-lg font-medium">$0.00</span>
              </CardTitle>
              <CardDescription>No manually tracked accounts added.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => handleAddAccount('Manual Account')} variant="outline" className="w-full sm:w-auto">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Manual Account
              </Button>
            </CardContent>
          </Card>

          {/* External Loans */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Building className="mr-2 h-5 w-5 text-primary" />
                  External Loans
                </div>
                <span className="text-lg font-medium">$0.00</span>
              </CardTitle>
              <CardDescription>No loan accounts linked.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Loan Type</label>
                <Select defaultValue="mortgage">
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mortgage">Mortgage</SelectItem>
                    <SelectItem value="personal">Personal Loan</SelectItem>
                    <SelectItem value="auto">Auto Loan</SelectItem>
                    <SelectItem value="student">Student Loan</SelectItem>
                    <SelectItem value="business">Business Loan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={() => handleAddAccount('Loan')} variant="outline" className="w-full sm:w-auto">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Loan
              </Button>
            </CardContent>
          </Card>

          {/* External Banking */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Banknote className="mr-2 h-5 w-5 text-primary" />
                  External Banking
                </div>
                <span className="text-lg font-medium">$0.00</span>
              </CardTitle>
              <CardDescription>No banking accounts linked.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => handleAddAccount('Bank Account')} variant="outline" className="w-full sm:w-auto">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Bank Account
              </Button>
            </CardContent>
          </Card>

          {/* External Credit Cards */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <CreditCard className="mr-2 h-5 w-5 text-primary" />
                  External Credit Cards
                </div>
                <span className="text-lg font-medium">$0.00</span>
              </CardTitle>
              <CardDescription>No credit card accounts linked.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => handleAddAccount('Credit Card')} variant="outline" className="w-full sm:w-auto">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Credit Card
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </ThreeColumnLayout>
  );
};

export default Accounts;
