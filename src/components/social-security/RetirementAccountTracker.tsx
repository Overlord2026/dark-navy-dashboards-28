
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@radix-ui/react-select";
import { PlusCircleIcon, TrashIcon, UserIcon, PiggyBankIcon, BellRingIcon, LineChartIcon } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@/context/UserContext";

type RetirementAccountType = "401K" | "457" | "403B" | "TSP" | "Other";

type RetirementAccount = {
  id: string;
  memberName: string;
  memberId: string;
  accountType: RetirementAccountType;
  employerSponsored: boolean;
  employerName: string;
  currentValue: number;
  annualContribution: number;
  employerMatch: number;
  employerMatchLimit: number;
  notes: string;
  lastUpdated: Date;
};

export const RetirementAccountTracker = () => {
  const { userProfile } = useUser();
  const [familyAccounts, setFamilyAccounts] = useState<RetirementAccount[]>([
    {
      id: "1",
      memberName: `${userProfile.firstName} ${userProfile.lastName}`,
      memberId: "1",
      accountType: "401K",
      employerSponsored: true,
      employerName: "Acme Corp",
      currentValue: 85000,
      annualContribution: 19500,
      employerMatch: 50,
      employerMatchLimit: 6,
      notes: "Traditional 401K account",
      lastUpdated: new Date()
    }
  ]);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isRolloverDialogOpen, setIsRolloverDialogOpen] = useState(false);
  const [newAccount, setNewAccount] = useState<Omit<RetirementAccount, "id" | "lastUpdated">>({
    memberName: "",
    memberId: "",
    accountType: "401K",
    employerSponsored: true,
    employerName: "",
    currentValue: 0,
    annualContribution: 0,
    employerMatch: 0,
    employerMatchLimit: 0,
    notes: ""
  });

  // Calculate total value across all accounts
  const totalRetirementValue = familyAccounts.reduce((sum, account) => sum + account.currentValue, 0);
  
  // Calculate annual contributions across all accounts
  const totalAnnualContributions = familyAccounts.reduce((sum, account) => sum + account.annualContribution, 0);

  const handleAddAccount = () => {
    if (!newAccount.memberName || !newAccount.accountType) {
      toast.error("Please fill out all required fields");
      return;
    }
    
    const id = Date.now().toString();
    setFamilyAccounts([...familyAccounts, {
      ...newAccount,
      id,
      lastUpdated: new Date()
    }]);
    
    setNewAccount({
      memberName: "",
      memberId: "",
      accountType: "401K",
      employerSponsored: true,
      employerName: "",
      currentValue: 0,
      annualContribution: 0,
      employerMatch: 0,
      employerMatchLimit: 0,
      notes: ""
    });
    
    setIsAddDialogOpen(false);
    toast.success("Retirement account added successfully");
  };

  const handleRemoveAccount = (id: string) => {
    setFamilyAccounts(familyAccounts.filter(account => account.id !== id));
    toast.success("Retirement account removed");
  };

  const handleGetAssistance = () => {
    toast.success("Your request for assistance has been sent to your advisor");
    // In a real app, this would send a notification to the advisor
  };

  // Calculate recommended monthly retirement income
  const calculateRecommendedIncome = (currentValue: number, annualContribution: number) => {
    // Simple calculation: assuming 7% annual return, 20 years to retirement, and 4% withdrawal rate
    const futureValue = currentValue * Math.pow(1.07, 20) + (annualContribution * ((Math.pow(1.07, 20) - 1) / 0.07));
    return Math.round(futureValue * 0.04 / 12);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Retirement Accounts</h2>
          <p className="text-muted-foreground">Track and manage 401K, 457, and 403B accounts for your family</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleGetAssistance}>
            <BellRingIcon className="h-4 w-4 mr-2" />
            Get Assistance
          </Button>
          <Dialog open={isRolloverDialogOpen} onOpenChange={setIsRolloverDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <LineChartIcon className="h-4 w-4 mr-2" />
                Rollover Analysis
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Retirement Account Rollover Analysis</DialogTitle>
                <DialogDescription>
                  Analyze if rolling over retirement accounts would be beneficial based on fees, investment options, and tax implications.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Our analysis looks at your current accounts and provides recommendations for potential rollovers to improve your retirement strategy.
                </p>
                
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Key considerations for rollovers:</h3>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>Investment fees and expense ratios</li>
                    <li>Available investment options</li>
                    <li>Tax implications of different account types</li>
                    <li>Employer matching contributions</li>
                    <li>Required minimum distributions (RMDs)</li>
                  </ul>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsRolloverDialogOpen(false)}>Close</Button>
                <Button onClick={handleGetAssistance}>Request Assistance</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircleIcon className="h-4 w-4 mr-2" />
                Add Account
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Retirement Account</DialogTitle>
                <DialogDescription>
                  Add a 401K, 457, or 403B account to track retirement savings.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="member-name">Family Member Name</Label>
                  <Input 
                    id="member-name" 
                    placeholder="Enter name" 
                    value={newAccount.memberName}
                    onChange={(e) => setNewAccount({...newAccount, memberName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account-type">Account Type</Label>
                  <select
                    id="account-type"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    value={newAccount.accountType}
                    onChange={(e) => setNewAccount({...newAccount, accountType: e.target.value as RetirementAccountType})}
                  >
                    <option value="401K">401K</option>
                    <option value="457">457</option>
                    <option value="403B">403B</option>
                    <option value="TSP">TSP (Thrift Savings Plan)</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="employer-sponsored"
                      checked={newAccount.employerSponsored}
                      onChange={(e) => setNewAccount({...newAccount, employerSponsored: e.target.checked})}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="employer-sponsored">Employer Sponsored</Label>
                  </div>
                </div>
                {newAccount.employerSponsored && (
                  <div className="space-y-2">
                    <Label htmlFor="employer-name">Employer Name</Label>
                    <Input 
                      id="employer-name" 
                      placeholder="Enter employer name" 
                      value={newAccount.employerName}
                      onChange={(e) => setNewAccount({...newAccount, employerName: e.target.value})}
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="current-value">Current Value ($)</Label>
                  <Input 
                    id="current-value" 
                    type="number" 
                    value={newAccount.currentValue}
                    onChange={(e) => setNewAccount({...newAccount, currentValue: Number(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="annual-contribution">Annual Contribution ($)</Label>
                  <Input 
                    id="annual-contribution" 
                    type="number" 
                    value={newAccount.annualContribution}
                    onChange={(e) => setNewAccount({...newAccount, annualContribution: Number(e.target.value)})}
                  />
                </div>
                {newAccount.employerSponsored && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="employer-match">Employer Match (% of contribution)</Label>
                      <Input 
                        id="employer-match" 
                        type="number" 
                        placeholder="e.g., 50 for 50%" 
                        value={newAccount.employerMatch}
                        onChange={(e) => setNewAccount({...newAccount, employerMatch: Number(e.target.value)})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="match-limit">Match Limit (% of salary)</Label>
                      <Input 
                        id="match-limit" 
                        type="number" 
                        placeholder="e.g., 6 for 6%" 
                        value={newAccount.employerMatchLimit}
                        onChange={(e) => setNewAccount({...newAccount, employerMatchLimit: Number(e.target.value)})}
                      />
                    </div>
                  </>
                )}
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Input 
                    id="notes" 
                    placeholder="Additional notes" 
                    value={newAccount.notes}
                    onChange={(e) => setNewAccount({...newAccount, notes: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddAccount}>Add Account</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Balance</CardTitle>
            <CardDescription>Across all retirement accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${totalRetirementValue.toLocaleString()}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Annual Contributions</CardTitle>
            <CardDescription>From you and your employers</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${totalAnnualContributions.toLocaleString()}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Accounts</CardTitle>
            <CardDescription>Tracked retirement accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{familyAccounts.length}</p>
          </CardContent>
        </Card>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Family Member</TableHead>
            <TableHead>Account Type</TableHead>
            <TableHead>Employer</TableHead>
            <TableHead className="text-right">Current Value</TableHead>
            <TableHead className="text-right">Annual Contribution</TableHead>
            <TableHead className="text-right">Est. Monthly Income</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {familyAccounts.map((account) => (
            <TableRow key={account.id}>
              <TableCell className="font-medium">
                <div className="flex items-center">
                  <UserIcon className="h-4 w-4 mr-2" />
                  {account.memberName}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <PiggyBankIcon className="h-4 w-4 mr-2" />
                  {account.accountType}
                </div>
              </TableCell>
              <TableCell>
                {account.employerSponsored ? (
                  <div>
                    {account.employerName}
                    <div className="text-xs text-muted-foreground">
                      {account.employerMatch}% match up to {account.employerMatchLimit}%
                    </div>
                  </div>
                ) : (
                  <span className="text-muted-foreground">N/A</span>
                )}
              </TableCell>
              <TableCell className="text-right font-medium">${account.currentValue.toLocaleString()}</TableCell>
              <TableCell className="text-right">${account.annualContribution.toLocaleString()}</TableCell>
              <TableCell className="text-right">
                ${calculateRecommendedIncome(account.currentValue, account.annualContribution).toLocaleString()}
                <div className="text-xs text-muted-foreground">Est. at retirement</div>
              </TableCell>
              <TableCell className="text-right">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleRemoveAccount(account.id)}
                  className="h-8 w-8"
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {familyAccounts.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                No retirement accounts added yet. Click "Add Account" to get started.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      
      <div className="bg-card p-4 rounded-lg border border-primary mb-4">
        <h3 className="font-medium mb-2">About Retirement Accounts</h3>
        <p className="text-muted-foreground text-sm mb-2">
          Employer-sponsored retirement accounts offer tax advantages and often include employer matching contributions:
        </p>
        <ul className="text-muted-foreground text-sm list-disc pl-5 space-y-1 mb-2">
          <li><strong>401(k):</strong> Most common employer-sponsored retirement plan for private sector employees</li>
          <li><strong>457:</strong> Retirement plans for state and local government employees</li>
          <li><strong>403(b):</strong> Retirement plans for public education organizations, nonprofit employers, and self-employed ministers</li>
          <li><strong>TSP:</strong> Thrift Savings Plan for federal employees and uniformed services</li>
        </ul>
        <p className="text-muted-foreground text-sm">
          Consider maximizing your contributions to take full advantage of employer matching and tax benefits.
        </p>
      </div>
    </div>
  );
};
